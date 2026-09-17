# SECURITIES KNOWLEDGE ATLAS

## プロジェクト名
SECURITIES KNOWLEDGE ATLAS

## サイト概要
証券業務の「流れ」と「つながり」を視覚的に理解できる静的Webサイトです。業務フロー、ナレッジ、用語集、困りごと、学習コースを横断して確認できます。

## 制作目的
- 業務の全体像を把握しやすくする
- ナレッジと用語の関連を見える化する
- 新任者や引き継ぎ対象者の学習支援を行う
- 問い合わせや問題発生時の切り分け開始点を提供する

## コンセプト
証券業務の知識を点ではなく、流れや責任境界とともに理解できるようにすることを目的としています。

## 想定利用者
- 証券業務に初めて携わる担当者
- 配属変更された社員
- 証券システム開発担当者
- 保守・運用担当者
- 業務要件を確認するプロジェクトメンバー

## 対象業務範囲
- 口座・顧客管理
- 注文受付
- 市場への発注
- 約定
- 約定照合
- 清算
- 決済
- 残高反映・保管
- 顧客報告・帳票

## 使用技術
- HTML5
- CSS3
- Vanilla JavaScript
- LocalStorage
- Intersection Observer API

## 使用していない技術
- React
- Vue
- Angular
- jQuery
- Bootstrap
- Tailwind CSS
- TypeScript
- Node.js 前提のビルドツール
- 外部CDN依存のライブラリ

## ファイル構成
```text
securities-knowledge-atlas/
├── index.html
├── flow.html
├── knowledge.html
├── glossary.html
├── troubleshooting.html
├── learning.html
├── about.html
├── README.md
├── css/
│   ├── reset.css
│   └── style.css
├── js/
│   ├── main.js
│   ├── flow.js
│   ├── knowledge.js
│   ├── glossary.js
│   ├── troubleshooting.js
│   ├── learning.js
│   └── storage.js
├── data/
│   ├── knowledge-data.js
│   ├── glossary-data.js
│   ├── troubleshooting-data.js
│   └── quiz-data.js
├── images/
│   └── README.md
└──
```

## 起動方法
### 方法1
ブラウザーで index.html を直接開く。

### 方法2
VS Code の Live Server などのローカルWebサーバーを利用して開く。

## 主な機能
- 横断検索
- 業務マップと詳細パネル
- ナレッジ一覧の検索・絞り込み
- 用語集の検索と詳細表示
- 困りごとに対する確認手順の提示
- 学習コースと理解度チェック
- ダークモード切り替え
- ブックマークと最近見た項目
- LocalStorage を使った状態保存

## サンプルデータの説明
すべてのデータは架空のサンプルとして作成されています。実在する顧客、口座情報、取引データ、社内システム名は含めていません。

## ナレッジを追加・編集する方法
`data/knowledge-data.js` の `window.SKA_DATA.knowledge` 配列に新しいオブジェクトを追加してください。各項目はタイトル、カテゴリ、要約、本文、関連用語、関連ナレッジIDを持つ構造です。

## 用語を追加・編集する方法
`data/glossary-data.js` の `window.SKA_DATA.glossary` 配列に新しい用語オブジェクトを追加してください。

## トラブルシューティングシナリオを追加する方法
`data/troubleshooting-data.js` に新規オブジェクトを追加してください。事象・確認手順・想定原因・関連用語・関連ナレッジなどを記載します。

## 学習問題を追加する方法
`data/quiz-data.js` の配列に新しい問題を追加し、問題文・選択肢・正解・解説・関連ナレッジIDを揃えてください。

## LocalStorageの利用内容
- テーマ設定
- 初心者向けと実務者向けの表示モード
- ブックマークしたナレッジID
- 最近見たナレッジID
- 学習ステップの完了状態

## アクセシビリティ対応
- スキップリンク
- セマンティックHTML
- `aria-current` / `aria-expanded` / `aria-live` の利用
- キーボード操作を配慮したUI
- `:focus-visible` によるフォーカス表示
- `prefers-reduced-motion` に対応

## レスポンシブ対応
- 320px 〜 1440px の幅で利用可能なレイアウト
- モバイルではナビゲーションをメニュー化
- フィルターやカードが画面幅に応じて調整
- 長文の行が広がりすぎない設計

## 情報管理上の注意
- 実在する顧客情報や個人情報を含めない
- 実在の口座番号や取引データを含めない
- 社外秘や本番システム名を記載しない
- 実務利用前に社内規程と最新の公式資料を確認する

## デモ情報に関する免責事項
本サイトの情報はデモサイトのため、実際の制度・規制・税務・条件・社内手続きと異なる場合があります。実務利用には業務有識者の監修と社内規程の確認が必要です。

## 画像やロゴを追加する方法
`images/` に画像を置き、必要に応じて HTML で参照してください。画像がない場合は CSS のグラデーションや装飾で代替しています。

## 動作確認チェックリスト
- 全ページへのリンクが正常である
- JavaScript エラーがない
- 検索、絞り込み、モーダルが動作する
- LocalStorage が使えない場合でも主要機能が動く
- ダークモードとライトモードが切り替わる
- キーボード操作が可能である
- 320px と 1440px の幅で崩れがない

## 今後の拡張案
- 検索履歴の保存
- ナレッジカテゴリの追加
- ブックマーク一覧ページの作成
- 業務フローのSVG化/詳細化
- 学習コースの難易度別設計
