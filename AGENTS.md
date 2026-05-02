# AGENTS.md

Guidance for AI coding agents (Claude Code, Cursor, Copilot, Aider, etc.) working in this repository. The file follows the [agentsmd.org](https://agentsmd.org) tool-agnostic convention. `CLAUDE.md` is a symlink to this file.

## Project

Personal portfolio site for Yevgen Liukkonen, served by GitHub Pages from `https://yekku.github.io/`. Single-page Astro 5 site, no backend.

## Stack

- **Astro 5** (static output, `output: 'static'`, `build.format: 'file'`).
- **Bootstrap 5.3**, **FontAwesome 6.5**, **github-calendar**, **Lato + Montserrat** — all self-hosted via npm; nothing loads from a CDN at runtime.
- No tests, no linter configured.

## Scripts

```bash
npm install          # once after clone
npm run dev          # local dev with HMR (http://localhost:4321)
npm run build        # static build into dist/
npm run preview      # serve dist/ locally to verify before pushing
```

## Where things live

```
src/
  layouts/BaseLayout.astro    HTML shell, vendor CSS/JS imports, meta tags
  components/Header.astro     profile photo + name + socials + contact CTA
  components/Sidebar.astro    info, testimonials, education, languages, music
  components/Skills.astro     skill bars (data-driven from `skills` array)
  pages/index.astro           composes the page; `whatIDo` data lives here
public/
  assets/css/styles.css       hand-edited theme CSS (NOT processed by Vite,
                              passed through to /assets/css/styles.css)
  assets/js/main.js           hand-edited; drives skill-bar animation,
                              Bootstrap tooltip init, GitHub calendar widget,
                              and the activity feed
  assets/images/              profile + project images
  favicon.ico
.github/workflows/deploy.yml  Pages deployment (Node 22, npm ci, astro build,
                              actions/deploy-pages@v4)
```

## Deploy contract

- **GitHub Pages source is "GitHub Actions"** (not "Deploy from branch").
- Push to `master` → `deploy.yml` runs → site is live in ~30–60s.
- The workflow is the only path to production. Don't manually publish anything.
- `dist/` is gitignored; the build artifact is uploaded by the Action, not committed.

## Conventions

- **Conventional Commits**, lowercase prefixes: `feat:`, `fix:`, `chore:`, `docs:`. Bodies use heredoc for multiline.
- Keep components small. Extract data into front-matter arrays when there's repetition (see `Skills.astro`, `Header.astro`).
- Self-host new third-party deps via npm. No new CDN `<link>` or `<script>` tags.

## Constraints worth knowing

- The GitHub username `Yekku` is hardcoded in `public/assets/js/main.js` in two places (calendar init + activity fetch). Change both if it ever needs to be parameterized.
- `main.js` is loaded as a classic script and depends on `GitHubCalendar` being a window global. The vendor JS is wired up in `BaseLayout.astro` via Vite's `?url` suffix + `<script is:inline>` to preserve that contract — don't switch it to a module import without refactoring `main.js`.
- Don't bump major versions of `bootstrap`, `@fortawesome/fontawesome-free`, or `github-calendar` without verifying the selectors in `public/assets/css/styles.css` and `public/assets/js/main.js` still match. Minor/patch is fine.
- The widget injects extra DOM (skip-to links, "Learn how we count contributions", a stats footer table). A `MutationObserver` waits for the SVG to appear, then `calendarCleanup()` strips those nodes. The upstream calendar uses class `.ContributionCalendar-day` on `<td>` cells, not `<rect>`s — that distinction is the subject of fixes `93e0141` and `bfd6dbb`.
- `PushEvent`s with zero commits are skipped in the activity feed (commit `8cf5f24`).

## Local preview before pushing

```bash
npm run build && npm run preview
# → http://localhost:4321
```

Visually compare to the live site before opening a PR. The deploy is push-to-merge, so once it's on master it's on production.
