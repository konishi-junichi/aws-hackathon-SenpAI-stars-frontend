# aws-hackathon-SenpAI-stars-frontend
AWS Hackathon 2025で使用するリポジトリ。フロントエンド編。

## プロジェクト概要
AWSのCloudFrontおよびS3の構成で静的Webサイトをホスティングするプロジェクトです。

## 機能要件
1. **AIエージェントとの対話機能**  
   AWSにデプロイしたAIエージェントとやりとりします

2. **音声入力対応**  
   ユーザーの声を文字にします

3. **音声出力対応**  
   AIエージェントの応答を音声にします

4. **会話履歴保存機能**  
   会話機能をAWSのサービス上で保持します。会話一覧が画面に表示されます

5. **複数AIエージェント対応**  
   メインでやり取りするエージェントの他に以下の3つのAIエージェントを選択可能：
   - 研修トレース先輩
   - 伝え方指導先輩
   - 悩み相談先輩

## 技術仕様
- **フレームワーク**: Next.js 14 + TypeScript
- **デプロイ**: 静的サイト生成（S3 + CloudFront対応）
- **音声認識**: Web Speech API
- **スタイリング**: CSS Variables（ダークモード対応）

## ディレクトリ構成
```
├── app/
│   ├── layout.tsx           # ルートレイアウト
│   └── page.tsx             # トップページ
├── components/
│   └── ChatApp.tsx          # メインチャットコンポーネント
├── styles/
│   └── globals.css          # グローバルスタイル
├── Dockerfile               # Docker設定
├── docker-compose.yml       # Docker Compose設定
├── next.config.js           # Next.js設定（静的エクスポート用）
├── package.json
└── tsconfig.json
```

## セットアップ・使用方法

### AWS設定
1. `.env.local.example`を`.env.local`にコピー
2. AWS認証情報を設定:
```bash
cp .env.local.example .env.local
# .env.localファイルを編集してAWS認証情報を入力
```

### 開発環境
#### 通常の方法
```bash
# 依存関係のインストール
npm install
# 開発サーバー起動（WSL環境でエラー発生）
npm run dev
```

#### Docker使用（推奨）
```bash
# 実行と終了
docker-compose up --build
docker-compose down
```

### 本番ビルド・デプロイ
#### 通常の方法
```bash
# ビルド
npm run build
# 静的ファイル生成（S3アップロード用）
npm run export
```

#### Docker使用（推奨）
```bash
# Docker環境でビルド・エクスポート
docker build -f Dockerfile.build -t senpai-build .
docker run --rm -v $(pwd):/host senpai-build cp -r /app/out /host/
```

生成された`out/`フォルダの内容をS3バケットにアップロードしてください。

## 主要機能
- シンプルなチャット画面
- 音声入力対応（🎤ボタン）
- 会話履歴検索
- サイドバー表示切り替え
- ダークモード/ライトモード切り替え
