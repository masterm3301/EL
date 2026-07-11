# Website Redesign (Editorial Minimal) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the 7-page static portfolio into an editorial-minimal site (Fraunces + Inter, warm palette, dark mode, scroll reveals, project filtering, dedicated essay pages) per `docs/superpowers/specs/2026-07-11-website-redesign-design.md`.

**Architecture:** Vanilla HTML/CSS/JS, no build step. One rewritten stylesheet with light/dark themes as CSS-variable blocks. `js/layout.js` injects nav/footer and owns the theme toggle + scroll-reveal observer. `js/blog.js` runs in three modes detected by which element exists on the page (writing index, single post, home teaser). New `post.html` renders an essay from `blog/posts.js` via `?post=<id>`.

**Tech Stack:** HTML5, CSS custom properties, vanilla ES6, Google Fonts (Fraunces, Inter), IntersectionObserver, localStorage.

## Global Constraints

- No frameworks, no build step, no new dependencies beyond the Google Fonts request.
- Fonts link (every page, replaces the current Inter-only link): `https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Inter:wght@400;500;600&display=swap`
- Theme bootstrap script (below) goes in every page `<head>` BEFORE the stylesheet link.
- Reveal animation must be added by JS only (`.reveal` class) so content is never hidden without JS, and must be skipped under `prefers-reduced-motion: reduce`.
- Accent color: terracotta `#c4552d` (light) / `#e0704a` (dark). Paper `#faf8f5` / `#161311`. Ink `#1a1815` / `#f0eae2`.
- All existing copy/content is kept verbatim unless a task explicitly changes it.
- Test server: run `python3 -m http.server 8000` from the repo root; pages at `http://localhost:8000/<page>.html`. (Needed because `blog/posts.js` and theme both work from `file://` too, but keep one consistent method.)
- Commit after every task.

**Theme bootstrap snippet (referenced by several tasks as "the theme bootstrap"):**

```html
<script>(function(){var t=localStorage.getItem('theme');if(t!=='light'&&t!=='dark'){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}document.documentElement.setAttribute('data-theme',t);})();</script>
```

**Standard `<head>` block (referenced by page tasks as "the standard head", swap TITLE/DESC per page):**

```html
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>TITLE</title>
  <meta name="description" content="DESC" />
  <script>(function(){var t=localStorage.getItem('theme');if(t!=='light'&&t!=='dark'){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}document.documentElement.setAttribute('data-theme',t);})();</script>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="css/style.css" />
</head>
```

---

### Task 1: Rewrite the stylesheet

**Files:**
- Modify: `css/style.css` (full replacement)

**Interfaces:**
- Produces: every class used by Tasks 2–8. Key names later tasks rely on:
  `.nav`, `.nav-inner`, `.nav-logo`, `.nav-links`, `.nav-toggle`, `.theme-toggle`,
  `.btn`, `.btn-outline`, `.btn-small`,
  `.page-head`, `.kicker`, `.page-title`, `.page-sub`,
  `.hero`, `.hero-name`, `.hero-lead`, `.hero-actions`, `.hero-stats`, `.stat`, `.stat-num`, `.stat-label`,
  `.home-strip`, `.strip-head`, `.row-list`, `.row-item`,
  `.about-grid`, `.pull-line`, `.about-text`, `.about-facts`,
  `.filter-bar`, `.chip`, `.chip.active`, `.project`, `.project.hidden-by-filter`, `.project-head`, `.project-role`, `.project-desc`, `.project-details`, `.tags`, `.featured-mark`,
  `.timeline`, `.tl-item`, `.tl-date`,
  `.skill-group`, `.certs-title`, `.certs`,
  `.post-index`, `.post-row`, `.post-row-meta`, `.post-row-title`, `.post-row-excerpt`,
  `.post-page`, `.post-back`, `.post-header`, `.post-meta`, `.post-article`, `.post-h2`, `.post-h3`, `.post-list`, `.post-quote`, `.post-hr`, `.post-body`, `.post-nav`, `.post-link`, `.blog-loading`,
  `.contact-box`, `.contact-email`, `.copy-note`, `.footer`, `.footer-inner`,
  `.reveal`, `.reveal.revealed`, `.section`

- [ ] **Step 1: Replace the entire contents of `css/style.css` with:**

