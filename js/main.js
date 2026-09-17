(function () {
  const storage = window.SKA && window.SKA.storage ? window.SKA.storage : null;
  const pageName = document.body.dataset.page || 'index';

  function updateNavCurrent() {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(function (link) {
      const page = link.getAttribute('data-page');
      const isCurrent = page === pageName;
      link.setAttribute('aria-current', isCurrent ? 'page' : 'false');
      if (isCurrent) {
        link.setAttribute('data-current', 'true');
      }
    });
  }

  function updateHeaderShadow() {
    const header = document.querySelector('.site-header');
    if (!header) return;
    if (window.scrollY > 8) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
  }

  function setupMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('.main-nav');
    if (!menuToggle || !nav) return;

    function closeMenu() {
      nav.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('menu-open');
      if (menuToggle.dataset.restoreFocus) {
        menuToggle.focus();
        delete menuToggle.dataset.restoreFocus;
      }
    }

    menuToggle.addEventListener('click', function () {
      const willOpen = !nav.classList.contains('open');
      nav.classList.toggle('open', willOpen);
      menuToggle.setAttribute('aria-expanded', String(willOpen));
      document.body.classList.toggle('menu-open', willOpen);
      if (willOpen) {
        menuToggle.dataset.restoreFocus = 'true';
      } else {
        delete menuToggle.dataset.restoreFocus;
      }
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && nav.classList.contains('open')) {
        closeMenu();
      }
    });

    nav.querySelectorAll('.nav-link').forEach(function (link) {
      link.addEventListener('click', function () {
        if (window.innerWidth <= 860) {
          closeMenu();
        }
      });
    });
  }

  function setupRevealAnimations() {
    const revealItems = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window)) {
      revealItems.forEach(function (item) {
        item.classList.add('is-visible');
      });
      return;
    }

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    revealItems.forEach(function (item) {
      observer.observe(item);
    });
  }

  function setupAccordions() {
    document.querySelectorAll('.accordion-item').forEach(function (item) {
      const button = item.querySelector('.accordion-trigger');
      const panel = item.querySelector('.accordion-panel');
      if (!button || !panel) return;
      button.setAttribute('aria-expanded', item.classList.contains('open') ? 'true' : 'false');
      button.setAttribute('aria-controls', panel.id || '');
      button.addEventListener('click', function () {
        const isOpen = item.classList.contains('open');
        item.classList.toggle('open', !isOpen);
        button.setAttribute('aria-expanded', String(!isOpen));
      });
    });
  }

  function setupQuickSearch() {
    const forms = document.querySelectorAll('[data-site-search-form]');
    if (!forms.length) return;

    forms.forEach(function (form) {
      const input = form.querySelector('[data-site-search-input]');
      if (!input) return;

      form.addEventListener('submit', function (event) {
        event.preventDefault();
        const value = input.value.trim();
        if (!value) return;
        window.location.href = 'knowledge.html?q=' + encodeURIComponent(value);
      });

      input.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
          event.preventDefault();
          const value = input.value.trim();
          if (!value) return;
          window.location.href = 'knowledge.html?q=' + encodeURIComponent(value);
        }
      });
    });
  }

  function renderRecentKnowledge() {
    const container = document.querySelector('[data-recent-items]');
    if (!container || !storage) return;

    const items = storage.readJson(storage.keys.recentItems, []);
    if (!Array.isArray(items) || items.length === 0) {
      container.parentElement?.classList.add('hidden');
      return;
    }

    container.innerHTML = '';
    items.slice(0, 5).forEach(function (item) {
      const link = document.createElement('a');
      link.href = item.url || 'knowledge.html';
      link.className = 'tiny-card';
      link.innerHTML = '<div class="label-row"><span class="badge">' + (item.category || 'ナレッジ') + '</span></div><strong>' + (item.title || '最近見た項目') + '</strong>';
      container.appendChild(link);
    });
  }

  function clearRecentHistory() {
    const button = document.querySelector('[data-clear-recent]');
    if (!button || !storage) return;
    button.addEventListener('click', function () {
      storage.writeJson(storage.keys.recentItems, []);
      const container = document.querySelector('[data-recent-items]');
      if (container) {
        container.innerHTML = '';
      }
      const wrapper = document.querySelector('[data-recent-section]');
      if (wrapper) {
        wrapper.remove();
      }
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    updateNavCurrent();
    updateHeaderShadow();
    window.addEventListener('scroll', updateHeaderShadow);
    setupMenu();
    setupQuickSearch();
    setupRevealAnimations();
    setupAccordions();
    renderRecentKnowledge();
    clearRecentHistory();

  });
})();
