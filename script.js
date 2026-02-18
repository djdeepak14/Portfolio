document.addEventListener("DOMContentLoaded", () => {
    // ───────────────────────────────────────────────
    // Modal Open / Close with Book-Opening Animation
    // ───────────────────────────────────────────────
    function openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (!modal) {
            console.warn(`Modal not found: ${modalId}`);
            return;
        }

        modal.style.display = "flex";
        document.body.classList.add("no-scroll");

        const content = modal.querySelector(".modal-content");
        if (!content) return;

        // Book opens: starts closed (scaled + rotated), unfolds like pages
        gsap.fromTo(content,
            { 
                scale: 0.4, 
                opacity: 0.4, 
                rotationY: -80,              // closed book perspective
                transformOrigin: "left center",
                skewX: -12
            },
            { 
                scale: 1, 
                opacity: 1, 
                rotationY: 0,
                skewX: 0,
                duration: 1.0,
                ease: "power4.out"
            }
        );

        // Background fade
        gsap.fromTo(modal,
            { background: "rgba(5,7,10,0)" },
            { background: "rgba(5,7,10,0.94)", duration: 1.2, ease: "power3.out" }
        );
    }

    function closeModal(modal) {
        if (!modal) return;

        const content = modal.querySelector(".modal-content");
        if (!content) return;

        gsap.to(content, {
            scale: 0.4,
            opacity: 0.4,
            rotationY: -80,
            skewX: -12,
            duration: 0.8,
            ease: "power3.in",
            onComplete: () => {
                modal.style.display = "none";
                document.body.classList.remove("no-scroll");
            }
        });

        gsap.to(modal, {
            background: "rgba(5,7,10,0)",
            duration: 0.9,
            ease: "power2.in"
        });
    }

    // Attach modal triggers
    document.querySelectorAll("[data-modal]").forEach(link => {
        link.addEventListener("click", e => {
            e.preventDefault();
            openModal(link.getAttribute("data-modal"));
        });
    });

    // Close buttons
    document.querySelectorAll(".close-modal").forEach(btn => {
        btn.addEventListener("click", () => {
            const modal = btn.closest(".modal");
            if (modal) closeModal(modal);
        });
    });

    // Click outside to close
    window.addEventListener("click", e => {
        if (e.target.classList.contains("modal")) {
            closeModal(e.target);
        }
    });

    // ESC key to close
    window.addEventListener("keydown", e => {
        if (e.key === "Escape") {
            const activeModal = document.querySelector(".modal.active");
            if (activeModal) closeModal(activeModal);
        }
    });

    // View Cover Letter from About modal
    document.querySelectorAll(".view-cover-letter").forEach(btn => {
        btn.addEventListener("click", () => {
            openModal("cover-modal");
        });
    });

    // ───────────────────────────────────────────────
    // All original features (unchanged)
    // ───────────────────────────────────────────────

    // 1. GSAP Hero Entrance + glitch
    if (typeof gsap !== "undefined") {
        gsap.from(".hero-name",   { duration: 1.4, y: 90, opacity: 0, ease: "power4.out" });
        gsap.from(".subtitle",    { duration: 1.2, y: 60, opacity: 0, ease: "power4.out", delay: 0.35 });
        gsap.from(".cta-btn",     { duration: 1.0, scale: 0.8, opacity: 0, ease: "back.out(1.7)", delay: 0.9 });

        gsap.timeline({ delay: 2.2 })
            .to(".hero-name", { x: -6, skewX: 10, duration: 0.08 })
            .to(".hero-name", { x: 6,  skewX: -10, duration: 0.08 })
            .to(".hero-name", { x: 0,  skewX: 0,  duration: 0.14 });
    }

    // 2. Hero particles
    const heroParticles = document.querySelector('.hero-particles');
    if (heroParticles) {
        for (let i = 0; i < 12; i++) {
            const p = document.createElement('div');
            p.className = 'particle';
            p.style.width = `${1.2 + Math.random() * 4}px`;
            p.style.height = p.style.width;
            p.style.left = `${Math.random() * 100}%`;
            p.style.top  = `${Math.random() * 100}%`;
            p.style.animationDelay    = `${Math.random() * 12}s`;
            p.style.animationDuration = `${16 + Math.random() * 24}s`;
            heroParticles.appendChild(p);
        }
    }

    // 3. Radial Progress animation
    const progressBars = document.querySelectorAll(".radial-progress");
    let progressAnimated = false;

    function animateRadialProgress() {
        progressBars.forEach(bar => {
            const percent = parseFloat(bar.dataset.percent) || 0;
            gsap.to(bar, {
                duration: 2.4,
                background: `conic-gradient(var(--accent) ${percent}%, transparent ${percent}%)`,
                ease: "power3.out"
            });
        });
    }

    const skillsModal = document.getElementById("skills-modal");
    if (skillsModal) {
        const skillsObserver = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting && !progressAnimated) {
                animateRadialProgress();
                progressAnimated = true;
                skillsObserver.disconnect();
            }
        }, { threshold: 0.35 });

        skillsObserver.observe(skillsModal);
    }

    // 4. Project filters
    document.querySelectorAll(".filters button").forEach(btn => {
        btn.addEventListener("click", () => {
            document.querySelectorAll(".filters button").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            const filter = btn.dataset.filter;
            document.querySelectorAll(".project-card").forEach(card => {
                card.style.display = (filter === "all" || card.dataset.category === filter) ? "block" : "none";
            });
        });
    });

    // 5. Contact form demo confetti
    const contactForm = document.querySelector(".contact-form");
    if (contactForm) {
        contactForm.addEventListener("submit", e => {
            e.preventDefault();
            if (!e.target.checkValidity()) return;

            confetti({ particleCount: 140, spread: 90, origin: { y: 0.6 } });
            e.target.reset();

            setTimeout(() => alert("Message sent! (Demo mode)"), 600);
        });
    }

    // 6. Snake-trail cursor (desktop only)
    const cursorContainer = document.getElementById("cursor-container");
    if (cursorContainer && window.innerWidth > 1023) {
        const trailLength = 16;
        const segments = [];
        const easing = 0.26;
        let mouseX = 0, mouseY = 0;

        for (let i = 0; i < trailLength; i++) {
            const seg = document.createElement("div");
            seg.className = "cursor-segment";
            seg.style.opacity = 0.92 - (i / trailLength) * 0.75;
            seg.style.width = `${18 - i * 0.7}px`;
            seg.style.height = seg.style.width;
            cursorContainer.appendChild(seg);
            segments.push(seg);
        }

        window.addEventListener("mousemove", e => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        function updateTrail() {
            segments[0].style.left = mouseX + "px";
            segments[0].style.top  = mouseY + "px";

            for (let i = 1; i < trailLength; i++) {
                const prev = segments[i - 1];
                const curr = segments[i];
                const px = parseFloat(prev.style.left) || mouseX;
                const py = parseFloat(prev.style.top)  || mouseY;
                const cx = parseFloat(curr.style.left) || px;
                const cy = parseFloat(curr.style.top)  || py;

                curr.style.left = (cx + (px - cx) * easing) + "px";
                curr.style.top  = (cy + (py - cy) * easing) + "px";
            }

            requestAnimationFrame(updateTrail);
        }

        updateTrail();
    }

    // 7. Background floating bots canvas
    const canvas = document.getElementById('bg-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let w, h;

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
                this.size = 16 + Math.random() * 24;
                this.vx = (Math.random() - 0.5) * 0.7;
                this.vy = (Math.random() - 0.5) * 0.7;
                this.rot = Math.random() * Math.PI * 2;
                this.rotSpd = (Math.random() - 0.5) * 0.018;
                this.alpha = 0.07 + Math.random() * 0.13;
                this.hue = 135 + Math.random() * 50;
                this.pulse = Math.random() * Math.PI * 2;
            }
            update() {
                this.x += this.vx;
                this.y += this.vy;
                this.rot += this.rotSpd;
                this.pulse += 0.016;

                if (this.x < -80 || this.x > w + 80 || this.y < -80 || this.y > h + 80) this.reset();
            }
            draw() {
                ctx.save();
                ctx.translate(this.x, this.y);
                ctx.rotate(this.rot);
                ctx.globalAlpha = this.alpha + Math.sin(this.pulse) * 0.05;
                ctx.fillStyle = `hsla(${this.hue}, 85%, 62%, 0.28)`;
                ctx.fillRect(-this.size/2, -this.size/1.8, this.size, this.size * 1.4);
                ctx.restore();
            }
        }

        const bots = Array.from({ length: 12 }, () => new Bot());

        function loop() {
            ctx.fillStyle = 'rgba(5,7,10,0.08)';
            ctx.fillRect(0,0,w,h);
            bots.forEach(b => { b.update(); b.draw(); });
            requestAnimationFrame(loop);
        }

        loop();
    }

    // 8. Education items fade-in (works in modal too)
    const eduObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('visible');
        });
    }, { threshold: 0.2 });

    document.querySelectorAll('.edu-item').forEach(item => eduObserver.observe(item));
});