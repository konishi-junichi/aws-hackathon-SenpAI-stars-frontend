# Senpai AI - プロジェクト構造ドキュメント

## 📋 目次

1. [プロジェクト概要](#プロジェクト概要)
2. [技術スタック](#技術スタック)
3. [アーキテクチャ](#アーキテクチャ)
4. [ディレクトリ構造](#ディレクトリ構造)
5. [主要コンポーネント](#主要コンポーネント)
6. [画面遷移フロー](#画面遷移フロー)
7. [デザインシステム](#デザインシステム)

---

## プロジェクト概要

**Senpai AI**は、AWS AI Hackathon向けに開発された、IT コンサルタントと研修生のための AI 学習アシスタントアプリケーションです。

### 主な機能

1. **研修トレース先輩（Learning Mentor）** - ドキュメントから問題を生成し、学習進捗を追跡
2. **話の伝わる先輩（Communication Mentor）** - ロジカルな思考とプレゼンテーションスキルの訓練
3. **悩み相談先輩（Counseling Mentor）** - 感情理解と自己内省のサポート

### 対象ユーザー

- 新入社員
- 若手コンサルタント
- 研修受講者

---

## 技術スタック

| カテゴリ | 技術 |
|---------|------|
| **フレームワーク** | React 18+ with TypeScript |
| **スタイリング** | Tailwind CSS v4 |
| **UIコンポーネント** | shadcn/ui |
| **アイコン** | Lucide React |
| **アニメーション** | Motion (Framer Motion) |
| **チャート** | Recharts |
| **ビルドツール** | Vite |

---

## アーキテクチャ

### システム構成

```
┌─────────────────────────────────────────┐
│           App.tsx (Root)                │
│        Screen State Management          │
└─────────────────────────────────────────┘
                    │
        ┌───────────┼───────────┐
        │           │           │
┌───────▼──┐  ┌────▼─────┐  ┌─▼──────────┐
│  Login   │  │ Dashboard│  │   Chat     │
│  Screen  │  │    V2    │  │ Interface  │
└──────────┘  └────┬─────┘  └────────────┘
                   │
        ┌──────────┼──────────┐
        │          │          │
    ┌───▼───┐  ┌──▼────┐  ┌──▼──────┐
    │Learning│ │Commu- │  │Counsel- │
    │ Mentor │ │nication│ │ing      │
    └────────┘  └───────┘  └─────────┘
```

### データフロー

1. **認証**: LoginScreen → Dashboard
2. **ナビゲーション**: Dashboard → 各 Mentor 画面
3. **状態管理**: useState による画面状態の管理
4. **コールバック**: 各コンポーネントは `onNavigate` / `onBack` を通じて通信

---

## ディレクトリ構造

```
/
├── App.tsx                          # ルートコンポーネント・画面ルーティング
├── styles/
│   └── globals.css                  # Tailwind設定・カスタムテーマ
├── components/                      # アプリケーションコンポーネント
│   ├── LoginScreen.tsx              # ログイン画面
│   ├── DashboardV2.tsx              # メインダッシュボード（推奨）
│   ├── Dashboard.tsx                # 旧ダッシュボード（レガシー）
│   ├── ChatInterface.tsx            # AI会話インターフェース
│   ├── LearningMentor.tsx           # 研修トレース機能
│   ├── CommunicationMentor.tsx      # コミュニケーション訓練
│   ├── CounselingMentor.tsx         # カウンセリング機能
│   ├── SenpaiCustomization.tsx      # AIキャラカスタマイズ
│   ├── HistoryScreen.tsx            # 学習履歴画面
│   └── ui/                          # shadcn/ui コンポーネント
│       ├── button.tsx
│       ├── card.tsx
│       ├── input.tsx
│       └── ...（その他UIコンポーネント）
└── guidelines/
    └── Guidelines.md                # 開発ガイドライン
```

---

## 主要コンポーネント

### 1. App.tsx

**役割**: アプリケーションのルートコンポーネント

**責務**:
- 画面状態の管理（useState）
- 画面遷移ロジック
- コンポーネント間のナビゲーション制御

**主な状態**:
```typescript
type Screen = "login" | "dashboard" | "chat" | "customization" 
            | "learning" | "communication" | "counseling" 
            | "history" | "settings"
```

---

### 2. LoginScreen.tsx

**役割**: ユーザー認証画面

**主な機能**:
- メール・パスワード入力
- ログインボタン
- アカウント作成・パスワード忘れリンク

**デザイン**:
- AWS Blue（#0073bb）を基調
- 白背景・グラデーション
- 中央配置レイアウト

---

### 3. DashboardV2.tsx ⭐ **推奨**

**役割**: メインハブ・3つのモジュールへのアクセスポイント

**主な機能**:
- **AIキャラクター表示**: 中央に浮遊するキャラクターアニメーション
- **吹き出しメッセージ**: 動的な挨拶・提案表示
- **3つのモジュールカード**:
  - 📘 研修トレース先輩（緑: #16a34a）
  - 🗣️ 話の伝わる先輩（青: #0073bb）
  - 💭 悩み相談先輩（ピンク: #ec4899）
- **基盤機能**:
  - 🔍 ナレッジ検索（RAG）
  - 📂 最近のアクティビティ
  - ⚙️ カスタム設定

**デザイン特徴**:
- パステルグラデーション背景（#FBEFEF → #F0F4FF → #E6F6FF）
- ホバーアニメーション
- ゲーミフィケーション要素（スコア・キラキラエフェクト）

---

### 4. ChatInterface.tsx

**役割**: AI エージェントとの会話インターフェース

**主な機能**:
- リアルタイムチャット
- モード切り替え（Learning/Communication/Counseling/General）
- クイックアクション
- タイピングインジケーター
- レスポンシブサイドバー

**技術実装**:
- Motion/React によるアニメーション
- メッセージの時系列表示
- 自動スクロール

---

### 5. LearningMentor.tsx

**役割**: 研修トレース先輩（問題生成・クイズ）

**フロー**:
1. **Upload**: ファイル/URL（YouTube, OneDrive, SharePoint）アップロード
2. **Generate**: AI による問題生成
3. **Quiz**: ユーザーが質問に回答
4. **Results**: 採点結果・フィードバック・再テスト提案

**主な機能**:
- ドラッグ&ドロップアップロード
- 複数選択クイズ
- プログレスバー
- 正答率表示
- 記憶保持曲線に基づく再テスト提案

**カラー**: 緑系（#16a34a）

---

### 6. CommunicationMentor.tsx

**役割**: 話の伝わる先輩（ロジカル思考訓練）

**主な機能**:
- ロールプレイ（クライアント/リーダー/同僚）
- ロジカルフレームワーク:
  - 5W1H
  - ピラミッドストラクチャー
  - PREP法
- チャット形式での対話練習
- フィードバックカード（良かった点・改善点）

**カラー**: 青系（#0073bb）

---

### 7. CounselingMentor.tsx

**役割**: 悩み相談先輩（共感・内省サポート）

**主な機能**:
- 感情選択（悲しい/困惑/不安/希望）
- 共感的な AI 応答
- 背景色の感情連動（感情に応じて背景色変化）
- メンターストーリー閲覧
- アクションプランチェックリスト
- リフレクション保存

**カラー**: ピンク系（#ec4899）

**デザイン特徴**:
- ソフトトーン
- パステル背景
- 心理的安全空間の演出

---

### 8. SenpaiCustomization.tsx

**役割**: AI キャラクターのカスタマイズ

**主な機能**:
- キャラクタータイプ選択:
  - 😊 Kind（優しい）
  - 📚 Strict（厳格）
  - 🤔 Logical（論理的）
  - 😄 Funny（面白い）
- メンター名変更
- アバター表示

---

### 9. HistoryScreen.tsx

**役割**: 学習履歴の閲覧・管理

**主な機能**:
- タブフィルター（All/Learning/Communication/Counseling）
- 学習進捗グラフ（Recharts）
- アクティビティタイムライン
- リトライ・ダウンロード機能

---

## 画面遷移フロー

```
Login
  │
  ├─→ Dashboard V2
       │
       ├─→ Learning Mentor
       │    ├─ Upload
       │    ├─ Quiz
       │    └─ Results
       │
       ├─→ Communication Mentor
       │    ├─ Chat
       │    └─ Feedback
       │
       ├─→ Counseling Mentor
       │    ├─ Emotion Select
       │    ├─ Chat
       │    └─ Reflection
       │
       ├─→ Chat Interface
       │    └─ Multi-mode Chat
       │
       ├─→ Customization
       ├─→ History
       └─→ Settings
```

---

## デザインシステム

### カラーパレット

| 用途 | カラーコード | 説明 |
|-----|-------------|------|
| **Primary** | #0073bb | AWS Blue・メインカラー |
| **Success** | #16a34a | Learning Mentor・成功 |
| **Empathy** | #ec4899 | Counseling Mentor・共感 |
| **Warning** | #ea580c | 再テスト・注意 |
| **Background** | #FBEFEF → #E6F6FF | パステルグラデーション |

### タイポグラフィ

- **フォントファミリー**: System Font Stack (Inter, Noto Sans JP)
- **見出し（h1-h4）**: Medium weight (500)
- **本文**: Regular weight (400)
- **行間**: 1.5

### 角丸

| サイズ | 値 | 用途 |
|-------|---|------|
| **sm** | 8px | 小要素 |
| **md** | 12px | ボタン |
| **lg** | 16px | カード |
| **xl** | 20px | 入力フィールド |
| **2xl** | 24px | 大型カード |
| **3xl** | 32px | メインカード |

### シャドウ

- **sm**: 小さな浮遊感
- **md**: 標準カード
- **lg**: 強調カード
- **xl**: モーダル・ダイアログ
- **2xl**: キャラクター・主要要素

### アニメーション

- **Duration**: 0.3s - 0.6s
- **Easing**: ease-in-out
- **主な効果**:
  - Hover 時の浮遊（translateY）
  - Fade in/out
  - Scale 変化
  - キャラクター浮遊（y軸ループ）

---

## 開発ガイドライン

### コンポーネント作成規則

1. **TypeScript**: 型安全性を確保
2. **Props Interface**: 各コンポーネントに Props 定義
3. **shadcn/ui**: 既存UIコンポーネントを優先使用
4. **アクセシビリティ**: ARIA属性・キーボード操作対応

### 状態管理

- **ローカル状態**: useState
- **画面遷移**: App.tsx の `currentScreen` 状態
- **将来的検討**: Context API / Zustand

### スタイリング

- **Tailwind優先**: inline styles は最小限
- **カスタムCSS変数**: `globals.css` で定義
- **レスポンシブ**: モバイルファースト

---

## 今後の拡張予定

### 短期（Phase 1）
- [ ] バックエンドAPI統合（AWS Lambda, Bedrock）
- [ ] 音声入力機能（Communication Mentor）
- [ ] OCR機能（Writing Assistant）
- [ ] スペースドリピティションアルゴリズム

### 中期（Phase 2）
- [ ] ユーザー認証（AWS Cognito）
- [ ] データベース連携（DynamoDB）
- [ ] RAG実装（Vector Store）
- [ ] リアルタイムコラボレーション

### 長期（Phase 3）
- [ ] モバイルアプリ（React Native）
- [ ] 多言語対応（i18n）
- [ ] アナリティクスダッシュボード
- [ ] AI モデル選択機能

---

## トラブルシューティング

### よくある問題

**Q: Tailwind クラスが適用されない**
- A: `globals.css` のインポートを確認。Vite の場合は `main.tsx` で import

**Q: shadcn/ui コンポーネントが見つからない**
- A: `/components/ui/` ディレクトリを確認。必要に応じて shadcn CLI でインストール

**Q: Motion アニメーションが動かない**
- A: `motion/react` からのインポートを確認（`framer-motion` ではない）

---

## ライセンス・貢献

このプロジェクトは AWS AI Hackathon 用に作成されました。

**開発者**: Figma Make AI
**プロジェクト管理**: GitHub
**デプロイ**: AWS Amplify / Vercel

---

## 連絡先・サポート

プロジェクトに関する質問・提案は、GitHub Issues までお願いします。

**バージョン**: 1.0.0  
**最終更新**: 2025年10月10日
