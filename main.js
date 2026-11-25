/* APK ZONE – data-driven 3D site. Apps apps.json se aati hain. */
const $ = (s, r = document) => r.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const mb = b => b ? (b / 1048576).toFixed(1) + ' MB' : '—';
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
let SITE = {}, APPS = [];
const P = (d, extra='') => `<svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ${extra}>${d}</svg>`;
const ICON = {
  gift: P('<rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13M5 12v8a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-8M7.5 8a2.5 2.5 0 1 1 0-5C10 3 12 8 12 8s2-5 4.5-5a2.5 2.5 0 1 1 0 5"/>'),
  shield: P('<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M8.5 12l2.5 2.5 4.5-5"/>'),
  bolt: P('<path d="M13 2L4 14h7l-1 8 9-12h-7z"/>'),
  search: P('<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>'),
  home: P('<path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/>'),
  apps: P('<rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/>'),
  steps: P('<path d="M12 3v12M7 10l5 5 5-5M4 21h16"/>'),
  info: P('<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.5"/>'),
  phone: P('<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>'),
  wa: '<svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15L2 22l5.1-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.200zm4.500-6.100c-.2-.1-1.500-.7-1.700-.8s-.4-.1-.6.100-.7.8-.8 1-.3.2-.5.1a6.700 6.700 0 0 1-3.300-2.900c-.2-.4.200-.4.700-1.300.1-.2 0-.3 0-.4l-.8-1.800c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.300 3 3 0 0 0-.9 2.200 5.200 5.200 0 0 0 1.100 2.800 11.900 11.900 0 0 0 4.600 4c1.700.7 2.400.8 3.200.7a2.700 2.700 0 0 0 1.800-1.300 2.200 2.200 0 0 0 .2-1.300c-.1-.1-.3-.2-.5-.3z"/></svg>',
  star: '<svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M12 2l3 6.500 7 .8-5.200 4.800 1.500 7L12 17.500 5.700 21l1.500-7L2 9.300l7-.8z"/></svg>',
  mail: P('<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>'),
  sun: P('<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.500 1.500M17.500 17.500L19 19M5 19l1.500-1.500M17.500 6.500L19 5"/>'),
  moon: P('<path d="M20 14A8 8 0 1 1 10 4a6.500 6.500 0 0 0 10 10z"/>'),
  check: P('<path d="M5 12l5 5 9-10"/>'),
  dl: P('<path d="M12 3v12M7 11l5 5 5-5M4 21h16"/>'),
  chat: P('<path d="M4 5h16v11H9l-5 4z"/>')
};
const ic = n => ICON[n] || '';
function hydrateIcons(root = document) { root.querySelectorAll('[data-ic]').forEach(el => { el.outerHTML = ic(el.dataset.ic).replace('<svg', '<svg class="ico"'); }); }
const num = () => ((SITE.contact || {}).phone || '').replace(/\D/g, '');
const prettyNum = () => { const n = num(); return n.length === 11 ? n.slice(0, 4) + ' ' + n.slice(4) : n; };
const intl = () => { const w = ((SITE.contact || {}).whatsapp || '').replace(/\D/g, ''); return w || ('92' + num().replace(/^0/, '')); };
function contactBox() {
  const c = SITE.contact || {};
  const btns = [];
  if (intl()) btns.push(`<a class="cbtn wa" href="https://wa.me/${intl()}?text=${encodeURIComponent('Assalam o Alaikum, mujhe APK ZONE ke baare mein baat karni hai.')}" target="_blank" rel="noopener">${ic('wa')}<span>WhatsApp par message</span></a>`);
  if (num()) btns.push(`<a class="cbtn call" href="tel:+${intl()}">${ic('phone')}<span>Call karein</span></a>`);
  if (c.email) btns.push(`<a class="cbtn mail" href="mailto:${esc(c.email)}">${ic('mail')}<span>Email</span></a>`);
  return `<div class="contact-card"><div><p class="tag">Rabta</p><h2>Hum se rabta karein</h2><p class="cn">${esc(c.note || '')}</p>
    ${num() ? `<p class="bignum">${ic('phone')} ${esc(prettyNum())}</p>` : ''}</div><div class="cbtns">${btns.join('')}</div></div>`;
}


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
  if (u) location.href = u; else toast('Download link tab chalega jab site GitHub Pages par ho.');
});

