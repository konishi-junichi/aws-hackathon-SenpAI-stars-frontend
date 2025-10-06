# Cognito設定手順

## 1. Cognitoユーザープールの作成

1. AWS Consoleで「Amazon Cognito」を開く
2. 「ユーザープールを作成」をクリック
3. 設定:
   - サインインオプション: 「ユーザー名」を選択
   - パスワードポリシー: デフォルト
   - MFA: 無効
   - ユーザーアカウントの復旧: Eメール
4. 「次へ」で進み、ユーザープールを作成

## 2. アプリクライアントの作成

1. 作成したユーザープールを選択
2. 「アプリの統合」タブ → 「アプリクライアント」
3. 「アプリクライアントを作成」をクリック
4. 設定:
   - アプリクライアント名: `senpai-chat-client`
   - 認証フロー: 「ALLOW_USER_SRP_AUTH」を有効
   - クライアントシークレットを生成: 無効

## 3. IDプールの作成

1. Cognitoコンソールで「IDプール」を選択
2. 「IDプールを作成」をクリック
3. 設定:
   - IDプール名: `senpai-chat-identity-pool`
   - 認証されていないアクセスを有効にする: 無効
   - 認証プロバイダー: Cognito
   - ユーザープールID: 手順1で作成したプールのID
   - アプリクライアントID: 手順2で作成したクライアントのID

## 4. IAMロールの設定

IDプール作成時に自動作成されるIAMロールに以下のポリシーを追加:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "bedrock:InvokeAgent"
            ],
            "Resource": "arn:aws:bedrock-agentcore:*:*:runtime/*"
        }
    ]
}
```

## 5. 環境変数の設定

`.env.local`ファイルに以下を設定:

```
NEXT_PUBLIC_AWS_REGION=us-east-1
NEXT_PUBLIC_BEDROCK_AGENT_ARN=your_bedrock_agent_arn
NEXT_PUBLIC_COGNITO_USER_POOL_ID=your_user_pool_id
NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID=your_app_client_id
NEXT_PUBLIC_COGNITO_IDENTITY_POOL_ID=your_identity_pool_id
```