document.addEventListener("DOMContentLoaded", () => {
    // ───────────────────────────────────────────────
    // 1. GSAP Hero Entrance + subtle glitch
    // ───────────────────────────────────────────────
    if (typeof gsap !== "undefined") {
        gsap.from(".hero-name",   { duration: 1.4, y: 90, opacity: 0, ease: "power4.out" });
        gsap.from(".subtitle",    { duration: 1.2, y: 60, opacity: 0, ease: "power4.out", delay: 0.35 });
        gsap.from(".cta-btn",     { duration: 1.0, scale: 0.8, opacity: 0, ease: "back.out(1.7)", delay: 0.9 });

        // Short cyber-glitch on hero name
        gsap.timeline({ delay: 2.2 })
            .to(".hero-name", { x: -6, skewX: 10, duration: 0.08 })
            .to(".hero-name", { x: 6,  skewX: -10, duration: 0.08 })
            .to(".hero-name", { x: 0,  skewX: 0,  duration: 0.14 });
    }

    // ───────────────────────────────────────────────
    // 2. Hero floating particles (CSS animation driven)
    // ───────────────────────────────────────────────
    const heroParticles = document.querySelector('.hero-particles');
    if (heroParticles) {
        for (let i = 0; i < 10; i++) {
            const p = document.createElement('div');
            p.className = 'particle';
            p.style.width = `${1.5 + Math.random() * 5}px`;
            p.style.height = p.style.width;
            p.style.left = `${Math.random() * 100}%`;
            p.style.top  = `${Math.random() * 100}%`;
            p.style.animationDelay    = `${Math.random() * 10}s`;
            p.style.animationDuration = `${18 + Math.random() * 20}s`;
            heroParticles.appendChild(p);
        }
    }

    // ───────────────────────────────────────────────
    // 3. Radial Progress bars (conic + optional count-up)
    // ───────────────────────────────────────────────
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

            const valueEl = bar.querySelector('.progress-value');
            if (valueEl) {
                gsap.to(valueEl, {
                    duration: 2.4,
                    innerHTML: percent,
                    roundProps: "innerHTML",
                    ease: "power3.out",
                    onUpdate: function() {
                        valueEl.textContent = Math.round(this.targets()[0].innerHTML) + "%";
                    }
                });
            }
        });
    }

    const skillsSection = document.querySelector("#skills");
    if (skillsSection) {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !progressAnimated) {
                    animateRadialProgress();
                    progressAnimated = true;
                    observer.disconnect();
                }
            },
            { threshold: 0.4 }
        );
        observer.observe(skillsSection);
    }

    // ───────────────────────────────────────────────
    // 4. Project filter buttons
    // ───────────────────────────────────────────────
    document.querySelectorAll(".filters button").forEach(btn => {
        btn.addEventListener("click", () => {
            document.querySelectorAll(".filters button").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            const filter = btn.dataset.filter;
            document.querySelectorAll(".project-card").forEach(card => {
                card.style.display =
                    (filter === "all" || card.dataset.category === filter) ? "block" : "none";
            });
        });
    });

    // ───────────────────────────────────────────────
    // 5. Cover letter modal
    // ───────────────────────────────────────────────
    const modal = document.getElementById("cover-modal");
    if (modal) {
        document.querySelector(".view-cover-letter")?.addEventListener("click", () => {
            modal.style.display = "flex";
        });

        document.querySelector(".close-modal")?.addEventListener("click", () => {
            modal.style.display = "none";
        });

        window.addEventListener("click", e => {
            if (e.target === modal) modal.style.display = "none";
        });
    }

    // ───────────────────────────────────────────────
    // 6. Contact form (demo success)
    // ───────────────────────────────────────────────
    const contactForm = document.getElementById("contact-form");
    if (contactForm) {
        contactForm.addEventListener("submit", e => {
            e.preventDefault();
            if (!e.target.checkValidity()) return;

            if (typeof confetti !== "undefined") {
                confetti({ particleCount: 140, spread: 90, origin: { y: 0.6 } });
            }

            e.target.reset();

            setTimeout(() => {
                alert("Transmission received! (Demo – no backend)");
            }, 400);
        });
    }

    // ───────────────────────────────────────────────
    // 7. Neon snake-trail cursor (desktop only)
    // ───────────────────────────────────────────────
    const cursorContainer = document.getElementById("cursor-container");
    if (cursorContainer && window.innerWidth > 1023) {
        const trailLength = 16;
        const segments = [];
        const easing = 0.26;
        let mouseX = 0, mouseY = 0;

        // Create trail
        for (let i = 0; i < trailLength; i++) {
            const seg = document.createElement("div");
            seg.className = "cursor-segment";
            seg.style.opacity = 0.92 - (i / trailLength) * 0.75;
            seg.style.width  = `${18 - i * 0.7}px`;
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

            // Gentle breathing pulse
            const t = Date.now() * 0.003;
            segments.forEach((seg, i) => {
                const pulse = Math.sin(t + i * 1.1) * 0.12 + 0.88;
                seg.style.transform = `translate(-50%, -50%) scale(${pulse})`;
            });

            requestAnimationFrame(updateTrail);
        }

        updateTrail();
    }

    // ───────────────────────────────────────────────
    // 8. Education timeline reveal
    // ───────────────────────────────────────────────
    const eduItems = document.querySelectorAll('.edu-item');
    if (eduItems.length > 0) {
        const observer = new IntersectionObserver(
            entries => entries.forEach(entry => {
                if (entry.isIntersecting) entry.target.classList.add('visible');
            }),
            { threshold: 0.25 }
        );
        eduItems.forEach(item => observer.observe(item));
    }

    // ───────────────────────────────────────────────
    // 9. Floating background bots / shapes
    // ───────────────────────────────────────────────
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

                if (this.x < -80 || this.x > w + 80 || this.y < -80 || this.y > h + 80) {
                    this.reset();
                }
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
            ctx.fillStyle = 'rgba(5, 7, 10, 0.08)';
            ctx.fillRect(0, 0, w, h);
            bots.forEach(b => { b.update(); b.draw(); });
            requestAnimationFrame(loop);
        }

        loop();
    }

    // ───────────────────────────────────────────────
    // Optional: Hero typing effect (uncomment if you use it)
    // ───────────────────────────────────────────────
    /*
    const typingEl = document.querySelector('.typing');
    if (typingEl) {
        const text = typingEl.dataset.text || "";
        let i = 0;
        function type() {
            if (i < text.length) {
                typingEl.textContent += text.charAt(i);
                i++;
                setTimeout(type, 60 + Math.random() * 80);
            } else {
                typingEl.classList.add('glitch');
            }
        }
        setTimeout(type, 800);
    }
    */
});