/* Deepak Khanal — Portfolio script (rebuilt) */
'use strict';
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const fine = matchMedia('(hover:hover) and (pointer:fine)');
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const store = {
  get(k) { try { return localStorage.getItem(k); } catch { return null; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch {} },
};

/* ===== CONFIG ===== */
const CONFIG = {
  // Free key from https://web3forms.com (sends form to your email). Leave as-is to fall back to mailto.
  web3formsKey: 'YOUR_ACCESS_KEY',
  email: 'djdeepakdj14@gmail.com',
  counter: { base: 'https://abacus.jasoncameron.dev', ns: 'deepak-khanal-portfolio', key: 'visits' },
};

/* ===== LOADER (hides on window load, max 2.1s) ===== */
function initLoader() {
  const loader = $('#loader');
  let done = false;
  const finish = () => {
    if (done) return; done = true;
    loader?.classList.add('hidden');
    document.body.style.overflow = '';
    initReveal(); initCounters();
  };
  document.body.style.overflow = 'hidden';
  const min = new Promise(r => setTimeout(r, reduced ? 0 : 900));
  const loaded = new Promise(r => document.readyState === 'complete' ? r() : addEventListener('load', r, { once: true }));
  Promise.all([min, loaded]).then(finish);
  setTimeout(finish, 2100);
}

/* ===== CURSOR (desktop mouse only, event-delegated, no layout thrash) ===== */
function initCursor() {
  const canvas = $('#cursor-canvas');
  if (!canvas || !fine.matches || reduced) return;
  const ctx = canvas.getContext('2d');
  const mk = cls => { const d = document.createElement('div'); d.className = cls; document.body.appendChild(d); return d; };
  const dot = mk('cur-dot'), ring = mk('cur-ring');
  const colors = [[200,180,120],[232,212,160],[255,248,220],[200,220,245],[255,255,255]];
  const parts = [];
  let mx = -100, my = -100, rx = -100, ry = -100, running = false, visible = false;

  const resize = () => {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width = innerWidth * dpr; canvas.height = innerHeight * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  resize(); addEventListener('resize', resize, { passive: true });
  document.documentElement.classList.add('has-cursor');

  addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    if (!visible) { visible = true; rx = mx; ry = my; dot.style.opacity = ring.style.opacity = 1; }
    if (parts.length < 60) for (let i = 0; i < 2; i++) {
      const c = colors[(Math.random() * colors.length) | 0];
      parts.push({ x: mx + (Math.random() - .5) * 6, y: my + (Math.random() - .5) * 6, s: Math.random() * 5 + 1.5, c,
        a: .85, vx: (Math.random() - .5) * 1.2, vy: (Math.random() - .5) * 1.2 - .6, d: Math.random() * .025 + .012 });
    }
    if (!running) { running = true; requestAnimationFrame(loop); }
  }, { passive: true });

  const hide = () => { visible = false; dot.style.opacity = ring.style.opacity = 0; };
  document.documentElement.addEventListener('mouseleave', hide);
  addEventListener('blur', hide);

  const sel = 'a,button,input,textarea,.project-card,.skill-card,.cert-card';
  document.addEventListener('mouseover', e => ring.classList.toggle('hover', !!e.target.closest(sel)));

  function loop() {
    rx += (mx - rx) * .18; ry += (my - ry) * .18;
    dot.style.transform = `translate3d(${mx}px,${my}px,0) translate(-50%,-50%)`;
    ring.style.transform = `translate3d(${rx}px,${ry}px,0) translate(-50%,-50%)`;
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    for (let i = parts.length - 1; i >= 0; i--) {
      const p = parts[i];
      p.x += p.vx; p.y += p.vy; p.a -= p.d; p.s *= .975;
      if (p.a <= 0) { parts.splice(i, 1); continue; }
      const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.s);
      g.addColorStop(0, `rgba(${p.c},${p.a})`); g.addColorStop(1, `rgba(${p.c},0)`);
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(p.x, p.y, p.s, 0, 6.283); ctx.fill();
    }
    // stop the loop when idle (saves battery)
    if (parts.length || Math.abs(mx - rx) > .3 || Math.abs(my - ry) > .3) requestAnimationFrame(loop);
    else running = false;
  }
}

