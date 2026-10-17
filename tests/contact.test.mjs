import assert from "node:assert/strict";
import test from "node:test";
import {
  CONTACT_EMAIL,
  CONTACT_LIMITS,
  createComposeLinks,
  normalizeContactDraft,
  validateContactDraft,
} from "../src/lib/contact.ts";

const draft = {
  name: "Visitor Name",
  email: "visitor@example.com",
  subject: "Hello",
  message: "Let's discuss a project.",
};

test("empty and whitespace-only drafts reject all required fields", () => {
  for (const value of ["", " \t\n "]) {
    assert.deepEqual(Object.keys(validateContactDraft({ name: value, email: value, subject: value, message: value })),
      ["name", "email", "subject", "message"]);
  }
});

test("invalid emails are rejected and surrounding whitespace is trimmed", () => {
  for (const email of ["invalid", "a@", "@example.com", "a b@example.com", "a@example", "a@b@c.com", "visitor@example..com", "visitor@-example.com", "visitor@example.com.", "visitor@example.com<evil>", ".visitor@example.com", "visitor..name@example.com"]) {
    assert.ok(validateContactDraft({ ...draft, email }).email, email);
  }
  assert.deepEqual(validateContactDraft({ ...draft, email: " visitor+tag@example.com " }), {});
});

test("name and message minimums, field limits, and subject header protection", () => {
  assert.ok(validateContactDraft({ ...draft, name: "A" }).name);
  assert.ok(validateContactDraft({ ...draft, message: "too short" }).message);
  assert.ok(validateContactDraft({ ...draft, subject: "Hello\r\nBcc: other@example.com" }).subject);
  for (const key of Object.keys(CONTACT_LIMITS)) {
    assert.ok(validateContactDraft({ ...draft, [key]: "x".repeat(CONTACT_LIMITS[key] + 1) })[key]);
  }
  assert.deepEqual(validateContactDraft({ ...draft, subject: "Hi" }), {});
});

test("normal Gmail and mailto drafts target only the existing contact email", () => {
  const links = createComposeLinks(draft);
  const gmail = new URL(links.gmail);
  const mailto = new URL(links.mailto);
  const expectedBody = "Name: Visitor Name\r\nEmail: visitor@example.com\r\n\r\nMessage:\r\nLet's discuss a project.";
  assert.equal(CONTACT_EMAIL, "vasanthakumar141099@gmail.com");
  assert.equal(gmail.origin, "https://mail.google.com");
  assert.equal(gmail.searchParams.get("view"), "cm");
  assert.equal(gmail.searchParams.get("fs"), "1");
  assert.equal(gmail.searchParams.get("to"), CONTACT_EMAIL);
  assert.equal(gmail.searchParams.get("su"), draft.subject);
  assert.equal(gmail.searchParams.get("body"), expectedBody);
  assert.equal(mailto.protocol, "mailto:");
  assert.equal(mailto.pathname, CONTACT_EMAIL);
  assert.equal(mailto.searchParams.get("subject"), draft.subject);
  assert.equal(mailto.searchParams.get("body"), expectedBody);
  assert.deepEqual([...mailto.searchParams.keys()], ["subject", "body"]);
});

test("special characters and Unicode round-trip without injecting recipients or headers", () => {
  const specialDraft = {
    name: "Zoë & 李",
    email: "visitor+tag@example.com",
    subject: "React & UI? #1 + 50% = '✓' 📬 &to=other@example.com",
    message: "First line: & ? # + % = /\nSecond line: தமிழ், café, 李 📬\n&bcc=other@example.com",
  };
  assert.deepEqual(validateContactDraft(specialDraft), {});
  const { gmail, mailto } = createComposeLinks(specialDraft);
  const gmailUrl = new URL(gmail);
  const mailtoUrl = new URL(mailto);
  for (const url of [gmailUrl, mailtoUrl]) {
    assert.equal(url.hash, "");
    assert.equal(url.searchParams.get("bcc"), null);
    assert.ok(url.searchParams.get("body").endsWith(specialDraft.message));
  }
  assert.equal(gmailUrl.searchParams.get("su"), specialDraft.subject);
  assert.equal(mailtoUrl.searchParams.get("subject"), specialDraft.subject);
  assert.equal(gmailUrl.searchParams.getAll("to").length, 1);
  assert.equal(gmailUrl.searchParams.get("to"), CONTACT_EMAIL);
});

test("normalization preserves internal message newlines and never mutates input", () => {
  const input = { ...draft, name: " Visitor Name ", email: " visitor@example.com ", subject: " Hello ", message: "  First line\n\nSecond line  " };
  assert.deepEqual(normalizeContactDraft(input), { ...draft, message: "First line\n\nSecond line" });
  assert.equal(input.subject, " Hello ");
  assert.equal(new URL(createComposeLinks(input).gmail).searchParams.get("su"), "Hello");
});