/* ---- 3D helpers ---- */
function tilt(root = document) {
  if (reduce) return;
  root.querySelectorAll('.card:not([data-t]),.d-logo:not([data-t])').forEach(el => {
    el.dataset.t = 1;
    const tgt = el.classList.contains('d-logo') ? $('.in3d', el) : el;
    el.addEventListener('pointermove', e => {
      if (e.pointerType === 'touch') return;
      const r = el.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      tgt.style.setProperty('--cy', ((x - .5) * 26) + 'deg');
      tgt.style.setProperty('--cx', ((.5 - y) * 22) + 'deg');
      el.style.setProperty('--mx', x * 100 + '%'); el.style.setProperty('--my', y * 100 + '%');
    });
    el.addEventListener('pointerleave', () => { tgt.style.setProperty('--cx', '0deg'); tgt.style.setProperty('--cy', '0deg'); });
  });
}
let io;
function reveal(root = document, sel = '.grid>*,.feat>*,section .box,ol.steps li,.info>div,.sec-head') {
  if (!('IntersectionObserver' in window)) return;
  io = io || new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .12 });
  root.querySelectorAll(sel).forEach((el, i) => {
    if (el.classList.contains('rv')) return;
    el.classList.add('rv'); el.style.transitionDelay = (i % 6) * 70 + 'ms'; io.observe(el);
  });
}
function buildBubbles() {
  const app = [[5,6,88],[74,3,80],[0,41,72],[80,40,92],[8,74,84],[62,78,80],[38,86,66]];
  const empty = [[26,2,30],[58,0,22],[92,22,34],[1,22,20],[18,52,38],[90,66,26],[30,66,18],[78,92,34],[50,92,16],[22,88,26],[93,86,14]];
  const el = $('#bubbles'); if (!el) return;
  const r = (a, b) => a + Math.random() * (b - a);
  let html = '';
  APPS.slice(0, app.length).forEach((a, i) => {
    const [x, y, s] = app[i];
    html += `<div class="bub app" style="left:${x}%;top:${y}%;width:${s}px;height:${s}px;--d:${(5 + i * .6).toFixed(1)}s;--dl:${(-i * .9).toFixed(1)}s;--dy:${i % 2 ? 18 : -18}px;--k:${(.5 + i % 3 * .25).toFixed(2)}"><img src="${esc(a.logo)}" alt="${esc(a.name)}" data-app="${esc(a.name)}"></div>`;
  });
  empty.forEach(([x, y, s], i) => {
    html += `<div class="bub" style="left:${x}%;top:${y}%;width:${s}px;height:${s}px;--d:${r(4, 8).toFixed(1)}s;--dl:${(-i * .7).toFixed(1)}s;--dy:${i % 2 ? 24 : -24}px;--k:${(.3 + i % 4 * .25).toFixed(2)}"></div>`;
  });
  el.innerHTML = html;
}
function initParallax() {
  const st = $('#stage'), sc = $('#scene'), core = $('#core'); if (!st || reduce) return;
  const move = (cx, cy) => {
    const r = st.getBoundingClientRect(), x = (cx - r.left) / r.width - .5, y = (cy - r.top) / r.height - .5;
    sc.style.setProperty('--px', (x * 40).toFixed(1)); sc.style.setProperty('--py', (y * 40).toFixed(1));
    core.style.setProperty('--cy', (x * 30).toFixed(1) + 'deg'); core.style.setProperty('--cx', (-y * 24).toFixed(1) + 'deg');
  };
  st.addEventListener('pointermove', e => move(e.clientX, e.clientY));
  st.addEventListener('pointerleave', () => { sc.style.setProperty('--px', 0); sc.style.setProperty('--py', 0); core.style.setProperty('--cx', '0deg'); core.style.setProperty('--cy', '0deg'); });
  addEventListener('deviceorientation', e => {
    if (e.gamma == null) return;
    const x = Math.max(-30, Math.min(30, e.gamma)) / 30 * .5, y = Math.max(-20, Math.min(20, (e.beta || 45) - 50)) / 20 * .5;
    sc.style.setProperty('--px', (x * 40).toFixed(1)); sc.style.setProperty('--py', (y * 40).toFixed(1));
  });
}
/* logo load na ho to naam wala badge dikhao */
document.addEventListener('error', e => {
  const i = e.target; if (!i || i.tagName !== 'IMG' || !i.dataset.app) return;
  const s = document.createElement('span'); s.className = 'lf ' + (i.className || '');
  s.textContent = i.dataset.app.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase(); s.title = i.dataset.app;
  i.replaceWith(s);
}, true);