/* ===== HERO CANVAS (pauses off-screen / hidden tab) ===== */
function initHeroCanvas() {
  const canvas = $('#bg-canvas'); if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let stars = [], beams = [], clouds = [], t = 0, onScreen = true, raf = 0, W = 0, H = 0;

  function build() {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    W = canvas.offsetWidth; H = canvas.offsetHeight;
    canvas.width = W * dpr; canvas.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const n = W < 600 ? 55 : 120;
    stars = Array.from({ length: n }, () => ({ x: Math.random() * W, y: Math.random() * H, r: Math.random() * 1.4 + .2,
      ph: Math.random() * 6.283, sp: Math.random() * .006 + .002, gold: Math.random() > .6 }));
    beams = Array.from({ length: 5 }, (_, i) => ({ x: (i + .6) * (W / 5.5), w: Math.random() * 55 + 25,
      a: Math.random() * .055 + .015, sp: Math.random() * .2 + .06, o: Math.random() * 6.283 }));
    clouds = Array.from({ length: 3 }, (_, i) => ({ nx: .2 + i * .28, ny: .25 + i * .18, r: Math.max(W, H) * (.4 + i * .08), sp: .15 + i * .08, o: i * 1.4 }));
  }
  let rt; build();
  addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(build, 200); }, { passive: true });

  function draw() {
    raf = 0; if (!onScreen || document.hidden) return;
    t += .007;
    const g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, '#050710'); g.addColorStop(.3, '#0b1020'); g.addColorStop(.7, '#080d1a'); g.addColorStop(1, '#050710');
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    clouds.forEach(c => {
      const x = W * c.nx + Math.sin(t * c.sp + c.o) * 35, y = H * c.ny + Math.cos(t * c.sp * .7 + c.o) * 20;
      const rg = ctx.createRadialGradient(x, y, 0, x, y, c.r);
      rg.addColorStop(0, 'rgba(200,180,120,0.055)'); rg.addColorStop(.4, 'rgba(168,196,232,0.03)'); rg.addColorStop(1, 'transparent');
      ctx.fillStyle = rg; ctx.fillRect(0, 0, W, H);
    });
    beams.forEach(b => {
      const x = b.x + Math.sin(t * b.sp + b.o) * 30, bg = ctx.createLinearGradient(x, 0, x, H);
      bg.addColorStop(0, `rgba(220,200,150,${b.a})`); bg.addColorStop(.3, `rgba(200,180,120,${b.a * .6})`); bg.addColorStop(1, 'transparent');
      ctx.fillStyle = bg; ctx.beginPath(); ctx.moveTo(x - b.w, 0); ctx.lineTo(x + b.w, 0);
      ctx.lineTo(x + b.w * .35, H); ctx.lineTo(x - b.w * .35, H); ctx.fill();
    });
    stars.forEach(s => {
      const a = .2 + .8 * (.5 + .5 * Math.sin(t * s.sp * 10 + s.ph));
      ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, 6.283);
      ctx.fillStyle = s.gold ? `rgba(220,200,140,${a})` : `rgba(255,255,255,${a})`; ctx.fill();
    });
    if (!reduced) raf = requestAnimationFrame(draw);
  }
  const kick = () => { if (!raf) raf = requestAnimationFrame(draw); };
  new IntersectionObserver(([e]) => { onScreen = e.isIntersecting; if (onScreen) kick(); }).observe(canvas);
  document.addEventListener('visibilitychange', kick);
  kick();
}

function initHeroParticles() {
  const box = $('#hero-particles'); if (!box || reduced) return;
  const cols = ['rgba(200,180,120,', 'rgba(232,212,160,', 'rgba(255,248,220,', 'rgba(168,196,232,'];
  for (let i = 0; i < (innerWidth < 600 ? 6 : 16); i++) {
    const p = document.createElement('div'), s = Math.random() * 55 + 8, c = cols[(Math.random() * 4) | 0];
    p.className = 'hero-particle';
    p.style.cssText = `width:${s}px;height:${s}px;left:${Math.random() * 100}%;top:${Math.random() * 100}%;background:radial-gradient(circle,${c}0.45),transparent 70%);--dur:${Math.random() * 7 + 4}s;--delay:-${Math.random() * 7}s;filter:blur(${Math.random() * 12 + 4}px)`;
    box.appendChild(p);
  }
}

