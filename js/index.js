(function () {
  const highlightItems = [
    { title: '証券取引の全体像', url: 'knowledge.html', category: '注文・約定' },
    { title: '注文とは', url: 'knowledge.html', category: '注文・約定' },
    { title: '約定とは', url: 'knowledge.html', category: '注文・約定' },
    { title: '注文と約定の違い', url: 'knowledge.html', category: '注文・約定' },
    { title: '清算と決済の違い', url: 'knowledge.html', category: '清算・決済' },
    { title: '残高不一致時の確認ポイント', url: 'knowledge.html', category: '残高・保管' }
  ];

  function renderHighlights() {
    const container = document.querySelector('[data-knowledge-highlights]');
    if (!container) return;

    container.innerHTML = highlightItems.map(function (item) {
      return '<article class="card reveal"><a href="' + item.url + '" class="card-link"><div class="card-icon">●</div><div class="label-row"><span class="badge">' + item.category + '</span></div><h3>' + item.title + '</h3><span class="list-link">詳細を見る</span></a></article>';
    }).join('');
  }

  function setupGlobalSearch() {
    const input = document.getElementById('global-search');
    const suggestions = document.getElementById('search-suggestions');
    const list = document.getElementById('suggestion-list');
    const trigger = document.querySelector('[data-search-trigger]');
    if (!input || !suggestions || !list || !trigger) return;

    const items = [
      { type: 'ナレッジ', title: '約定とは', description: '約定の概念と確認ポイント', page: 'knowledge.html', keyword: '約定' },
      { type: '用語', title: '決済', description: '資金や証券の移動・反映', page: 'glossary.html#TERM-009', keyword: '決済' },
      { type: 'トラブル', title: '残高不一致時の確認ポイント', description: '差異の切り分けポイント', page: 'troubleshooting.html', keyword: '残高不一致' },
      { type: 'ナレッジ', title: '清算と決済の違い', description: '工程の違いを比較', page: 'knowledge.html', keyword: '清算' },
      { type: '用語', title: '受渡日', description: '資産の移動予定日', page: 'glossary.html#TERM-006', keyword: '受渡日' },
      { type: 'トラブル', title: '注文と約定の違いが分からない', description: '状態確認の入口', page: 'troubleshooting.html', keyword: '注文と約定' }
    ];

    function navigateToSearchResults(value) {
      const trimmed = value.trim();
      if (!trimmed) {
        suggestions.classList.add('visible');
        return;
      }
      window.location.href = 'knowledge.html?q=' + encodeURIComponent(trimmed);
    }

    function updateSuggestions() {
      const value = input.value.trim();
      const filtered = items.filter(function (item) {
        if (!value) return true;
        const text = (item.title + ' ' + item.description + ' ' + item.keyword).toLowerCase();
        return text.includes(value.toLowerCase());
      }).slice(0, 6);

      list.innerHTML = filtered.map(function (item) {
        return '<li class="suggestion-item"><a href="' + item.page + '" style="display:inline-flex;align-items:center;gap:0.5rem;"><span class="badge">' + item.type + '</span><span>' + item.title + '</span></a></li>';
      }).join('');

      suggestions.classList.toggle('visible', filtered.length > 0);
    }

    input.addEventListener('input', updateSuggestions);
    input.addEventListener('keydown', function (event) {
      if (event.key === 'Enter') {
        event.preventDefault();
        navigateToSearchResults(input.value);
      }
    });
    trigger.addEventListener('click', function () {
      navigateToSearchResults(input.value);
    });

    document.querySelectorAll('.flow-link').forEach(function (button) {
      button.addEventListener('click', function () {
        const target = button.getAttribute('data-flow-target');
        if (target) {
          window.location.href = target;
        }
      });
    });

    updateSuggestions();
  }

  document.addEventListener('DOMContentLoaded', function () {
    renderHighlights();
    setupGlobalSearch();
  });
})();
