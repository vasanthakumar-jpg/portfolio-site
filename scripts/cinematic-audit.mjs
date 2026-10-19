import assert from "node:assert/strict";
import { mkdir, readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { chromium } from "playwright";

const base = "http://127.0.0.1:4173/portfolio-site/";
const browser = await chromium.launch();
const errors = [];
const checks = [];
await mkdir("audit-artifacts", { recursive: true });
const sha = bytes => createHash("sha256").update(bytes).digest("hex");
const resumeHash = sha(await readFile("public/Vasanthakumar_Resume.pdf"));
async function check(name, run) {
  try { await run(); checks.push({ name, pass: true }); console.log(`PASS ${name}`); }
  catch (error) { checks.push({ name, pass: false }); console.error(`FAIL ${name}: ${error.stack}`); }
}
async function open(width, reduced = false) {
  const context = await browser.newContext({ viewport: { width, height: 1000 }, reducedMotion: reduced ? "reduce" : "no-preference", hasTouch: width < 768, isMobile: width < 768 });
  const page = await context.newPage();
  page.on("pageerror", error => errors.push(error.message));
  page.on("console", message => { if (message.type() === "error") errors.push(message.text()); });
  page.on("response", response => { if (response.url().startsWith(base) && response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
  await page.route("https://www.google.com/maps/**", route => route.fulfill({ body: "<html lang='en'><title>Map test fixture</title></html>", contentType: "text/html" }));
  await page.goto(base);
  await page.locator(".logo-preloader").waitFor({ state: "detached", timeout: 5500 });
  await page.waitForTimeout(1300);
  return { context, page };
}
async function scrollTo(page, y) {
  await page.evaluate(y => window.scrollTo({ top: y, behavior: "instant" }), y);
  await page.waitForTimeout(1100);
}
try {
  for (const width of [320, 375, 768, 1024, 1440, 1920]) {
    await check(`${width}px full-motion layout, fast scroll, reverse and refresh`, async () => {
      const { context, page } = await open(width);
      try {
        const initialPins = await page.locator(".pin-spacer").count();
        assert.equal(await page.locator("html.lenis").count(), 1);
        assert.equal(await page.locator("#services .service-card").count(), 5);
        assert.equal(await page.locator("#services").getByRole("heading", { name: "Budget-Friendly Development", exact: true }).count(), 1);
        assert.equal(await page.locator(".hero-photo-depth.tilt-card, .cinema-cursor-ring, .cursor-glow").count(), 0);
        if (width < 768) {
          await page.getByRole("button", { name: "Toggle navigation menu" }).click();
          assert.equal(await page.locator('#mobile-navigation a[aria-label="Chat on WhatsApp"]:visible').count(), 1);
          await page.keyboard.press("Escape");
        } else {
          assert.equal(await page.locator('header a[aria-label="Chat on WhatsApp"]:visible').count(), 1);
          const logo = await page.locator("header img").boundingBox();
          const nav = await page.getByRole("navigation", { name: "Main navigation", exact: true }).boundingBox();
          assert.ok(logo.x + logo.width + 4 <= nav.x, `Navbar overlaps logo at ${width}px`);
        }
        const offset = page.locator(".hero-portrait-offset");
        const beforeHover = await offset.evaluate(element => ({ transform: getComputedStyle(element).transform, animation: getComputedStyle(element).animationName }));
        assert.equal(beforeHover.animation, "none");
        assert.match(beforeHover.transform, /^matrix3d/);
        await offset.hover({ force: true }); await page.waitForTimeout(300);
        assert.equal(await offset.evaluate(element => getComputedStyle(element).transform), beforeHover.transform);
        const whatsappLinks = page.locator('a[aria-label="Chat on WhatsApp"]');
        assert.ok(await whatsappLinks.count() >= 3);
        for (const link of await whatsappLinks.all()) {
          assert.equal(await link.getAttribute("href"), "https://wa.me/917339232817");
          assert.equal(await link.getAttribute("target"), "_blank");
          assert.match(await link.getAttribute("rel"), /noopener/);
        }
        assert.equal(await page.locator('#contact a[href="https://wa.me/917339232817"]').count(), 1);
        if (width < 1024) assert.equal(initialPins, 0);
        else assert.ok(initialPins >= 2, `Expected desktop scenes, got ${initialPins}`);
        if (width < 1024) assert.equal(await page.locator(".cinema-cursor-ring").count(), 0);
        const height = await page.evaluate(() => document.documentElement.scrollHeight);
        for (const y of [400, height / 2, height - 1000, height / 3, 0]) {
          await scrollTo(page, y);
          const dimensions = await page.evaluate(() => ({ width: document.documentElement.clientWidth, content: document.documentElement.scrollWidth }));
          assert.ok(dimensions.content <= dimensions.width + 1, JSON.stringify(dimensions));
        }
        await scrollTo(page, 0);
        const hero = await page.locator(".hero-scroll-copy").evaluate(element => ({ opacity: getComputedStyle(element).opacity, transform: getComputedStyle(element).transform }));
        assert.ok(Number(hero.opacity) > .95, JSON.stringify(hero));
        await page.screenshot({ path: `audit-artifacts/cinema-${width}.png` });
        await scrollTo(page, height / 2);
        await page.reload();
        await page.locator(".logo-preloader").waitFor({ state: "detached", timeout: 5500 });
        await page.waitForTimeout(1500);
        assert.equal(await page.locator(".pin-spacer").count(), initialPins);
        assert.ok(await page.locator("#projects").isVisible());
        assert.equal(await page.locator('a[download]').first().getAttribute("download"), "Vasanthakumar_Resume.pdf");
      } finally { await context.close(); }
    });
  }
  await check("Desktop hash offset, horizontal gallery, modal focus/scroll lock and resize cleanup", async () => {
    const { context, page } = await open(1440);
    try {
      await page.locator('header a[href="#about"]').click();
      await page.waitForTimeout(1800);
      assert.ok(Math.abs((await page.locator("#about").boundingBox()).y - 96) < 4);
      await page.screenshot({ path: "audit-artifacts/cinematic-about.png" });
      const bounds = await page.locator(".gallery-scene").boundingBox();
      const top = await page.evaluate(() => scrollY) + bounds.y;
      await scrollTo(page, top - 90);
      assert.equal(await page.locator(".gallery-scene").getAttribute("data-horizontal"), "true");
      await scrollTo(page, top + 600);
      const x = await page.locator(".gallery-track").evaluate(element => new DOMMatrix(getComputedStyle(element).transform).m41);
      assert.ok(x < -300, `Gallery did not travel: ${x}`);
      await scrollTo(page, top - 90);
      const returned = await page.locator(".gallery-track").evaluate(element => new DOMMatrix(getComputedStyle(element).transform).m41);
      assert.ok(Math.abs(returned) < 5, `Gallery did not reverse: ${returned}`);
      await page.screenshot({ path: "audit-artifacts/cinematic-gallery.png" });
      const trigger = page.getByRole("button", { name: /View details for/ }).first();
      await page.locator(".project-card h4").first().click();
      const dialog = page.getByRole("dialog");
      await dialog.waitFor();
      await page.waitForTimeout(700);
      assert.ok(await page.locator("html").evaluate(element => element.classList.contains("lenis-stopped")));
      for (let i = 0; i < 5; i++) {
        await page.keyboard.press("Tab");
        assert.ok(await dialog.evaluate(element => element.contains(document.activeElement)));
      }
      const before = await page.evaluate(() => scrollY);
      await page.mouse.wheel(0, 700); await page.waitForTimeout(400);
      assert.ok(Math.abs(await page.evaluate(() => scrollY) - before) < 3);
      await page.keyboard.press("Escape"); await dialog.waitFor({ state: "hidden" });
      await page.waitForTimeout(100);
      assert.ok(await trigger.evaluate(element => element === document.activeElement));
      assert.equal(await page.locator("html.lenis-stopped").count(), 0);
      await page.setViewportSize({ width: 768, height: 1000 }); await page.waitForTimeout(1200);
      assert.equal(await page.locator(".pin-spacer").count(), 0);
      assert.equal(await page.locator(".gallery-scene").getAttribute("data-horizontal"), null);
      await page.setViewportSize({ width: 1440, height: 1000 }); await page.waitForTimeout(1200);
      assert.ok(await page.locator(".pin-spacer").count() >= 2);
      await scrollTo(page, 1600);
      await page.getByRole("link", { name: "Back to top", exact: true }).click();
      await page.waitForTimeout(1800);
      assert.ok(await page.evaluate(() => scrollY < 3), "Back-to-top must return past the hero pin to the actual page start");
      await page.emulateMedia({ reducedMotion: "reduce" }); await page.waitForTimeout(1000);
      assert.equal(await page.locator("html.lenis, .pin-spacer").count(), 0);
      assert.equal(await page.locator(".gallery-scene").getAttribute("data-horizontal"), null);
      await page.emulateMedia({ reducedMotion: "no-preference" }); await page.waitForTimeout(1500);
      assert.ok(await page.locator(".pin-spacer").count() >= 2);
    } finally { await context.close(); }
  });
  await check("Reduced motion, certificate dialog and exact resume bytes", async () => {
    const { context, page } = await open(1440, true);
    try {
      assert.equal(await page.locator("html.lenis, .pin-spacer").count(), 0);
      const [download] = await Promise.all([page.waitForEvent("download"), page.locator("#home a[download]").click()]);
      assert.equal(download.suggestedFilename(), "Vasanthakumar_Resume.pdf");
      assert.equal(sha(await readFile(await download.path())), resumeHash);
      const trigger = page.getByRole("button", { name: "View Certificate" }).first();
      await trigger.click();
      const dialog = page.getByRole("dialog");
      await dialog.locator("img").evaluate(image => image.decode());
      await page.keyboard.press("Escape"); await dialog.waitFor({ state: "hidden" });
      assert.ok(await trigger.evaluate(element => element === document.activeElement));
    } finally { await context.close(); }
  });
  await check("No application console/runtime errors", async () => assert.deepEqual(errors, []));
} finally { await browser.close(); }
console.log(`${checks.filter(check => check.pass).length}/${checks.length} cinematic checks passed`);
if (checks.some(check => !check.pass)) process.exitCode = 1;
