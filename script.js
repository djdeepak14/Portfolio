
'use strict';

// ===== LOADER =====

function initLoader() {
    const loader = document.getElementById('loader');
    if (!loader) return;

    // Force hide after 4 seconds as backup
    setTimeout(() => {
        loader.classList.add('hidden');
        document.body.style.overflow = '';
    }, 4000);

    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.classList.add('hidden');
            document.body.style.overflow = '';
            initRevealAnimations();
            animateCounters();
        }, 1800);   // Reduced from 2200
    });

    document.body.style.overflow = 'hidden';
}

// ===== RAINBOW PARTICLE CURSOR =====
function initCursor() {
    const canvas = document.getElementById('cursor-canvas');
    if (!canvas || window.innerWidth <= 900) return;
    const ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });

    const mouse = { x: -200, y: -200 };
    const particles = [];
    let hue = 0;

    window.addEventListener('mousemove', e => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
        hue = (hue + 3) % 360;

        // Spawn trail particles
        for (let i = 0; i < 3; i++) {
            particles.push({
                x: mouse.x + (Math.random() - 0.5) * 6,
                y: mouse.y + (Math.random() - 0.5) * 6,
                size: Math.random() * 5 + 2,
                hue: (hue + i * 15) % 360,
                alpha: 1,
                vx: (Math.random() - 0.5) * 1.5,
                vy: (Math.random() - 0.5) * 1.5 - 0.5,
                decay: Math.random() * 0.025 + 0.015,
            });
        }
    });

    // Dot cursor overlay
    const dot = document.createElement('div');
    dot.style.cssText = `
       position:fixed; top:0; left:0; width:10px; height:10px;
       border-radius:50%; background:#fff; pointer-events:none;
       z-index:10000; transform:translate(-50%,-50%); transition:transform 0.08s;
       mix-blend-mode:difference;
     `;
    document.body.appendChild(dot);

    const ring = document.createElement('div');
    ring.style.cssText = `
       position:fixed; top:0; left:0; width:36px; height:36px;
       border-radius:50%; border:1px solid rgba(139,92,246,0.6);
       pointer-events:none; z-index:10000; transform:translate(-50%,-50%);
       transition:transform 0.2s, width 0.2s, height 0.2s, border-color 0.2s;
     `;
    document.body.appendChild(ring);

    let rx = -200, ry = -200;

    function animateCursor() {
        requestAnimationFrame(animateCursor);

        // Smooth ring follow
        rx += (mouse.x - rx) * 0.12;
        ry += (mouse.y - ry) * 0.12;
        dot.style.left = mouse.x + 'px';
        dot.style.top = mouse.y + 'px';
        ring.style.left = rx + 'px';
        ring.style.top = ry + 'px';

        // Draw trail
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.alpha -= p.decay;
            p.size *= 0.97;
            if (p.alpha <= 0) { particles.splice(i, 1); continue; }

            ctx.save();
            ctx.globalAlpha = p.alpha;
            const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
            gradient.addColorStop(0, `hsla(${p.hue}, 100%, 70%, 1)`);
            gradient.addColorStop(1, `hsla(${p.hue}, 100%, 50%, 0)`);
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }
    animateCursor();

    // Interactive ring scale on clickable elements
    document.querySelectorAll('a, button, .project-card, .skill-card, .cert-card').forEach(el => {
        el.addEventListener('mouseenter', () => {
            ring.style.width = '52px';
            ring.style.height = '52px';
            ring.style.borderColor = 'rgba(236,72,153,0.8)';
        });
        el.addEventListener('mouseleave', () => {
            ring.style.width = '36px';
            ring.style.height = '36px';
            ring.style.borderColor = 'rgba(139,92,246,0.6)';
        });
    });
}

