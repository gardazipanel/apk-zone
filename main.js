/* APK ZONE – data-driven site. Apps apps.json se aata hai. */
const $ = (s, r = document) => r.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const mb = b => b ? (b / 1048576).toFixed(1) + ' MB' : '—';
let SITE = {}, APPS = [];

function repoInfo() {
  let { user, repo } = SITE.github || {};
  const h = location.hostname;
  if ((!user || !repo) && h.endsWith('.github.io')) {
    user = user || h.split('.')[0];
    repo = repo || location.pathname.split('/')[1] || h;
  }
  return { user, repo };
}
function dlUrl(a) {
  const { user, repo } = repoInfo();
  if (!user || !repo) return null;
  return `https://github.com/${user}/${repo}/releases/download/${encodeURIComponent(a.releaseTag)}/${encodeURIComponent(a.file)}`;
}
function toast(msg) {
  const t = document.createElement('div'); t.className = 'toast'; t.textContent = msg;
  document.body.append(t); setTimeout(() => t.remove(), 4500);
}
document.addEventListener('click', e => {
  const b = e.target.closest('[data-dl]'); if (!b) return;
  e.preventDefault();
  const a = APPS.find(x => x.slug === b.dataset.dl);
  const u = a && dlUrl(a);
  if (u) location.href = u;
  else toast('Download link tab chalega jab site GitHub Pages par ho (ya site.json mein github user/repo likhein).');
});

function layout(active) {
  const name = SITE.name || 'APK ZONE';
  const [w1, ...w2] = name.split(' ');
  document.body.insertAdjacentHTML('afterbegin', `
  <header class="nav"><div class="wrap nav-in">
    <a class="brand" href="index.html"><img src="logo.svg" alt="${esc(name)} logo"><span>${esc(w1)} <b>${esc(w2.join(' '))}</b></span></a>
    <button class="icon-btn burger" id="burger" aria-label="Menu">☰</button>
    <nav class="links" id="links">
      <a href="index.html" class="${active==='home'?'active':''}">🏠 Home</a>
      <a href="index.html#apps">📱 Top Apps</a>
      <a href="index.html#install">✅ Install Guide</a>
      <a href="index.html#about">ℹ️ About</a>
      <a href="index.html#contact">💬 Contact</a>
      <button class="icon-btn" id="theme" aria-label="Theme">🌙</button>
    </nav></div></header>`);
  document.body.insertAdjacentHTML('beforeend', `
  <footer><div class="wrap f-in"><div>© ${new Date().getFullYear()} ${esc(name)} — ${esc(SITE.tagline||'')}</div>
  <div>100% Free • 100% Secure • 100% Offline</div></div></footer>`);
  const root = document.documentElement;
  const saved = (() => { try { return localStorage.getItem('theme'); } catch { return null; } })();
  if (saved) root.dataset.theme = saved;
  const tb = $('#theme'); const setIcon = () => tb.textContent = root.dataset.theme === 'light' ? '☀️' : '🌙';
  setIcon();
  tb.onclick = () => { root.dataset.theme = root.dataset.theme === 'light' ? 'dark' : 'light'; try { localStorage.setItem('theme', root.dataset.theme); } catch {} setIcon(); };
  $('#burger').onclick = () => $('#links').classList.toggle('open');
  $('#links').addEventListener('click', e => { if (e.target.closest('a')) $('#links').classList.remove('open'); });
}

const cardHTML = a => `
  <article class="card">
    <a href="app.html?app=${encodeURIComponent(a.slug)}"><img src="${esc(a.logo)}" alt="${esc(a.name)} logo" loading="lazy" width="96" height="96"></a>
    <h3><a href="app.html?app=${encodeURIComponent(a.slug)}">${esc(a.name)}</a></h3>
    <span class="cat">${esc(a.category)}</span>
    <div class="meta">v${esc(a.version)} • ${mb(a.sizeBytes)}</div>
    <button class="dl" data-dl="${esc(a.slug)}">⬇ Download</button>
  </article>`;

