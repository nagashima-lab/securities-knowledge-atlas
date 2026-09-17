(function () {
  const glossaryList = window.SKA_DATA && window.SKA_DATA.glossary ? window.SKA_DATA.glossary : [];

  function renderFilters() {
    const categoryFilter = document.getElementById('glossary-category');
    if (!categoryFilter) return;
    const categories = Array.from(new Set(glossaryList.map(function (item) { return item.category; }))).sort();
    categoryFilter.innerHTML = '<option value="">カテゴリーを選択</option>' + categories.map(function (category) {
      return '<option value="' + category + '">' + category + '</option>';
    }).join('');
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function getVisibleItems() {
    const search = document.getElementById('glossary-search');
    const category = document.getElementById('glossary-category');
    const kana = document.getElementById('glossary-kana');
    const query = search ? search.value.trim().toLowerCase() : '';
    const categoryValue = category ? category.value : '';
    const kanaValue = kana ? kana.value : '';

    return glossaryList.filter(function (item) {
      const haystack = [item.term, item.reading, item.english, item.shortDefinition, item.description, item.commonConfusion, item.relatedTerms.join(' ')].join(' ').toLowerCase();
      const matchesQuery = !query || haystack.includes(query);
      const matchesCategory = !categoryValue || item.category === categoryValue;
      const matchesKana = !kanaValue || item.term.startsWith(kanaValue) || item.reading.startsWith(kanaValue);
      return matchesQuery && matchesCategory && matchesKana;
    });
  }

  function renderGlossary() {
    const list = document.getElementById('glossary-list');
    const count = document.getElementById('glossary-result-count');
    if (!list || !count) return;

    const items = getVisibleItems();
    count.textContent = items.length + '件';

    if (!items.length) {
      list.innerHTML = '<div class="empty-state">条件に合う用語がありません。別のキーワードや絞り込みを試してください。</div>';
      return;
    }

    list.innerHTML = items.map(function (item) {
      return '<article class="term-card reveal is-visible"><div class="meta-row"><span class="badge">' + escapeHtml(item.category) + '</span></div><h3>' + escapeHtml(item.term) + '</h3><p class="lead">' + escapeHtml(item.shortDefinition) + '</p><div class="meta-row"><span class="tag">読み：' + escapeHtml(item.reading) + '</span><span class="tag">英：' + escapeHtml(item.english) + '</span></div><button type="button" class="secondary-button" data-open-term="' + escapeHtml(item.id) + '">詳細を見る</button></article>';
    }).join('');

    list.querySelectorAll('[data-open-term]').forEach(function (button) {
      button.addEventListener('click', function () {
        const term = glossaryList.find(function (entry) { return entry.id === button.getAttribute('data-open-term'); });
        if (term) openTermDetail(term);
      });
    });
  }

  function openTermDetail(term) {
    const modal = document.getElementById('glossary-modal');
    const panel = document.getElementById('glossary-detail');
    const closeButton = document.querySelector('[data-close-glossary]');
    if (!modal || !panel || !closeButton) return;

    panel.innerHTML = '<h3>' + term.term + '</h3>' +
      '<p class="lead">' + term.shortDefinition + '</p>' +
      '<div class="meta-row"><span class="tag">読み：' + term.reading + '</span><span class="tag">英：' + term.english + '</span></div>' +
      '<p>' + term.description + '</p>' +
      '<div><strong>業務の位置</strong><p>' + term.flowPosition + '</p></div>' +
      '<div><strong>よくある混同</strong><p>' + term.commonConfusion + '</p></div>' +
      '<div><strong>関連用語</strong><p>' + term.relatedTerms.join(' / ') + '</p></div>';

    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    closeButton.focus();

    const close = function () {
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');
    };

    closeButton.onclick = close;
    modal.onclick = function (event) {
      if (event.target === modal) close();
    };

    document.addEventListener('keydown', function handler(event) {
      if (event.key === 'Escape') {
        close();
        document.removeEventListener('keydown', handler);
      }
    });
  }

  function bindControls() {
    const search = document.getElementById('glossary-search');
    const category = document.getElementById('glossary-category');
    const kana = document.getElementById('glossary-kana');
    const resetButton = document.getElementById('reset-glossary');

    if (search) {
      let timer = null;
      search.addEventListener('input', function () {
        clearTimeout(timer);
        timer = setTimeout(renderGlossary, 120);
      });
    }

    [category, kana].forEach(function (element) {
      if (element) {
        element.addEventListener('change', renderGlossary);
      }
    });

    if (resetButton) {
      resetButton.addEventListener('click', function () {
        if (search) search.value = '';
        if (category) category.value = '';
        if (kana) kana.value = '';
        renderGlossary();
      });
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    renderFilters();
    bindControls();
    renderGlossary();
  });
})();
