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
