import './style.css';
import { Experience } from './experience/Experience.js';
import { initAnimations } from './animations/gsap.js';

// ═══════════════════════════════════════
// INITIALIZE 3D EXPERIENCE
// ═══════════════════════════════════════
const canvas = document.getElementById('webgl-canvas');
const experience = new Experience(canvas);

// ═══════════════════════════════════════
// INITIALIZE GSAP ANIMATIONS
// ═══════════════════════════════════════
initAnimations();

// ═══════════════════════════════════════
// CUSTOM CURSOR
// ═══════════════════════════════════════
const cursorDot = document.querySelector('.cursor-dot');
const cursorRing = document.querySelector('.cursor-ring');

if (cursorDot && cursorRing) {
    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursorDot.style.left = mouseX + 'px';
        cursorDot.style.top = mouseY + 'px';
    });

    // Smooth ring follow
    function animateCursor() {
        ringX += (mouseX - ringX) * 0.12;
        ringY += (mouseY - ringY) * 0.12;
        cursorRing.style.left = ringX + 'px';
        cursorRing.style.top = ringY + 'px';
        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Hover detection for interactive elements
    const interactiveElements = document.querySelectorAll('a, button, input, textarea, .skill-card, .project-card, .magnetic-btn');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursorDot.classList.add('hover');
            cursorRing.classList.add('hover');
        });
        el.addEventListener('mouseleave', () => {
            cursorDot.classList.remove('hover');
            cursorRing.classList.remove('hover');
        });
    });
}

// ═══════════════════════════════════════
// MOBILE MENU
// ═══════════════════════════════════════
const menuToggle = document.getElementById('menu-toggle');
const menuClose = document.getElementById('menu-close');
const mobileMenu = document.getElementById('mobile-menu');
const menuLinks = mobileMenu?.querySelectorAll('.mobile-nav-link');

function openMenu() {
    mobileMenu.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Staggered entrance animation for links
    if (menuLinks && typeof gsap !== 'undefined') {
        import('gsap').then(({ gsap }) => {
            gsap.fromTo(menuLinks,
                { opacity: 0, x: -30 },
                {
                    opacity: 1,
                    x: 0,
                    duration: 0.4,
                    stagger: 0.08,
                    ease: 'power3.out',
                    delay: 0.15
                }
            );
        });
    }
}

function closeMenu() {
    mobileMenu.classList.remove('active');
    document.body.style.overflow = '';
}

menuToggle?.addEventListener('click', openMenu);
menuClose?.addEventListener('click', closeMenu);

// Close mobile menu on link click
mobileMenu?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
});

// ═══════════════════════════════════════
// SMOOTH SCROLL FOR NAV LINKS
// ═══════════════════════════════════════
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const targetEl = document.querySelector(targetId);
        if (targetEl) {
            e.preventDefault();
            targetEl.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ═══════════════════════════════════════
// FORM HANDLING
// ═══════════════════════════════════════
const form = document.querySelector('#contact-form');
form?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.textContent;

    // Change button state to sending
    btn.textContent = 'Sending...';
    btn.disabled = true;

    const formData = new FormData(form);

    try {
        const response = await fetch(form.action, {
            method: form.method,
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        });

        if (response.ok) {
            btn.textContent = '✓ Message Sent!';
            btn.style.background = 'linear-gradient(135deg, #34d399, #10b981)';
            form.reset();
        } else {
            const data = await response.json();
            if (Object.hasOwn(data, 'errors')) {
                btn.textContent = 'Error sending message';
            } else {
                btn.textContent = 'Oops! Something went wrong';
            }
        }
    } catch (error) {
        btn.textContent = 'Oops! Connection error';
    }

    setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = '';
        btn.disabled = false;
    }, 3000);
});

// ═══════════════════════════════════════
// ACTIVE NAV LINK HIGHLIGHT
// ═══════════════════════════════════════
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('nav a[href^="#"]');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 200;
        if (scrollY >= sectionTop) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('text-cyan-400');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('text-cyan-400');
        }
    });
});

console.log('🚀 Portfolio initialized — Built with Three.js, GSAP & Passion');
