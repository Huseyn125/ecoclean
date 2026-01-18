
const mobileMenuButton = document.querySelector('.mobile-menu-button');
const mobileMenu = document.querySelector('.mobile-menu');
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

mobileMenuButton.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
});

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
    window.scrollTo({top: 0, behavior: 'smooth'});
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth'
            });
            
            // Close mobile menu if open
            if (!mobileMenu.classList.contains('hidden')) {
                mobileMenu.classList.add('hidden');
            }
        }
    });
});