```css
/* ============ TOKENS ============ */
:root {
  --paper: #faf8f5;
  --paper-raised: #f3efe8;
  --ink: #1a1815;
  --ink-soft: #57514a;
  --ink-faint: #8a8378;
  --accent: #c4552d;
  --accent-soft: rgba(196, 85, 45, 0.08);
  --line: #e7e1d7;
  --radius: 10px;
  --max: 1000px;
  --measure: 720px;
  --font-display: "Fraunces", Georgia, "Times New Roman", serif;
  --font-body: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}
[data-theme="dark"] {
  --paper: #161311;
  --paper-raised: #201c18;
  --ink: #f0eae2;
  --ink-soft: #b5ada1;
  --ink-faint: #7d766c;
  --accent: #e0704a;
  --accent-soft: rgba(224, 112, 74, 0.12);
  --line: #2d2822;
}

/* ============ BASE ============ */
* { margin: 0; padding: 0; box-sizing: border-box; }

html { scroll-behavior: smooth; }

body {
  font-family: var(--font-body);
  color: var(--ink);
  background: var(--paper);
  line-height: 1.7;
  font-size: 1.02rem;
  -webkit-font-smoothing: antialiased;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  transition: background 0.25s ease, color 0.25s ease;
}

.container { max-width: var(--max); margin: 0 auto; padding: 0 24px; }

h1, h2, h3, .stat-num { font-family: var(--font-display); font-weight: 500; letter-spacing: -0.01em; }

a { color: var(--accent); text-decoration: none; }

p a, li a, .post-article a {
  background-image: linear-gradient(var(--accent), var(--accent));
  background-size: 0% 1px;
  background-position: 0 100%;
  background-repeat: no-repeat;
  transition: background-size 0.25s ease;
}
p a:hover, li a:hover, .post-article a:hover { background-size: 100% 1px; }

::selection { background: var(--accent); color: var(--paper); }

/* ============ BUTTONS ============ */
.btn {
  display: inline-block;
  background: var(--ink);
  color: var(--paper);
  padding: 13px 28px;
  border-radius: 999px;
  font-weight: 500;
  font-size: 0.95rem;
  transition: background 0.2s ease, transform 0.2s ease;
}
.btn:hover { background: var(--accent); transform: translateY(-1px); }

.btn-outline {
  background: transparent;
  color: var(--ink);
  border: 1px solid var(--line);
}
.btn-outline:hover { background: var(--accent-soft); color: var(--accent); border-color: var(--accent); }

.btn-small { padding: 9px 20px; font-size: 0.86rem; }

/* ============ NAV ============ */
.nav {
  position: sticky;
  top: 0;
  z-index: 100;
  background: color-mix(in srgb, var(--paper) 88%, transparent);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--line);
}
.nav-inner { display: flex; align-items: center; justify-content: space-between; height: 68px; }
.nav-logo { font-family: var(--font-display); font-weight: 600; font-size: 1.35rem; color: var(--ink); }
.nav-logo span { color: var(--accent); }

.nav-links { display: flex; align-items: center; gap: 26px; }
.nav-links a:not(.btn) {
  color: var(--ink-soft);
  font-weight: 500;
  font-size: 0.92rem;
  padding-bottom: 3px;
  background-image: linear-gradient(var(--accent), var(--accent));
  background-size: 0% 1.5px;
  background-position: 0 100%;
  background-repeat: no-repeat;
  transition: background-size 0.25s ease, color 0.2s ease;
}
.nav-links a:not(.btn):hover { color: var(--ink); background-size: 100% 1.5px; }
.nav-links a.active { color: var(--ink); background-size: 100% 1.5px; }

.theme-toggle {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--ink-soft);
  display: inline-flex;
  align-items: center;
  padding: 6px;
  border-radius: 50%;
  transition: color 0.2s ease, background 0.2s ease;
}
.theme-toggle:hover { color: var(--accent); background: var(--accent-soft); }
.theme-toggle svg { width: 18px; height: 18px; }
.icon-sun { display: none; }
.icon-moon { display: block; }
[data-theme="dark"] .icon-sun { display: block; }
[data-theme="dark"] .icon-moon { display: none; }

.nav-toggle { display: none; background: none; border: none; cursor: pointer; padding: 8px; }
.nav-toggle span { display: block; width: 22px; height: 1.5px; background: var(--ink); margin: 5px 0; }

/* ============ PAGE HEAD (interior pages) ============ */
.page-head { padding: 88px 0 20px; }
.kicker {
  color: var(--accent);
  font-weight: 600;
  font-size: 0.8rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  margin-bottom: 14px;
}
.page-title { font-size: clamp(2.6rem, 6vw, 3.9rem); line-height: 1.08; }
.page-sub { color: var(--ink-soft); max-width: var(--measure); margin-top: 18px; font-size: 1.05rem; }

/* ============ HERO (home) ============ */
.hero { padding: 110px 0 40px; }
.hero-name { font-size: clamp(3rem, 8vw, 5rem); line-height: 1.04; max-width: 14ch; }
.hero-lead { max-width: 620px; margin-top: 26px; font-size: 1.12rem; color: var(--ink-soft); }
.hero-lead strong { color: var(--ink); font-weight: 600; }
.hero-actions { margin-top: 36px; display: flex; gap: 14px; flex-wrap: wrap; }

.hero-stats {
  margin: 88px 0 0;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  border-top: 1px solid var(--line);
}
.stat { padding: 26px 20px 0 0; }
.stat + .stat { border-left: 1px solid var(--line); padding-left: 24px; }
.stat-num { display: block; font-size: 2.6rem; color: var(--ink); line-height: 1.1; }
.stat-label {
  display: block;
  margin-top: 6px;
  font-size: 0.75rem;
  color: var(--ink-faint);
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

/* ============ HOME STRIPS ============ */
.home-strip { padding: 88px 0 0; }
.home-strip:last-of-type { padding-bottom: 100px; }
.strip-head { display: flex; align-items: baseline; justify-content: space-between; gap: 16px; margin-bottom: 8px; }
.strip-head h2 { font-size: 1.7rem; }
.strip-head a { font-size: 0.9rem; font-weight: 500; }

.row-list { list-style: none; }
.row-item { border-bottom: 1px solid var(--line); }
.row-item a {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 20px;
  padding: 20px 4px;
  color: var(--ink);
  transition: padding-left 0.25s ease, color 0.2s ease;
}
.row-item a:hover { padding-left: 14px; color: var(--accent); }
.row-item .row-title { font-family: var(--font-display); font-size: 1.25rem; font-weight: 500; }
.row-item .row-meta { font-size: 0.84rem; color: var(--ink-faint); white-space: nowrap; }

/* ============ SECTIONS ============ */
.section { padding: 48px 0 110px; }

/* ============ ABOUT ============ */
.pull-line { font-family: var(--font-display); font-size: 1.7rem; line-height: 1.35; max-width: 24ch; margin-bottom: 34px; }
.about-grid { display: grid; grid-template-columns: 1.55fr 1fr; gap: 64px; }
.about-text { color: var(--ink-soft); font-size: 1.05rem; max-width: var(--measure); }
.about-text p + p { margin-top: 18px; }
.about-text strong { color: var(--ink); font-weight: 600; }

.about-facts { height: fit-content; border-top: 1px solid var(--line); }
.about-facts h3 { font-size: 1.15rem; padding: 18px 0 4px; }
.about-facts ul { list-style: none; }
.about-facts li { padding: 12px 0; font-size: 0.92rem; color: var(--ink-soft); border-bottom: 1px solid var(--line); }
.about-facts strong { color: var(--ink); font-weight: 600; }

/* ============ PROJECTS ============ */
.filter-bar { display: flex; flex-wrap: wrap; gap: 10px; margin: 26px 0 10px; }
.chip {
  background: transparent;
  border: 1px solid var(--line);
  color: var(--ink-soft);
  font-family: var(--font-body);
  font-size: 0.85rem;
  font-weight: 500;
  padding: 7px 18px;
  border-radius: 999px;
  cursor: pointer;
  transition: all 0.2s ease;
}
.chip:hover { border-color: var(--accent); color: var(--accent); }
.chip.active { background: var(--accent); border-color: var(--accent); color: #fff; }

.projects { display: block; }
.project {
  padding: 40px 0;
  border-bottom: 1px solid var(--line);
  transition: opacity 0.3s ease;
}
.project.hidden-by-filter { display: none; }
.project-head { display: flex; align-items: baseline; gap: 14px; flex-wrap: wrap; }
.project-head h3 { font-size: 1.55rem; }
.featured-mark {
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--accent);
  border: 1px solid var(--accent);
  border-radius: 999px;
  padding: 2px 10px;
}
.project-role { display: block; width: 100%; margin-top: 4px; font-size: 0.84rem; font-weight: 500; color: var(--ink-faint); }
.project-desc { margin-top: 14px; color: var(--ink-soft); max-width: var(--measure); }
.project-details { margin: 14px 0 0 18px; color: var(--ink-soft); font-size: 0.93rem; max-width: var(--measure); }
.project-details li { margin-bottom: 6px; }

.tags { margin-top: 18px; display: flex; flex-wrap: wrap; gap: 8px; }
.tags span {
  background: var(--accent-soft);
  color: var(--accent);
  font-size: 0.76rem;
  font-weight: 500;
  padding: 4px 12px;
  border-radius: 999px;
}

/* ============ TIMELINE ============ */
.timeline { position: relative; margin-top: 30px; padding-left: 32px; border-left: 1px solid var(--line); }
.tl-item { position: relative; padding-bottom: 44px; }
.tl-item:last-child { padding-bottom: 0; }
.tl-item::before {
  content: "";
  position: absolute;
  left: -36px;
  top: 9px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--accent);
}
.tl-date {
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--accent);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}
.tl-item h3 { font-size: 1.25rem; margin-top: 6px; }
.tl-item p { color: var(--ink-soft); font-size: 0.94rem; margin-top: 6px; max-width: var(--measure); }

/* ============ SKILLS ============ */
.skill-group { padding: 30px 0; border-bottom: 1px solid var(--line); }
.skill-group:last-of-type { border-bottom: none; }
.skill-group h3 { font-size: 1.35rem; margin-bottom: 16px; }

.certs-title { margin-top: 60px; font-size: 1.35rem; }
.certs { margin-top: 18px; list-style: none; }
.certs li { padding: 12px 0; border-bottom: 1px solid var(--line); font-size: 0.94rem; color: var(--ink-soft); }
.certs li:last-child { border-bottom: none; }

/* ============ WRITING INDEX ============ */
.post-index { margin-top: 20px; }
.post-row { border-bottom: 1px solid var(--line); }
.post-row > a { display: block; padding: 34px 4px; color: var(--ink); transition: padding-left 0.25s ease; }
.post-row > a:hover { padding-left: 14px; }
.post-row > a:hover .post-row-title { color: var(--accent); }
.post-row-meta { font-size: 0.82rem; color: var(--ink-faint); font-weight: 500; }
.post-row-title { font-family: var(--font-display); font-size: 1.7rem; font-weight: 500; margin-top: 8px; line-height: 1.25; transition: color 0.2s ease; }
.post-row-excerpt { margin-top: 10px; color: var(--ink-soft); font-size: 0.97rem; max-width: var(--measure); }
.blog-loading { color: var(--ink-faint); padding: 30px 0; }

/* ============ POST PAGE ============ */
.post-page { max-width: 680px; margin: 0 auto; padding: 72px 24px 110px; width: 100%; }
.post-back { font-size: 0.9rem; font-weight: 500; }
.post-header { margin: 26px 0 40px; padding-bottom: 32px; border-bottom: 1px solid var(--line); }
.post-header h1 { font-size: clamp(2rem, 5vw, 2.9rem); line-height: 1.15; }
.post-meta { display: block; margin-top: 16px; font-size: 0.86rem; color: var(--ink-faint); font-weight: 500; }
.post-article { font-size: 1.06rem; color: var(--ink-soft); }
.post-body { margin-top: 18px; }
.post-h2 { font-size: 1.5rem; margin-top: 44px; color: var(--ink); }
.post-h3 { font-size: 1.2rem; margin-top: 32px; color: var(--ink); }
.post-list { margin: 14px 0 0 24px; }
.post-list li { margin-bottom: 8px; }
.post-quote {
  margin-top: 22px;
  padding: 14px 22px;
  border-left: 2px solid var(--accent);
  color: var(--ink-soft);
  font-style: italic;
}
.post-hr { border: none; border-top: 1px solid var(--line); margin: 36px 0 12px; }
.post-link { display: inline-block; margin-top: 30px; font-size: 0.92rem; font-weight: 500; }
.post-nav { display: flex; justify-content: space-between; gap: 20px; margin-top: 56px; padding-top: 28px; border-top: 1px solid var(--line); font-size: 0.92rem; }
.post-nav a { max-width: 46%; }

/* ============ CONTACT ============ */
.contact-box { text-align: center; padding-top: 40px; }
.contact-box .page-sub { margin-left: auto; margin-right: auto; }
.contact-email {
  display: inline-block;
  font-family: var(--font-display);
  font-size: clamp(1.3rem, 4vw, 2.1rem);
  color: var(--ink);
  margin-top: 36px;
  cursor: pointer;
  border-bottom: 1.5px solid var(--line);
  padding-bottom: 4px;
  transition: color 0.2s ease, border-color 0.2s ease;
}
.contact-email:hover { color: var(--accent); border-color: var(--accent); }
.copy-note { display: block; margin-top: 12px; font-size: 0.8rem; color: var(--ink-faint); min-height: 1.2em; }
.contact-box .hero-actions { justify-content: center; margin-top: 34px; }

/* ============ FOOTER ============ */
.footer { margin-top: auto; border-top: 1px solid var(--line); padding: 36px 0; }
.footer-inner { display: flex; align-items: center; justify-content: space-between; gap: 16px; flex-wrap: wrap; }
.footer-name { font-family: var(--font-display); font-size: 1.1rem; color: var(--ink); }
.footer p { color: var(--ink-faint); font-size: 0.85rem; }
.footer-links { display: flex; gap: 18px; font-size: 0.88rem; }

/* ============ REVEAL ============ */
.reveal { opacity: 0; transform: translateY(14px); transition: opacity 0.55s ease-out, transform 0.55s ease-out; }
.reveal.revealed { opacity: 1; transform: none; }

/* ============ RESPONSIVE ============ */
@media (max-width: 860px) {
  .about-grid { grid-template-columns: 1fr; gap: 44px; }
  .hero-stats { grid-template-columns: repeat(2, 1fr); row-gap: 30px; }
  .stat:nth-child(3) { border-left: none; padding-left: 0; }
}

@media (max-width: 720px) {
  .nav-toggle { display: block; }
  .nav-links {
    display: none;
    position: absolute;
    top: 68px;
    left: 0;
    right: 0;
    background: var(--paper);
    border-bottom: 1px solid var(--line);
    flex-direction: column;
    padding: 20px 24px;
    gap: 16px;
    align-items: flex-start;
  }
  .nav-links.open { display: flex; }
  .hero { padding: 70px 0 30px; }
  .hero-stats { margin-top: 60px; }
  .page-head { padding: 60px 0 12px; }
  .section { padding: 32px 0 80px; }
  .home-strip { padding-top: 64px; }
  .row-item a { flex-direction: column; gap: 4px; }
}
```

