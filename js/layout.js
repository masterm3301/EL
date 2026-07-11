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
