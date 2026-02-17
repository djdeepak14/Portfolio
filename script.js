document.addEventListener("DOMContentLoaded", () => {

    /* =========================
       GSAP HERO ENTRANCE
    ========================== */
    if (typeof gsap !== "undefined") {
        gsap.from(".hero-name",   { duration: 1.3, y: 80, opacity: 0, ease: "power3.out" });
        gsap.from(".subtitle",    { duration: 1.1, y: 50, opacity: 0, ease: "power3.out", delay: 0.3 });
        gsap.from(".location",    { duration: 1.0, y: 40, opacity: 0, ease: "power3.out", delay: 0.5 });
        gsap.from(".hero-tagline",{ duration: 1.2, y: 30, opacity: 0, ease: "power3.out", delay: 0.7 });
        gsap.from(".cta-btn",     { duration: 0.9, scale: 0.85, opacity: 0, ease: "back.out(1.4)", delay: 1.0 });
    }

    /* =========================
       HERO PARTICLES
    ========================== */
    const heroParticles = document.querySelector('.hero-particles');
    if (heroParticles) {
        for (let i = 0; i < 8; i++) {
            const p = document.createElement('div');
            p.className = 'particle';
            p.style.width = `${2 + Math.random() * 4}px`;
            p.style.height = p.style.width;
            p.style.left = `${Math.random() * 100}%`;
            p.style.top = `${Math.random() * 100}%`;
            p.style.animationDelay = `${Math.random() * 12}s`;
            p.style.animationDuration = `${20 + Math.random() * 15}s`;
            heroParticles.appendChild(p);
        }
    }

    /* =========================
       RADIAL PROGRESS
    ========================== */
    const progressBars = document.querySelectorAll(".radial-progress");
    let animated = false;

    function animateProgress() {
        progressBars.forEach(bar => {
            const percent = bar.dataset.percent;
            gsap.to(bar, {
                duration: 2,
                background: `conic-gradient(var(--accent) ${percent}%, transparent ${percent}%)`,
                ease: "power2.out"
            });
        });
    }

    window.addEventListener("scroll", () => {
        if (!animated) {
            const skills = document.querySelector("#skills");
            if (skills && skills.getBoundingClientRect().top < window.innerHeight * 0.8) {
                animateProgress();
                animated = true;
            }
        }
    });

    /* =========================
       PROJECT FILTER
    ========================== */
    document.querySelectorAll(".filters button").forEach(btn => {
        btn.addEventListener("click", () => {
            document.querySelectorAll(".filters button").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            const filter = btn.dataset.filter;
            document.querySelectorAll(".project-card").forEach(card => {
                card.style.display =
                    (filter === "all" || card.dataset.category === filter)
                        ? "block"
                        : "none";
            });
        });
    });

    /* =========================
       COVER LETTER MODAL
    ========================== */
    const modal = document.getElementById("cover-modal");

    document.querySelector(".view-cover-letter")?.addEventListener("click", () => {
        modal.style.display = "flex";
    });

    document.querySelector(".close-modal")?.addEventListener("click", () => {
        modal.style.display = "none";
    });

    window.addEventListener("click", e => {
        if (e.target === modal) modal.style.display = "none";
    });

    /* =========================
       CONTACT FORM (NO BACKEND)
    ========================== */
    document.getElementById("contact-form")?.addEventListener("submit", e => {
        e.preventDefault();

        if (e.target.checkValidity()) {
            if (typeof confetti !== "undefined") {
                confetti({
                    particleCount: 120,
                    spread: 80,
                    origin: { y: 0.6 }
                });
            }

            e.target.reset();

            setTimeout(() => {
                alert("Message sent successfully! (Demo Mode — No Backend Connected)");
            }, 300);
        }
    });

    /* =========================
       SNAKE TRAIL CURSOR
    ========================== */
    const cursorContainer = document.getElementById("cursor-container");

    if (cursorContainer && window.innerWidth > 1023) {
        const trailLength = 14;
        const segments = [];
        const easing = 0.28;
        let mouseX = 0, mouseY = 0;

        for (let i = 0; i < trailLength; i++) {
            const seg = document.createElement("div");
            seg.className = "cursor-segment";
            seg.style.opacity = 0.9 - (i / trailLength) * 0.7;
            seg.style.width = `${16 - i * 0.6}px`;
            seg.style.height = seg.style.width;
            cursorContainer.appendChild(seg);
            segments.push(seg);
        }

        window.addEventListener("mousemove", e => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        function updateSnake() {
            segments[0].style.left = mouseX + "px";
            segments[0].style.top = mouseY + "px";

            for (let i = 1; i < trailLength; i++) {
                const prev = segments[i - 1];
                const curr = segments[i];

                const px = parseFloat(prev.style.left) || mouseX;
                const py = parseFloat(prev.style.top) || mouseY;

                const cx = parseFloat(curr.style.left) || px;
                const cy = parseFloat(curr.style.top) || py;

                curr.style.left = (cx + (px - cx) * easing) + "px";
                curr.style.top = (cy + (py - cy) * easing) + "px";
            }

            requestAnimationFrame(updateSnake);
        }

        updateSnake();
    }

    /* =========================
       EDUCATION REVEAL
    ========================== */
    const eduItems = document.querySelectorAll('.edu-item');
    const eduObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.2 });

    eduItems.forEach(item => eduObserver.observe(item));

    /* =========================
       FLOATING ROBOT BACKGROUND
    ========================== */
    const canvas = document.getElementById('bg-canvas');

    if (canvas) {
        const ctx = canvas.getContext('2d');
        let w, h, frame = 0;

        function resize() {
            w = canvas.width = window.innerWidth;
            h = canvas.height = window.innerHeight;
        }

        window.addEventListener('resize', resize);
        resize();

        class Bot {
            constructor() { this.reset(); }

            reset() {
                this.x = Math.random() * w;
                this.y = Math.random() * h;
                this.size = 18 + Math.random() * 22;
                this.vx = (Math.random() - 0.5) * 0.6;
                this.vy = (Math.random() - 0.5) * 0.6;
                this.rot = Math.random() * Math.PI * 2;
                this.rotSpd = (Math.random() - 0.5) * 0.015;
                this.alpha = 0.08 + Math.random() * 0.14;
                this.hue = 140 + Math.random() * 40;
                this.pulse = Math.random() * Math.PI * 2;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;
                this.rot += this.rotSpd;
                this.pulse += 0.015;

                if (this.x < -60 || this.x > w + 60 || this.y < -60 || this.y > h + 60)
                    this.reset();
            }

            draw() {
                ctx.save();
                ctx.translate(this.x, this.y);
                ctx.rotate(this.rot);
                ctx.globalAlpha = this.alpha + Math.sin(this.pulse) * 0.04;

                ctx.fillStyle = `hsla(${this.hue},80%,60%,0.25)`;
                ctx.fillRect(-this.size/2, -this.size/1.6, this.size, this.size * 1.3);

                ctx.restore();
            }
        }

        const bots = Array.from({ length: 10 }, () => new Bot());

        function loop() {
            frame++;
            if (frame % 2 === 0) {
                ctx.clearRect(0, 0, w, h);
                bots.forEach(b => { b.update(); b.draw(); });
            }
            requestAnimationFrame(loop);
        }

        loop();
    }

});
