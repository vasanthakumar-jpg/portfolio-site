import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { chromium } from "playwright";

const siteUrl = new URL(process.env.AUDIT_URL || "http://127.0.0.1:4173/portfolio-site/");
const artifactDirectory = resolve("audit-artifacts");
const checks = [];
const browserErrors = [];
const failedLocalRequests = [];
const failedExternalRequests = [];
const externalLinkChecks = [];
const contactRecipient = "vasanthakumar141099@gmail.com";
await mkdir(artifactDirectory, { recursive: true });

async function check(name, run) {
  try {
    await run();
    checks.push({ name, result: "PASS" });
    console.log(`PASS ${name}`);
  } catch (error) {
    checks.push({ name, result: "FAIL", error: error.message });
    console.error(`FAIL ${name}: ${error.message}`);
  }
}

function watchPage(page) {
  page.on("pageerror", (error) => browserErrors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") browserErrors.push(message.text());
  });
  page.on("requestfailed", (request) => {
    const failure = { url: request.url(), error: request.failure()?.errorText };
    if (new URL(request.url()).origin === siteUrl.origin) failedLocalRequests.push(failure);
    else failedExternalRequests.push(failure);
  });
  page.on("response", (response) => {
    if (response.status() >= 400 && new URL(response.url()).origin === siteUrl.origin) {
      failedLocalRequests.push({ url: response.url(), status: response.status() });
    }
  });
}

async function assertNoOverflow(page) {
  const dimensions = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    document: document.documentElement.scrollWidth,
    body: document.body.scrollWidth,
  }));
  assert.ok(dimensions.document <= dimensions.viewport + 1, JSON.stringify(dimensions));
  assert.ok(dimensions.body <= dimensions.viewport + 1, JSON.stringify(dimensions));
}

async function settleAnimations(page) {
  await page.waitForTimeout(450);
}

async function revealSections(page) {
  for (const id of ["home", "about", "services", "projects", "experience", "course", "contact"]) {
    const section = page.locator(`#${id}`);
    assert.equal(await section.count(), 1, `Section #${id} must exist exactly once`);
    await section.scrollIntoViewIfNeeded();
    await settleAnimations(page);
  }
  await page.waitForTimeout(1600);
  await assertNoOverflow(page);
}

async function assertCertificateDialog(page) {
  const trigger = page.locator("#course").getByRole("button", { name: "View Certificate" }).first();
  await trigger.click();
  const dialog = page.getByRole("dialog");
  await dialog.waitFor({ state: "visible" });
  const certificate = dialog.locator("img");
  await certificate.evaluate((image) => image.decode());
  assert.ok(await certificate.evaluate((image) => image.naturalWidth > 0));
  const dialogBounds = await dialog.boundingBox();
  const viewport = page.viewportSize();
  assert.ok(dialogBounds.width <= viewport.width, "Certificate dialog must fit viewport width");
  assert.ok(dialogBounds.height <= viewport.height, "Certificate dialog must fit viewport height");
  await page.keyboard.press("Escape");
  await dialog.waitFor({ state: "hidden" });
  assert.ok(await trigger.evaluate((element) => element === document.activeElement), "Focus must return to certificate trigger");
}

async function fillDraft(page, draft) {
  for (const [field, value] of Object.entries(draft)) {
    await page.locator(`#field-${field}`).fill(value);
  }
}

function assertComposeUrl(url, draft, client) {
  const composed = new URL(url);
  const subject = draft.subject.trim();
  const body = `Name: ${draft.name.trim()}\r\nEmail: ${draft.email.trim()}\r\n\r\nMessage:\r\n${draft.message.trim()}`;
  if (client === "gmail") {
    assert.equal(composed.origin, "https://mail.google.com");
    assert.equal(composed.searchParams.get("to"), contactRecipient);
    assert.equal(composed.searchParams.get("su"), subject);
  } else {
    assert.equal(composed.protocol, "mailto:");
    assert.equal(composed.pathname, contactRecipient);
    assert.equal(composed.searchParams.get("subject"), subject);
  }
  assert.equal(composed.searchParams.get("body"), body);
}

