# Website Redesign — Editorial Minimal

**Date:** 2026-07-11
**Scope:** Full visual + UX redesign of the personal portfolio site (static HTML/CSS/JS, no build step, no frameworks).

## Goals

Keep the minimal character but make the site feel crafted and senior: distinctive typography, warm palette, editorial layouts, real reading experience for essays, dark mode, and subtle motion.

## Decisions (agreed with owner)

- **Direction:** Editorial minimal — warm off-white, serif display type, generous whitespace.
- **Structure:** Keep all 7 pages (index, about, projects, experience, skills, writing, contact) + add `post.html`.
- **UX upgrades:** dedicated post pages, scroll-reveal animations, dark mode toggle, project filtering.
- **Stack:** vanilla HTML/CSS/JS only. Fonts via Google Fonts.

## Design language

### Typography
- **Display:** Fraunces (Google Fonts) — name/wordmark, page titles, section headings, essay titles, stat numerals, pull-lines.
- **Body/UI:** Inter — paragraphs, nav, buttons, tags, metadata.
- Page titles ~3.5–4.5rem, tightly tracked. Body 1.05–1.1rem, relaxed line height (~1.7). Essay body at ~680px measure.

### Color
Light theme: warm off-white paper (≈ `#FAF8F5`), warm near-black ink (≈ `#1A1815`), soft/faint ink steps, warm hairline borders, single accent: burnt terracotta (≈ `#C4552D`) used sparingly (links, active states, markers).
Dark theme: warm near-black paper, soft cream ink, same terracotta slightly brightened. All colors as CSS variables; dark theme is a second variable block under `[data-theme="dark"]`.

### Space & texture
- Section padding 120px+ desktop, tightened on mobile.
- Reading width ~720px (prose) / ~680px (essays); grids ~1000px.
- Replace boxed cards with open, hairline-separated rows/groups wherever possible (projects, posts, facts, stats, certs).

### Motion
- Scroll reveal: fade + 12px rise, ~500ms ease-out, first intersection only, via one IntersectionObserver watching `[data-reveal]`; fully disabled under `prefers-reduced-motion`.
- Link hover: sliding underline. Cards/rows: soft lift or background tint on hover. Nothing bouncy.

## Page layouts

- **Shared nav/footer** (injected by `js/layout.js`): Fraunces wordmark; links with slide-in underline hover and terracotta active underline; "Get in Touch" button; sun/moon dark-mode toggle. Footer: name, one-line tagline, email/LinkedIn links, copyright — single compact band. (GitHub link only if owner supplies a URL; none exists in current site content.)
- **Home:** left-aligned hero — kicker line ("Mobile & Full-Stack · CTO · Rabat"), huge Fraunces name, trimmed 2–3 line lead, two buttons. Stats: unboxed Fraunces numerals over small uppercase labels, hairline-separated. Two teaser strips: "Selected work" (3 featured projects as one-line rows → projects.html) and "Recent writing" (2 latest essays → writing.html).
- **About:** two columns — prose (with a short Fraunces pull-line: "I build products from zero to one.") + facts panel as open hairline list (includes CV link).
- **Projects:** filter chips (All / CTO roles / Mobile / Web / Freelance) at top; full-width editorial rows: Fraunces name + role/date line, description, bullets, lowercase tags; hairlines between rows; small "featured" marker on Coordify, Caraleya, Justice Data.
- **Experience:** finer timeline — thin line, small dots, small-caps terracotta dates, roomier rhythm.
- **Skills:** open groups under Fraunces subheads with skill chips; certifications as hairline list.
- **Writing:** essay index — date + reading time, big Fraunces title, one-line excerpt, hairline-separated; titles link to `post.html?post=slug`.
- **Contact:** centered — large Fraunces headline ("Let's build something."), short line, email as large clickable text with copy-to-clipboard, LinkedIn button.

## Technical design

- **Post pages:** `post.html` reads `?post=slug`, finds the essay in `blog/posts.js` data, renders title/date/reading time (words ÷ 200 wpm) and body client-side. "← Writing" link on top; prev/next links at bottom. Unknown slug → redirect/fallback to writing.html. `js/blog.js` handles both index mode and post mode.
- **Dark mode:** inline `<head>` script on every page sets `data-theme` on `<html>` from localStorage (fallback: `prefers-color-scheme`) before paint. Nav toggle flips + persists.
- **Filtering:** project rows carry `data-cat` tokens; chips toggle visibility (CSS class + short fade); "All" default; active chip terracotta. ~20 lines JS.
- **Files changed:** `css/style.css` (full rewrite, both themes), `js/layout.js` (nav/footer markup, theme toggle, reveal observer), `js/blog.js` (rewrite), new `post.html`, all 7 pages retouched (Fraunces+Inter font link, theme bootstrap script, restructured markup).

## Error handling

- Unknown/missing post slug → fall back to writing index.
- JS disabled: pages still render their static content (nav/footer are JS-injected today already — unchanged behavior); reveal elements must not be hidden by default without JS (set hidden state only when observer registers).
- Reduced motion: no transforms/transitions for reveals.

## Testing

Manual pass: every page in light + dark; mobile widths (≤720px, ≤860px) via devtools; keyboard navigation (menu, toggle, filters, post links); reduced-motion check; direct-load and refresh of `post.html?post=...`; unknown slug fallback.
