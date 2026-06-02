/* =============================================
   PROMOUSER — script.js
   ============================================= */

'use strict';

/* ── SPLASH SCREEN + PAGE PROGRESS ── */
(function () {
  const body = document.body;
  if (!body) return;

  document.documentElement.dataset.splash = 'active';

  const favicon = document.querySelector('link[rel="icon"]')?.href || 'assets/icons/favicon.png';
  if (!document.querySelector('link[rel="mask-icon"]')) {
    const maskIcon = document.createElement('link');
    maskIcon.rel = 'mask-icon';
    maskIcon.href = favicon;
    maskIcon.color = '#e8ff00';
    document.head.appendChild(maskIcon);
  }
  if (!document.querySelector('meta[name="theme-color"]')) {
    const themeColor = document.createElement('meta');
    themeColor.name = 'theme-color';
    themeColor.content = '#0d0d0d';
    document.head.appendChild(themeColor);
  }

  const splash = document.createElement('div');
  splash.className = 'splash-screen';
  splash.innerHTML = `
    <div class="splash-inner">
      <div class="splash-logo"><img src="${favicon}" alt="ProMouser logo"></div>
      <div class="splash-title">ProMouser Launching</div>
      <div class="splash-note">ProMouser Launch</div>
      <div class="splash-bar"><span class="splash-bar-fill"></span></div>
      <div class="splash-meta">Initializing performance matrix…</div>
    </div>`;

  body.prepend(splash);

  const fill = splash.querySelector('.splash-bar-fill');
  let progress = 0;

  const tick = () => {
    progress = Math.min(100, progress + Math.random() * 16 + 6);
    if (fill) fill.style.width = `${progress}%`;
    if (progress < 98) requestAnimationFrame(tick);
  };

  setTimeout(() => requestAnimationFrame(tick), 50);

  const removeSplash = () => {
    splash.classList.add('hidden');
    document.documentElement.dataset.splash = 'false';
    setTimeout(() => splash.remove(), 700);
  };

  window.addEventListener('load', () => {
    if (fill) fill.style.width = '100%';
    setTimeout(removeSplash, 550);
  });

  setTimeout(removeSplash, 2600);
})();

(function () {
  const progressBar = document.createElement('div');
  progressBar.className = 'scroll-progress';
  document.body.appendChild(progressBar);

  const update = () => {
    const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
    progressBar.style.width = documentHeight > 0
      ? `${Math.min(100, (window.scrollY / documentHeight) * 100)}%`
      : '0%';
  };

  window.addEventListener('scroll', update, { passive: true });
  update();
})();

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