// ===== HERO BACKGROUND CANVAS =====
function initHeroCanvas() {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    function resize() {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    // Stars
    const stars = Array.from({ length: 140 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.2 + 0.2,
        alpha: Math.random(),
        speed: Math.random() * 0.005 + 0.002,
        phase: Math.random() * Math.PI * 2,
    }));

    // Light beams
    const beams = Array.from({ length: 5 }, (_, i) => ({
        x: (i + 1) * (canvas.width / 6),
        width: Math.random() * 60 + 30,
        alpha: Math.random() * 0.04 + 0.01,
        speed: Math.random() * 0.3 + 0.1,
        offset: Math.random() * Math.PI * 2,
    }));

    let t = 0;

    function drawFrame() {
        requestAnimationFrame(drawFrame);
        t += 0.01;

        // Gradient sky
        const grd = ctx.createLinearGradient(0, 0, 0, canvas.height);
        grd.addColorStop(0, '#040716');
        grd.addColorStop(0.4, '#0e0325');
        grd.addColorStop(1, '#05070f');
        ctx.fillStyle = grd;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Moving nebula clouds
        for (let n = 0; n < 3; n++) {
            const nx = canvas.width * (0.2 + n * 0.3) + Math.sin(t * 0.3 + n) * 50;
            const ny = canvas.height * (0.3 + n * 0.15) + Math.cos(t * 0.2 + n) * 30;
            const nr = Math.max(canvas.width, canvas.height) * (0.3 + n * 0.1);
            const ng = ctx.createRadialGradient(nx, ny, 0, nx, ny, nr);
            const colors = [
                'rgba(139,92,246,0.06)',
                'rgba(236,72,153,0.04)',
                'rgba(59,130,246,0.05)',
            ];
            ng.addColorStop(0, colors[n]);
            ng.addColorStop(1, 'transparent');
            ctx.fillStyle = ng;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        // Light beams
        beams.forEach(b => {
            const bx = b.x + Math.sin(t * b.speed + b.offset) * 40;
            const bg = ctx.createLinearGradient(bx - b.width / 2, 0, bx + b.width / 2, canvas.height);
            bg.addColorStop(0, `rgba(139,92,246,${b.alpha})`);
            bg.addColorStop(0.5, `rgba(236,72,153,${b.alpha * 0.6})`);
            bg.addColorStop(1, 'transparent');
            ctx.fillStyle = bg;
            ctx.beginPath();
            ctx.moveTo(bx - b.width, 0);
            ctx.lineTo(bx + b.width, 0);
            ctx.lineTo(bx + b.width * 0.5, canvas.height);
            ctx.lineTo(bx - b.width * 0.5, canvas.height);
            ctx.closePath();
            ctx.fill();
        });

        // Stars
        stars.forEach(s => {
            s.alpha = 0.3 + 0.7 * (0.5 + 0.5 * Math.sin(t * s.speed * 10 + s.phase));
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255,255,255,${s.alpha})`;
            ctx.fill();
        });
    }

    drawFrame();
}

// ===== HERO FLOATING PARTICLES =====
function initHeroParticles() {
    const container = document.getElementById('hero-particles');
    if (!container) return;
    for (let i = 0; i < 20; i++) {
        const p = document.createElement('div');
        p.className = 'hero-particle';
        const size = Math.random() * 60 + 10;
        const colors = ['rgba(139,92,246,', 'rgba(236,72,153,', 'rgba(59,130,246,', 'rgba(6,182,212,'];
        const col = colors[Math.floor(Math.random() * colors.length)];
        p.style.cssText = `
         width:${size}px; height:${size}px;
         left:${Math.random() * 100}%; top:${Math.random() * 100}%;
         background:radial-gradient(circle, ${col}0.5), transparent 70%);
         --dur:${Math.random() * 6 + 4}s;
         --delay:${Math.random() * 4}s;
         filter:blur(${Math.random() * 10 + 4}px);
       `;
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
        if (!deleting) {
            el.textContent = phrase.substring(0, ci + 1);
            ci++;
            if (ci === phrase.length) {
                deleting = true;
                setTimeout(type, 1800);
                return;
            }
        } else {
            el.textContent = phrase.substring(0, ci - 1);
            ci--;
            if (ci === 0) {
                deleting = false;
                pi = (pi + 1) % phrases.length;
            }
        }
        setTimeout(type, deleting ? 45 : 75);
    }
    type();
}

// ===== NAVBAR =====
function initNavbar() {
    const navbar = document.getElementById('navbar');
    const toggle = document.getElementById('nav-toggle');
    const links = document.querySelector('.nav-links');

    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 40);
        updateScrollProgress();
        updateActiveNav();
        toggleBackTop();
    }, { passive: true });

    toggle?.addEventListener('click', () => {
        links.classList.toggle('open');
        // Animate burger
        const spans = toggle.querySelectorAll('span');
        toggle.classList.toggle('active');
        if (toggle.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translate(5px,5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(5px,-5px)';
        } else {
            spans[0].style.transform = '';
            spans[1].style.opacity = '';
            spans[2].style.transform = '';
        }
    });

    // Close nav on link click (mobile)
    document.querySelectorAll('[data-nav]').forEach(a => {
        a.addEventListener('click', () => {
            links.classList.remove('open');
            toggle.classList.remove('active');
            const spans = toggle.querySelectorAll('span');
            spans[0].style.transform = '';
            spans[1].style.opacity = '';
            spans[2].style.transform = '';
        });
    });
}

function updateScrollProgress() {
    const bar = document.getElementById('scroll-bar');
    if (!bar) return;
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (scrollTop / docHeight * 100) + '%';
}

function updateActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('[data-nav]');
    let current = '';
    sections.forEach(s => {
        if (window.scrollY >= s.offsetTop - 120) current = s.id;
    });
    navLinks.forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === '#' + current);
    });
}

// ===== SCROLL PROGRESS / BACK TO TOP =====
function toggleBackTop() {
    const btn = document.getElementById('back-top');
    if (!btn) return;
    btn.classList.toggle('visible', window.scrollY > 400);
}

document.getElementById('back-top')?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ===== REVEAL ON SCROLL =====
function initRevealAnimations() {
    const els = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
    const observer = new IntersectionObserver(entries => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                setTimeout(() => entry.target.classList.add('visible'), i * 60);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    els.forEach(el => observer.observe(el));
}

// ===== ANIMATED COUNTERS =====
function animateCounters() {
    const els = document.querySelectorAll('.stat-num[data-target]');
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const el = entry.target;
            const target = parseInt(el.dataset.target);
            let start = 0;
            const step = () => {
                start += Math.ceil(target / 40);
                if (start >= target) { el.textContent = target + '+'; return; }
                el.textContent = start;
                requestAnimationFrame(step);
            };
            step();
            observer.unobserve(el);
        });
    }, { threshold: 0.5 });
    els.forEach(el => observer.observe(el));
}

// ===== SKILL BARS =====
function initSkillBars() {
    const bars = document.querySelectorAll('.skill-fill[data-pct]');
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const el = entry.target;
            el.style.width = el.dataset.pct + '%';
            observer.unobserve(el);
        });
    }, { threshold: 0.3 });
    bars.forEach(b => observer.observe(b));
}

// ===== SKILL FILTER =====
function initSkillFilter() {
    const btns = document.querySelectorAll('.skill-cat-btn');
    const cards = document.querySelectorAll('.skill-card');

    btns.forEach(btn => {
        btn.addEventListener('click', () => {
            btns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const cat = btn.dataset.cat;
            cards.forEach(card => {
                const show = cat === 'all' || card.dataset.cat === cat;
                card.style.display = show ? '' : 'none';
            });
        });
    });
}

// ===== 3D TILT CARDS =====
function initTiltCards() {
    document.querySelectorAll('.tilt-card').forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;
            const dx = (e.clientX - cx) / (rect.width / 2);
            const dy = (e.clientY - cy) / (rect.height / 2);
            card.style.transform = `perspective(600px) rotateY(${dx * 8}deg) rotateX(${-dy * 8}deg) translateZ(6px)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });
}