- [ ] **Step 2: Verify the CSS parses and the site still loads (old markup, new styles — will look half-styled; that's expected)**

Run: `python3 -m http.server 8000` (from repo root, leave running in background) then open `http://localhost:8000/index.html`.
Expected: page renders with warm off-white background, no console errors. Layout will look rough until page tasks land.

- [ ] **Step 3: Commit**

```bash
git add css/style.css
git commit -m "redesign: rewrite stylesheet — editorial minimal, light/dark themes"
```

---

### Task 2: Rewrite `js/layout.js` (nav, footer, theme toggle, reveal observer)

**Files:**
- Modify: `js/layout.js` (full replacement)

**Interfaces:**
- Consumes: CSS classes from Task 1 (`.theme-toggle`, `.icon-sun`, `.icon-moon`, `.footer-inner`, `.reveal`).
- Produces: injected header/footer on every page with `#siteHeader` / `#siteFooter`; scroll-reveal for any element carrying `data-reveal`; theme persistence in `localStorage.theme`.

- [ ] **Step 1: Replace the entire contents of `js/layout.js` with:**

```js
// Shared nav + footer, theme toggle, and scroll reveal — injected on every page.
(function () {
  const sun = '<svg class="icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4m11.4-11.4 1.4-1.4"/></svg>';
  const moon = '<svg class="icon-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>';

  document.getElementById('siteHeader').innerHTML = `
    <div class="container nav-inner">
      <a href="index.html" class="nav-logo">Othman<span>.</span></a>
      <nav class="nav-links" id="navLinks">
        <a href="about.html">About</a>
        <a href="projects.html">Projects</a>
        <a href="experience.html">Experience</a>
        <a href="skills.html">Skills</a>
        <a href="writing.html">Writing</a>
        <a href="contact.html">Contact</a>
        <button class="theme-toggle" id="themeToggle" aria-label="Toggle dark mode">${sun}${moon}</button>
        <a href="contact.html" class="btn btn-small">Get in Touch</a>
      </nav>
      <button class="nav-toggle" id="navToggle" aria-label="Toggle menu">
        <span></span><span></span><span></span>
      </button>
    </div>`;

  document.getElementById('siteFooter').innerHTML = `
    <div class="container footer-inner">
      <div>
        <div class="footer-name">Othman El Majid</div>
        <p>Building products from zero to one · Rabat, Morocco</p>
      </div>
      <div class="footer-links">
        <a href="mailto:mastermajidosse@gmail.com">Email</a>
        <a href="https://linkedin.com/in/othmaneelmajid" target="_blank" rel="noopener">LinkedIn</a>
      </div>
      <p>© 2026 Othman El Majid</p>
    </div>`;

  // Mobile menu
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');
  toggle.addEventListener('click', () => links.classList.toggle('open'));
  links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => links.classList.remove('open')));

  // Active page marker (post pages highlight Writing)
  const here = location.pathname.split('/').pop() || 'index.html';
  const marked = here === 'post.html' ? 'writing.html' : here;
  links.querySelectorAll('a').forEach(a => {
    if (a.getAttribute('href') === marked && !a.classList.contains('btn')) a.classList.add('active');
  });

  // Theme toggle — bootstrap script in <head> already set data-theme before paint
  document.getElementById('themeToggle').addEventListener('click', () => {
    const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  });

  // Scroll reveal — class added here so content is never hidden without JS
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('revealed'); io.unobserve(e.target); }
      });
    }, { threshold: 0.08 });
    document.querySelectorAll('[data-reveal]').forEach(el => { el.classList.add('reveal'); io.observe(el); });
  }
})();
```

- [ ] **Step 2: Verify**

Open `http://localhost:8000/index.html`.
Expected: nav shows wordmark + links + moon/sun icon + button; footer shows three-part band. Clicking the theme icon flips the whole page dark/light; reloading keeps the choice (check `localStorage.theme` in devtools). No console errors.

- [ ] **Step 3: Commit**

```bash
git add js/layout.js
git commit -m "redesign: new nav/footer, theme toggle, scroll-reveal observer"
```

---

### Task 3: Home page (`index.html`)

**Files:**
- Modify: `index.html` (full replacement)

**Interfaces:**
- Consumes: standard head, Task 1 classes, Task 2 injection; `#homeWriting` will be filled by Task 7's `blog.js` (until then it shows its static fallback text — fine).
- Produces: `#homeWriting` element that `js/blog.js` (Task 7) fills with the two latest essays.

- [ ] **Step 1: Replace the entire contents of `index.html` with:**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Othman El — Mobile &amp; Full-Stack Developer · CTO</title>
  <meta name="description" content="Othman El — Mobile application developer, full-stack engineer and CTO with 9+ years of experience, 38+ shipped apps and 1M+ downloads." />
  <script>(function(){var t=localStorage.getItem('theme');if(t!=='light'&&t!=='dark'){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}document.documentElement.setAttribute('data-theme',t);})();</script>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="css/style.css" />
</head>
<body>

  <header class="nav" id="siteHeader"></header>

  <!-- ============ HERO ============ -->
  <section class="hero" id="top">
    <div class="container">
      <p class="kicker">Mobile &amp; Full-Stack · CTO · Rabat, Morocco</p>
      <h1 class="hero-name">Othman El Majid</h1>
      <p class="hero-lead">
        Nine years turning early-stage startup concepts into production-grade products —
        <strong>38+ apps and websites shipped</strong>, <strong>1M+ combined downloads</strong>,
        trusted by founders across Morocco, France, Canada, the US, and Saudi Arabia.
      </p>
      <div class="hero-actions">
        <a href="projects.html" class="btn">View Projects</a>
        <a href="writing.html" class="btn btn-outline">Read My Writing</a>
      </div>
      <div class="hero-stats" data-reveal>
        <div class="stat"><span class="stat-num">9+</span><span class="stat-label">Years of Experience</span></div>
        <div class="stat"><span class="stat-num">38+</span><span class="stat-label">Apps &amp; Websites Shipped</span></div>
        <div class="stat"><span class="stat-num">1M+</span><span class="stat-label">Combined Downloads</span></div>
        <div class="stat"><span class="stat-num">4</span><span class="stat-label">CTO Roles</span></div>
      </div>
    </div>
  </section>

  <!-- ============ SELECTED WORK ============ -->
  <section class="home-strip" data-reveal>
    <div class="container">
      <div class="strip-head">
        <h2>Selected work</h2>
        <a href="projects.html">All projects →</a>
      </div>
      <ul class="row-list">
        <li class="row-item">
          <a href="projects.html">
            <span class="row-title">Coordify — concept to MVP in five months</span>
            <span class="row-meta">CTO · 2025–2026</span>
          </a>
        </li>
        <li class="row-item">
          <a href="projects.html">
            <span class="row-title">Caraleya — social &amp; event-planning super-app</span>
            <span class="row-meta">Flutter · 2025</span>
          </a>
        </li>
        <li class="row-item">
          <a href="projects.html">
            <span class="row-title">Justice Data Solutions — US legal-tech apps</span>
            <span class="row-meta">Lead Flutter · 2022–2024</span>
          </a>
        </li>
      </ul>
    </div>
  </section>

  <!-- ============ RECENT WRITING ============ -->
  <section class="home-strip" data-reveal>
    <div class="container">
      <div class="strip-head">
        <h2>Recent writing</h2>
        <a href="writing.html">All essays →</a>
      </div>
      <ul class="row-list" id="homeWriting">
        <li class="row-item"><a href="writing.html"><span class="row-title">Essays on startups, funding, and building things</span><span class="row-meta">→</span></a></li>
      </ul>
    </div>
  </section>

  <footer class="footer" id="siteFooter"></footer>

  <script src="js/layout.js"></script>
  <script src="blog/posts.js"></script>
  <script src="js/blog.js"></script>
</body>
</html>
```

- [ ] **Step 2: Verify**

Open `http://localhost:8000/index.html`.
Expected: left-aligned hero with huge serif name, kicker above it; unboxed stat row with hairlines; two strips below ("Selected work" rows, "Recent writing" fallback row until Task 7). Stats/strips fade in on scroll. Dark mode looks correct. At 375px width (devtools), stats collapse to 2 columns, rows stack.
Note: until Task 7 rewrites `js/blog.js`, the old blog.js may throw on this page (it expects `#blogGrid`) — its `try/catch` swallows it except one line writing to a null element inside `catch`; if a console error appears here, ignore it, Task 7 removes it.

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "redesign: editorial home page with stats row and teaser strips"
```

---

### Task 4: About + Contact pages

**Files:**
- Modify: `about.html` (body section only; use the standard head with existing title/description)
- Modify: `contact.html` (full replacement)

- [ ] **Step 1: In `about.html`, replace the `<head>` with the standard head (keep the existing `<title>About — Othman El Majid</title>` and its meta description), then replace the `<section class="section" id="about">…</section>` block with:**

```html
  <section class="page-head">
    <div class="container">
      <p class="kicker">About</p>
      <h1 class="page-title">I build products from zero to one.</h1>
    </div>
  </section>

  <section class="section" id="about">
    <div class="container">
      <div class="about-grid" data-reveal>
        <div class="about-text">
          <p>
            I'm a mobile application developer and technology leader specializing in
            <strong>cross-platform Flutter development</strong>, with a sharp focus on performance,
            stable architecture, and intuitive user experience.
          </p>
          <p>
            Over the last nine years I've worked across the full stack — Flutter and Dart on the front,
            Firebase, AWS, and Parse Server on the back — and across the full company lifecycle:
            freelancer, lead developer, and CTO. I've recruited and led cross-functional
            engineering teams covering mobile, backend, and design, and I've owned everything from
            stack selection and infrastructure to CI/CD release pipelines.
          </p>
          <p>
            My specialty is the zero-to-one phase: taking a founder's idea and turning it into a
            functional, production-grade MVP — fast — then scaling it with solid engineering
            standards, code review practices, and release processes.
          </p>
        </div>
        <div class="about-facts">
          <h3>Quick Facts</h3>
          <ul>
            <li><strong>Location:</strong> Rabat, Morocco (remote-friendly)</li>
            <li><strong>Languages:</strong> English (Professional) — please communicate in English</li>
            <li><strong>Core stack:</strong> Flutter · Dart · Firebase · AWS</li>
            <li><strong>Education:</strong> Associate's Degree in Computer Science — NTIC (2014–2016)</li>
            <li><strong>Email:</strong> <a href="mailto:mastermajidosse@gmail.com">mastermajidosse@gmail.com</a></li>
            <li><strong>LinkedIn:</strong> <a href="https://linkedin.com/in/othmaneelmajid" target="_blank" rel="noopener">linkedin.com/in/othmaneelmajid</a></li>
            <li><strong>CV:</strong> <a href="https://drive.google.com/drive/my-drive" target="_blank" rel="noopener">View on Google Drive</a></li>
          </ul>
        </div>
      </div>
    </div>
  </section>
```

- [ ] **Step 2: Replace the entire contents of `contact.html` with:**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Contact — Othman El Majid</title>
  <meta name="description" content="Contact Othman El Majid — open to CTO engagements, contract work, and full-time remote roles." />
  <script>(function(){var t=localStorage.getItem('theme');if(t!=='light'&&t!=='dark'){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}document.documentElement.setAttribute('data-theme',t);})();</script>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="css/style.css" />
</head>
<body>

  <header class="nav" id="siteHeader"></header>

  <!-- ============ CONTACT ============ -->
  <section class="section" id="contact">
    <div class="container contact-box">
      <p class="kicker">Contact</p>
      <h1 class="page-title">Let's build something.</h1>
      <p class="page-sub">
        Building an MVP? Need a technical co-founder's eye, or a Flutter team lead?
        I'm open to CTO engagements, contract work, and full-time remote roles.
      </p>
      <a class="contact-email" id="copyEmail" href="mailto:mastermajidosse@gmail.com">mastermajidosse@gmail.com</a>
      <span class="copy-note" id="copyNote">click to email — or copy below</span>
      <div class="hero-actions">
        <a href="#" class="btn" id="copyBtn">Copy Email</a>
        <a href="https://linkedin.com/in/othmaneelmajid" class="btn btn-outline" target="_blank" rel="noopener">LinkedIn</a>
      </div>
    </div>
  </section>

  <footer class="footer" id="siteFooter"></footer>

  <script src="js/layout.js"></script>
  <script>
    document.getElementById('copyBtn').addEventListener('click', function (e) {
      e.preventDefault();
      navigator.clipboard.writeText('mastermajidosse@gmail.com').then(() => {
        document.getElementById('copyNote').textContent = 'copied to clipboard ✓';
      }).catch(() => {
        document.getElementById('copyNote').textContent = 'copy failed — select it manually';
      });
    });
  </script>
</body>
</html>
```

- [ ] **Step 3: Verify**

Open `http://localhost:8000/about.html` and `http://localhost:8000/contact.html`.
Expected: About shows serif pull-line title, two columns (prose + open hairline facts list, no gray box); Contact shows big serif headline, large clickable email, "Copy Email" writes to clipboard and note changes to "copied to clipboard ✓". Both correct in dark mode and at mobile width.

- [ ] **Step 4: Commit**

```bash
git add about.html contact.html
git commit -m "redesign: about and contact pages"
```

---

### Task 5: Projects page with filtering

**Files:**
- Modify: `projects.html`

**Interfaces:**
- Consumes: Task 1 classes (`.filter-bar`, `.chip`, `.project`, `.hidden-by-filter`, `.featured-mark`).

- [ ] **Step 1: Replace the `<head>` with the standard head (keep existing title/description), and replace the section opener (everything from `<section class="section" id="projects">` through `<div class="projects">`) with:**

```html
  <section class="page-head">
    <div class="container">
      <p class="kicker">Projects</p>
      <h1 class="page-title">Things I've built and led.</h1>
      <p class="page-sub">A selection of the products I've built, led, or architected — with the details of what went into each one.</p>
      <div class="filter-bar" id="filterBar">
        <button class="chip active" data-filter="all">All</button>
        <button class="chip" data-filter="cto">CTO roles</button>
        <button class="chip" data-filter="mobile">Mobile</button>
        <button class="chip" data-filter="web">Web</button>
        <button class="chip" data-filter="freelance">Freelance</button>
      </div>
    </div>
  </section>

  <section class="section" id="projects">
    <div class="container">
      <div class="projects">
```

(The old `<h2 class="section-title">` and `<p class="section-sub">` lines are removed — their text moved into the page head above.)

- [ ] **Step 2: Keep every `<article>`'s inner content exactly as is, but change each opening `<article class="project">` tag to add `data-reveal` and a `data-cat` attribute per this exact mapping:**

| Project (h3 text) | New opening tag |
|---|---|
| Coordify | `<article class="project" data-cat="cto mobile web" data-reveal>` |
| Caraleya — Social Organizer App | `<article class="project" data-cat="mobile" data-reveal>` |
| Justice Data Solutions — Legal-Tech Apps | `<article class="project" data-cat="mobile" data-reveal>` |
| Gooto &amp; the Kenjano App Studio | `<article class="project" data-cat="cto mobile" data-reveal>` |
| Creaskale — Social Video Platform | `<article class="project" data-cat="cto mobile" data-reveal>` |
| Moharik — Crowdfunding Platform | `<article class="project" data-cat="cto web" data-reveal>` |
| Gladly — Lifestyle Ecosystem App | `<article class="project" data-cat="mobile" data-reveal>` |
| Farmly — Gardening &amp; Sustainability App | `<article class="project" data-cat="mobile freelance" data-reveal>` |
| Bwhour — Gamified EdTech SaaS | `<article class="project" data-cat="mobile" data-reveal>` |
| Charity Apps — Saudi Arabia | `<article class="project" data-cat="mobile freelance" data-reveal>` |
| Freelance Portfolio — 15+ Apps &amp; 8 Unity Games | `<article class="project" data-cat="mobile freelance" data-reveal>` |

- [ ] **Step 3: Add a featured marker to the three featured projects.** Inside the `<div class="project-head">` of **Coordify**, **Caraleya**, and **Justice Data Solutions**, right after the `<h3>…</h3>` line, insert:

```html
            <span class="featured-mark">Featured</span>
```

- [ ] **Step 4: Add the filter script.** Immediately after the `<script src="js/layout.js"></script>` line at the bottom of `projects.html`, add:

```html
  <script>
    (function () {
      const chips = document.querySelectorAll('#filterBar .chip');
      const projects = document.querySelectorAll('.project');
      chips.forEach(chip => chip.addEventListener('click', () => {
        chips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        const f = chip.dataset.filter;
        projects.forEach(p => {
          const show = f === 'all' || (p.dataset.cat || '').split(' ').includes(f);
          p.classList.toggle('hidden-by-filter', !show);
        });
      }));
    })();
  </script>
```

- [ ] **Step 5: Verify**

Open `http://localhost:8000/projects.html`.
Expected: page head with big serif title and 5 chips; projects render as full-width hairline-separated rows (no boxes); Coordify/Caraleya/Justice Data show a small "FEATURED" pill. Clicking "CTO roles" leaves exactly 4 rows (Coordify, Gooto, Creaskale, Moharik); "Web" leaves 2 (Coordify, Moharik); "Freelance" leaves 3 (Farmly, Charity Apps, Freelance Portfolio); "All" restores 11.

- [ ] **Step 6: Commit**

```bash
git add projects.html
git commit -m "redesign: projects page — editorial rows, featured marks, category filters"
```

---

### Task 6: Experience + Skills pages

**Files:**
- Modify: `experience.html`
- Modify: `skills.html`

- [ ] **Step 1: In `experience.html`, replace the `<head>` with the standard head (keep existing title/description), then replace the lines from `<section class="section" id="experience">` through `<div class="timeline">` with:**

```html
  <section class="page-head">
    <div class="container">
      <p class="kicker">Experience</p>
      <h1 class="page-title">Nine years, end to end.</h1>
    </div>
  </section>

  <section class="section" id="experience">
    <div class="container">
      <div class="timeline">
```

Then add `data-reveal` to every `<div class="tl-item">` (i.e. each becomes `<div class="tl-item" data-reveal>`). The old `<h2 class="section-title">Experience Timeline</h2>` line is removed. All timeline item content stays verbatim.

- [ ] **Step 2: In `skills.html`, replace the `<head>` with the standard head (keep existing title/description), then replace everything between `<header class="nav" id="siteHeader"></header>` and `<footer class="footer" id="siteFooter"></footer>` with:**

```html
  <section class="page-head">
    <div class="container">
      <p class="kicker">Skills</p>
      <h1 class="page-title">Tools of the trade.</h1>
    </div>
  </section>

  <section class="section" id="skills">
    <div class="container">
      <div class="skill-group" data-reveal>
        <h3>Mobile &amp; Frontend</h3>
        <div class="tags"><span>Flutter</span><span>Dart</span><span>BLoC pattern</span><span>C# (Unity)</span><span>Java</span><span>WordPress</span><span>CSS</span><span>Responsive UI</span></div>
      </div>
      <div class="skill-group" data-reveal>
        <h3>Backend &amp; Cloud</h3>
        <div class="tags"><span>Firebase Auth</span><span>Firestore</span><span>Cloud Functions</span><span>FCM Messaging</span><span>Firebase Performance</span><span>AWS</span><span>Parse Server</span><span>REST APIs</span><span>Postman</span></div>
      </div>
      <div class="skill-group" data-reveal>
        <h3>Architecture &amp; DevOps</h3>
        <div class="tags"><span>Cross-platform architecture</span><span>CI/CD (Codemagic)</span><span>TDD</span><span>Bash automation</span><span>Git workflows</span></div>
      </div>
      <div class="skill-group" data-reveal>
        <h3>Leadership</h3>
        <div class="tags"><span>Tech strategy</span><span>Product execution</span><span>Recruitment</span><span>Team &amp; people management</span><span>Marketing strategy</span></div>
      </div>

      <h3 class="certs-title">Certifications &amp; Continuing Education</h3>
      <ul class="certs" data-reveal>
        <li>Flutter Essentials</li>
        <li>C# for Unity Game Development</li>
        <li>How to Get Things Done Ahead of Deadlines</li>
        <li>Daily Habits for Effective People Management</li>
        <li>HR Guidelines Everyone Should Know</li>
      </ul>
    </div>
  </section>
```

- [ ] **Step 3: Verify**

Open `http://localhost:8000/experience.html` and `http://localhost:8000/skills.html`.
Expected: Experience shows a fine 1px timeline with small terracotta dots and serif role titles, items revealing as you scroll. Skills shows hairline-separated groups with serif subheads and pill tags; certifications as a hairline list. Both fine in dark mode and mobile.

- [ ] **Step 4: Commit**

```bash
git add experience.html skills.html
git commit -m "redesign: experience timeline and skills pages"
```

---

### Task 7: Writing index, `blog.js` rewrite, and `post.html`

**Files:**
- Modify: `writing.html`
- Modify: `js/blog.js` (full replacement)
- Create: `post.html`

**Interfaces:**
- Consumes: `window.BLOG_POSTS.posts[]` from `blog/posts.js` — objects `{ id, type, title, date, source, link, tags[], excerpt, content?[], body?[] }`; body blocks `{type: 'p'|'h2'|'h3'|'ul'|'quote'|'hr', text?, items?}`.
- Produces: `js/blog.js` with three self-detecting modes: `#blogGrid` (index), `#postRoot` (post page), `#homeWriting` (home teaser). Post URLs: `post.html?post=<id>`.

- [ ] **Step 1: In `writing.html`, replace the `<head>` with the standard head (keep existing title/description), then replace the `<section class="section" id="writing">…</section>` block with:**

```html
  <section class="page-head">
    <div class="container">
      <p class="kicker">Writing</p>
      <h1 class="page-title">Essays &amp; notes.</h1>
      <p class="page-sub">On startups, funding, and building things — originally published on LinkedIn.</p>
    </div>
  </section>

  <section class="section" id="writing">
    <div class="container">
      <div class="post-index" id="blogGrid">
        <p class="blog-loading">Loading posts…</p>
      </div>
    </div>
  </section>
```

- [ ] **Step 2: Create `post.html` with:**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Writing — Othman El Majid</title>
  <meta name="description" content="An essay by Othman El Majid." />
  <script>(function(){var t=localStorage.getItem('theme');if(t!=='light'&&t!=='dark'){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}document.documentElement.setAttribute('data-theme',t);})();</script>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="css/style.css" />
</head>
<body>

  <header class="nav" id="siteHeader"></header>

  <main class="post-page" id="postRoot">
    <p class="blog-loading">Loading…</p>
  </main>

  <footer class="footer" id="siteFooter"></footer>

  <script src="js/layout.js"></script>
  <script src="blog/posts.js"></script>
  <script src="js/blog.js"></script>
</body>
</html>
```

- [ ] **Step 3: Replace the entire contents of `js/blog.js` with:**

```js
// Blog rendering — three modes detected by which element exists on the page:
//   #blogGrid     writing.html index
//   #postRoot     post.html single essay (?post=<id>)
//   #homeWriting  index.html teaser strip
(function () {
  const data = window.BLOG_POSTS && window.BLOG_POSTS.posts;
  const fmt = d => new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');

  const words = p => {
    let t = (p.excerpt || '') + ' ' + (p.content || []).join(' ');
    (p.body || []).forEach(b => { t += ' ' + (b.text || '') + ' ' + (b.items || []).join(' '); });
    return t.trim().split(/\s+/).length;
  };
  const readTime = p => Math.max(1, Math.round(words(p) / 200)) + ' min read';

  const block = b =>
    b.type === 'hr' ? '<hr class="post-hr">'
    : b.type === 'ul' ? `<ul class="post-list">${b.items.map(i => `<li>${i}</li>`).join('')}</ul>`
    : b.type === 'quote' ? `<blockquote class="post-quote">${b.text}</blockquote>`
    : b.type === 'h2' ? `<h2 class="post-h2">${b.text}</h2>`
    : b.type === 'h3' ? `<h3 class="post-h3">${b.text}</h3>`
    : `<p class="post-body">${b.text}</p>`;

  const grid = document.getElementById('blogGrid');
  const root = document.getElementById('postRoot');
  const home = document.getElementById('homeWriting');
  const fail = el => { el.innerHTML = '<p class="blog-loading">Posts couldn\'t be loaded. Read my writing on <a href="https://linkedin.com/in/othmaneelmajid" target="_blank" rel="noopener">LinkedIn</a>.</p>'; };

  if (!data) { if (grid) fail(grid); if (root) fail(root); return; }
  const posts = [...data].sort((a, b) => b.date.localeCompare(a.date));

  // ---- Writing index ----
  if (grid) {
    grid.innerHTML = posts.map(p => `
      <article class="post-row" data-reveal>
        <a href="post.html?post=${encodeURIComponent(p.id)}">
          <span class="post-row-meta">${fmt(p.date)} · ${readTime(p)} · ${p.source}</span>
          <h2 class="post-row-title">${esc(p.title)}</h2>
          ${p.excerpt ? `<p class="post-row-excerpt">${p.excerpt}</p>` : ''}
        </a>
      </article>`).join('');
  }

  // ---- Single post ----
  if (root) {
    const id = new URLSearchParams(location.search).get('post');
    const i = posts.findIndex(p => p.id === id);
    if (i === -1) { location.replace('writing.html'); return; }
    const p = posts[i];
    document.title = p.title + ' — Othman El Majid';
    const bodyBlocks = (p.body && p.body.length) ? p.body
      : (p.content || []).map(text => ({ type: 'p', text }));
    const prev = posts[i + 1]; // older
    const next = posts[i - 1]; // newer
    root.innerHTML = `
      <a class="post-back" href="writing.html">← Writing</a>
      <header class="post-header">
        <h1>${esc(p.title)}</h1>
        <span class="post-meta">${fmt(p.date)} · ${readTime(p)} · ${p.source}</span>
      </header>
      <div class="post-article">
        ${p.excerpt && p.body && p.body.length ? `<p class="post-body"><em>${p.excerpt}</em></p>` : ''}
        ${bodyBlocks.map(block).join('')}
      </div>
      ${p.type === 'article' && p.link ? `<a class="post-link" href="${p.link}" target="_blank" rel="noopener">Originally published on LinkedIn ↗</a>` : ''}
      <nav class="post-nav">
        <span>${prev ? `<a href="post.html?post=${encodeURIComponent(prev.id)}">← ${esc(prev.title)}</a>` : ''}</span>
        <span>${next ? `<a href="post.html?post=${encodeURIComponent(next.id)}">${esc(next.title)} →</a>` : ''}</span>
      </nav>`;
  }

  // ---- Home teaser ----
  if (home) {
    home.innerHTML = posts.slice(0, 2).map(p => `
      <li class="row-item">
        <a href="post.html?post=${encodeURIComponent(p.id)}">
          <span class="row-title">${esc(p.title)}</span>
          <span class="row-meta">${fmt(p.date)}</span>
        </a>
      </li>`).join('');
  }
})();
```

- [ ] **Step 4: Verify data integrity (every post has an id)**

Run: `node -e "global.window={};eval(require('fs').readFileSync('blog/posts.js','utf8'));const ps=window.BLOG_POSTS.posts;ps.forEach(p=>{if(!p.id)throw new Error('missing id: '+p.title)});console.log(ps.length+' posts, all have ids')"`
Expected: prints `<N> posts, all have ids` (no throw).

- [ ] **Step 5: Verify in browser**

- `http://localhost:8000/writing.html` → hairline-separated essay index with date, reading time, big serif titles; clicking a title opens the post page.
- `http://localhost:8000/post.html?post=rethinking-startup-funding-north-africa` → full essay at reading width, "← Writing" link, correct reading time, prev/next links at bottom, document title updates, "Writing" highlighted in nav.
- `http://localhost:8000/post.html?post=does-not-exist` → redirects to writing.html.
- `http://localhost:8000/index.html` → "Recent writing" strip now shows the two latest essay titles linking to their post pages; no console errors.

- [ ] **Step 6: Commit**

```bash
git add writing.html post.html js/blog.js
git commit -m "redesign: essay index, dedicated post pages, blog.js rewrite"
```

---

### Task 8: Full QA pass

**Files:** none (fixes only if found)

- [ ] **Step 1: Walk every page** (`index`, `about`, `projects`, `experience`, `skills`, `writing`, `post.html?post=<first-id>`, `contact`) in **light and dark** mode. Check: no console errors, no unstyled elements, active nav link correct on each page.
- [ ] **Step 2: Mobile pass** at 375px and 800px widths: hamburger menu opens/closes, stats 2-col, project rows readable, post page comfortable.
- [ ] **Step 3: Keyboard pass**: Tab through nav (toggle reachable, Enter flips theme), filter chips operable with Enter, post links focusable.
- [ ] **Step 4: Reduced-motion pass**: in devtools rendering settings, emulate `prefers-reduced-motion: reduce`, reload — content appears instantly with no fade/translate.
- [ ] **Step 5: Fix anything found, then final commit if fixes were made**

```bash
git add -A
git commit -m "redesign: QA fixes"
```
