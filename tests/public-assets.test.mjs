import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";
import test from "node:test";

async function publicFiles(directory = "public") {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.map((entry) => entry.isDirectory() ? publicFiles(join(directory, entry.name)) : join(directory, entry.name)));
  return nested.flat();
}

test("published assets contain the PDF resume and no working documents or audit artifacts", async () => {
  const files = await publicFiles();
  assert.deepEqual(files.filter((file) => /\.docx?$|audit-artifacts|debug|\.log$|\.map$/i.test(file)), []);
  const pdf = await readFile("public/Vasanthakumar_Resume.pdf");
  assert.equal(pdf.subarray(0, 5).toString(), "%PDF-");
  assert.ok(pdf.length > 10000, "The supplied resume PDF should not be empty or truncated");
});

test("search discovery points to the actual GitHub Pages project URL", async () => {
  const sitemap = await readFile("public/sitemap.xml", "utf8");
  assert.ok(sitemap.includes("<loc>https://vasanthakumar-jpg.github.io/portfolio-site/</loc>"));
  const robots = await readFile("public/robots.txt", "utf8");
  assert.ok(robots.includes("Sitemap: https://vasanthakumar-jpg.github.io/portfolio-site/sitemap.xml"));
});