// ===== MAGNETIC BUTTONS =====
function initMagneticButtons() {
    document.querySelectorAll('.magnetic').forEach(btn => {
        btn.addEventListener('mousemove', e => {
            const rect = btn.getBoundingClientRect();
            const dx = (e.clientX - (rect.left + rect.width / 2)) * 0.25;
            const dy = (e.clientY - (rect.top + rect.height / 2)) * 0.25;
            btn.style.transform = `translate(${dx}px, ${dy}px)`;
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = '';
        });
    });
}

// ===== RIPPLE EFFECT =====
function initRipple() {
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('click', e => {
            const rect = btn.getBoundingClientRect();
            btn.style.setProperty('--rx', ((e.clientX - rect.left) / rect.width * 100) + '%');
            btn.style.setProperty('--ry', ((e.clientY - rect.top) / rect.height * 100) + '%');
        });
    });
}

// ===== PARALLAX =====
function initParallax() {
    window.addEventListener('mousemove', e => {
        const nx = (e.clientX / window.innerWidth - 0.5) * 2;
        const ny = (e.clientY / window.innerHeight - 0.5) * 2;
        document.querySelectorAll('.hero-orb').forEach((orb, i) => {
            const depth = (i + 1) * 12;
            orb.style.transform = `translate(${nx * depth}px, ${ny * depth * 0.6}px)`;
        });
    }, { passive: true });
}

