(function () {
  const scenarioList = window.SKA_DATA && window.SKA_DATA.troubleshooting ? window.SKA_DATA.troubleshooting : [];

  function getVisibleScenarios() {
    const search = document.getElementById('troubleshooting-search');
    const scope = document.getElementById('troubleshooting-scope');
    const query = search ? search.value.trim().toLowerCase() : '';
    const scopeValue = scope ? scope.value : '';

    return scenarioList.filter(function (scenario) {
      const haystack = [scenario.title, scenario.scenario, scenario.scope, scenario.firstCheck, scenario.likelyCause, scenario.normalRange, scenario.escalation, ...(scenario.relatedTerms || []), ...(scenario.steps || [])].join(' ').toLowerCase();
      const matchesQuery = !query || haystack.includes(query);
      const matchesScope = !scopeValue || scenario.scope === scopeValue;
      return matchesQuery && matchesScope;
    });
  }

  function renderScopeOptions() {
    const select = document.getElementById('troubleshooting-scope');
    if (!select) return;

    const scopes = Array.from(new Set(scenarioList.map(function (scenario) { return scenario.scope; }))).sort();
    select.innerHTML = '<option value="">対象範囲を選択</option>' + scopes.map(function (scope) {
      return '<option value="' + scope + '">' + scope + '</option>';
    }).join('');
  }

  function renderScenarios() {
    const container = document.getElementById('scenario-list');
    const count = document.getElementById('troubleshooting-result-count');
    if (!container || !count) return;

    const items = getVisibleScenarios();
    count.textContent = items.length + '件';

    if (!items.length) {
      container.innerHTML = '<div class="empty-state">条件に合うトラブルシューティングは見つかりませんでした。別のキーワードや対象範囲を試してください。</div>';
      return;
    }

    container.innerHTML = items.map(function (scenario, index) {
      return '<article class="scenario-card reveal is-visible"><div class="label-row"><span class="badge">シナリオ ' + (index + 1) + '</span></div><h3>' + scenario.title + '</h3><p>' + scenario.scenario + '</p><div class="meta-row"><span class="tag">対象: ' + scenario.scope + '</span></div><ol class="point-list">' + scenario.steps.map(function (step) { return '<li>' + step + '</li>'; }).join('') + '</ol><div class="note">' + scenario.firstCheck + '</div></article>';
    }).join('');
  }

  function bindControls() {
    const search = document.getElementById('troubleshooting-search');
    const scope = document.getElementById('troubleshooting-scope');
    const resetButton = document.getElementById('reset-troubleshooting');

    if (search) {
      let timer = null;
      search.addEventListener('input', function () {
        clearTimeout(timer);
        timer = setTimeout(renderScenarios, 120);
      });
    }

    if (scope) {
      scope.addEventListener('change', renderScenarios);
    }

    if (resetButton) {
      resetButton.addEventListener('click', function () {
        if (search) search.value = '';
        if (scope) scope.value = '';
        renderScenarios();
      });
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    renderScopeOptions();
    bindControls();
    renderScenarios();
  });
})();