/* ── SEARCH INDEX + COMPARE ANALYTICS ── */
(function () {
  const normalize = text => String(text || '')
    .normalize('NFKD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[^\p{L}\p{N}\s]+/gu, ' ')
    .trim()
    .toLowerCase();

  const createSearchHost = overlay => {
    let host = document.getElementById('searchResults');
    if (host) return host;
    host = document.createElement('div');
    host.id = 'searchResults';
    host.className = 'search-results';
    overlay.appendChild(host);
    return host;
  };

  class SearchIndex {
    constructor(items) {
      this.items = items.map(item => ({
        ...item,
        tokens: normalize(`${item.title} ${item.description}`).split(/\s+/).filter(Boolean)
      }));
    }

    search(query) {
      const terms = normalize(query).split(/\s+/).filter(Boolean);
      if (!terms.length) return [];
      const results = this.items.map(item => {
        const score = terms.reduce((sum, token) => {
          const index = item.tokens.indexOf(token);
          return sum + (index === -1 ? 0 : 30 - index);
        }, 0) + terms.reduce((sum, token) => {
          return sum + (item.title.includes(token) ? 8 : 0);
        }, 0);
        return { ...item, score };
      }).filter(item => item.score > 0);

      return results.sort((a, b) => b.score - a.score).slice(0, 8);
    }
  }

  const overlay = document.getElementById('searchOverlay');
  const input = document.getElementById('searchInput');
  if (overlay && input) {
    const resultsHost = createSearchHost(overlay);
    const links = Array.from(document.querySelectorAll('a[href]'))
      .filter(link => {
        const href = link.getAttribute('href');
        return href && !href.startsWith('#') && !href.startsWith('javascript:') && href.trim();
      })
      .map(link => ({
        title: link.textContent.trim() || link.getAttribute('href'),
        url: link.getAttribute('href'),
        description: link.dataset.search || '',
        text: normalize(link.textContent.trim()),
      }));

    const index = new SearchIndex(links);
    let activeResult = -1;

    const renderResults = items => {
      resultsHost.innerHTML = items.length
        ? items.map(item => `
            <button class="search-result-item" type="button" data-href="${item.url}">
              <span><strong>${item.title}</strong><div class="search-result-meta">${item.description || item.url}</div></span>
              <span>→</span>
            </button>
          `).join('')
        : '<div class="search-empty">No results yet. Try a different search term.</div>';

      resultsHost.querySelectorAll('.search-result-item').forEach((button, index) => {
        button.addEventListener('click', () => {
          const href = button.dataset.href;
          if (href) window.location.href = href;
        });
      });
      activeResult = -1;
    };

    const executeSearch = query => {
      if (!query) {
        resultsHost.innerHTML = '<div class="search-empty">Search pages, compare features, and find mouse advice instantly.</div>';
        return;
      }
      renderResults(index.search(query));
    };

    input.addEventListener('input', e => executeSearch(e.target.value));
    input.addEventListener('keydown', e => {
      const items = Array.from(resultsHost.querySelectorAll('.search-result-item'));
      if (!items.length) return;
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        activeResult = Math.min(activeResult + 1, items.length - 1);
        items.forEach((item, idx) => item.classList.toggle('active', idx === activeResult));
        items[activeResult]?.focus();
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        activeResult = Math.max(activeResult - 1, 0);
        items.forEach((item, idx) => item.classList.toggle('active', idx === activeResult));
        items[activeResult]?.focus();
      }
      if (e.key === 'Enter' && activeResult >= 0) {
        e.preventDefault();
        items[activeResult].click();
      }
    });

    overlay.addEventListener('animationend', () => {
      if (overlay.classList.contains('open')) input.focus();
    });

    executeSearch('');
  }

  class CompareEngine extends EventTarget {
    #config = {
      mice: [
        { id: 'g502', name: 'G502 Hero', grip: ['palm', 'claw'], weight: 121, sensor: 'hero 25k', connection: 'wired', use: ['fps', 'productivity'], specialty: 'buttons' },
        { id: 'deathadder', name: 'DeathAdder V3', grip: ['palm', 'claw'], weight: 82, sensor: 'focus+', connection: 'wired', use: ['office', 'productivity'], specialty: 'comfort' },
        { id: 'model-o', name: 'Model O', grip: ['claw', 'fingertip'], weight: 67, sensor: 'pixart 3370', connection: 'wired', use: ['fps', 'creative'], specialty: 'lightweight' },
        { id: 'superlight', name: 'Superlight Pro X', grip: ['fingertip', 'claw'], weight: 63, sensor: 'hero 25k', connection: 'wireless', use: ['fps', 'office'], specialty: 'wireless' }
      ],
      weights: {
        game: 40,
        grip: 25,
        weight: 20,
        connection: 10,
        specialty: 5
      }
    };

    #state = { game: 'fps', grip: 'claw', weight: 'balanced', connection: 'any' };
    #root;
    #elements = {};
    #rowMap = new Map([['use', 'use'], ['grip', 'grip'], ['weight', 'weight'], ['sensor', 'sensor'], ['connection', 'connection']]);

    constructor(root) {
      super();
      this.#root = root;
      this.#elements = {
        game: document.getElementById('gameTypeSelect'),
        grip: document.getElementById('gripStyleSelect'),
        weight: document.getElementById('weightPreferenceSelect'),
        connection: document.getElementById('connectionSelect'),
        title: document.getElementById('recommendationTitle'),
        intro: document.getElementById('recommendationIntro'),
        score: document.getElementById('recommendationScore'),
        scoreValue: document.getElementById('recommendationValue'),
        gripMatch: document.getElementById('matchGrip'),
        weightMatch: document.getElementById('matchWeight'),
        connectionMatch: document.getElementById('matchConnection'),
        sensorMatch: document.getElementById('matchSensor')
      };
    }

    init() {
      if (!this.#root) return;
      this.#hydrateState();
      this.#bindControls();
      this.#render();
    }

    #hydrateState() {
      try {
        const saved = JSON.parse(localStorage.getItem('pm_compare_state') || '{}');
        this.#state = { ...this.#state, ...saved };
      } catch (error) {
        this.#state = { ...this.#state };
      }
      const params = new URLSearchParams(location.search);
      ['game', 'grip', 'weight', 'connection'].forEach(key => {
        const value = params.get(key);
        if (value) this.#state[key] = value;
      });
      Object.entries(this.#elements).forEach(([key, el]) => {
        if (el && this.#state[key]) el.value = this.#state[key];
      });
    }

    #bindControls() {
      ['game', 'grip', 'weight', 'connection'].forEach(key => {
        const el = this.#elements[key];
        if (!el) return;
        el.addEventListener('change', () => {
          this.#state[key] = el.value;
          this.#saveState();
          this.#updateURL();
          this.#render();
          this.dispatchEvent(new CustomEvent('compare:update', { detail: { ...this.#state } }));
        });
      });
    }

    #saveState() {
      localStorage.setItem('pm_compare_state', JSON.stringify(this.#state));
    }

    #updateURL() {
      const params = new URLSearchParams(location.search);
      Object.entries(this.#state).forEach(([key, value]) => params.set(key, value));
      history.replaceState({}, '', `${location.pathname}?${params.toString()}`);
    }

    #weightScore(mouse) {
      if (this.#state.weight === 'any') return 1;
      const ideal = { light: 75, balanced: 95, heavy: 110 }[this.#state.weight];
      const diff = Math.abs(mouse.weight - ideal);
      return Math.max(0, 1 - diff / 90);
    }

    #sensorScore(mouse) {
      return mouse.use.includes(this.#state.game) ? 1 : 0.55;
    }

    #matchValue(value, expected) {
      return value === expected ? 1 : 0.4;
    }

    #computeScores() {
      return this.#config.mice.map(mouse => {
        const gameScore = mouse.use.includes(this.#state.game) ? 1 : 0.3;
        const gripScore = mouse.grip.includes(this.#state.grip) ? 1 : 0.35;
        const connectionScore = this.#state.connection === 'any' ? 1 : this.#matchValue(mouse.connection, this.#state.connection);
        const weightScore = this.#weightScore(mouse);
        const specialtyScore = mouse.specialty === 'wireless' && this.#state.connection === 'wireless' ? 1 : 0.75;
        const total = Math.round(
          (gameScore * this.#config.weights.game) +
          (gripScore * this.#config.weights.grip) +
          (weightScore * this.#config.weights.weight) +
          (connectionScore * this.#config.weights.connection) +
          (specialtyScore * this.#config.weights.specialty)
        );

        return {
          ...mouse,
          score: Math.min(100, total),
          details: { gameScore, gripScore, weightScore, connectionScore, specialtyScore }
        };
      }).sort((a, b) => b.score - a.score);
    }

    #render() {
      const [winner] = this.#computeScores();
      const memo = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 });
      if (!winner) return;
      const gripMatch = Math.round(winner.details.gripScore * 100);
      const weightMatch = Math.round(winner.details.weightScore * 100);
      const connectionMatch = Math.round(winner.details.connectionScore * 100);
      const sensorMatch = Math.round(winner.details.gameScore * 100);

      this.#elements.title.textContent = winner.name;
      this.#elements.intro.textContent = `${winner.name} is the best fit for ${this.#state.game} with ${this.#state.grip} grip.`;
      this.#elements.score.style.width = `${winner.score}%`;
      this.#elements.scoreValue.textContent = `${memo.format(winner.score)}%`;
      this.#elements.gripMatch.textContent = `${memo.format(gripMatch)}%`;
      this.#elements.weightMatch.textContent = `${memo.format(weightMatch)}%`;
      this.#elements.connectionMatch.textContent = `${memo.format(connectionMatch)}%`;
      this.#elements.sensorMatch.textContent = `${memo.format(sensorMatch)}%`;

      this.#rowMap.forEach((feature, property) => {
        const row = this.#root.querySelector(`[data-feature="${feature}"]`);
        if (!row) return;
        const isMatch = property === 'weight'
          ? winner.details.weightScore > 0.65
          : property === 'connection'
            ? winner.details.connectionScore > 0.7
            : property === 'sensor'
              ? winner.details.gameScore > 0.7
              : winner.details[`${property}Score`]?.toFixed !== undefined;
        row.classList.toggle('highlight', isMatch);
      });
    }
  }

  new CompareEngine(document.getElementById('comparePanel')).init();
})();

/* ── PRO GENERATOR ENGINE ── */
(function () {
  const focusEl = document.getElementById('generatorFocusSelect');
  if (!focusEl) return;

  const mice = [
    { id: 'g502', name: 'G502 Hero', focus: ['fps', 'productivity'], grip: ['palm', 'claw'], weight: 121, connection: 'wired', wireless: 0, description: 'Hybrid FPS and productivity mouse with customizable buttons.' },
    { id: 'deathadder', name: 'DeathAdder V3', focus: ['office', 'productivity'], grip: ['palm', 'claw'], weight: 82, connection: 'wired', wireless: 0, description: 'Comfort-first design for long office sessions.' },
    { id: 'model-o', name: 'Model O', focus: ['fps', 'creative'], grip: ['claw', 'fingertip'], weight: 67, connection: 'wired', wireless: 0, description: 'Ultra-light mouse for aggressive competitive play.' },
    { id: 'superlight', name: 'Superlight Pro X', focus: ['fps', 'office'], grip: ['fingertip', 'claw'], weight: 63, connection: 'wireless', wireless: 1, description: 'Premium wireless performance for elite players.' }
  ];

  const elements = {
    focus: document.getElementById('generatorFocusSelect'),
    grip: document.getElementById('generatorGripSelect'),
    weight: document.getElementById('generatorWeightSelect'),
    connection: document.getElementById('generatorConnectionSelect'),
    run: document.getElementById('generatorRunBtn'),
    title: document.getElementById('generatorResultTitle'),
    copy: document.getElementById('generatorResultCopy'),
    score: document.getElementById('generatorScore'),
    gripScore: document.getElementById('generatorGripScore'),
    weightScore: document.getElementById('generatorWeightScore'),
    wirelessScore: document.getElementById('generatorWirelessScore')
  };

  const compute = ({ focus, grip, weight, connection }, mouse) => {
    const focusScore = mouse.focus.includes(focus) ? 1 : 0.35;
    const gripScore = mouse.grip.includes(grip) ? 1 : 0.3;
    const weightTarget = { light: 70, balanced: 90, heavy: 110 }[weight] || 85;
    const weightDiff = Math.abs(mouse.weight - weightTarget) / 100;
    const weightScore = Math.max(0, 1 - weightDiff);
    const connectionMatch = connection === 'any' ? 1 : (mouse.connection === connection ? 1 : 0.25);
    const wireless = mouse.wireless && connection === 'wireless' ? 0.1 : 0;
    const total = (focusScore * 0.35) + (gripScore * 0.25) + (weightScore * 0.2) + (connectionMatch * 0.15) + wireless;
    return {
      score: Math.round(Math.max(0, Math.min(100, total * 100))),
      focusScore: Math.round(focusScore * 100),
      gripScore: Math.round(gripScore * 100),
      weightScore: Math.round(weightScore * 100),
      connectionScore: Math.round(connectionMatch * 100)
    };
  };

  const render = result => {
    elements.title.textContent = `${result.name} recommended`;
    elements.copy.textContent = result.description;
    elements.score.textContent = `${result.match.score}%`;
    elements.gripScore.textContent = `${result.match.gripScore}%`;
    elements.weightScore.textContent = `${result.match.weightScore}%`;
    elements.wirelessScore.textContent = `${result.match.connectionScore}%`;
  };

  const run = () => {
    const input = {
      focus: String(elements.focus.value).toLowerCase(),
      grip: String(elements.grip.value).toLowerCase(),
      weight: String(elements.weight.value).toLowerCase(),
      connection: String(elements.connection.value).toLowerCase()
    };
    const results = mice.map(m => ({ ...m, match: compute(input, m) })).sort((a, b) => b.match.score - a.match.score);
    render(results[0]);
  };

  elements.run?.addEventListener('click', run);
  ['focus', 'grip', 'weight', 'connection'].forEach(key => {
    elements[key]?.addEventListener('change', run);
  });
  run();
})();

/* ── PAGE TRANSITION + LINK PREFETCH ── */
(function () {
  const shouldHandle = url => {
    if (!url || url.startsWith('mailto:') || url.startsWith('tel:') || url.startsWith('#') || url.startsWith('javascript:')) return false;
    try {
      const target = new URL(url, location.href);
      return target.origin === location.origin;
    } catch { return false; }
  };

  document.body.addEventListener('click', event => {
    const link = event.target.closest('a');
    if (!link || !link.href || !shouldHandle(link.href)) return;
    if (link.target === '_blank' || event.metaKey || event.ctrlKey || event.shiftKey) return;
    event.preventDefault();
    document.body.classList.add('page-transitioning');
    setTimeout(() => location.href = link.href, 420);
  });

  const prefetched = new Set();
  const prefetch = url => {
    if (prefetched.has(url)) return;
    prefetched.add(url);
    fetch(url, { credentials: 'same-origin' }).catch(() => {});
  };

  document.body.addEventListener('mouseover', event => {
    const link = event.target.closest('a');
    if (link?.href && shouldHandle(link.href)) prefetch(link.href);
  }, { passive: true });
})();

/* ── RADAR CHART RENDERER ── */
(function () {
  const radarChart = document.getElementById('compareRadarChart');
  const radarArea = document.getElementById('radarArea');
  if (!radarChart || !radarArea) return;

  const render = (speed = 0.7, sensor = 0.8, comfort = 0.75, wireless = 0.5) => {
    const cx = 140, cy = 140, radius = 100;
    const angles = [0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2];
    const values = [speed, sensor, comfort, wireless];
    const points = values.map((val, i) => {
      const x = cx + Math.cos(angles[i] - Math.PI / 2) * radius * val;
      const y = cy + Math.sin(angles[i] - Math.PI / 2) * radius * val;
      return [x, y];
    });
    const pathData = `M ${points[0][0]} ${points[0][1]} L ${points[1][0]} ${points[1][1]} L ${points[2][0]} ${points[2][1]} L ${points[3][0]} ${points[3][1]} Z`;
    radarArea.setAttribute('d', pathData);
  };

  render(0.72, 0.85, 0.78, 0.55);
  document.getElementById('regenRadarBtn')?.addEventListener('click', () => {
    render(Math.random() * 0.4 + 0.6, Math.random() * 0.3 + 0.7, Math.random() * 0.35 + 0.65, Math.random() * 0.5 + 0.3);
  });
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
