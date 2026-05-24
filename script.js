/* =============================================
   PROMOUSER — script.js
   ============================================= */

'use strict';

/* ── ANNOUNCEMENT BAR ── */
(function () {
  const bar    = document.getElementById('announcementBar');
  const closeBtn = document.getElementById('closeBanner');
  if (!bar || !closeBtn) return;

  // Remember dismissal
  if (sessionStorage.getItem('pm_banner_closed')) {
    bar.classList.add('hidden');
    document.documentElement.style.setProperty('--announce-h', '0px');
  }

  closeBtn.addEventListener('click', () => {
    bar.style.transition = 'opacity 0.3s, height 0.3s, padding 0.3s';
    bar.style.opacity = '0';
    bar.style.height  = '0';
    bar.style.overflow = 'hidden';
    setTimeout(() => {
      bar.classList.add('hidden');
      document.documentElement.style.setProperty('--announce-h', '0px');
    }, 300);
    sessionStorage.setItem('pm_banner_closed', '1');
  });
})();


/* ── STICKY HEADER ── */
(function () {
  const header = document.getElementById('siteHeader');
  if (!header) return;
  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 10);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
})();


/* ── MOBILE HAMBURGER ── */
(function () {
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');
  if (!hamburger || !navLinks) return;

  hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
    hamburger.setAttribute('aria-expanded', isOpen);
  });

  // Close on nav link click (mobile)
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
})();


/* ── SEARCH OVERLAY ── */
(function () {
  const openBtn  = document.getElementById('navSearchBtn');
  const overlay  = document.getElementById('searchOverlay');
  const closeBtn = document.getElementById('closeSearch');
  const input    = document.getElementById('searchInput');
  if (!openBtn || !overlay) return;

  const open = () => {
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    setTimeout(() => input && input.focus(), 50);
  };
  const close = () => {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  };

  openBtn.addEventListener('click', open);
  closeBtn && closeBtn.addEventListener('click', close);
  overlay.addEventListener('click', e => { if (e.target === overlay) close(); });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && overlay.classList.contains('open')) close();
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault(); open(); }
  });
})();


/* ── ACTIVE LINK HIGHLIGHTING ── */
(function () {
  const currentPage = location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-links a');

  navLinks.forEach(link => {
    const href = link.getAttribute('href') || '';
    const isCurrent = href === currentPage || (currentPage === 'index.html' && href === 'index.html');

    if (isCurrent) {
      link.classList.add('active');
      link.closest('li')?.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
})();


/* ── SCROLL REVEAL ── */
(function () {
  const targets = document.querySelectorAll('.reveal');
  if (!targets.length) return;

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          // Stagger siblings
          const siblings = Array.from(
            entry.target.parentElement.querySelectorAll('.reveal:not(.visible)')
          );
          const delay = siblings.indexOf(entry.target) * 80;
          setTimeout(() => entry.target.classList.add('visible'), delay);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  targets.forEach(el => observer.observe(el));
})();


/* ── HERO LINE-BY-LINE ANIMATION ── */
(function () {
  const lines = document.querySelectorAll('.hero-title .line');
  lines.forEach((line, i) => {
    line.style.opacity  = '0';
    line.style.transform = 'translateY(20px)';
    line.style.transition = `opacity 0.6s ${0.1 + i * 0.12}s cubic-bezier(0.16,1,0.3,1),
                              transform 0.6s ${0.1 + i * 0.12}s cubic-bezier(0.16,1,0.3,1)`;
    requestAnimationFrame(() => {
      setTimeout(() => {
        line.style.opacity  = '1';
        line.style.transform = 'translateY(0)';
      }, 50);
    });
  });
})();


/* ── FLOATING TAG PARALLAX ── */
(function () {
  const tags = document.querySelectorAll('.floating-tag');
  if (!tags.length) return;

  const speeds = [0.015, -0.02, 0.018];
  let ticking = false;

  window.addEventListener('mousemove', e => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const cx = window.innerWidth  / 2;
      const cy = window.innerHeight / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      tags.forEach((tag, i) => {
        const s = speeds[i] || 0.01;
        tag.style.transform = `translate(${dx * s}px, ${dy * s}px)`;
      });
      ticking = false;
    });
  });
})();


