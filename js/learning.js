(function () {
  const storage = window.SKA && window.SKA.storage ? window.SKA.storage : null;
  const steps = [
    {
      id: 'step-01',
      title: '証券取引の登場人物',
      goal: '顧客、取引、業務担当の関係を理解する',
      summary: '証券取引では、顧客の意思、価格情報、担当領域が組み合わさって取引が成立します。各人物や役割の位置を理解すると、業務のつながりが見えやすくなります。',
      terms: ['顧客', '注文', '約定', '担当領域'],
      points: ['市場と顧客の役割を分ける', '業務の入口と出口を知る', '問い合わせがどこから始まるかを整理する'],
      relatedKnowledgeIds: ['KB-TRD-001', 'KB-CUSTOMER-001']
    },
    {
      id: 'step-02',
      title: '商品と市場',
      goal: '株式や市場の前提を理解する',
      summary: '証券業務は、対象の銘柄や市場条件が前提になります。取引対象が何か、どこで成立するのかを理解しておくと、後続の処理の意味が分かりやすくなります。',
      terms: ['銘柄', '市場', '取引条件'],
      points: ['取引対象の基本を知る', '市場の条件と取引結果をつなぐ', '株式に対する一般的な前提を理解する'],
      relatedKnowledgeIds: ['KB-TRD-001', 'KB-CO-001']
    },
    {
      id: 'step-03',
      title: '注文とは',
      goal: '顧客の意思がどう処理されるか理解する',
      summary: '注文は、顧客が売買を希望する意思を示す入口です。数量や価格条件、対象口座などが含まれ、発注に進む前の基準になります。',
      terms: ['注文', '発注', '数量', '価格条件'],
      points: ['注文は依頼そのもの', '条件の確認が重要', '発注と注文を区別する'],
      relatedKnowledgeIds: ['KB-TRD-002', 'KB-TRD-004']
    },
    {
      id: 'step-04',
      title: '約定とは',
      goal: '成立した取引の事実を理解する',
      summary: '注文が市場で成立すると約定が発生し、数量や価格、日時が記録されます。ここから後続の照合や決済が始まるため、取引の実体を把握する重要な地点です。',
      terms: ['約定', '出来', '約定日'],
      points: ['約定は成立の事実', '取引の実体として記録される', '後続工程の入力になる'],
      relatedKnowledgeIds: ['KB-TRD-003', 'KB-TRD-005']
    },
    {
      id: 'step-05',
      title: '約定照合',
      goal: '注文と約定の差異を見つける',
      summary: '約定照合では、注文情報と市場の成立情報を比較してズレがないかを確認します。差異があれば例外対応や再確認に進むため、業務の安定性を支える工程です。',
      terms: ['約定照合', '差異', '例外処理'],
      points: ['差異がどこにあるかを見つける', '実務では確認が重要', '例外の入口になる'],
      relatedKnowledgeIds: ['KB-TRD-006', 'KB-EXCEPT-001']
    },
    {
      id: 'step-06',
      title: '清算と決済',
      goal: '取引の整理と実際の反映を区別する',
      summary: '清算は整理と整合、決済は反映と実際の処理に近い役割です。両者の違いを理解すると、残高不一致や処理未了の切り分けがしやすくなります。',
      terms: ['清算', '決済', '受渡日'],
      points: ['清算は整理', '決済は移動・反映', '残高とつながる'],
      relatedKnowledgeIds: ['KB-SETTLE-001', 'KB-SETTLE-003']
    },
    {
      id: 'step-07',
      title: '残高と保管',
      goal: '保有状況と保管状態を対応づける',
      summary: '残高は現在の保有状況や余力を示し、保管はその状態がどのように保持されているかを表します。決済と連動して変わるため、見える状態と実体を分けて理解するとよいです。',
      terms: ['残高', '保管', '建玉'],
      points: ['残高は状態の把握', '保管は保持の管理', '差異の確認が大切'],
      relatedKnowledgeIds: ['KB-BAL-001', 'KB-BAL-004']
    },
    {
      id: 'step-08',
      title: 'コーポレートアクションの概要',
      goal: '企業行為が取引や残高にどう影響するかを見る',
      summary: '配当や分割などの企業行為は、株式の保有や権利に影響を与えます。これらを理解しておくと、残高や報告の見え方の変動を説明しやすくなります。',
      terms: ['コーポレートアクション', '配当', '権利確定'],
      points: ['企業行為は取引に影響する', '対象日と保有状態を区別する', '残高確認と結びつく'],
      relatedKnowledgeIds: ['KB-CO-001', 'KB-CO-002']
    }
  ];

  const quizData = window.SKA_DATA && window.SKA_DATA.quiz ? window.SKA_DATA.quiz : [];

  function getProgressStorage() {
    if (!storage) return {};
    const value = storage.readJson(storage.keys.learningProgress, {});
    return value && typeof value === 'object' ? value : {};
  }

  function saveProgressState(state) {
    if (storage) {
      storage.writeJson(storage.keys.learningProgress, state);
    }
  }

  function renderSteps() {
    const container = document.getElementById('steps-list');
    if (!container) return;
    const progress = getProgressStorage();

    container.innerHTML = steps.map(function (step, index) {
      const completed = Boolean(progress[step.id]);
      return '<article class="step-card reveal"><div class="meta-row"><span class="badge">Step ' + (index + 1) + '</span></div><h3>' + step.title + '</h3><p><strong>学習目標</strong>：' + step.goal + '</p><p>' + step.summary + '</p><div><strong>重要用語</strong><p>' + step.terms.join('、') + '</p></div><div><strong>覚えておきたい3点</strong><ul class="point-list"><li>' + step.points.join('</li><li>') + '</li></ul></div><div class="meta-row">' + step.relatedKnowledgeIds.map(function (id) { return '<a class="tag" href="knowledge.html">' + id + '</a>'; }).join('') + '</div><button type="button" class="step-button" data-complete-step="' + step.id + '" aria-pressed="' + String(completed) + '">' + (completed ? '完了済み' : '完了ボタン') + '</button></article>';
    }).join('');

    container.querySelectorAll('[data-complete-step]').forEach(function (button) {
      button.addEventListener('click', function () {
        const stepId = button.getAttribute('data-complete-step');
        const state = getProgressStorage();
        state[stepId] = !state[stepId];
        saveProgressState(state);
        renderSteps();
        updateProgress();
      });
    });
  }

  function updateProgress() {
    const progress = getProgressStorage();
    const completed = Object.values(progress).filter(Boolean).length;
    const percent = Math.round((completed / steps.length) * 100);
    const bar = document.getElementById('learning-progress-bar');
    const text = document.getElementById('learning-progress-text');
    if (bar) bar.style.width = percent + '%';
    if (text) text.textContent = percent + '%';
  }

  function resetProgress() {
    const button = document.getElementById('reset-learning');
    if (!button) return;
    button.addEventListener('click', function () {
      if (window.confirm('学習進捗をリセットしますか？')) {
        saveProgressState({});
        renderSteps();
        updateProgress();
      }
    });
  }

  function renderQuiz() {
    const container = document.getElementById('quiz-container');
    if (!container) return;

    let currentIndex = 0;
    let score = 0;

    function renderQuestion() {
      if (currentIndex >= quizData.length) {
        container.innerHTML = '<div class="note success"><h3>理解度チェックの結果</h3><p>全体として、重要な流れと用語の関係を理解できている状態です。次は実務の時系列と例外対応を見直して、理解の定着をさらに進めましょう。</p></div>';
        return;
      }

      const question = quizData[currentIndex];
      container.innerHTML = '<div class="panel"><h3>問題 ' + (currentIndex + 1) + '</h3><p>' + question.question + '</p>' + question.options.map(function (option) {
        return '<button type="button" class="quiz-option" data-choice="' + option + '">' + option + '</button>';
      }).join('') + '</div>';

      container.querySelectorAll('[data-choice]').forEach(function (button) {
        button.addEventListener('click', function () {
          const selected = button.getAttribute('data-choice');
          const isCorrect = selected === question.answer;
          score += isCorrect ? 1 : 0;
          container.innerHTML = '<div class="panel"><h3>' + (isCorrect ? '正解' : '不正解') + '</h3><p>' + question.explanation + '</p><p><a href="knowledge.html">関連ナレッジ: ' + question.relatedKnowledgeId + '</a></p><button type="button" class="primary-button" data-next-question>次の問題へ進む</button></div>';
          const nextButton = container.querySelector('[data-next-question]');
          if (nextButton) {
            nextButton.addEventListener('click', function () {
              currentIndex += 1;
              renderQuestion();
            });
          }
        });
      });
    }

    renderQuestion();
  }

  document.addEventListener('DOMContentLoaded', function () {
    renderSteps();
    updateProgress();
    resetProgress();
    renderQuiz();
  });
})();