/* ===== TYPING ===== */
function initTyping() {
  const el = $('#typing-el'); if (!el) return;
  const words = ['smart automation systems.', 'AI-powered vision tools.', 'real-time IoT dashboards.', 'full-stack web apps.', 'PLC control logic.', 'computer vision pipelines.'];
  if (reduced) { el.textContent = words[0]; return; }
  let w = 0, c = 0, del = false;
  (function tick() {
    const s = words[w];
    c += del ? -1 : 1; el.textContent = s.slice(0, c);
    if (!del && c === s.length) { del = true; return setTimeout(tick, 1800); }
    if (del && c === 0) { del = false; w = (w + 1) % words.length; }
    setTimeout(tick, del ? 38 : 70);
  })();
}

/* ===== NAV / SCROLL (one rAF-throttled handler, section offsets cached) ===== */
function initNav() {
  const nav = $('#navbar'), toggle = $('#nav-toggle'), links = $('.nav-links');
  const secs = $$('section[id]'), navA = $$('[data-nav]'), bar = $('#scroll-bar'), top = $('#back-top');
  let tick = false;
  const setMenu = open => {
    links.classList.toggle('open', open);
    toggle.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', open);
    document.body.classList.toggle('menu-open', open);
  };
  const update = () => {
    tick = false;
    const y = scrollY, max = document.documentElement.scrollHeight - innerHeight;
    nav.classList.toggle('scrolled', y > 40);
    if (bar) bar.style.width = (max > 0 ? y / max * 100 : 0) + '%';
    top?.classList.toggle('visible', y > 400);
    let cur = ''; secs.forEach(s => { if (y >= s.offsetTop - 130) cur = s.id; });
    if (innerHeight + y >= document.documentElement.scrollHeight - 4) cur = secs[secs.length - 1].id;
    navA.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + cur));
  };
  addEventListener('scroll', () => { if (!tick) { tick = true; requestAnimationFrame(update); } }, { passive: true });
  addEventListener('resize', () => { if (innerWidth > 900) setMenu(false); }, { passive: true });
  toggle.addEventListener('click', () => setMenu(!links.classList.contains('open')));
  top?.addEventListener('click', () => scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' }));
  // smooth scroll + keep URL hash
  $$('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
    const t = document.querySelector(a.getAttribute('href')); if (!t) return;
    e.preventDefault(); setMenu(false);
    scrollTo({ top: t.getBoundingClientRect().top + scrollY - 70, behavior: reduced ? 'auto' : 'smooth' });
    history.replaceState(null, '', a.getAttribute('href'));
  }));
  update();
}

/* ===== REVEAL (clears delay after finishing so hover/tilt stay snappy) ===== */
function initReveal() {
  const els = $$('.reveal-up,.reveal-left,.reveal-right');
  if (!('IntersectionObserver' in window)) { els.forEach(e => e.classList.add('visible', 'done')); return; }
  const io = new IntersectionObserver(entries => {
    entries.filter(e => e.isIntersecting).forEach((en, i) => {
      const el = en.target; io.unobserve(el);
      el.style.transitionDelay = i * 0.06 + 's';
      el.classList.add('visible');
      setTimeout(() => { el.style.transitionDelay = ''; el.classList.add('done'); }, 900 + i * 60);
    });
  }, { threshold: 0.07 });
  els.forEach(el => io.observe(el));
}

function countUp(el, target, suffix = '') {
  if (reduced) { el.textContent = target.toLocaleString() + suffix; return; }
  const t0 = performance.now(), dur = 1100;
  (function step(now) {
    const p = Math.min((now - t0) / dur, 1), v = Math.round(target * (1 - Math.pow(1 - p, 3)));
    el.textContent = v.toLocaleString() + (p === 1 ? suffix : '');
    if (p < 1) requestAnimationFrame(step);
  })(t0);
}
function initCounters() {
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return; io.unobserve(e.target);
    countUp(e.target, parseInt(e.target.dataset.target, 10), '+');
  }), { threshold: .5 });
  $$('.stat-num[data-target]').forEach(el => io.observe(el));
}

/* ===== SKILLS ===== */
function initSkills() {
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.style.width = e.target.dataset.pct + '%'; io.unobserve(e.target); }
  }), { threshold: .2 });
  $$('.skill-fill[data-pct]').forEach(b => io.observe(b));
  const btns = $$('.skill-cat-btn'), cards = $$('.skill-card');
  btns.forEach(btn => btn.addEventListener('click', () => {
    btns.forEach(b => b.classList.toggle('active', b === btn));
    cards.forEach(c => {
      const show = btn.dataset.cat === 'all' || c.dataset.cat === btn.dataset.cat;
      c.hidden = !show;
    });
    $$('.skill-fill').forEach(b => { if (!b.style.width) b.style.width = b.dataset.pct + '%'; });
  }));
}