function layout(active) {
  const name = SITE.name || 'APK ZONE';
  document.body.insertAdjacentHTML('afterbegin', `
  <div class="bgfx"><i></i></div>
  <header class="nav"><div class="wrap nav-in">
    <a class="brand" href="index.html"><img src="site-logo.png" alt="${esc(name)} logo"><span>${esc(name)}</span></a>
    <button class="icon-btn burger" id="burger" aria-label="Menu" aria-expanded="false">☰</button>
    <nav class="links" id="links">
      <a href="index.html" class="${active==='home'?'active':''}">${ic('home')}Home</a>
      <a href="index.html#apps">${ic('apps')}Apps</a>
      <a href="index.html#install">${ic('steps')}Install</a>
      <a href="about.html" class="${active==='about'?'active':''}">${ic('info')}About</a>
      <a href="index.html#contact">${ic('chat')}Contact</a>
      <button class="icon-btn" id="theme" aria-label="Theme"></button>
    </nav></div></header>`);
  document.body.insertAdjacentHTML('beforeend', `
  <footer><div class="wrap">
    <div class="f-grid">
      <div><a class="brand" href="index.html"><img src="site-logo.png" alt=""><span>${esc(name)}</span></a>
        <p class="f-about">Apni pasandeeda Android apps free download karein. Asaan, tez aur bharosemand.</p></div>
      <div><h4>Links</h4><a href="index.html">Home</a><a href="index.html#apps">Apps</a><a href="index.html#install">Install guide</a><a href="about.html">About us</a></div>
      <div><h4>Rabta</h4>${num() ? `<a href="tel:+${intl()}">${ic('phone')} ${esc(prettyNum())}</a>` : ''}${intl() ? `<a href="https://wa.me/${intl()}" target="_blank" rel="noopener">${ic('wa')} WhatsApp</a>` : ''}</div>
    </div>
    <div class="f-bot"><span>© ${new Date().getFullYear()} ${esc(name)}. Tamam huqooq mehfooz hain.</span><span>100% Free • 100% Secure • 100% Offline</span></div>
  </div></footer>`);
  const root = document.documentElement;
  const saved = (() => { try { return localStorage.getItem('theme'); } catch { return null; } })();
  if (saved) root.dataset.theme = saved;
  const tb = $('#theme'); const setIcon = () => tb.innerHTML = root.dataset.theme === 'light' ? ic('sun') + '<span class="lb"> Light mode</span>' : ic('moon') + '<span class="lb"> Dark mode</span>';
  setIcon();
  tb.onclick = () => { root.dataset.theme = root.dataset.theme === 'light' ? 'dark' : 'light'; try { localStorage.setItem('theme', root.dataset.theme); } catch {} setIcon(); };
  const nav = $('#links'), bg = $('#burger');
  bg.onclick = () => { const o = nav.classList.toggle('open'); bg.textContent = o ? '✕' : '☰'; bg.setAttribute('aria-expanded', o); };
  nav.addEventListener('click', e => { if (e.target.closest('a')) { nav.classList.remove('open'); bg.textContent = '☰'; } });
}

