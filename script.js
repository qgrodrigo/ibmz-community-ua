/* ═══════════════════════════════════════════════════════════════
   IBM Z Community UA — JavaScript
   Navbar scroll · FAQ accordion · Smooth scroll · Reveal
   Particles · Active nav tracking · Microinteractions
═══════════════════════════════════════════════════════════════ */

'use strict';

/* ── Helpers ─────────────────────────────────────────────────── */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

/* ── 1. Navbar: scroll effect + active link tracking ─────────── */
(function initNavbar() {
  const navbar   = $('#navbar');
  const hamburger = $('#hamburger');
  const mobileMenu = $('#mobile-menu');
  const navLinks = $$('.nav-link');
  const mobileLinks = $$('.mobile-link');
  const sections = $$('section[id]');

  if (!navbar) return;

  /* Scroll: add/remove .scrolled */
  const onScroll = () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    updateActiveLink();
  };

  /* Active nav link based on current section */
  const updateActiveLink = () => {
    const scrollY = window.scrollY + 120;
    let currentId = '';

    sections.forEach(sec => {
      if (sec.offsetTop <= scrollY) {
        currentId = sec.id;
      }
    });

    navLinks.forEach(link => {
      const href = link.getAttribute('href').replace('#', '');
      link.classList.toggle('active', href === currentId);
    });
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load

  /* Hamburger toggle */
  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', isOpen);
    if (isOpen) {
      mobileMenu.removeAttribute('hidden');
    } else {
      mobileMenu.setAttribute('hidden', '');
    }
  });

  /* Close mobile menu on link click */
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      mobileMenu.setAttribute('hidden', '');
    });
  });

  /* Close mobile menu on outside click */
  document.addEventListener('click', (e) => {
    if (!navbar.contains(e.target) && hamburger.classList.contains('open')) {
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      mobileMenu.setAttribute('hidden', '');
    }
  });

  /* Close mobile menu on Escape */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && hamburger.classList.contains('open')) {
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      mobileMenu.setAttribute('hidden', '');
      hamburger.focus();
    }
  });
})();

/* ── 2. FAQ Accordion ─────────────────────────────────────────── */
(function initFAQ() {
  const faqItems = $$('.faq-item');

  faqItems.forEach(item => {
    const question = $('.faq-item__question', item);
    const answer   = $('.faq-item__answer', item);

    if (!question || !answer) return;

    question.addEventListener('click', () => {
      const isExpanded = question.getAttribute('aria-expanded') === 'true';

      /* Close all others */
      faqItems.forEach(other => {
        if (other !== item) {
          const otherQ = $('.faq-item__question', other);
          const otherA = $('.faq-item__answer', other);
          if (otherQ) otherQ.setAttribute('aria-expanded', 'false');
          if (otherA) otherA.setAttribute('hidden', '');
        }
      });

      /* Toggle current */
      if (isExpanded) {
        question.setAttribute('aria-expanded', 'false');
        answer.setAttribute('hidden', '');
      } else {
        question.setAttribute('aria-expanded', 'true');
        answer.removeAttribute('hidden');
        /* Smooth scroll into view if needed */
        requestAnimationFrame(() => {
          const rect = item.getBoundingClientRect();
          if (rect.bottom > window.innerHeight) {
            item.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }
        });
      }
    });

    /* Keyboard: Enter / Space already handled by button */
  });
})();

/* ── 3. Scroll reveal animation ──────────────────────────────── */
(function initReveal() {
  const elements = $$('[data-reveal]');
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          /* Stagger delay within the same parent grid */
          const siblings = $$('[data-reveal]', entry.target.parentElement);
          const idx = siblings.indexOf(entry.target);
          entry.target.style.transitionDelay = `${idx * 80}ms`;
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  elements.forEach(el => observer.observe(el));
})();

/* ── 4. Hero particles ───────────────────────────────────────── */
(function initParticles() {
  const container = $('#particles');
  if (!container) return;

  const colors = ['#78a9ff', '#47dbd9', '#e801a0', '#fffff0'];
  const count  = window.innerWidth < 640 ? 14 : 26;

  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'hero-particle';

    const size  = Math.random() * 4 + 2;
    const color = colors[Math.floor(Math.random() * colors.length)];
    const x     = Math.random() * 100;
    const y     = Math.random() * 100;
    const dur   = Math.random() * 8 + 6;
    const delay = Math.random() * 8;

    Object.assign(p.style, {
      width:  `${size}px`,
      height: `${size}px`,
      background: color,
      left: `${x}%`,
      top:  `${y}%`,
      animationDuration: `${dur}s`,
      animationDelay: `${delay}s`,
      boxShadow: `0 0 ${size * 3}px ${color}`,
    });

    container.appendChild(p);
  }
})();

/* ── 5. Smooth scroll for anchor links ──────────────────────── */
(function initSmoothScroll() {
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;

    const id = link.getAttribute('href').slice(1);
    if (!id) return;

    const target = document.getElementById(id);
    if (!target) return;

    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
})();

/* ── 6. Button ripple microinteraction ──────────────────────── */
(function initRipple() {
  const buttons = $$('.btn--primary, .btn--cta');

  buttons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      /* avoid duplicate ripples */
      const existing = btn.querySelector('.ripple');
      if (existing) existing.remove();

      const ripple = document.createElement('span');
      ripple.className = 'ripple';

      const rect = btn.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height) * 2;
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top  - size / 2;

      Object.assign(ripple.style, {
        position: 'absolute',
        width:  `${size}px`,
        height: `${size}px`,
        left:   `${x}px`,
        top:    `${y}px`,
        borderRadius: '50%',
        background: 'rgba(255,255,255,.25)',
        transform: 'scale(0)',
        animation: 'rippleAnim .5s ease-out',
        pointerEvents: 'none',
      });

      /* ensure button is positioned */
      if (getComputedStyle(btn).position === 'static') {
        btn.style.position = 'relative';
      }
      btn.style.overflow = 'hidden';
      btn.appendChild(ripple);
      ripple.addEventListener('animationend', () => ripple.remove());
    });
  });

  /* inject ripple keyframe */
  const style = document.createElement('style');
  style.textContent = `
    @keyframes rippleAnim {
      to { transform: scale(1); opacity: 0; }
    }
  `;
  document.head.appendChild(style);
})();

/* ── 7. Navbar CTA + mobile CTA close menu ──────────────────── */
(function initNavCTA() {
  /* Close mobile menu when any internal link is clicked */
  $$('a[href^="#"]').forEach(link => {
    link.addEventListener('click', () => {
      const hamburger = $('#hamburger');
      const mobileMenu = $('#mobile-menu');
      if (hamburger && hamburger.classList.contains('open')) {
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        mobileMenu && mobileMenu.setAttribute('hidden', '');
      }
    });
  });
})();

/* ── 8. Dashboard progress bar trigger on scroll ─────────────── */
(function initDashboard() {
  const fill = $('.dash__progress-fill');
  if (!fill) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          fill.style.animationPlayState = 'running';
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );
  observer.observe(fill.closest('.xplore') || fill);
})();