/* ===== TILT + MAGNETIC (mouse only) ===== */
function initHoverFx() {
  if (!fine.matches || reduced) return;
  $$('.tilt-card').forEach(c => {
    c.addEventListener('mousemove', e => {
      const r = c.getBoundingClientRect();
      const dx = (e.clientX - r.left - r.width / 2) / (r.width / 2), dy = (e.clientY - r.top - r.height / 2) / (r.height / 2);
      c.style.transform = `perspective(700px) rotateY(${dx * 6}deg) rotateX(${-dy * 6}deg) translateZ(5px)`;
    });
    c.addEventListener('mouseleave', () => { c.style.transform = ''; });
  });
  $$('.magnetic').forEach(b => {
    b.addEventListener('mousemove', e => {
      const r = b.getBoundingClientRect();
      b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .2}px,${(e.clientY - r.top - r.height / 2) * .2}px)`;
    });
    b.addEventListener('mouseleave', () => { b.style.transform = ''; });
  });
  addEventListener('mousemove', e => {
    const nx = (e.clientX / innerWidth - .5) * 2, ny = (e.clientY / innerHeight - .5) * 2;
    $$('.hero-orb').forEach((o, i) => { o.style.transform = `translate(${nx * (i + 1) * 9}px,${ny * (i + 1) * 5}px)`; });
  }, { passive: true });
}

/* ===== MODALS (Esc to close, focus restore, aria) ===== */
const modalData = {
  laundry: { title:'Laundry Booking System', meta:'Full-Stack Web App · Sevas Kodit Oy · 2024–2025', desc:'A production React application built for a real estate company to manage shared laundry facility bookings across residential properties.', bullets:['User authentication and role-based access control','Real-time slot availability with conflict prevention','Admin dashboard for managing machines and schedules','Mobile-responsive modular component architecture','Backend REST API + SQL database integration'], tech:['React','JavaScript','Node.js','Express','SQL','REST API','Git'] },
  yolo:    { title:'YOLO Vehicle Detection System', meta:'Computer Vision · B.Eng. Thesis · 2025', desc:'Real-time vehicle detection and counting system built as the thesis for B.Eng. Automation & Technical Systems.', bullets:['YOLOv8 fine-tuned for vehicle class detection','Multithreaded pipeline for concurrent stream processing','Per-lane counting with directional tracking','Structured CSV export for analytics','Runs on CPU — no dedicated GPU required'], tech:['Python','YOLOv8','OpenCV','Multithreading','NumPy','CSV'] },
  traffic: { title:'Smart Traffic Counting System', meta:'Computer Vision · IoT · 2024', desc:'Intelligent traffic monitoring tracking and counting vehicles across multiple lanes using computer vision.', bullets:['OpenCV-based vehicle detection and motion tracking','Multi-lane counting with configurable virtual lines','Live visualisation overlay on video stream','Exportable count data for analytics'], tech:['Python','OpenCV','NumPy','IoT','AI/ML'] },
  face:    { title:'Face Recognition Pipeline', meta:'AI/ML · Computer Vision · 2024', desc:'CPU-optimised face recognition system designed for resource-constrained environments without GPU acceleration.', bullets:['Embedding-based recognition without GPU','Real-time detection from webcam or video','Lightweight model for edge deployment','Identification logging with timestamps'], tech:['Python','OpenCV','face_recognition','NumPy','Edge AI'] },
  iot:     { title:'IoT Sensor Dashboard', meta:'Real-Time Monitoring · Node.js · 2024', desc:'Live industrial equipment monitoring dashboard for continuous data ingestion and real-time sensor stream visualisation.', bullets:['WebSocket-based real-time data push via Socket.IO','Python data acquisition layer with sensors','Live chart rendering with alert thresholds','Multi-device support and session persistence'], tech:['Node.js','Express','Socket.IO','Python','JavaScript','HTML/CSS'] },
  plc:     { title:'PLC & ABB Robot Programs', meta:'Industrial Automation · TwinCAT · RAPID · 2024', desc:'PLC state-machine logic and ABB robotic cell programming developed during B.Eng. studies.', bullets:['TwinCAT PLC state-machine with edge detection','Sequential step control for machine operations','ABB RAPID: pick-and-place with tool calibration','Greasing and palletising automation programs','EPLAN schematic interpretation'], tech:['TwinCAT','Structured Text','ABB RAPID','EPLAN','SolidWorks','CAD'] },
};
let lastFocus = null;
function openModal(id) {
  const d = modalData[id]; if (!d) return;
  lastFocus = document.activeElement;
  $('#modal-content').innerHTML = `<h2 id="modal-title">${d.title}</h2><div class="modal-meta">${d.meta}</div><p>${d.desc}</p>
    <ul>${d.bullets.map(b => `<li>${b}</li>`).join('')}</ul>
    <div class="modal-tech">${d.tech.map(t => `<span>${t}</span>`).join('')}</div>
    <div class="modal-actions"><a href="https://github.com/djdeepak14" target="_blank" rel="noopener" class="btn btn-primary">GitHub ↗</a>
    <button class="btn btn-ghost" onclick="closeModal()">Close</button></div>`;
  $('#modal-overlay').classList.add('active');
  document.body.style.overflow = 'hidden';
  $('.modal-close').focus();
}
function closeModal() {
  $('#modal-overlay').classList.remove('active');
  document.body.style.overflow = '';
  lastFocus?.focus?.();
}
window.openModal = openModal; window.closeModal = closeModal;
addEventListener('keydown', e => {
  if (e.key === 'Escape') { closeModal(); $('.nav-links')?.classList.remove('open'); }
  if (e.key === 'Tab' && $('#modal-overlay').classList.contains('active')) {
    const f = $$('button,a[href]', $('.modal-box')), first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }
});

/* ===== CONTACT FORM (really sends via Web3Forms, else opens mail app) ===== */
function initForm() {
  const form = $('#contact-form'); if (!form) return;
  const btn = $('#submit-btn'), ok = $('#form-success');
  const say = (msg, good = true) => { ok.textContent = msg; ok.style.display = 'block'; ok.style.color = good ? '' : '#e8a0a0'; setTimeout(() => ok.style.display = 'none', 6000); };
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const data = { name: form.name.value.trim(), email: form.email.value.trim(), subject: form.subject.value.trim() || 'Portfolio contact', message: form.message.value.trim() };
    if (form.website.value) return; // honeypot
    const label = btn.textContent; btn.disabled = true; btn.textContent = 'Sending...';
    try {
      if (CONFIG.web3formsKey === 'YOUR_ACCESS_KEY') {
        location.href = `mailto:${CONFIG.email}?subject=${encodeURIComponent(data.subject)}&body=${encodeURIComponent(data.message + '\n\n— ' + data.name + ' (' + data.email + ')')}`;
        say('Opening your email app…');
      } else {
        const r = await fetch('https://api.web3forms.com/submit', { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({ access_key: CONFIG.web3formsKey, ...data, from_name: data.name }) });
        const j = await r.json(); if (!j.success) throw new Error(j.message);
        form.reset(); say('✅ Message sent! I\'ll be in touch soon.');
      }
    } catch { say('❌ Could not send. Please email me directly.', false); }
    btn.disabled = false; btn.textContent = label;
  });
}

/* ===== VISITOR COUNTER (counts once per browser; shared total via Abacus) ===== */
async function initVisitors() {
  const pill = $('#visitor-pill'), out = $('#visitor-count'); if (!pill || !out) return;
  const { base, ns, key } = CONFIG.counter, seen = store.get('dk_visited') === '1';
  try {
    const ctl = new AbortController(); setTimeout(() => ctl.abort(), 6000);
    const r = await fetch(`${base}/${seen ? 'get' : 'hit'}/${ns}/${key}`, { signal: ctl.signal });
    const { value } = await r.json();
    if (typeof value !== 'number') throw 0;
    store.set('dk_visited', '1'); store.set('dk_last_count', value);
    pill.hidden = false; countUp(out, value);
  } catch {
    const last = parseInt(store.get('dk_last_count'), 10);
    if (last) { pill.hidden = false; out.textContent = last.toLocaleString(); }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  $('#year') && ($('#year').textContent = new Date().getFullYear());
  initLoader(); initNav(); initHeroCanvas(); initHeroParticles(); initTyping();
  initSkills(); initHoverFx(); initForm(); initCursor(); initVisitors();
});