/* ── MOUSE BODY TILT ON HOVER ── */
(function () {
  const mouse = document.querySelector('.mouse-3d');
  if (!mouse) return;

  mouse.addEventListener('mousemove', e => {
    const rect = mouse.getBoundingClientRect();
    const cx = rect.left + rect.width  / 2;
    const cy = rect.top  + rect.height / 2;
    const rotX = ((e.clientY - cy) / rect.height) * -20;
    const rotY = ((e.clientX - cx) / rect.width)  *  20;
    mouse.querySelector('.mouse-body').style.transform =
      `rotateX(${rotX}deg) rotateY(${rotY}deg)`;
  });
  mouse.addEventListener('mouseleave', () => {
    mouse.querySelector('.mouse-body').style.transform = '';
  });
})();


/* ── QUICK-LINK CARD HOVER SOUND (visual ripple) ── */
(function () {
  const cards = document.querySelectorAll('.ql-card');
  cards.forEach(card => {
    card.addEventListener('click', function (e) {
      const ripple = document.createElement('span');
      ripple.style.cssText = `
        position: absolute;
        border-radius: 50%;
        background: rgba(232,255,0,0.2);
        width: 10px; height: 10px;
        left: ${e.offsetX - 5}px;
        top:  ${e.offsetY - 5}px;
        pointer-events: none;
        transform: scale(0);
        animation: ripple 0.5s ease-out forwards;
      `;
      // Add ripple keyframes if not already added
      if (!document.getElementById('ripple-style')) {
        const style = document.createElement('style');
        style.id = 'ripple-style';
        style.textContent = `
          @keyframes ripple {
            to { transform: scale(30); opacity: 0; }
          }
        `;
        document.head.appendChild(style);
      }
      card.style.position = 'relative';
      card.style.overflow  = 'hidden';
      card.appendChild(ripple);
      ripple.addEventListener('animationend', () => ripple.remove());
    });
  });
})();


/* ── SMOOTH ANCHOR SCROLL ── */
(function () {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const id = this.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();


/* ── ACTIVE NAV HIGHLIGHT ON SCROLL ── */
(function () {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');
  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navLinks.forEach(link => {
            const href = link.getAttribute('href') || '';
            link.classList.toggle(
              'active',
              href.includes(`#${entry.target.id}`) ||
              (entry.target.id === 'hero' && href.endsWith('index.html'))
            );
          });
        }
      });
    },
    { rootMargin: '-50% 0px -50% 0px' }
  );

  sections.forEach(s => observer.observe(s));
})();


/* ── IFRAME LOAD INDICATOR ── */
(function () {
  const iframe = document.querySelector('.ai-embed-wrapper iframe');
  const wrapper = document.querySelector('.ai-embed-wrapper');
  if (!iframe || !wrapper) return;

  const loader = document.createElement('div');
  loader.style.cssText = `
    position: absolute;
    inset: 56px 0 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--bg-3);
    color: var(--text-3);
    font-size: 14px;
    gap: 10px;
    z-index: 2;
  `;
  loader.innerHTML = `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
         style="animation: spin 1s linear infinite">
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4"/>
    </svg>
    Loading Mouse AI…
  `;
  if (!document.getElementById('spin-style')) {
    const style = document.createElement('style');
    style.id = 'spin-style';
    style.textContent = `@keyframes spin { to { transform: rotate(360deg); } }`;
    document.head.appendChild(style);
  }
  wrapper.style.position = 'relative';
  wrapper.appendChild(loader);

  iframe.addEventListener('load', () => {
    loader.style.transition = 'opacity 0.4s';
    loader.style.opacity = '0';
    setTimeout(() => loader.remove(), 400);
  });
})();


/* ── KEYBOARD NAVIGATION ── */
document.addEventListener('keydown', e => {
  if (e.key === 'Tab') {
    document.body.classList.add('keyboard-nav');
  }
});
document.addEventListener('mousedown', () => {
  document.body.classList.remove('keyboard-nav');
});

// Add focus-visible style when keyboard navigating
(function () {
  const style = document.createElement('style');
  style.textContent = `
    .keyboard-nav *:focus { outline: 2px solid var(--accent) !important; outline-offset: 3px !important; }
    *:focus:not(:focus-visible) { outline: none !important; }
  `;
  document.head.appendChild(style);
})();