async function assertDraftPreserved(page, draft) {
  for (const [field, value] of Object.entries(draft)) {
    assert.equal(await page.locator(`#field-${field}`).inputValue(), value);
  }
}

async function waitUntilComposeReady(page) {
  await page.getByRole("button", { name: "Send Message", exact: true }).waitFor({ state: "visible" });
  await page.waitForFunction(() => !document.querySelector('#contact button[type="submit"]').disabled);
}

async function auditContact(page, context, screenshotName) {
  const form = page.locator("#contact form");
  const status = form.getByRole("status");
  const send = form.getByRole("button", { name: "Send Message", exact: true });
  const capturedGmailUrls = [];
  const clientSession = await context.newCDPSession(page);
  await clientSession.send("Page.enable");
  const capturedMailtoUrls = [];
  clientSession.on("Page.frameRequestedNavigation", ({ url }) => {
    if (url.startsWith("mailto:")) capturedMailtoUrls.push(url);
  });
  // Fulfill the browser's compose navigation locally, before any email content
  // can be transmitted. This still exercises the real popup and opener logic.
  await context.route("https://mail.google.com/**", async (route) => {
    capturedGmailUrls.push(route.request().url());
    await route.fulfill({ contentType: "text/html", body: "<!doctype html><title>Compose navigation intercepted for audit</title>" });
  });

  await check(`${screenshotName} contact rejects empty and whitespace-only fields accessibly`, async () => {
    await fillDraft(page, { name: "", email: "", subject: "", message: "" });
    await send.click();
    assert.equal(await form.locator('[aria-invalid="true"]').count(), 4);
    assert.equal(await page.locator("#field-name").evaluate((element) => element === document.activeElement), true);
    await page.waitForFunction(() => {
      const label = document.querySelector('label[for="field-name"]');
      return label.getBoundingClientRect().top > document.querySelector('header').getBoundingClientRect().bottom;
    });
    for (const field of ["name", "email", "subject", "message"]) {
      assert.equal(await page.locator(`#field-${field}`).getAttribute("aria-describedby"), `error-${field}`);
      assert.ok(await page.locator(`#error-${field}`).isVisible());
    }
    await fillDraft(page, { name: "   ", email: "   ", subject: "   ", message: "   " });
    await form.getByRole("button", { name: "Open Gmail", exact: true }).click();
    assert.equal(await form.locator('[aria-invalid="true"]').count(), 4);
    assert.deepEqual(capturedGmailUrls, []);
    assert.deepEqual(capturedMailtoUrls, []);
    await assertNoOverflow(page);
    await form.screenshot({ path: resolve(artifactDirectory, `${screenshotName}-contact-errors.png`) });
  });

  await check(`${screenshotName} contact rejects invalid email and short message`, async () => {
    await fillDraft(page, { name: "Audit Visitor", email: "invalid-email", subject: "Portfolio question", message: "short" });
    await send.click();
    assert.match(await page.locator("#error-email").textContent(), /valid email/i);
    assert.match(await page.locator("#error-message").textContent(), /at least 10/i);
    assert.equal(await form.locator('[aria-invalid="true"]').count(), 2);
    assert.equal(await page.locator("#field-email").evaluate((element) => element === document.activeElement), true);
    assert.deepEqual(capturedGmailUrls, []);
  });

  const normalDraft = {
    name: "Audit Visitor",
    email: "audit.visitor@example.com",
    subject: "Portfolio question",
    message: "I would like to discuss a frontend project.",
  };
  await check(`${screenshotName} normal submit opens Gmail with the existing recipient and keeps the draft`, async () => {
    await fillDraft(page, normalDraft);
    const popupPromise = page.waitForEvent("popup");
    await send.click();
    const popup = await popupPromise;
    await popup.waitForURL("https://mail.google.com/**");
    await popup.waitForLoadState("domcontentloaded");
    assertComposeUrl(popup.url(), normalDraft, "gmail");
    assert.equal(await popup.evaluate(() => window.opener), null);
    assert.equal(capturedMailtoUrls.length, 0);
    assert.match(await status.textContent(), /Please review and send the message/i);
    assert.doesNotMatch(await status.textContent(), /message sent|sent successfully/i);
    await assertDraftPreserved(page, normalDraft);
    await popup.close();
  });

  await check(`${screenshotName} rapid repeat submissions are guarded and buttons recover`, async () => {
    assert.equal(await form.locator('button[type="submit"]').isDisabled(), true);
    assert.equal(await form.getByRole("button", { name: "Open Gmail", exact: true }).isDisabled(), true);
    assert.equal(await form.getByRole("button", { name: "Use email app", exact: true }).isDisabled(), true);
    await form.evaluate((element) => { element.requestSubmit(); element.requestSubmit(); });
    assert.equal(capturedMailtoUrls.length, 0);
    assert.equal(capturedGmailUrls.length, 1);
    await waitUntilComposeReady(page);
    assert.equal(await form.getByRole("button", { name: "Open Gmail", exact: true }).isEnabled(), true);
  });

  const specialDraft = {
    name: "  Zoë & Ravi  ",
    email: "audit+portfolio@example.com",
    subject: "  R&D + #design? Café & தமிழ்  ",
    message: "  Hello & welcome!\nCan we discuss #UI + pricing?\nதமிழ் ✓  ",
  };
  await check(`${screenshotName} Gmail fallback safely encodes special characters and trims boundary spaces`, async () => {
    await fillDraft(page, specialDraft);
    const popupPromise = page.waitForEvent("popup");
    await form.getByRole("button", { name: "Open Gmail", exact: true }).click();
    const popup = await popupPromise;
    await popup.waitForURL("https://mail.google.com/**");
    await popup.waitForLoadState("domcontentloaded");
    assertComposeUrl(popup.url(), specialDraft, "gmail");
    assert.equal(await popup.evaluate(() => window.opener), null);
    await assertDraftPreserved(page, specialDraft);
    await popup.close();
    await waitUntilComposeReady(page);
  });

  await check(`${screenshotName} email-app fallback creates a correctly encoded mailto draft`, async () => {
    await form.getByRole("button", { name: "Use email app", exact: true }).click();
    await page.waitForTimeout(200);
    assert.equal(capturedMailtoUrls.length, 1, "Browser must request the mailto protocol");
    assertComposeUrl(capturedMailtoUrls[0], specialDraft, "mailto");
    assert.match(await status.textContent(), /email app has been requested/i);
    await assertDraftPreserved(page, specialDraft);
    await waitUntilComposeReady(page);
  });

  await check(`${screenshotName} blocked Gmail popup falls back to mailto with visible recovery options`, async () => {
    await page.evaluate(() => {
      window.__auditOriginalOpen = window.open;
      window.open = () => null;
    });
    await form.getByRole("button", { name: "Open Gmail", exact: true }).click();
    await page.waitForTimeout(200);
    assert.equal(capturedMailtoUrls.length, 2);
    assertComposeUrl(capturedMailtoUrls[1], specialDraft, "mailto");
    assert.equal(capturedGmailUrls.length, 2);
    assert.ok(await form.getByRole("button", { name: "Open Gmail", exact: true }).isVisible());
    assert.ok(await form.getByRole("button", { name: "Use email app", exact: true }).isVisible());
    await assertDraftPreserved(page, specialDraft);
    await page.evaluate(() => { window.open = window.__auditOriginalOpen; });
    await waitUntilComposeReady(page);
  });

  await check(`${screenshotName} compose-launch error preserves entered text and allows retry`, async () => {
    await page.evaluate(() => {
      window.__auditOriginalOpen = window.open;
      window.open = () => { throw new Error("Simulated compose launch failure"); };
    });
    await form.getByRole("button", { name: "Open Gmail", exact: true }).click();
    assert.match(await status.textContent(), /Unable to open your email draft/i);
    await assertDraftPreserved(page, specialDraft);
    await page.evaluate(() => { window.open = window.__auditOriginalOpen; });
    await waitUntilComposeReady(page);
    assert.equal(await send.isEnabled(), true);
    await assertNoOverflow(page);
    await form.screenshot({ path: resolve(artifactDirectory, `${screenshotName}-contact-recovery.png`) });
  });
  await clientSession.detach();
}

