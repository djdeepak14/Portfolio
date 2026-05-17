/* =========================================
   DEEPAK KHANAL — PORTFOLIO SCRIPT
   Heaven Theme · Gold & Celestial White
   ========================================= */

   'use strict';

   // ===== LOADER — pure timer, always fires =====
   function initLoader() {
     const loader = document.getElementById('loader');
     if (!loader) return;
     setTimeout(() => {
       loader.classList.add('hidden');
       document.body.style.overflow = '';
       initRevealAnimations();
       animateCounters();
     }, 2100);
   }
   
   // ===== CELESTIAL CURSOR (desktop only) =====
   function initCursor() {
     if (window.innerWidth <= 900) return;
     const canvas = document.getElementById('cursor-canvas');
     if (!canvas) return;
     const ctx = canvas.getContext('2d');
   
     function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
     resize();
     window.addEventListener('resize', resize, { passive: true });
   
     const mouse = { x: -300, y: -300 };
     const particles = [];
   
     // Heaven particle colours — gold, ivory, soft blue-white
     const heavenColors = [
       [200, 180, 120],  // gold
       [232, 212, 160],  // gold-light
       [255, 248, 220],  // ivory
       [200, 220, 245],  // heaven blue
       [255, 255, 255],  // pure white
     ];
   
     // Dot
     const dot = document.createElement('div');
     dot.style.cssText = 'position:fixed;top:0;left:0;width:8px;height:8px;border-radius:50%;background:#e8d4a0;pointer-events:none;z-index:10000;transform:translate(-50%,-50%);box-shadow:0 0 8px rgba(200,180,120,0.8);';
     document.body.appendChild(dot);
   
     // Ring
     const ring = document.createElement('div');
     ring.style.cssText = 'position:fixed;top:0;left:0;width:34px;height:34px;border-radius:50%;border:1px solid rgba(200,180,120,0.6);pointer-events:none;z-index:10000;transform:translate(-50%,-50%);transition:width .2s,height .2s,border-color .2s;';
     document.body.appendChild(ring);
   
     let rx = -300, ry = -300;
   
     window.addEventListener('mousemove', e => {
       mouse.x = e.clientX; mouse.y = e.clientY;
       // Spawn 2 gentle celestial particles
       for (let i = 0; i < 2; i++) {
         const col = heavenColors[Math.floor(Math.random() * heavenColors.length)];
         particles.push({
           x: mouse.x + (Math.random() - 0.5) * 6,
           y: mouse.y + (Math.random() - 0.5) * 6,
           size: Math.random() * 5 + 1.5,
           r: col[0], g: col[1], b: col[2],
           alpha: 0.85,
           vx: (Math.random() - 0.5) * 1.2,
           vy: (Math.random() - 0.5) * 1.2 - 0.6,
           decay: Math.random() * 0.025 + 0.012,
         });
       }
     }, { passive: true });
   
     // Hover scale
     document.querySelectorAll('a,button,.project-card,.skill-card,.cert-card,.contact-link').forEach(el => {
       el.addEventListener('mouseenter', () => {
         ring.style.width = '50px'; ring.style.height = '50px';
         ring.style.borderColor = 'rgba(232,212,160,0.9)';
       });
       el.addEventListener('mouseleave', () => {
         ring.style.width = '34px'; ring.style.height = '34px';
         ring.style.borderColor = 'rgba(200,180,120,0.6)';
       });
     });
   
     function loop() {
       requestAnimationFrame(loop);
       rx += (mouse.x - rx) * 0.12;
       ry += (mouse.y - ry) * 0.12;
       dot.style.left = mouse.x + 'px'; dot.style.top = mouse.y + 'px';
       ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
   
       ctx.clearRect(0, 0, canvas.width, canvas.height);
       for (let i = particles.length - 1; i >= 0; i--) {
         const p = particles[i];
         p.x += p.vx; p.y += p.vy;
         p.alpha -= p.decay; p.size *= 0.975;
         if (p.alpha <= 0) { particles.splice(i, 1); continue; }
         ctx.save();
         ctx.globalAlpha = p.alpha;
         const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
         g.addColorStop(0, `rgba(${p.r},${p.g},${p.b},1)`);
         g.addColorStop(1, `rgba(${p.r},${p.g},${p.b},0)`);
         ctx.fillStyle = g;
         ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill();
         ctx.restore();
       }
     }
     loop();
   }
   
   // ===== HERO BACKGROUND — Heaven Sky =====
   function initHeroCanvas() {
     const canvas = document.getElementById('bg-canvas');
     if (!canvas) return;
     const ctx = canvas.getContext('2d');
     let stars = [], beams = [], cloudLayers = [];
   
     function buildAssets() {
       canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight;
       const count = window.innerWidth < 600 ? 60 : 130;
   
       // Stars — white/gold tones only
       stars = Array.from({ length: count }, () => ({
         x: Math.random() * canvas.width,
         y: Math.random() * canvas.height,
         r: Math.random() * 1.4 + 0.2,
         phase: Math.random() * Math.PI * 2,
         speed: Math.random() * 0.006 + 0.002,
         gold: Math.random() > 0.6, // some stars slightly golden
       }));
   
       // Divine light beams — warm white/gold
       beams = Array.from({ length: 5 }, (_, i) => ({
         x: (i + 0.6) * (canvas.width / 5.5),
         w: Math.random() * 55 + 25,
         alpha: Math.random() * 0.055 + 0.015,
         speed: Math.random() * 0.2 + 0.06,
         offset: Math.random() * Math.PI * 2,
       }));
   
       // Soft cloud/fog layers
       cloudLayers = Array.from({ length: 3 }, (_, i) => ({
         nx: 0.2 + i * 0.28,
         ny: 0.25 + i * 0.18,
         r: Math.max(canvas.width, canvas.height) * (0.4 + i * 0.08),
         speed: 0.15 + i * 0.08,
         offset: i * 1.4,
       }));
     }
   
     buildAssets();
     window.addEventListener('resize', buildAssets, { passive: true });
   
     let t = 0;
     function draw() {
       requestAnimationFrame(draw); t += 0.007;
   
       // Deep heaven sky
       const grd = ctx.createLinearGradient(0, 0, 0, canvas.height);
       grd.addColorStop(0,   '#050710');
       grd.addColorStop(0.3, '#0b1020');
       grd.addColorStop(0.7, '#080d1a');
       grd.addColorStop(1,   '#050710');
       ctx.fillStyle = grd; ctx.fillRect(0, 0, canvas.width, canvas.height);
   
       // Glowing clouds / nebula — warm gold & soft blue-white
       cloudLayers.forEach(({ nx, ny, r, speed, offset }) => {
         const cx = canvas.width  * nx + Math.sin(t * speed + offset) * 35;
         const cy = canvas.height * ny + Math.cos(t * speed * 0.7 + offset) * 20;
         const ng = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
         ng.addColorStop(0,   'rgba(200,180,120,0.055)');
         ng.addColorStop(0.4, 'rgba(168,196,232,0.03)');
         ng.addColorStop(1,   'transparent');
         ctx.fillStyle = ng; ctx.fillRect(0, 0, canvas.width, canvas.height);
       });
   
       // A single bright divine glow at top-centre
       const divineGlow = ctx.createRadialGradient(
         canvas.width * 0.5, canvas.height * 0.1, 0,
         canvas.width * 0.5, canvas.height * 0.1, canvas.width * 0.5
       );
       divineGlow.addColorStop(0,   `rgba(200,180,120,${0.04 + 0.02 * Math.sin(t * 0.5)})`);
       divineGlow.addColorStop(0.5, 'rgba(168,196,232,0.02)');
       divineGlow.addColorStop(1,   'transparent');
       ctx.fillStyle = divineGlow; ctx.fillRect(0, 0, canvas.width, canvas.height);
   
       // Light beams — warm white/gold columns
       beams.forEach(b => {
         const bx = b.x + Math.sin(t * b.speed + b.offset) * 30;
         const bg = ctx.createLinearGradient(bx, 0, bx, canvas.height);
         bg.addColorStop(0,   `rgba(220,200,150,${b.alpha})`);
         bg.addColorStop(0.3, `rgba(200,180,120,${b.alpha * 0.6})`);
         bg.addColorStop(1,   'transparent');
         ctx.fillStyle = bg;
         ctx.beginPath();
         ctx.moveTo(bx - b.w, 0); ctx.lineTo(bx + b.w, 0);
         ctx.lineTo(bx + b.w * 0.35, canvas.height); ctx.lineTo(bx - b.w * 0.35, canvas.height);
         ctx.closePath(); ctx.fill();
       });
   
       // Stars — white or faint gold
       stars.forEach(s => {
         const alpha = 0.2 + 0.8 * (0.5 + 0.5 * Math.sin(t * s.speed * 10 + s.phase));
         ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
         ctx.fillStyle = s.gold
           ? `rgba(220,200,140,${alpha})`
           : `rgba(255,255,255,${alpha})`;
         ctx.fill();
       });
     }
     draw();
   }
   
   // ===== HERO FLOATING PARTICLES — gold & white only =====
   function initHeroParticles() {
     const container = document.getElementById('hero-particles');
     if (!container) return;
     const count = window.innerWidth < 600 ? 8 : 18;
     const colors = [
       'rgba(200,180,120,', 'rgba(232,212,160,',
       'rgba(255,248,220,', 'rgba(168,196,232,',
     ];
     for (let i = 0; i < count; i++) {
       const p = document.createElement('div'); p.className = 'hero-particle';
       const size = Math.random() * 55 + 8;
       const col  = colors[Math.floor(Math.random() * colors.length)];
       p.style.cssText = `width:${size}px;height:${size}px;left:${Math.random()*100}%;top:${Math.random()*100}%;background:radial-gradient(circle,${col}0.45),transparent 70%);--dur:${Math.random()*7+4}s;--delay:-${Math.random()*7}s;filter:blur(${Math.random()*12+4}px);`;
       container.appendChild(p);
     }
   }
   
   // ===== TYPING EFFECT =====
   function initTyping() {
     const el = document.getElementById('typing-el');
     if (!el) return;
     const phrases = [
       'smart automation systems.',
       'AI-powered vision tools.',
       'real-time IoT dashboards.',
       'full-stack web apps.',
       'PLC control logic.',
       'computer vision pipelines.',
     ];
     let pi = 0, ci = 0, deleting = false;
     function type() {
       const phrase = phrases[pi];
       if (!deleting) { el.textContent = phrase.substring(0, ci + 1); ci++; if (ci === phrase.length) { deleting = true; setTimeout(type, 1800); return; } }
       else           { el.textContent = phrase.substring(0, ci - 1); ci--; if (ci === 0) { deleting = false; pi = (pi + 1) % phrases.length; } }
       setTimeout(type, deleting ? 38 : 70);
     }
     type();
   }
   
   // ===== NAVBAR =====
   function initNavbar() {
     const navbar = document.getElementById('navbar');
     const toggle = document.getElementById('nav-toggle');
     const links  = document.querySelector('.nav-links');
   
     window.addEventListener('scroll', () => {
       navbar.classList.toggle('scrolled', window.scrollY > 40);
       updateScrollProgress(); updateActiveNav(); toggleBackTop();
     }, { passive: true });
   
     toggle?.addEventListener('click', () => {
       const open = links.classList.toggle('open');
       const spans = toggle.querySelectorAll('span');
       if (open) { spans[0].style.transform='rotate(45deg) translate(5px,5px)'; spans[1].style.opacity='0'; spans[2].style.transform='rotate(-45deg) translate(5px,-5px)'; }
       else       { spans[0].style.transform=''; spans[1].style.opacity=''; spans[2].style.transform=''; }
     });
   
     document.querySelectorAll('[data-nav]').forEach(a => {
       a.addEventListener('click', () => {
         links.classList.remove('open');
         const spans = toggle?.querySelectorAll('span');
         if (spans) { spans[0].style.transform=''; spans[1].style.opacity=''; spans[2].style.transform=''; }
       });
     });
   }
   
   function updateScrollProgress() {
     const bar = document.getElementById('scroll-bar'); if (!bar) return;
     bar.style.width = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight) * 100) + '%';
   }
   function updateActiveNav() {
     const sections = document.querySelectorAll('section[id]');
     const navLinks = document.querySelectorAll('[data-nav]');
     let current = '';
     sections.forEach(s => { if (window.scrollY >= s.offsetTop - 130) current = s.id; });
     navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + current));
   }
   function toggleBackTop() {
     document.getElementById('back-top')?.classList.toggle('visible', window.scrollY > 400);
   }
   document.getElementById('back-top')?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
   
   // ===== REVEAL ON SCROLL =====
   function initRevealAnimations() {
     const els = document.querySelectorAll('.reveal-up,.reveal-left,.reveal-right');
     if (!els.length) return;
     const io = new IntersectionObserver(entries => {
       entries.forEach((entry, i) => {
         if (!entry.isIntersecting) return;
         setTimeout(() => entry.target.classList.add('visible'), i * 55);
         io.unobserve(entry.target);
       });
     }, { threshold: 0.07 });
     els.forEach(el => io.observe(el));
   }
   
   // ===== COUNTERS =====
   function animateCounters() {
     const io = new IntersectionObserver(entries => {
       entries.forEach(entry => {
         if (!entry.isIntersecting) return;
         const el = entry.target, target = parseInt(el.dataset.target); let val = 0;
         const step = () => { val += Math.ceil(target / 35); if (val >= target) { el.textContent = target + '+'; return; } el.textContent = val; requestAnimationFrame(step); };
         step(); io.unobserve(el);
       });
     }, { threshold: 0.5 });
     document.querySelectorAll('.stat-num[data-target]').forEach(el => io.observe(el));
   }
   
   // ===== SKILL BARS =====
   function initSkillBars() {
     const io = new IntersectionObserver(entries => {
       entries.forEach(entry => { if (!entry.isIntersecting) return; entry.target.style.width = entry.target.dataset.pct + '%'; io.unobserve(entry.target); });
     }, { threshold: 0.2 });
     document.querySelectorAll('.skill-fill[data-pct]').forEach(b => io.observe(b));
   }
   
   // ===== SKILL FILTER =====
   function initSkillFilter() {
     const btns = document.querySelectorAll('.skill-cat-btn');
     const cards = document.querySelectorAll('.skill-card');
     btns.forEach(btn => {
       btn.addEventListener('click', () => {
         btns.forEach(b => b.classList.remove('active')); btn.classList.add('active');
         const cat = btn.dataset.cat;
         cards.forEach(card => {
           const show = cat === 'all' || card.dataset.cat === cat;
           if (show) { card.style.display = ''; requestAnimationFrame(() => { card.style.opacity = '1'; card.style.transform = ''; }); }
           else       { card.style.opacity = '0'; card.style.transform = 'scale(0.88)'; setTimeout(() => { if (card.style.opacity === '0') card.style.display = 'none'; }, 300); }
         });
       });
     });
   }
   
   // ===== 3D TILT (desktop) =====
   function initTiltCards() {
     if (window.innerWidth <= 900) return;
     document.querySelectorAll('.tilt-card').forEach(card => {
       card.addEventListener('mousemove', e => {
         const r = card.getBoundingClientRect();
         const dx = (e.clientX - r.left - r.width  / 2) / (r.width  / 2);
         const dy = (e.clientY - r.top  - r.height / 2) / (r.height / 2);
         card.style.transform = `perspective(700px) rotateY(${dx * 6}deg) rotateX(${-dy * 6}deg) translateZ(5px)`;
       });
       card.addEventListener('mouseleave', () => { card.style.transform = ''; });
     });
   }
   
   // ===== MAGNETIC (desktop) =====
   function initMagneticButtons() {
     if (window.innerWidth <= 900) return;
     document.querySelectorAll('.magnetic').forEach(btn => {
       btn.addEventListener('mousemove', e => {
         const r = btn.getBoundingClientRect();
         btn.style.transform = `translate(${(e.clientX-(r.left+r.width/2))*.2}px,${(e.clientY-(r.top+r.height/2))*.2}px)`;
       });
       btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
     });
   }
   
   // ===== RIPPLE =====
   function initRipple() {
     document.querySelectorAll('.btn').forEach(btn => {
       btn.addEventListener('click', e => {
         const r = btn.getBoundingClientRect();
         btn.style.setProperty('--rx', ((e.clientX - r.left) / r.width  * 100) + '%');
         btn.style.setProperty('--ry', ((e.clientY - r.top)  / r.height * 100) + '%');
       });
     });
   }
   
   // ===== PARALLAX (desktop) =====
   function initParallax() {
     if (window.innerWidth <= 900) return;
     window.addEventListener('mousemove', e => {
       const nx = (e.clientX / window.innerWidth  - 0.5) * 2;
       const ny = (e.clientY / window.innerHeight - 0.5) * 2;
       document.querySelectorAll('.hero-orb').forEach((orb, i) => {
         const d = (i + 1) * 9; orb.style.transform = `translate(${nx*d}px,${ny*d*.55}px)`;
       });
     }, { passive: true });
   }
   
   // ===== SMOOTH SCROLL =====
   function initSmoothScroll() {
     document.querySelectorAll('a[href^="#"]').forEach(a => {
       a.addEventListener('click', e => {
         const target = document.querySelector(a.getAttribute('href'));
         if (target) { e.preventDefault(); window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 70, behavior: 'smooth' }); }
       });
     });
   }
   
   // ===== MODALS =====
   const modalData = {
     laundry: { title:'Laundry Booking System', meta:'Full-Stack Web App · Sevas Kodit Oy · 2024–2025', desc:'A production React application built for a real estate company to manage shared laundry facility bookings across residential properties.', bullets:['User authentication and role-based access control','Real-time slot availability with conflict prevention','Admin dashboard for managing machines and schedules','Mobile-responsive modular component architecture','Backend REST API + SQL database integration'], tech:['React','JavaScript','Node.js','Express','SQL','REST API','Git'] },
     yolo:    { title:'YOLO Vehicle Detection System', meta:'Computer Vision · B.Eng. Thesis · 2025', desc:'Real-time vehicle detection and counting system built as the thesis for B.Eng. Automation & Technical Systems.', bullets:['YOLOv8 fine-tuned for vehicle class detection','Multithreaded pipeline for concurrent stream processing','Per-lane counting with directional tracking','Structured CSV export for analytics','Runs on CPU — no dedicated GPU required'], tech:['Python','YOLOv8','OpenCV','Multithreading','NumPy','CSV'] },
     traffic: { title:'Smart Traffic Counting System', meta:'Computer Vision · IoT · 2024', desc:'Intelligent traffic monitoring tracking and counting vehicles across multiple lanes using computer vision.', bullets:['OpenCV-based vehicle detection and motion tracking','Multi-lane counting with configurable virtual lines','Live visualisation overlay on video stream','Exportable count data for analytics'], tech:['Python','OpenCV','NumPy','IoT','AI/ML'] },
     face:    { title:'Face Recognition Pipeline', meta:'AI/ML · Computer Vision · 2024', desc:'CPU-optimised face recognition system designed for resource-constrained environments without GPU acceleration.', bullets:['Embedding-based recognition without GPU','Real-time detection from webcam or video','Lightweight model for edge deployment','Identification logging with timestamps'], tech:['Python','OpenCV','face_recognition','NumPy','Edge AI'] },
     iot:     { title:'IoT Sensor Dashboard', meta:'Real-Time Monitoring · Node.js · 2024', desc:'Live industrial equipment monitoring dashboard for continuous data ingestion and real-time sensor stream visualisation.', bullets:['WebSocket-based real-time data push via Socket.IO','Python data acquisition layer with sensors','Live chart rendering with alert thresholds','Multi-device support and session persistence'], tech:['Node.js','Express','Socket.IO','Python','JavaScript','HTML/CSS'] },
     plc:     { title:'PLC & ABB Robot Programs', meta:'Industrial Automation · TwinCAT · RAPID · 2024', desc:'PLC state-machine logic and ABB robotic cell programming developed during B.Eng. studies.', bullets:['TwinCAT PLC state-machine with edge detection','Sequential step control for machine operations','ABB RAPID: pick-and-place with tool calibration','Greasing and palletising automation programs','EPLAN schematic interpretation'], tech:['TwinCAT','Structured Text','ABB RAPID','EPLAN','SolidWorks','CAD'] },
   };
   
   function openModal(id) {
     const data = modalData[id]; if (!data) return;
     document.getElementById('modal-content').innerHTML = `
       <h2>${data.title}</h2>
       <div class="modal-meta">${data.meta}</div>
       <p>${data.desc}</p>
       <ul>${data.bullets.map(b=>`<li>${b}</li>`).join('')}</ul>
       <div class="modal-tech">${data.tech.map(t=>`<span>${t}</span>`).join('')}</div>
       <div style="margin-top:1.5rem;display:flex;gap:.8rem;flex-wrap:wrap;">
         <a href="https://github.com/djdeepak14" target="_blank" class="btn btn-primary">GitHub ↗</a>
         <button class="btn btn-ghost" onclick="closeModal()">Close</button>
       </div>`;
     document.getElementById('modal-overlay').classList.add('active');
     document.body.style.overflow = 'hidden';
   }
   
   function closeModal() {
     document.getElementById('modal-overlay').classList.remove('active');
     document.body.style.overflow = '';
   }
   window.openModal = openModal; window.closeModal = closeModal;
   
   // ===== CONTACT FORM =====
   function initContactForm() {
     const form = document.getElementById('contact-form'); if (!form) return;
     form.addEventListener('submit', e => {
       e.preventDefault();
       const btn = document.getElementById('submit-btn'), success = document.getElementById('form-success');
       btn.textContent = 'Sending...'; btn.disabled = true;
       setTimeout(() => {
         btn.textContent = 'Message Sent ✓';
         btn.style.background = 'linear-gradient(135deg,#a8c4e8,#c8b47a)';
         if (success) success.style.display = 'block';
         form.reset();
         setTimeout(() => { btn.textContent='Send Message ✈️'; btn.style.background=''; btn.disabled=false; if(success)success.style.display='none'; }, 4000);
       }, 1200);
     });
   }
   
   // ===== STAGGER DELAYS =====
   function applyStaggerDelays() {
     document.querySelectorAll('#skills-grid .skill-card').forEach((el, i) => el.style.transitionDelay = (i * .035) + 's');
     document.querySelectorAll('.project-card').forEach((el, i) => el.style.transitionDelay = (i * .06) + 's');
     document.querySelectorAll('.cert-card').forEach((el, i) => el.style.transitionDelay = (i * .05) + 's');
   }
   
   // ===== INIT =====
   document.addEventListener('DOMContentLoaded', () => {
     document.body.style.overflow = 'hidden';
     initLoader();
     initHeroCanvas();
     initHeroParticles();
     initTyping();
     initNavbar();
     initSkillBars();
     initSkillFilter();
     initTiltCards();
     initMagneticButtons();
     initRipple();
     initParallax();
     initSmoothScroll();
     initContactForm();
     applyStaggerDelays();
     initCursor();
   });