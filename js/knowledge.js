(function () {
  const storage = window.SKA && window.SKA.storage ? window.SKA.storage : null;
  const knowledgeList = window.SKA_DATA && window.SKA_DATA.knowledge ? window.SKA_DATA.knowledge : [];

  function uniqueArray(items) {
    return Array.from(new Set(items.filter(Boolean)));
  }

  function getBookmarks() {
    if (!storage) return [];
    const value = storage.readJson(storage.keys.bookmarks, []);
    return Array.isArray(value) ? value : [];
  }

  function saveBookmarks(items) {
    if (storage) {
      storage.writeJson(storage.keys.bookmarks, items);
    }
  }

  function setRecentItem(item) {
    if (!storage || !item) return;
    const current = storage.readJson(storage.keys.recentItems, []);
    const next = [
      { id: item.id, title: item.title, category: item.category, url: 'knowledge.html#' + item.id },
      ...current.filter(function (entry) { return entry.id !== item.id; })
    ].slice(0, 5);
    storage.writeJson(storage.keys.recentItems, next);
  }

  function getCurrentFilters() {
    return {
      query: document.getElementById('knowledge-search') ? document.getElementById('knowledge-search').value.trim().toLowerCase() : '',
      category: document.getElementById('category-filter') ? document.getElementById('category-filter').value : '',
      difficulty: document.getElementById('difficulty-filter') ? document.getElementById('difficulty-filter').value : '',
      audience: document.getElementById('audience-filter') ? document.getElementById('audience-filter').value : '',
      type: document.getElementById('type-filter') ? document.getElementById('type-filter').value : '',
      sort: document.getElementById('sort-order') ? document.getElementById('sort-order').value : 'title',
      onlyBookmarks: document.getElementById('bookmark-toggle') ? document.getElementById('bookmark-toggle').dataset.active === 'true' : false
    };
  }

  function renderFilterOptions() {
    const categoryFilter = document.getElementById('category-filter');
    const audienceFilter = document.getElementById('audience-filter');
    const typeFilter = document.getElementById('type-filter');
    if (!categoryFilter || !audienceFilter || !typeFilter) return;

    const categories = uniqueArray(knowledgeList.map(function (item) { return item.category; }));
    const audiences = uniqueArray(knowledgeList.flatMap(function (item) { return item.audience || []; }));
    const types = uniqueArray(knowledgeList.map(function (item) { return item.contentType; }));

    categoryFilter.innerHTML = '<option value="">業務領域を選択</option>' + categories.map(function (value) {
      return '<option value="' + value + '">' + value + '</option>';
    }).join('');

    audienceFilter.innerHTML = '<option value="">対象者を選択</option>' + audiences.map(function (value) {
      return '<option value="' + value + '">' + value + '</option>';
    }).join('');

    typeFilter.innerHTML = '<option value="">コンテンツ種別を選択</option>' + types.map(function (value) {
      return '<option value="' + value + '">' + value + '</option>';
    }).join('');
  }

  function matchesQuery(item, query) {
    if (!query) return true;
    const haystack = [item.title, item.summary, item.body, ...(item.relatedTerms || [])].join(' ').toLowerCase();
    return haystack.includes(query);
  }

  function filteredKnowledge() {
    const filters = getCurrentFilters();
    const bookmarks = getBookmarks();

    let items = knowledgeList.filter(function (item) {
      return matchesQuery(item, filters.query)
        && (!filters.category || item.category === filters.category)
        && (!filters.difficulty || item.difficulty === filters.difficulty)
        && (!filters.audience || (item.audience || []).includes(filters.audience))
        && (!filters.type || item.contentType === filters.type)
        && (!filters.onlyBookmarks || bookmarks.includes(item.id));
    });

    items = items.sort(function (a, b) {
      if (filters.sort === 'readingTime') return a.readingTime - b.readingTime;
      if (filters.sort === 'category') return a.category.localeCompare(b.category) || a.title.localeCompare(b.title);
      return a.title.localeCompare(b.title);
    });

    return items;
  }

  function renderKnowledgeList() {
    const list = document.getElementById('knowledge-list');
    const count = document.getElementById('knowledge-result-count');
    if (!list || !count) return;

    const items = filteredKnowledge();
    count.textContent = items.length + '件';

    if (!items.length) {
      list.innerHTML = '<div class="empty-state">条件に合うナレッジが見つかりませんでした。別のキーワードや条件を試してください。</div>';
      return;
    }

    const bookmarks = getBookmarks();
    list.innerHTML = items.map(function (item) {
      const isBookmarked = bookmarks.includes(item.id);
      return '<article class="knowledge-card reveal is-visible" data-item-id="' + item.id + '">' +
        '<div class="meta-row"><span class="badge">' + item.id + '</span><span class="badge">' + item.category + '</span></div>' +
        '<h3>' + item.title + '</h3>' +
        '<div class="meta-row"><span class="badge">' + item.difficulty + '</span><span class="badge">' + item.product + '</span><span class="badge">' + item.contentType + '</span></div>' +
        '<p class="lead">' + item.summary + '</p>' +
        '<div class="meta-row"><span class="tag">読了' + item.readingTime + '分</span><span class="tag">' + item.status + '</span><span class="tag">確認日 ' + item.reviewedDate + '</span></div>' +
        '<div class="label-row"><button type="button" class="secondary-button" data-open-knowledge="' + item.id + '">詳細を表示</button><button type="button" class="ghost-button" data-bookmark-knowledge="' + item.id + '" aria-pressed="' + (isBookmarked ? 'true' : 'false') + '">' + (isBookmarked ? '★ ブックマーク済み' : '☆ ブックマーク') + '</button></div>' +
        '</article>';
    }).join('');

    list.querySelectorAll('[data-open-knowledge]').forEach(function (button) {
      button.addEventListener('click', function () {
        const item = knowledgeList.find(function (entry) { return entry.id === button.getAttribute('data-open-knowledge'); });
        if (item) openKnowledgeDetail(item);
      });
    });

    list.querySelectorAll('[data-bookmark-knowledge]').forEach(function (button) {
      button.addEventListener('click', function () {
        toggleBookmark(button.getAttribute('data-bookmark-knowledge'));
      });
    });
  }

  function toggleBookmark(id) {
    const bookmarks = getBookmarks();
    const next = bookmarks.includes(id) ? bookmarks.filter(function (item) { return item !== id; }) : uniqueArray([id].concat(bookmarks));
    saveBookmarks(next);
    renderKnowledgeList();
  }

  function openKnowledgeDetail(item) {
    const modal = document.getElementById('knowledge-modal');
    const panel = document.getElementById('knowledge-detail');
    const closeButton = document.querySelector('[data-close-knowledge]');
    if (!modal || !panel || !closeButton) return;

    const knowledge = knowledgeList.find(function (entry) { return entry.id === item.id; });
    if (!knowledge) return;

    setRecentItem(knowledge);
    panel.innerHTML = '<h3>' + knowledge.title + '</h3>' +
      '<div class="meta-row"><span class="badge">' + knowledge.id + '</span><span class="badge">' + knowledge.category + '</span><span class="badge">' + knowledge.product + '</span></div>' +
      '<ul class="meta-list"><li>' + knowledge.keyPoints.join('</li><li>') + '</li></ul>' +
      '<p>' + knowledge.body + '</p>' +
      '<div><strong>確認ポイント</strong><p>' + (knowledge.summary || '') + '</p></div>' +
      '<div><strong>関連用語</strong><p>' + (knowledge.relatedTerms || []).join(' / ') + '</p></div>' +
      '<div><strong>関連ナレッジ</strong><p>' + (knowledge.relatedKnowledgeIds || []).join(' / ') + '</p></div>' +
      '<p class="note">この情報はデモサイト向けのサンプル情報です。実務利用前に内容と最新性を確認してください。</p>';

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
    const search = document.getElementById('knowledge-search');
    const resetButton = document.getElementById('reset-filters');
    const bookmarkToggle = document.getElementById('bookmark-toggle');
    const sortOrder = document.getElementById('sort-order');
    const categoryFilter = document.getElementById('category-filter');
    const difficultyFilter = document.getElementById('difficulty-filter');
    const audienceFilter = document.getElementById('audience-filter');
    const typeFilter = document.getElementById('type-filter');

    const params = new URLSearchParams(window.location.search);
    const initialQuery = params.get('q') || '';
    if (search && initialQuery) {
      search.value = initialQuery;
    }

    if (search) {
      let timer = null;
      search.addEventListener('input', function () {
        clearTimeout(timer);
        timer = setTimeout(renderKnowledgeList, 120);
      });
    }

    [categoryFilter, difficultyFilter, audienceFilter, typeFilter, sortOrder].forEach(function (element) {
      if (element) {
        element.addEventListener('change', renderKnowledgeList);
      }
    });

    if (resetButton) {
      resetButton.addEventListener('click', function () {
        if (search) search.value = '';
        if (categoryFilter) categoryFilter.value = '';
        if (difficultyFilter) difficultyFilter.value = '';
        if (audienceFilter) audienceFilter.value = '';
        if (typeFilter) typeFilter.value = '';
        if (sortOrder) sortOrder.value = 'title';
        if (bookmarkToggle) {
          bookmarkToggle.dataset.active = 'false';
          bookmarkToggle.textContent = 'ブックマークのみ表示';
        }
        renderKnowledgeList();
      });
    }

    if (bookmarkToggle) {
      bookmarkToggle.addEventListener('click', function () {
        const active = bookmarkToggle.dataset.active === 'true';
        bookmarkToggle.dataset.active = String(!active);
        bookmarkToggle.textContent = !active ? 'ブックマークのみ表示中' : 'ブックマークのみ表示';
        renderKnowledgeList();
      });
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    renderFilterOptions();
    bindControls();
    renderKnowledgeList();
  });
})();
