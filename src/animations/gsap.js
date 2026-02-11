import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initAnimations() {
    // ═══════════════════════════════════════
    // LOADING SCREEN ANIMATION
    // ═══════════════════════════════════════
    const loader = document.querySelector('.loader');
    const loaderBar = document.querySelector('.loader-bar');
    const loaderPercentage = document.querySelector('.loader-percentage');

    if (loader && loaderBar) {
        const tl = gsap.timeline({
            onComplete: () => {
                loader.classList.add('hidden');
                // Trigger entrance animations after loader hides
                setTimeout(() => initEntranceAnimations(), 300);
            }
        });

        tl.to(loaderBar, {
            width: '100%',
            duration: 2,
            ease: 'power2.inOut',
            onUpdate: function () {
                if (loaderPercentage) {
                    loaderPercentage.textContent = Math.round(this.progress() * 100) + '%';
                }
            }
        })
            .to(loader, {
                opacity: 0,
                duration: 0.6,
                ease: 'power2.inOut'
            }, '+=0.3');
    } else {
        initEntranceAnimations();
    }

    function initEntranceAnimations() {
        // ═══════════════════════════════════════
        // HERO SECTION ENTRANCE
        // ═══════════════════════════════════════
        const heroTimeline = gsap.timeline({ defaults: { ease: 'power3.out' } });

        heroTimeline
            .from('#hero .section-label', {
                opacity: 0,
                y: 30,
                duration: 0.8,
                delay: 0.2
            })
            .from('#hero h1', {
                opacity: 0,
                y: 50,
                duration: 1,
                stagger: 0.1
            }, '-=0.4')
            .from('#hero .hero-description', {
                opacity: 0,
                y: 30,
                duration: 0.8
            }, '-=0.5')
            .from('#hero .hero-cta', {
                opacity: 0,
                y: 30,
                scale: 0.9,
                duration: 0.8
            }, '-=0.4')
            .from('#hero .hero-stats', {
                opacity: 0,
                y: 20,
                duration: 0.6
            }, '-=0.3')
            .from('.scroll-indicator', {
                opacity: 0,
                y: -20,
                duration: 0.8
            }, '-=0.2');

        // ═══════════════════════════════════════
        // ABOUT SECTION
        // ═══════════════════════════════════════
        gsap.utils.toArray('#about [data-animate]').forEach((el) => {
            const type = el.dataset.animate;
            const delay = parseInt(el.dataset.delay || '0') / 1000;

            const from = { opacity: 0 };
            if (type === 'fade-right') from.x = -60;
            if (type === 'fade-left') from.x = 60;
            if (type === 'fade-up') from.y = 60;

            gsap.fromTo(el, from, {
                opacity: 1,
                x: 0,
                y: 0,
                duration: 1,
                delay,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: el,
                    start: 'top 85%',
                    toggleActions: 'play none none reverse'
                }
            });
        });

        // ═══════════════════════════════════════
        // SKILLS SECTION
        // ═══════════════════════════════════════
        const skillsHeader = document.querySelectorAll('#skills .section-label, #skills h2');
        if (skillsHeader.length) {
            gsap.fromTo(skillsHeader,
                { opacity: 0, y: 40 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    stagger: 0.1,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: '#skills',
                        start: 'top 75%',
                        toggleActions: 'play none none reverse'
                    }
                }
            );
        }

        gsap.utils.toArray('.skill-card').forEach((card, i) => {
            gsap.fromTo(card,
                { opacity: 0, y: 50, scale: 0.85 },
                {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 0.6,
                    delay: i * 0.06,
                    ease: 'back.out(1.4)',
                    scrollTrigger: {
                        trigger: '#skills',
                        start: 'top 65%',
                        toggleActions: 'play none none reverse'
                    }
                }
            );
        });

        // Skill card mouse tracking for spotlight effect
        document.querySelectorAll('.skill-card').forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width) * 100;
                const y = ((e.clientY - rect.top) / rect.height) * 100;
                card.style.setProperty('--mouse-x', `${x}%`);
                card.style.setProperty('--mouse-y', `${y}%`);
            });
        });

        // ═══════════════════════════════════════
        // PROJECTS SECTION
        // ═══════════════════════════════════════
        const projectsHeader = document.querySelectorAll('#projects .section-label, #projects h2, #projects .section-description');
        if (projectsHeader.length) {
            gsap.fromTo(projectsHeader,
                { opacity: 0, y: 40 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    stagger: 0.1,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: '#projects',
                        start: 'top 75%',
                        toggleActions: 'play none none reverse'
                    }
                }
            );
        }

        gsap.utils.toArray('.project-card').forEach((card, i) => {
            gsap.fromTo(card,
                { opacity: 0, y: 80 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.9,
                    delay: i * 0.15,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: '#projects',
                        start: 'top 65%',
                        toggleActions: 'play none none reverse'
                    }
                }
            );

            // 3D tilt on hover
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width - 0.5;
                const y = (e.clientY - rect.top) / rect.height - 0.5;

                gsap.to(card, {
                    rotateY: x * 8,
                    rotateX: -y * 8,
                    duration: 0.4,
                    ease: 'power2.out',
                    transformPerspective: 600
                });
            });

            card.addEventListener('mouseleave', () => {
                gsap.to(card, {
                    rotateY: 0,
                    rotateX: 0,
                    duration: 0.6,
                    ease: 'power2.out'
                });
            });
        });

        // ═══════════════════════════════════════
        // CONTACT SECTION
        // ═══════════════════════════════════════
        gsap.utils.toArray('#contact [data-animate]').forEach((el) => {
            const delay = parseInt(el.dataset.delay || '0') / 1000;
            gsap.fromTo(el,
                { opacity: 0, y: 50 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    delay,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: '#contact',
                        start: 'top 70%',
                        toggleActions: 'play none none reverse'
                    }
                }
            );
        });

        // ═══════════════════════════════════════
        // PARALLAX SECTIONS
        // ═══════════════════════════════════════
        gsap.utils.toArray('.parallax-section').forEach((section) => {
            const depth = section.dataset.parallaxSpeed || 0.1;
            gsap.to(section, {
                yPercent: -parseFloat(depth) * 100,
                ease: 'none',
                scrollTrigger: {
                    trigger: section,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 1.5
                }
            });
        });

        // ═══════════════════════════════════════
        // STAT COUNTERS
        // ═══════════════════════════════════════
        document.querySelectorAll('[data-count]').forEach((el) => {
            const target = el.dataset.count;
            const isNumber = !isNaN(target);

            if (isNumber) {
                const obj = { val: 0 };
                gsap.to(obj, {
                    val: parseInt(target),
                    duration: 2,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: el,
                        start: 'top 80%',
                        toggleActions: 'play none none reverse'
                    },
                    onUpdate: () => {
                        el.textContent = Math.round(obj.val) + '+';
                    }
                });
            }
        });

        // ═══════════════════════════════════════
        // NAVBAR SCROLL BEHAVIOR
        // ═══════════════════════════════════════
        const nav = document.querySelector('nav');
        if (nav) {
            ScrollTrigger.create({
                start: 'top -80',
                onUpdate: (self) => {
                    if (self.progress > 0) {
                        nav.classList.add('scrolled');
                    } else {
                        nav.classList.remove('scrolled');
                    }
                }
            });
        }

        // ═══════════════════════════════════════
        // GLASS CARD HOVER ENHANCEMENT
        // ═══════════════════════════════════════
        document.querySelectorAll('.glass-card').forEach((card) => {
            card.addEventListener('mouseenter', () => {
                gsap.to(card, {
                    scale: 1.015,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            });

            card.addEventListener('mouseleave', () => {
                gsap.to(card, {
                    scale: 1,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            });
        });

        // ═══════════════════════════════════════
        // MAGNETIC BUTTONS
        // ═══════════════════════════════════════
        document.querySelectorAll('.magnetic-btn').forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;

                gsap.to(btn, {
                    x: x * 0.3,
                    y: y * 0.3,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            });

            btn.addEventListener('mouseleave', () => {
                gsap.to(btn, {
                    x: 0,
                    y: 0,
                    duration: 0.5,
                    ease: 'elastic.out(1, 0.3)'
                });
            });
        });

        // ═══════════════════════════════════════
        // SECTION SEPARATORS
        // ═══════════════════════════════════════
        gsap.utils.toArray('.section-separator').forEach(sep => {
            gsap.fromTo(sep,
                { scaleX: 0 },
                {
                    scaleX: 1,
                    duration: 1.2,
                    ease: 'power3.inOut',
                    scrollTrigger: {
                        trigger: sep,
                        start: 'top 85%',
                        toggleActions: 'play none none reverse'
                    }
                }
            );
        });
    }
}