// ===== SMOOTH SCROLL =====
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', e => {
            const target = document.querySelector(a.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

// ===== PROJECT MODALS =====
const modalData = {
    laundry: {
        title: 'Laundry Booking System',
        meta: 'Full-Stack Web App · Sevas Kodit Oy · 2024–2025',
        desc: 'A production React application built for a real estate company to manage shared laundry facility bookings across residential properties.',
        bullets: [
            'User authentication and role-based access control',
            'Real-time slot availability with conflict prevention',
            'Admin dashboard for managing machines and schedules',
            'Mobile-responsive UI with modular component architecture',
            'Integration with backend REST API and SQL database',
        ],
        tech: ['React', 'JavaScript', 'Node.js', 'Express', 'SQL', 'REST API', 'Git'],
    },
    yolo: {
        title: 'YOLO Vehicle Detection System',
        meta: 'Computer Vision · B.Eng. Thesis · 2025',
        desc: 'Real-time vehicle detection and counting system built as the thesis project for B.Eng. Automation & Technical Systems.',
        bullets: [
            'YOLOv8 model fine-tuned for vehicle class detection',
            'Multithreaded pipeline for concurrent stream processing',
            'Per-lane counting with directional tracking',
            'Structured CSV export for analytics and reporting',
            'Runs on CPU — no dedicated GPU required',
        ],
        tech: ['Python', 'YOLOv8', 'OpenCV', 'Multithreading', 'NumPy', 'CSV'],
    },
    traffic: {
        title: 'Smart Traffic Counting System',
        meta: 'Computer Vision · IoT · 2024',
        desc: 'Intelligent traffic monitoring system that tracks and counts vehicles across multiple lanes using computer vision techniques.',
        bullets: [
            'OpenCV-based vehicle detection and motion tracking',
            'Multi-lane counting with configurable virtual lines',
            'Live visualisation overlay on video stream',
            'Exportable count data for traffic analytics',
        ],
        tech: ['Python', 'OpenCV', 'NumPy', 'IoT', 'AI/ML'],
    },
    face: {
        title: 'Face Recognition Pipeline',
        meta: 'AI/ML · Computer Vision · 2024',
        desc: 'CPU-optimised face recognition system designed to run in resource-constrained environments without GPU acceleration.',
        bullets: [
            'Embedding-based face recognition without GPU dependency',
            'Real-time detection with webcam or video stream input',
            'Lightweight model selection for edge deployment',
            'Identification logging with timestamp records',
        ],
        tech: ['Python', 'OpenCV', 'face_recognition', 'NumPy', 'Edge AI'],
    },
    iot: {
        title: 'IoT Sensor Dashboard',
        meta: 'Real-Time Monitoring · Node.js · 2024',
        desc: 'Live industrial equipment monitoring dashboard built for continuous data ingestion and real-time visualisation of sensor streams.',
        bullets: [
            'WebSocket-based real-time data push via Socket.IO',
            'Python data acquisition layer interfacing with sensors',
            'Live chart rendering with configurable alert thresholds',
            'Multi-device support and session persistence',
        ],
        tech: ['Node.js', 'Express', 'Socket.IO', 'Python', 'JavaScript', 'HTML/CSS'],
    },
    plc: {
        title: 'PLC & ABB Robot Programs',
        meta: 'Industrial Automation · TwinCAT · RAPID · 2024',
        desc: 'Industrial automation programs developed during B.Eng. studies covering PLC state-machine logic and ABB robotic cell programming.',
        bullets: [
            'TwinCAT PLC state-machine with rising/falling edge detection',
            'Sequential step control for multi-stage machine operations',
            'ABB RAPID: pick-and-place routine with tool calibration',
            'Greasing and palletising automation cell programs',
            'EPLAN electrical schematic interpretation and documentation',
        ],
        tech: ['TwinCAT', 'Structured Text', 'ABB RAPID', 'EPLAN', 'SolidWorks', 'CAD'],
    },
};

function openModal(id) {
    const data = modalData[id];
    if (!data) return;
    const overlay = document.getElementById('modal-overlay');
    const content = document.getElementById('modal-content');
    content.innerHTML = `
       <h2>${data.title}</h2>
       <div class="modal-meta">${data.meta}</div>
       <p>${data.desc}</p>
       <ul>${data.bullets.map(b => `<li>${b}</li>`).join('')}</ul>
       <div class="modal-tech">${data.tech.map(t => `<span>${t}</span>`).join('')}</div>
       <div style="margin-top:1.5rem;display:flex;gap:0.8rem;flex-wrap:wrap;">
         <a href="https://github.com/djdeepak14" target="_blank" class="btn btn-primary">GitHub ↗</a>
         <button class="btn btn-ghost" onclick="closeModal()">Close</button>
       </div>
     `;
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    document.getElementById('modal-overlay').classList.remove('active');
    document.body.style.overflow = '';
}

// Expose to global scope for inline onclick attributes
window.openModal = openModal;
window.closeModal = closeModal;

// ===== CONTACT FORM =====
function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;
    form.addEventListener('submit', handleFormSubmit);
}

