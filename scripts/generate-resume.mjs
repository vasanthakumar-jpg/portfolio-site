import { mkdir, writeFile } from "node:fs/promises";
import { chromium } from "playwright";
import { profile, skillGroups, experiences, marketplace, projects, certifications, achievements, education } from "../src/data/portfolio.ts";

const escape = (value) => String(value).replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]);
const list = (items) => `<ul>${items.map((item) => `<li>${escape(item)}</li>`).join("")}</ul>`;
const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>${escape(profile.name)} — Resume</title><style>
@page { size:A4; margin:13mm 14mm; }
*{box-sizing:border-box}body{margin:0;font:9.2pt/1.4 Arial,sans-serif;color:#263648}h1{font-size:23pt;line-height:1.15;margin:0 0 7px;color:#1555a2}h2{font-size:12pt;line-height:1.2;color:#1555a2;border-bottom:1px solid #cad6e3;padding-bottom:5px;margin:17px 0 9px}h3{font-size:10pt;margin:0 0 3px}p{margin:4px 0}a{color:#1555a2;text-decoration:none}ul{margin:5px 0;padding-left:15px}li{margin:2px 0}.contact{font-size:8.8pt;margin-top:8px}.headline{font-size:11pt;font-weight:bold}.skills p{margin:4px 0}.entry{break-inside:avoid;margin-bottom:12px}.row{display:flex;justify-content:space-between;gap:12px}.period{white-space:nowrap;font-size:8.8pt;color:#526477}.sub{color:#526477}.page+.page{break-before:page}.project{break-inside:avoid;margin-bottom:11px}.project p{font-size:9pt}.link{overflow-wrap:anywhere}.footer{font-size:8pt;color:#526477;margin-top:12px}
</style></head><body><section class="page">
<h1>${escape(profile.name)}</h1><p class="headline">${escape(profile.headline)}</p>
<p class="contact">${escape(profile.phone)} · <a href="mailto:${profile.email}">${escape(profile.email)}</a> · ${escape(profile.location)}</p>
<p class="contact"><a href="${profile.github}">GitHub: vasanthakumar-jpg</a> · <a href="${profile.linkedin}">LinkedIn: Vasanthakumar Rajendran</a></p>
<p class="contact link"><a href="${profile.siteUrl}">${profile.siteUrl}</a></p>
<h2>Professional Summary</h2><p>${escape(profile.summary.replace(/^I build/, "Front-End Developer building").replace("and customize", "and customizing").replace("My work spans", "Work spans"))}</p>
<h2>Skills</h2><div class="skills">${skillGroups.map((group) => `<p><strong>${escape(group.title)}:</strong> ${escape(group.items.join(", "))}</p>`).join("")}</div>
<h2>Professional Experience</h2>${experiences.map((experience) => `<div class="entry"><div class="row"><h3>${escape(experience.company)}</h3><span class="period">${escape(experience.period)}</span></div><p><strong>${escape(experience.role)}</strong> <span class="sub">· ${escape(experience.location)}</span></p>${list(experience.bullets)}</div>`).join("")}
</section><section class="page"><h1 style="font-size:17pt">Selected Work & Projects</h1>
<div class="project"><h2>${escape(marketplace.title)} — ${escape(marketplace.role)}</h2><p><strong>${escape(marketplace.type)}</strong> · <a href="${marketplace.liveUrl}">${marketplace.liveUrl}</a></p><p>${escape(marketplace.description)}</p><p><strong>Roles:</strong> ${escape(marketplace.roles.join(", "))}.</p><p><strong>Workflows:</strong> ${escape([...marketplace.management, ...marketplace.workflow, "Role-based dashboards and permissions"].join(", "))}.</p><p>${escape(marketplace.approach)}</p></div>
${projects.map((project) => `<div class="project"><h3>${escape(project.title)}</h3><p class="sub">${escape(project.role)}${project.technologies.length ? " · " + escape(project.technologies.join(", ")) : ""}</p><p>${escape(project.description)} ${escape(project.features.join("; "))}.</p></div>`).join("")}
<h2>Certifications</h2>${certifications.map((certificate) => `<p><strong>${escape(certificate.issuer)} — ${escape(certificate.title)}</strong>${certificate.level !== certificate.title ? " · " + escape(certificate.level) : ""} · ${certificate.year}</p>`).join("")}
<h2>Achievements</h2>${list(achievements)}
<h2>Education</h2><p><strong>${escape(education.degree)}</strong> · ${escape(education.college)} · ${escape(education.university)} · ${education.year}</p>
</section></body></html>`;

await mkdir("public", { recursive: true });
await mkdir("audit-artifacts", { recursive: true });
await writeFile("audit-artifacts/resume-preview.html", html);
const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: "load" });
  await page.pdf({ path: "public/resume.pdf", format: "A4", printBackground: true, preferCSSPageSize: true, tagged: true });
  console.log("Generated public/resume.pdf from professional content only.");
} finally { await browser.close(); }