const browser = await chromium.launch({ headless: true });
try {
  const desktop = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
  const page = await desktop.newPage();
  watchPage(page);
  await page.goto(siteUrl.href, { waitUntil: "networkidle" });

  await check("Production project path and refresh", async () => {
    assert.equal(new URL(page.url()).pathname, siteUrl.pathname);
    assert.equal(await page.locator("h1").count(), 1);
    await page.reload({ waitUntil: "networkidle" });
    assert.equal(await page.locator("h1").count(), 1);
  });

  await check("Desktop navigation reaches each section", async () => {
    for (const id of ["home", "about", "projects", "experience", "contact"]) {
      const link = page.locator(`header nav a[href="#${id}"]`).first();
      await link.click();
      await page.waitForFunction((sectionId) => {
        const section = document.getElementById(sectionId);
        const header = document.querySelector("header");
        const top = section.getBoundingClientRect().top;
        return top >= -1 && top <= header.getBoundingClientRect().bottom + 40;
      }, id);
      assert.equal(new URL(page.url()).hash, `#${id}`);
    }
  });

  await check("Desktop sections and contact layout have no horizontal overflow", async () => {
    await revealSections(page);
    await page.screenshot({ path: resolve(artifactDirectory, "desktop.png"), fullPage: true });
  });

  await check("Local images, favicon and CV URLs resolve under the project path", async () => {
    const urls = await page.evaluate(() => [
      ...Array.from(document.images, (image) => image.src),
      document.querySelector('link[rel="icon"]')?.href,
      ...Array.from(document.querySelectorAll('a[download]'), (anchor) => anchor.href),
    ].filter(Boolean));
    const localUrls = [...new Set(urls)].filter((url) => new URL(url).origin === siteUrl.origin);
    assert.ok(localUrls.length >= 3, "Expected local portrait, logo, favicon and CV assets");
    for (const url of localUrls) {
      assert.ok(new URL(url).pathname.startsWith(siteUrl.pathname), `Incorrect asset base: ${url}`);
      const response = await page.request.get(url);
      assert.ok(response.ok(), `${response.status()} ${url}`);
      assert.notEqual(response.headers()["content-type"]?.split(";")[0], "text/html", `Asset returned HTML: ${url}`);
    }
    const downloadPromise = page.waitForEvent("download");
    await page.locator("#home a[download]").click();
    const download = await downloadPromise;
    assert.equal(download.suggestedFilename(), "Vasanthakumar_Resume.pdf");
    await download.saveAs(resolve(artifactDirectory, "downloaded-resume.pdf"));
  });

  await check("SEO metadata and image are valid", async () => {
    const metadata = await page.evaluate(() => ({
      title: document.title,
      description: document.querySelector('meta[name="description"]')?.content,
      canonical: document.querySelector('link[rel="canonical"]')?.href,
      image: document.querySelector('meta[property="og:image"]')?.content,
    }));
    assert.match(metadata.title, /Vasantha/i);
    assert.ok(metadata.description?.length > 40);
    assert.equal(metadata.canonical, "https://vasanthakumar-jpg.github.io/portfolio-site/");
    const image = new URL(metadata.image);
    assert.equal(image.origin, "https://vasanthakumar-jpg.github.io");
    assert.ok(image.pathname.startsWith("/portfolio-site/assets/"));
    const imageResponse = await page.request.get(new URL(image.pathname, siteUrl.origin).href);
    assert.ok(imageResponse.ok());
    assert.match(imageResponse.headers()["content-type"], /^image\//);
  });

  await check("Certificate dialog opens, fits, closes with Escape and restores focus", async () => {
    await assertCertificateDialog(page);
  });

  await check("Resume-backed skills, chronology, projects, education and achievements render", async () => {
    const text = await page.locator("main").textContent();
    for (const expected of ["Vasanthakumar Rajendran", "Shopify Liquid", "Walrus – Yes India Can", "06/2026 – Present", "08/2025 – 03/2026", "09/2024 – 07/2025", "06/2024 – 08/2024", "PRAVOKHA", "Super Admin", "Seller management", "Technical SEO", "Anna University", "Rajalakshmi Edureka", "Smart Cliff"]) assert.ok(text.includes(expected), expected);
    assert.equal(await page.locator("#projects article").count(), 8);
    assert.equal(await page.locator("#experience ol > li").count(), 4);
    assert.equal(await page.locator("#skills [role='progressbar'], #skills .skill-bar").count(), 0);
    for (const removed of ["TypeScript", "10+", "95%", "HSC", "SSLC", "Within 24 hours"]) assert.equal(text.includes(removed), false, removed);
    const resume = await page.request.get(new URL("Vasanthakumar_Resume.pdf", siteUrl).href);
    assert.ok(resume.ok());
    assert.match(resume.headers()["content-type"], /^application\/pdf/);
    assert.equal((await resume.body()).subarray(0, 5).toString(), "%PDF-");
    assert.equal(await page.locator('a[href$=".docx"]').count(), 0);
    const sitemap = await page.request.get(new URL("sitemap.xml", siteUrl).href);
    assert.ok(sitemap.ok());
    assert.ok((await sitemap.text()).includes("https://vasanthakumar-jpg.github.io/portfolio-site/"));
    const schema = JSON.parse(await page.locator('script[type="application/ld+json"]').textContent());
    assert.equal(schema["@type"], "ProfilePage");
    assert.equal(schema.mainEntity.name, "Vasanthakumar Rajendran");
  });

  await check("Images and icon buttons have accessible names; external links are safe", async () => {
    const findings = await page.evaluate(() => ({
      imagesWithoutAlt: Array.from(document.images).filter((image) => !image.hasAttribute("alt")).length,
      unnamedButtons: Array.from(document.querySelectorAll("button")).filter((button) => !button.textContent.trim() && !button.getAttribute("aria-label") && !button.getAttribute("aria-labelledby")).length,
      placeholderLinks: document.querySelectorAll('a[href="#"], a[href=""]').length,
      unsafeNewTabs: Array.from(document.querySelectorAll('a[target="_blank"]')).filter((anchor) => !anchor.rel.includes("noopener")).length,
      iframesWithoutTitle: Array.from(document.querySelectorAll("iframe")).filter((frame) => !frame.title).length,
      brokenHashLinks: Array.from(document.querySelectorAll('a[href^="#"]')).filter((anchor) => !document.getElementById(anchor.hash.slice(1))).length,
    }));
    assert.deepEqual(findings, { imagesWithoutAlt: 0, unnamedButtons: 0, placeholderLinks: 0, unsafeNewTabs: 0, iframesWithoutTitle: 0, brokenHashLinks: 0 });
  });

  await auditContact(page, desktop, "desktop");

  for (const [name, viewport] of [
    ["tablet", { width: 768, height: 1024 }],
    ["mobile", { width: 390, height: 844 }],
    ["small-mobile", { width: 320, height: 740 }],
  ]) {
    const context = await browser.newContext({ viewport, reducedMotion: "reduce", isMobile: name.includes("mobile"), hasTouch: name.includes("mobile") });
    const responsivePage = await context.newPage();
    watchPage(responsivePage);
    await responsivePage.goto(siteUrl.href, { waitUntil: "networkidle" });
    await check(`${name} sections and contact layout fit the viewport`, async () => {
      await revealSections(responsivePage);
      await responsivePage.screenshot({ path: resolve(artifactDirectory, `${name}.png`), fullPage: true });
      const textareaSize = await responsivePage.locator("#contact textarea").evaluate((textarea) => Number.parseFloat(getComputedStyle(textarea).fontSize));
      assert.ok(textareaSize >= (viewport.width < 768 ? 16 : 14), "Message text must be readable without mobile input zoom");
    });
    if (viewport.width < 768) {
      await check(`${name} navigation opens, Escape closes, and a section click closes it`, async () => {
        const toggle = responsivePage.getByRole("button", { name: "Toggle navigation menu" });
        await toggle.click();
        assert.equal(await toggle.getAttribute("aria-expanded"), "true");
        await responsivePage.keyboard.press("Escape");
        assert.equal(await toggle.getAttribute("aria-expanded"), "false");
        await toggle.click();
        await responsivePage.locator('header nav a[href="#contact"]:visible').click();
        assert.equal(await toggle.getAttribute("aria-expanded"), "false");
        assert.equal(new URL(responsivePage.url()).hash, "#contact");
      });
    }
    await check(`${name} certificate dialog fits`, async () => {
      await assertCertificateDialog(responsivePage);
    });
    if (name === "mobile") await auditContact(responsivePage, context, name);
    await context.close();
  }

  await check("Hash refresh and the missing-page return link keep the GitHub Pages base", async () => {
    await page.goto(new URL("#course", siteUrl).href, { waitUntil: "networkidle" });
    await page.reload({ waitUntil: "networkidle" });
    assert.equal(new URL(page.url()).hash, "#course");
    assert.ok(await page.locator("#course").isVisible());
    await page.goto(new URL("missing-audit-page", siteUrl).href, { waitUntil: "networkidle" });
    assert.equal(await page.locator("h1").textContent(), "404");
    assert.equal(await page.locator('meta[name="robots"]').getAttribute("content"), "noindex, follow");
    const returnLink = page.getByRole("link", { name: "Return to Home" });
    assert.equal(new URL(await returnLink.getAttribute("href"), siteUrl.origin).pathname, siteUrl.pathname);
    await returnLink.click();
    assert.match(await page.locator("h1").textContent(), /Vasantha/i);
  });

  await check("No browser exceptions, console errors or failed local requests", async () => {
    assert.deepEqual(browserErrors, []);
    assert.deepEqual(failedLocalRequests, []);
  });
  // Social sites can require login or block automated clients. Record their
  // actual response separately instead of treating an access restriction as
  // proof that the owner's existing profile link is broken.
  const externalLinks = await page.evaluate(() => [...new Set(
    Array.from(document.querySelectorAll('a[href^="https://"]'), (link) => link.href)
  )]);
  await Promise.all(externalLinks.map(async (url) => {
    try {
      const response = await page.request.get(url, { timeout: 15000 });
      externalLinkChecks.push({ url, status: response.status(), finalUrl: response.url() });
      await response.dispose();
    } catch (error) {
      externalLinkChecks.push({ url, error: error.message });
    }
  }));
  await desktop.close();
} finally {
  await browser.close();
  const report = { siteUrl: siteUrl.href, checks, browserErrors, failedLocalRequests, failedExternalRequests, externalLinkChecks };
  await writeFile(resolve(artifactDirectory, "browser-audit.json"), JSON.stringify(report, null, 2));
}

if (checks.some((item) => item.result === "FAIL")) process.exitCode = 1;
