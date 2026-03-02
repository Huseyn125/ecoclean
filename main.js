const themeToggle = document.getElementById('themeToggle');
const navLinks = Array.from(document.querySelectorAll('.nav-link'));
const sectionTargets = navLinks
    .map(link => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

const applyTheme = (isDark) => {
    document.body.classList.toggle('dark-mode', isDark);
    if (themeToggle) {
        themeToggle.setAttribute('aria-pressed', isDark ? 'true' : 'false');
        themeToggle.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
    }
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
};

const storedTheme = localStorage.getItem('theme');
const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
const initialIsDark = storedTheme ? storedTheme === 'dark' : prefersDark;

applyTheme(initialIsDark);

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const isDark = !document.body.classList.contains('dark-mode');
        applyTheme(isDark);
    });
}

const updateActiveNav = () => {
    if (!navLinks.length || !sectionTargets.length) {
        return;
    }

    const scrollPosition = window.scrollY + 140;
    let activeSectionId = sectionTargets[0].id;

    sectionTargets.forEach(section => {
        if (section.offsetTop <= scrollPosition) {
            activeSectionId = section.id;
        }
    });

    navLinks.forEach(link => {
        const linkTarget = link.getAttribute('href').replace('#', '');
        link.classList.toggle('nav-link-active', linkTarget === activeSectionId);
    });
};

updateActiveNav();
window.addEventListener('scroll', updateActiveNav);

/* --- CardNav Logic --- */
const navEl = document.getElementById('cardNav');
const hamburger = document.getElementById('navHamburger');
const cards = Array.from(document.querySelectorAll('.nav-card-item'));
const contentEl = document.getElementById('cardNavContent');

let isExpanded = false;
let navTl = null;

const calculateHeight = () => {
    if (!navEl) return 260;

    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    if (isMobile) {
        if (contentEl) {
            const wasVisible = contentEl.style.visibility;
            const wasPointerEvents = contentEl.style.pointerEvents;
            const wasPosition = contentEl.style.position;
            const wasHeight = contentEl.style.height;

            contentEl.style.visibility = 'visible';
            contentEl.style.pointerEvents = 'auto';
            contentEl.style.position = 'static';
            contentEl.style.height = 'auto';

            contentEl.offsetHeight;

            const topBar = 60;
            const padding = 16;
            const contentHeight = contentEl.scrollHeight;

            contentEl.style.visibility = wasVisible;
            contentEl.style.pointerEvents = wasPointerEvents;
            contentEl.style.position = wasPosition;
            contentEl.style.height = wasHeight;

            return topBar + contentHeight + padding;
        }
    }
    return 260;
};

const createTimeline = () => {
    if (!navEl || typeof gsap === 'undefined') return null;

    gsap.set(navEl, { height: 60, overflow: 'hidden' });
    gsap.set(cards, { y: 50, opacity: 0 });

    const tl = gsap.timeline({ paused: true });

    tl.to(navEl, {
        height: calculateHeight,
        duration: 0.4,
        ease: 'power3.out'
    });

    tl.to(cards, { y: 0, opacity: 1, duration: 0.4, ease: 'power3.out', stagger: 0.08 }, '-=0.1');

    return tl;
};

if (typeof gsap !== 'undefined') {
    navTl = createTimeline();

    window.addEventListener('resize', () => {
        if (!navTl) return;

        if (isExpanded) {
            const newHeight = calculateHeight();
            gsap.set(navEl, { height: newHeight });

            navTl.kill();
            navTl = createTimeline();
            if (navTl) navTl.progress(1);
        } else {
            navTl.kill();
            navTl = createTimeline();
        }
    });

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            if (!navTl) return;

            if (!isExpanded) {
                hamburger.classList.add('open');
                navEl.classList.add('open');
                isExpanded = true;
                navTl.play(0);
            } else {
                hamburger.classList.remove('open');
                navTl.eventCallback('onReverseComplete', () => {
                    navEl.classList.remove('open');
                    isExpanded = false;
                });
                navTl.reverse();
            }
        });
    }
}

const faqQuestions = document.querySelectorAll('.faq-question');

faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
        const answer = question.nextElementSibling;
        const icon = question.querySelector('i');

        answer.classList.toggle('hidden');

        icon.classList.toggle('transform');
        icon.classList.toggle('rotate-180');
    });
});

const backToTopButton = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 200) {
        backToTopButton.classList.remove('hidden');
        backToTopButton.classList.add('flex');
    } else {
        backToTopButton.classList.add('hidden');
        backToTopButton.classList.remove('flex');
    }
});

backToTopButton.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        if (this.getAttribute('href') === '#') return;
        e.preventDefault();

        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth'
            });

            // Close CardNav dropdown menu if open
            if (isExpanded && navTl) {
                hamburger.classList.remove('open');
                navTl.eventCallback('onReverseComplete', () => {
                    navEl.classList.remove('open');
                    isExpanded = false;
                });
                navTl.reverse();
            }
        }
    });
});

document.querySelectorAll('.nav-card-link:not([href^="#"]), .card-nav-cta-button:not([href^="#"])').forEach(link => {
    link.addEventListener('click', () => {
        if (isExpanded && navTl) {
            hamburger.classList.remove('open');
            navTl.eventCallback('onReverseComplete', () => {
                navEl.classList.remove('open');
                isExpanded = false;
            });
            navTl.reverse();
        }
    });
});