function handleFormSubmit(e) {
    e.preventDefault();
    const btn = document.getElementById('submit-btn');
    const success = document.getElementById('form-success');
    btn.textContent = 'Sending...';
    btn.disabled = true;
    setTimeout(() => {
        btn.textContent = 'Message Sent ✓';
        btn.style.background = 'linear-gradient(135deg,#10b981,#06b6d4)';
        if (success) success.style.display = 'block';
        e.target.reset();
        setTimeout(() => {
            btn.textContent = 'Send Message ✈️';
            btn.style.background = '';
            btn.disabled = false;
            if (success) success.style.display = 'none';
        }, 4000);
    }, 1200);
}

// Expose form submit for inline attribute
window.handleFormSubmit = handleFormSubmit;

// ===== SCROLL REVEAL STAGGER DELAYS =====
function applyStaggerDelays() {
    // Skills
    document.querySelectorAll('#skills-grid .skill-card').forEach((el, i) => {
        el.style.transitionDelay = (i * 0.04) + 's';
    });
    // Projects
    document.querySelectorAll('.project-card').forEach((el, i) => {
        el.style.transitionDelay = (i * 0.07) + 's';
    });
    // Certs
    document.querySelectorAll('.cert-card').forEach((el, i) => {
        el.style.transitionDelay = (i * 0.06) + 's';
    });
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
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

    // Cursor — deferred until after load
    window.addEventListener('load', initCursor);
});
  // Force loader hide if something goes wrong
  setTimeout(() => {
    const loader = document.getElementById('loader');
    if (loader) loader.classList.add('hidden');
    document.body.style.overflow = '';
  }, 5000);