function renderHome() {
  const g = $('#grid');
  const draw = q => {
    q = (q || '').trim().toLowerCase();
    const list = APPS.filter(a => !q || (a.name + ' ' + a.category + ' ' + a.tagline).toLowerCase().includes(q));
    g.innerHTML = list.length ? list.map(cardHTML).join('') : '<div class="empty" style="grid-column:1/-1">Koi app nahi mili. Dosra naam try karein.</div>';
  };
  draw();
  $('#q').addEventListener('input', e => draw(e.target.value));
  $('#sform').addEventListener('submit', e => { e.preventDefault(); draw($('#q').value); $('#apps').scrollIntoView(); });
  $('#phone').innerHTML = APPS.slice(0, 6).map(a => `<img src="${esc(a.logo)}" alt="">`).join('');
  const fl = APPS.slice(0, 4).map(a => `<img class="float" src="${esc(a.logo)}" alt="">`).join('');
  $('#stage').insertAdjacentHTML('beforeend', fl);
  const c = SITE.contact || {};
  const links = [];
  if (c.whatsapp) links.push(`<a class="dl big" href="https://wa.me/${esc(c.whatsapp.replace(/\D/g,''))}">💬 WhatsApp</a>`);
  if (c.email) links.push(`<a class="dl big" href="mailto:${esc(c.email)}">✉️ Email</a>`);
  $('#contact-links').innerHTML = links.join(' ') || '<p class="note">Contact details site.json mein add karein.</p>';
  $('#contact-note').textContent = c.note || '';
}

function renderApp() {
  const slug = new URLSearchParams(location.search).get('app');
  const a = APPS.find(x => x.slug === slug);
  const m = $('#main');
  if (!a) { m.innerHTML = '<div class="wrap"><div class="empty" style="margin-top:40px">App nahi mili. <a href="index.html" style="color:var(--cyan)">Home par wapas jayein</a></div></div>'; return; }
  document.title = `${a.name} APK Download – ${SITE.name}`;
  const others = APPS.filter(x => x.slug !== a.slug);
  m.innerHTML = `<div class="wrap">
    <div class="crumb"><a href="index.html">Home</a> › ${esc(a.name)}</div>
    <div class="d-head"><img src="${esc(a.logo)}" alt="${esc(a.name)} logo">
      <div><h1>${esc(a.name)}</h1><p class="tl">${esc(a.tagline)}</p>
      <div class="row"><button class="dl big" data-dl="${esc(a.slug)}">⬇ Download APK (${mb(a.sizeBytes)})</button>
      <span class="note">v${esc(a.version)} • Android ${esc(a.minAndroid)}+</span></div></div></div>
    <section><div class="info">
      <div><small>Version</small><b>${esc(a.version)}</b></div><div><small>Size</small><b>${mb(a.sizeBytes)}</b></div>
      <div><small>Android</small><b>${esc(a.minAndroid)}+</b></div><div><small>Category</small><b>${esc(a.category)}</b></div>
      <div><small>Updated</small><b>${esc(a.updated)}</b></div></div></section>
    <section><div class="sec-head"><div><h2>Screenshots</h2></div></div>
      ${a.screenshots?.length ? `<div class="shots">${a.screenshots.map(s => `<img src="${esc(s)}" alt="${esc(a.name)} screenshot" loading="lazy">`).join('')}</div>` : '<div class="empty">Screenshots jald add kiye jayenge.</div>'}</section>
    <section class="two"><div class="box"><h3>About ${esc(a.name)}</h3>${a.description.map(p => `<p>${esc(p)}</p>`).join('')}</div>
      <div class="box"><h3>Features</h3><ul>${a.features.map(f => `<li>${esc(f)}</li>`).join('')}</ul>
      <h3 style="margin-top:18px">Security</h3><p class="note">SHA-256:</p><p class="hash">${esc(a.sha256 || '—')}</p><p class="note" style="margin-top:6px">Package: ${esc(a.package)}</p></div></section>
    <section><div class="sec-head"><div><h2>Install kaise karein</h2></div></div>${installSteps()}</section>
    <section><div class="sec-head"><div><h2>Aur Apps</h2></div><a class="more" href="index.html#apps">View All →</a></div>
      <div class="grid">${others.slice(0, 4).map(cardHTML).join('')}</div></section></div>
    <div class="lightbox" id="lb"><img alt=""></div>`;
  const lb = $('#lb');
  m.addEventListener('click', e => { const i = e.target.closest('.shots img'); if (i) { $('img', lb).src = i.src; lb.classList.add('on'); } });
  lb.onclick = () => lb.classList.remove('on');
}
const installSteps = () => `<ol class="steps">
  <li>“Download APK” button dabayein, file download ho jayegi.</li>
  <li>File kholein. Agar phone puchay to <b>Settings → Unknown sources / Install unknown apps</b> allow karein.</li>
  <li><b>Install</b> dabayein aur kaam mukammal hone par app kholein.</li></ol>`;

(async () => {
  const page = document.body.dataset.page;
  try {
    [SITE, { apps: APPS }] = await Promise.all([fetch('site.json').then(r => r.json()), fetch('apps.json').then(r => r.json())]);
  } catch { document.body.innerHTML = '<p style="padding:30px;color:#fff">Data load nahi hua. Site ko local server ya GitHub Pages par kholein.</p>'; return; }
  layout(page);
  page === 'home' ? (renderHome(), $('#steps').innerHTML = installSteps()) : renderApp();
})();
