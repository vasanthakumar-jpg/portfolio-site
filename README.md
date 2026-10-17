# Vasanthakumar Rajendran — Developer portfolio

A React, Vite, TypeScript, and Tailwind/shadcn portfolio for front-end and Shopify/e-commerce development. Published URL: https://vasanthakumar-jpg.github.io/portfolio-site/

## Content

Professional copy in `src/data/portfolio.ts` is condensed from the supplied resume. It includes four chronological roles, PRAVOKHA's marketplace workflows, the Walrus professional showcase, six other projects, grouped skills, certifications, achievements, and education.

Do not infer a project stack, result, private company information, or a source/demo link. TypeScript is used by this repository but omitted from professional skills because it is not in the supplied resume. The dental booking project's stack is unspecified; no framework is claimed.

## Local development and checks

Use Node.js 22.18 or later:

```sh
npm ci
npm run dev
```

Development runs at http://localhost:8080/. On Windows PowerShell, use `npm.cmd` if the PowerShell npm wrapper is restricted.

```sh
npm run lint
npm run typecheck
npm test
npm run build
npm run preview
```

Production preview: http://localhost:4173/portfolio-site/. The build uses `/portfolio-site/` for the Vite base and React Router basename; development uses `/`. Keep public asset and resume URLs relative to `import.meta.env.BASE_URL`. The single-page site's section hashes work with static hosting; arbitrary nested routes do not gain an SPA fallback on GitHub Pages.

## Resume

The header, hero, and footer download the supplied `public/Vasanthakumar_Resume.pdf` as `Vasanthakumar_Resume.pdf`. Replace this file with an updated approved PDF when needed. The deployment workflow uses the committed PDF and does not require Playwright. Working DOCX files are ignored and should not be placed in `public/`.

The optional `npm run resume:generate` utility produces a separate `public/resume.pdf` from portfolio content; it does not update or replace the supplied download.

## Contact

**Send Message** validates Name, Email, Subject, and Message, then opens an encoded Gmail compose draft addressed to the resume's existing email, `vasanthakumar141099@gmail.com`. If its popup is blocked, it requests the default email app through `mailto:`. **Open Gmail** and **Use email app** provide explicit recovery options.

The visitor reviews and sends the email. The site preserves the draft, guards duplicate launches, and never claims delivery. No backend, EmailJS, password, or email API configuration is required. See [Contact-Form.md](Contact-Form.md).

## Optional browser verification

The browser audit and PDF generator use [Playwright](https://playwright.dev/docs/library), kept out of runtime dependencies. If unavailable:

```sh
npm install --no-save --package-lock=false playwright
npx playwright install chromium
```

Run `npm run build`, then keep `npm run preview` running in one terminal. Run `npm run test:browser` for the portfolio regression checks, or `npm run test:preloader` for first-visit timing, resource readiness, session reloads, responsive sizes, reduced motion, and the five-second safety deadline. Run these browser suites separately so their timing checks do not compete for browser resources. Screenshots, diagnostics, and JSON reports go only to ignored `audit-artifacts/`. Gmail navigation is intercepted locally; tests send no email. A configured mail app and signed-in Gmail account still require manual checks. Run `npm ci` later to restore the exact committed dependencies.

## GitHub Pages deployment

The workflow in [.github/workflows/deploy.yml](.github/workflows/deploy.yml) installs with `npm ci`, lints, typechecks, tests, builds, uploads `dist/`, and deploys that artifact when changes reach `main`.

Set **Settings → Pages → Build and deployment → Source → GitHub Actions**. Push the reviewed changes to `main` and confirm the workflow succeeds before checking the live site. The workflow uses GitHub's provided token; no personal token or email credentials are needed. See [Vite's deployment guide](https://vite.dev/guide/static-deploy.html#github-pages) and [GitHub's Pages workflow documentation](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).

The existing `npm run deploy` alternative builds and publishes to `gh-pages`. For that alternative, select **Deploy from a branch → gh-pages → /(root)** as the Pages source. Use one publishing source at a time.

Review the files before committing. Working documents, node_modules, dist, and diagnostic artifacts are ignored:

```sh
git status --short
git diff
git add .
git commit -m "Update portfolio from resume with React and Shopify work"
git push origin main
```