const cardHTML = a => `
  <article class="card">
    <a class="lg" href="app.html?app=${encodeURIComponent(a.slug)}"><img src="${esc(a.logo)}" alt="${esc(a.name)} logo" data-app="${esc(a.name)}" loading="lazy" width="92" height="92"></a>
    <h3><a href="app.html?app=${encodeURIComponent(a.slug)}">${esc(a.name)}</a></h3>
    <span class="cat">${esc(a.category)}</span>
    <div class="meta">v${esc(a.version)} • ${mb(a.sizeBytes)}</div>
    <button class="dl" data-dl="${esc(a.slug)}">${ic('dl')} Download</button>
  </article>`;

function renderHome() {
  const g = $('#grid');
  const draw = (q, first) => {
    q = (q || '').trim().toLowerCase();
    const list = APPS.filter(a => !q || (a.name + ' ' + a.category + ' ' + a.tagline).toLowerCase().includes(q));
    g.innerHTML = list.length ? list.map(cardHTML).join('') : '<div class="empty" style="grid-column:1/-1">Koi app nahi mili. Dosra naam try karein.</div>';
    tilt(g); if (first) reveal(g); else g.querySelectorAll('.card').forEach(c => c.classList.add('rv', 'in'));
  };
  draw('', true);
  $('#q').addEventListener('input', e => draw(e.target.value));
  $('#sform').addEventListener('submit', e => { e.preventDefault(); draw($('#q').value); $('#apps').scrollIntoView(); });

  buildBubbles();
  initParallax();

  $('#contact-box').innerHTML = contactBox();
  hydrateIcons();
  reveal(document, 'section .box,ol.steps li,.feat>*,.sec-head,.contact-card');
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
    <div class="d-head"><div class="d-logo"><span class="halo"></span><span class="halo h2"></span><div class="in3d"><img src="${esc(a.logo)}" alt="${esc(a.name)} logo" data-app="${esc(a.name)}"></div></div>
      <div><h1>${esc(a.name)}</h1><p class="tl">${esc(a.tagline)}</p>
      <div class="row"><button class="dl big" data-dl="${esc(a.slug)}">${ic('dl')} Download APK (${mb(a.sizeBytes)})</button>
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
      <div class="grid">${others.slice(0, 4).map(cardHTML).join('')}</div></section>
    <section id="contact">${contactBox()}</section></div>
    <div class="lightbox" id="lb"><img alt=""></div>`;
  const lb = $('#lb');
  m.addEventListener('click', e => { const i = e.target.closest('.shots img'); if (i) { $('img', lb).src = i.src; lb.classList.add('on'); } });
  lb.onclick = () => lb.classList.remove('on');
  tilt(m); reveal(m);
}

function renderAbout() {
  document.title = `About Us – ${SITE.name}`;
  const faq = [
    ['Kya ye apps waqai free hain?', 'Ji haan, APK ZONE par maujood tamam apps free download ki ja sakti hain.'],
    ['APK install karne par phone warning kyun deta hai?', 'Ye apps Play Store ke bahar se aati hain, is liye Android “Install unknown apps” ki ijazat mangta hai. Settings mein sirf apne browser ya Files app ko ijazat dein.'],
    ['Kaun sa Android version chahiye?', 'Zyada tar apps Android 7.0 aur us se naye versions par chalti hain. Har app ke page par apni requirement likhi hoti hai.'],
    ['Kya apps internet ke baghair chalti hain?', 'Ji, in apps ko offline istemal karne ke liye banaya gaya hai.'],
    ['File asli hone ki tasdeeq kaise karun?', 'Har app ke page par SHA-256 checksum diya gaya hai jis se aap download ki hui file ka muqabla kar saktay hain.'],
    ['Madad ya nayi app ki darkhwast kahan karun?', `Neeche Contact section se WhatsApp ya call kar ke seedha rabta karein${num() ? ' (' + prettyNum() + ')' : ''}.`]
  ];
  const why = [
    ['gift', 'Bilkul Free', 'Koi chhupi fees ya subscription nahi.'],
    ['shield', 'Mehfooz Download', 'Har file ka SHA-256 checksum, aur download GitHub Releases se.'],
    ['bolt', 'Offline Istemal', 'Internet ke baghair bhi apps ka kaam jari rehta hai.'],
    ['chat', 'Seedha Rabta', 'WhatsApp aur call par madad hamesha dastyab.']
  ];
  $('#main').innerHTML = `<div class="wrap">
    <div class="about-hero"><div class="d-logo big"><span class="halo"></span><span class="halo h2"></span><div class="in3d"><img src="site-logo.png" alt="${esc(SITE.name)} logo"></div></div>
      <div><p class="tag">About Us</p><h1><span class="grad">${esc(SITE.name)}</span></h1>
      <p class="lead">Asaan, tez aur bharosemand jagah jahan se aap apni zaroorat ki Android apps seedhi download kar saktay hain.</p></div></div>
    <section><div class="stats">
      <div><b>${APPS.length}</b><small>Apps</small></div><div><b>100%</b><small>Free</small></div>
      <div><b>7.0+</b><small>Android</small></div><div><b>Offline</b><small>Istemal</small></div></div></section>
    <section class="two"><div class="box"><h3>Hamari kahani</h3>
      <p>APK ZONE ka maqsad hai ke aam logon aur chhote karobar walon ko aisi apps muhaya karna jo un ka rozana ka kaam asaan bana dein. Dukan, workshop, salon, gym ya dairy ka hisab kitab ab mobile par chand taps mein ho sakta hai.</p>
      <p>Hum chahte hain ke download ka tareeqa saaf aur seedha ho: app chunein, Download dabayein aur install kar lein. Har app ka alag page hai jis par version, size, features aur checksum maujood hain.</p></div>
      <div class="box"><h3>Hamara maqsad</h3><ul><li>Asaan aur saaf interface</li><li>Tez aur mehfooz download</li><li>Waqt ke sath nayi apps aur updates</li><li>Aap ki rai ki qadar</li></ul></div></section>
    <section><div class="sec-head"><span class="star">${ic('star')}</span><div><h2>Kyun APK ZONE</h2></div></div>
      <div class="feat">${why.map(w => `<div class="box"><div class="ic">${ic(w[0])}</div><h3>${w[1]}</h3><p>${w[2]}</p></div>`).join('')}</div></section>
    <section><div class="sec-head"><span class="star">${ic('apps')}</span><div><h2>Hamari Apps</h2></div><a class="more" href="index.html#apps">Sab dekhein →</a></div>
      <div class="chips">${APPS.map(a => `<a class="chip" href="app.html?app=${encodeURIComponent(a.slug)}"><img src="${esc(a.logo)}" alt="" data-app="${esc(a.name)}">${esc(a.name)}</a>`).join('')}</div></section>
    <section><div class="sec-head"><span class="star">${ic('info')}</span><div><h2>Aksar pooche gaye sawalat</h2></div></div>
      <div class="faq">${faq.map(f => `<details class="box"><summary>${esc(f[0])}</summary><p>${f[1]}</p></details>`).join('')}</div></section>
    <section id="contact">${contactBox()}</section></div>`;
  tilt($('#main')); reveal($('#main'), '.stats>div,.box,.chip,.sec-head,.contact-card');
}

const installSteps = () => `<ol class="steps">
  <li>“Download” button dabayein, APK file download ho jayegi.</li>
  <li>File kholein. Agar phone puchay to <b>Settings → Install unknown apps</b> allow karein.</li>
  <li><b>Install</b> dabayein aur kaam mukammal hone par app kholein.</li></ol>`;

(async () => {
  const page = document.body.dataset.page;
  try {
    [SITE, { apps: APPS }] = await Promise.all([fetch('site.json?v=' + Date.now()).then(r => r.json()), fetch('apps.json?v=' + Date.now()).then(r => r.json())]);
  } catch { document.body.innerHTML = '<p style="padding:30px;color:#fff">Data load nahi hua. Site ko GitHub Pages ya local server par kholein.</p>'; return; }
  layout(page);
  if (page === 'home') { $('#steps').innerHTML = installSteps(); renderHome(); } else if (page === 'about') renderAbout(); else renderApp();
})();
