(function () {
  const storage = window.SKA && window.SKA.storage ? window.SKA.storage : null;
  const flowSteps = [
    {
      id: 'step-001',
      name: '口座・顧客管理',
      short: '顧客の基本情報と取引前提を整える',
      summary: '口座情報や顧客情報を整え、注文や残高の前提を揃える工程です。',
      overview: '顧客と口座の情報管理は、取引の許可や残高の前提に直結します。初期情報が不明だと、後続の注文や照合の誤りにつながりやすくなります。',
      inputs: ['顧客情報', '口座情報', '取引条件の前提'],
      actions: ['登録情報の整合確認', '権限確認', '更新の管理'],
      outputs: ['口座状態', '顧客情報の最新状態', '取引前提'],
      previous: '開始',
      next: '注文受付',
      roles: ['フロントオフィス', '顧客対応', '運用担当'],
      checks: ['口座情報の整合', '権限と条件の確認', '対象顧客の特定'],
      exceptions: ['情報未整備', '更新漏れ', '権限不一致'],
      relatedTerms: ['口座', '顧客管理', '権限'],
      relatedKnowledge: ['KB-CUSTOMER-001']
    },
    {
      id: 'step-002',
      name: '注文受付',
      short: '顧客の売買希望を受け取り、必要情報を整理する',
      summary: '注文の条件を確認し、発注前の状態として受け付けます。',
      overview: '注文受付では、銘柄、数量、価格条件、口座情報の整合を確認し、後続の発注へ正しく引き渡します。',
      inputs: ['売買指示', '数量', '価格条件', '顧客情報'],
      actions: ['受領と確認', '条件の検証', '発注準備'],
      outputs: ['注文情報', '受付状態', '発注候補'],
      previous: '口座・顧客管理',
      next: '市場への発注',
      roles: ['フロントオフィス', '営業担当'],
      checks: ['銘柄と数量', '顧客条件', '価格条件の妥当性'],
      exceptions: ['入力不足', '条件不一致', '取消や訂正'],
      relatedTerms: ['注文', '発注', '取消'],
      relatedKnowledge: ['KB-TRD-002', 'KB-TRD-004']
    },
    {
      id: 'step-003',
      name: '市場への発注',
      short: '受付済みの注文を市場に送る処理',
      summary: '注文情報を市場の取引処理へ引き渡し、成立可能性を待ちます。',
      overview: '市場への発注は、取引条件がルールに沿っているかを確認したうえで、執行の対象として送られます。',
      inputs: ['受付済み注文', '執行条件'],
      actions: ['送信', '執行可能性確認', '状態更新'],
      outputs: ['送信記録', '市場への受理情報', '進行状態'],
      previous: '注文受付',
      next: '約定',
      roles: ['トレーディング', '運用担当'],
      checks: ['市場条件', '執行可能性', '送信状態'],
      exceptions: ['送信失敗', '市場条件不一致', '再送信'],
      relatedTerms: ['発注', '注文', '約定'],
      relatedKnowledge: ['KB-TRD-002', 'KB-TRD-017']
    },
    {
      id: 'step-004',
      name: '約定',
      short: '市場で取引が成立した事実を確認する',
      summary: '発注された注文が市場で成立し、約定情報が生成されます。',
      overview: '約定では、売買が成立した事実とその条件が確定します。数量、価格、日時が記録され、後続の照合や決済の基礎情報になります。',
      inputs: ['市場の成立情報', '注文情報'],
      actions: ['約定情報の取得', '記録', '状態更新'],
      outputs: ['約定情報', '約定日', '約定金額・数量'],
      previous: '市場への発注',
      next: '約定照合',
      roles: ['ミドルオフィス', '取引確認担当'],
      checks: ['数量と価格', '成立時刻', '取引の整合'],
      exceptions: ['未成立', '価格差異', '取消影響'],
      relatedTerms: ['約定', '約定日', '出来'],
      relatedKnowledge: ['KB-TRD-003', 'KB-TRD-004']
    },
    {
      id: 'step-005',
      name: '約定照合',
      short: '注文と約定の差異を確認して整合させる',
      summary: '注文情報と約定情報の差異を見つけ、例外対応の入口を作ります。',
      overview: '約定照合では、売買対象、数量、価格、日時などの差異を確認し、未整合の状態があれば次工程の前提を修正します。',
      inputs: ['注文情報', '約定情報', '例外判定'],
      actions: ['差異確認', '再照合', '例外切り分け'],
      outputs: ['照合結果', '差異情報', '例外情報'],
      previous: '約定',
      next: '清算',
      roles: ['ミドルオフィス', '例外対応'],
      checks: ['数量差異', '価格差異', '対象の一致'],
      exceptions: ['フェイル', '差異', '未処理'],
      relatedTerms: ['約定照合', 'フェイル', '例外処理'],
      relatedKnowledge: ['KB-TRD-006', 'KB-EXCEPT-001']
    },
    {
      id: 'step-006',
      name: '清算',
      short: '約定結果を整理して計算上の整合をとる',
      summary: '取引ごとの数量や金額、債務関係を整理して決済前提を整えます。',
      overview: '清算は、約定済みの取引を管理しやすい形に整理する作業です。特に金額や数量の整合性と、後続の決済前提を揃えるための鍵となります。',
      inputs: ['照合済み約定情報', '取引データ'],
      actions: ['金額整理', '数量整理', '相殺整理'],
      outputs: ['清算結果', '決済対象', '残高変動前提'],
      previous: '約定照合',
      next: '決済',
      roles: ['バックオフィス', '精算担当'],
      checks: ['数量と金額の整合', '残高影響', '相殺対象'],
      exceptions: ['未処理', '差異', 'データミス'],
      relatedTerms: ['清算', 'ネッティング', '決済'],
      relatedKnowledge: ['KB-SETTLE-001', 'KB-SETTLE-003']
    },
    {
      id: 'step-007',
      name: '決済',
      short: '資金や証券の移動・反映を進める',
      summary: '清算後の処理をもとに、資産や資金の移動と反映を進めます。',
      overview: '決済は、資金や証券が実際に移動し、残高や保管状態に反映される工程です。決済の状態が未了だと、顧客に見える残高や保有状態に影響しやすくなります。',
      inputs: ['清算結果', '決済予定'],
      actions: ['資金・証券の反映', '状態更新', '完了確認'],
      outputs: ['決済完了情報', '残高変動', '受渡予定'],
      previous: '清算',
      next: '残高・保管',
      roles: ['バックオフィス', '決済担当'],
      checks: ['受渡予定', '資金と証券の対応', '完了状態'],
      exceptions: ['決済未了', '差異', '例外処理'],
      relatedTerms: ['決済', '受渡日', '残高'],
      relatedKnowledge: ['KB-SETTLE-002', 'KB-BAL-002']
    },
    {
      id: 'step-008',
      name: '残高・保管',
      short: '更新された保有状態を保持し、状態を可視化する',
      summary: '決済後の残高や保管状態を集約し、必要な状態管理と報告の基準を整えます。',
      overview: '残高・保管では、顧客の保有や余力、評価額などの状態を確認し、以後の報告や例外対応に使う情報を整えます。',
      inputs: ['決済結果', '保管データ', '残高'],
      actions: ['反映確認', '保管状態の更新', '差異確認'],
      outputs: ['残高情報', '保管状態', '報告基準'],
      previous: '決済',
      next: '顧客報告・帳票',
      roles: ['カストディ', '運用担当'],
      checks: ['残高整合', '保管状態', '例外有無'],
      exceptions: ['残高不一致', '未反映', '保管差異'],
      relatedTerms: ['残高', '建玉', 'カストディ'],
      relatedKnowledge: ['KB-BAL-001', 'KB-BAL-003']
    },
    {
      id: 'step-009',
      name: '顧客報告・帳票',
      short: '最終状態を顧客や社内に伝える',
      summary: '残高や取引状態を、帳票や報告として顧客や社内の利用者へ提供します。',
      overview: '顧客報告・帳票では、取引や残高の最終状態を対象者へ分かりやすく伝える工程です。必要に応じて再確認や問い合わせの入口となります。',
      inputs: ['残高情報', '取引結果', '帳票項目'],
      actions: ['集計', '報告書作成', '確認'],
      outputs: ['報告書', '帳票', '確認データ'],
      previous: '残高・保管',
      next: '完了',
      roles: ['顧客対応', 'バックオフィス'],
      checks: ['正確性', '内容の説明性', '利用者への伝達'],
      exceptions: ['情報不足', '問い合わせ', '修正対応'],
      relatedTerms: ['帳票', '残高', '報告'],
      relatedKnowledge: ['KB-BAL-004', 'KB-EXCEPT-003']
    }
  ];

  const relatedFields = [
    '商品管理',
    '時価・価格情報',
    'コーポレートアクション',
    '税務・会計',
    'リスク管理',
    'コンプライアンス',
    '障害・例外処理',
    '顧客・当局向け報告'
  ];

  function renderFlowMap() {
    const map = document.getElementById('flow-map');
    if (!map) return;
    map.innerHTML = flowSteps.map(function (step, index) {
      const button = '<button type="button" class="flow-step-button" data-step-id="' + step.id + '" aria-label="' + step.name + 'の詳細を表示"><span class="step-number">' + (index + 1) + '</span><span>' + step.name + '</span></button>';
      return '<div class="flow-step" data-step-card="' + step.id + '">' + button + '</div>';
    }).join('');

    map.querySelectorAll('.flow-step-button').forEach(function (button) {
      button.addEventListener('click', function () {
        openFlowDetail(button.getAttribute('data-step-id'));
      });
    });
  }

  function renderRelatedFields() {
    const container = document.getElementById('related-fields');
    if (!container) return;
    container.innerHTML = relatedFields.map(function (field) {
      return '<article class="card"><div class="card-link"><div class="card-icon">◆</div><h3>' + field + '</h3><p>業務全体と接続する周辺領域として確認するための視点です。</p></div></article>';
    }).join('');
  }

  function getStepDetail(stepId) {
    return flowSteps.find(function (step) {
      return step.id === stepId;
    });
  }

  function openFlowDetail(stepId) {
    const step = getStepDetail(stepId);
    const modal = document.getElementById('flow-modal');
    const panel = document.getElementById('flow-panel');
    const closeButton = document.querySelector('[data-close-flow]');
    if (!step || !modal || !panel || !closeButton) return;

    const mode = storage ? storage.readString(storage.keys.viewMode, 'beginner') : 'beginner';
    const isExpert = mode === 'expert';

    let content = '<h3>' + step.name + '</h3>';
    content += '<p class="note">' + step.summary + '</p>';
    content += '<div class="summary-block">';
    content += '<div><strong>一言での説明</strong><p>' + step.short + '</p></div>';
    if (isExpert) {
      content += '<div><strong>主な入力情報</strong><ul class="meta-list"><li>' + step.inputs.join('</li><li>') + '</li></ul></div>';
      content += '<div><strong>主な処理</strong><ul class="meta-list"><li>' + step.actions.join('</li><li>') + '</li></ul></div>';
      content += '<div><strong>主な出力情報</strong><ul class="meta-list"><li>' + step.outputs.join('</li><li>') + '</li></ul></div>';
      content += '<div><strong>確認ポイント</strong><ul class="meta-list"><li>' + step.checks.join('</li><li>') + '</li></ul></div>';
      content += '<div><strong>例外時の確認事項</strong><ul class="meta-list"><li>' + step.exceptions.join('</li><li>') + '</li></ul></div>';
    } else {
      content += '<div><strong>概要</strong><p>' + step.overview + '</p></div>';
      content += '<div><strong>前工程</strong><p>' + step.previous + '</p></div>';
      content += '<div><strong>後工程</strong><p>' + step.next + '</p></div>';
      content += '<div><strong>関連用語</strong><p>' + step.relatedTerms.join(' / ') + '</p></div>';
    }
    content += '<div><strong>関連役割</strong><p>' + step.roles.join(' / ') + '</p></div>';
    content += '<div><strong>関連ナレッジ</strong><p>' + step.relatedKnowledge.map(function (id) { return '<a href="knowledge.html">' + id + '</a>'; }).join(' / ') + '</p></div>';
    content += '</div>';

    panel.innerHTML = content;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    closeButton.focus();

    const close = function () {
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');
      const trigger = document.querySelector('[data-step-id="' + stepId + '"]');
      if (trigger) trigger.focus();
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

  function setupViewMode() {
    const buttons = document.querySelectorAll('[data-view-mode]');
    if (!buttons.length) return;

    function apply(mode) {
      buttons.forEach(function (button) {
        const active = button.getAttribute('data-view-mode') === mode;
        button.classList.toggle('is-selected', active);
        button.setAttribute('aria-pressed', active ? 'true' : 'false');
      });
      if (storage) {
        storage.writeString(storage.keys.viewMode, mode);
      }
    }

    const storedMode = storage ? storage.readString(storage.keys.viewMode, 'beginner') : 'beginner';
    apply(storedMode);

    buttons.forEach(function (button) {
      button.addEventListener('click', function () {
        apply(button.getAttribute('data-view-mode'));
      });
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    renderFlowMap();
    renderRelatedFields();
    setupViewMode();
  });
})();
