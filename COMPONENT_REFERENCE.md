# コンポーネントリファレンス

## 目次

- [画面コンポーネント](#画面コンポーネント)
- [UIコンポーネント（shadcn/ui）](#uiコンポーネントshadcnui)
- [使用例](#使用例)

---

## 画面コンポーネント

### LoginScreen

**パス**: `/components/LoginScreen.tsx`

**Props**:
```typescript
interface LoginScreenProps {
  onLogin: () => void;
}
```

**説明**: ログイン画面。メール・パスワード入力とログインボタンを提供。

**主な要素**:
- Senpai AI ロゴ（Brain アイコン）
- Email 入力フィールド
- Password 入力フィールド
- Login ボタン
- Create account / Forgot password リンク

---

### DashboardV2

**パス**: `/components/DashboardV2.tsx`

**Props**:
```typescript
interface DashboardV2Props {
  onNavigate: (screen: string) => void;
  onLogout: () => void;
}
```

**説明**: メインダッシュボード。AIキャラクターと3つのモジュールカードを表示。

**主な機能**:
- AIキャラクター表示（浮遊アニメーション）
- 吹き出しメッセージ
- 3つのモジュールカード（Learning/Communication/Counseling）
- ナレッジ検索
- 最近のアクティビティ
- カスタム設定

**状態管理**:
```typescript
const [characterMood, setCharacterMood] = useState<"normal" | "thinking" | "supportive" | "empathetic">("normal");
const [greeting, setGreeting] = useState(string);
const [searchQuery, setSearchQuery] = useState(string);
```

---

### ChatInterface

**パス**: `/components/ChatInterface.tsx`

**Props**:
```typescript
interface ChatInterfaceProps {
  onLogout: () => void;
}
```

**説明**: AI会話インターフェース。リアルタイムチャット機能。

**主な機能**:
- メッセージ送受信
- タイピングインジケーター
- モード切り替え（Learning/Communication/Counseling/General）
- クイックアクション
- レスポンシブサイドバー
- ファイルアップロード

**Message型**:
```typescript
interface Message {
  id: string;
  role: "user" | "agent";
  content: string;
  mode?: "learning" | "communication" | "counseling" | "general";
  timestamp: Date;
}
```

---

### LearningMentor

**パス**: `/components/LearningMentor.tsx`

**Props**:
```typescript
interface LearningMentorProps {
  onBack: () => void;
}
```

**説明**: 研修トレース機能。ファイルから問題生成・クイズ・採点。

**フロー制御**:
```typescript
const [step, setStep] = useState<"upload" | "quiz" | "results">("upload");
```

**主な機能**:
- ドラッグ&ドロップファイルアップロード
- YouTube URL 入力
- Cloud Storage URL 入力
- 複数選択クイズ生成
- プログレスバー
- 採点・フィードバック
- 再テスト提案

---

### CommunicationMentor

**パス**: `/components/CommunicationMentor.tsx`

**Props**:
```typescript
interface CommunicationMentorProps {
  onBack: () => void;
}
```

**説明**: コミュニケーション訓練。ロジカルフレームワークとロールプレイ。

**主な機能**:
- ロール選択（Client/Leader/Colleague）
- チャット形式練習
- ロジカルフレームワーク表示（5W1H, Pyramid, PREP）
- フィードバック生成（Well Done / To Improve）

**Frameworks**:
```typescript
const frameworks = [
  { name: "5W1H", description: "Who, What, When, Where, Why, How" },
  { name: "Pyramid Structure", description: "Conclusion → Key Points → Details" },
  { name: "PREP", description: "Point, Reason, Example, Point" },
];
```

---

### CounselingMentor

**パス**: `/components/CounselingMentor.tsx`

**Props**:
```typescript
interface CounselingMentorProps {
  onBack: () => void;
}
```

**説明**: カウンセリング機能。感情理解と共感サポート。

**主な機能**:
- 感情選択（Sad/Confused/Anxious/Hopeful）
- 背景色の感情連動
- 共感的AI応答
- メンターストーリー閲覧（ダイアログ）
- アクションプランチェックリスト
- リフレクション保存

**Emotions**:
```typescript
const emotions = [
  { id: "sad", label: "Sad", emoji: "😢", color: "#6b7280" },
  { id: "confused", label: "Confused", emoji: "😕", color: "#8b5cf6" },
  { id: "anxious", label: "Anxious", emoji: "😰", color: "#ea580c" },
  { id: "hopeful", label: "Hopeful", emoji: "🌟", color: "#16a34a" },
];
```

---

### SenpaiCustomization

**パス**: `/components/SenpaiCustomization.tsx`

**Props**:
```typescript
interface SenpaiCustomizationProps {
  onBack: () => void;
}
```

**説明**: AIキャラクターのカスタマイズ画面。

**主な機能**:
- キャラクタータイプ選択（Kind/Strict/Logical/Funny）
- メンター名変更
- アバタープレビュー

**Character Types**:
```typescript
const characterTypes = [
  { id: "kind", label: "Kind", emoji: "😊", color: "#ec4899" },
  { id: "strict", label: "Strict", emoji: "📚", color: "#0073bb" },
  { id: "logical", label: "Logical", emoji: "🤔", color: "#8b5cf6" },
  { id: "funny", label: "Funny", emoji: "😄", color: "#f59e0b" },
];
```

---

### HistoryScreen

**パス**: `/components/HistoryScreen.tsx`

**Props**:
```typescript
interface HistoryScreenProps {
  onBack: () => void;
}
```

**説明**: 学習履歴画面。過去の活動を表示・フィルタリング。

**主な機能**:
- タブフィルター（All/Learning/Communication/Counseling）
- 学習進捗グラフ（Recharts）
- アクティビティタイムライン
- Retry / Download ボタン

---

## UIコンポーネント（shadcn/ui）

### Button

**パス**: `/components/ui/button.tsx`

**使用例**:
```tsx
<Button variant="default">Default</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button size="sm">Small</Button>
<Button size="icon"><Icon /></Button>
```

**Variants**: default, destructive, outline, secondary, ghost, link
**Sizes**: default, sm, lg, icon

---

### Card

**パス**: `/components/ui/card.tsx`

**使用例**:
```tsx
<Card className="p-6">
  <h3>Card Title</h3>
  <p>Card content...</p>
</Card>
```

---

### Input

**パス**: `/components/ui/input.tsx`

**使用例**:
```tsx
<Input 
  type="email" 
  placeholder="Enter email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
/>
```

---

### Textarea

**パス**: `/components/ui/textarea.tsx`

**使用例**:
```tsx
<Textarea 
  placeholder="Enter your message..."
  rows={4}
/>
```

---

### Select

**パス**: `/components/ui/select.tsx`

**使用例**:
```tsx
<Select value={role} onValueChange={setRole}>
  <SelectTrigger>
    <SelectValue placeholder="Select role" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="client">Client</SelectItem>
    <SelectItem value="leader">Leader</SelectItem>
  </SelectContent>
</Select>
```

---

### Dialog

**パス**: `/components/ui/dialog.tsx`

**使用例**:
```tsx
<Dialog>
  <DialogTrigger asChild>
    <Button>Open Dialog</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Dialog Title</DialogTitle>
    </DialogHeader>
    <p>Dialog content...</p>
  </DialogContent>
</Dialog>
```

---

### Tabs

**パス**: `/components/ui/tabs.tsx`

**使用例**:
```tsx
<Tabs defaultValue="all">
  <TabsList>
    <TabsTrigger value="all">All</TabsTrigger>
    <TabsTrigger value="learning">Learning</TabsTrigger>
  </TabsList>
  <TabsContent value="all">
    All content...
  </TabsContent>
  <TabsContent value="learning">
    Learning content...
  </TabsContent>
</Tabs>
```

---

### Progress

**パス**: `/components/ui/progress.tsx`

**使用例**:
```tsx
<Progress value={75} className="h-2" />
```

---

### Avatar

**パス**: `/components/ui/avatar.tsx`

**使用例**:
```tsx
<Avatar>
  <AvatarFallback>JD</AvatarFallback>
</Avatar>
```

---

### Checkbox

**パス**: `/components/ui/checkbox.tsx`

**使用例**:
```tsx
<Checkbox 
  id="agree"
  checked={agreed}
  onCheckedChange={setAgreed}
/>
<label htmlFor="agree">I agree</label>
```

---

## 使用例

### 基本的なページ構造

```tsx
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { ArrowLeft } from "lucide-react";

interface MyPageProps {
  onBack: () => void;
}

export function MyPage({ onBack }: MyPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h2>Page Title</h2>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <Card className="p-6 rounded-3xl shadow-md">
          <p>Content here...</p>
        </Card>
      </div>
    </div>
  );
}
```

---

### Motion アニメーション

```tsx
import { motion } from "motion/react";

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
>
  <Card>Animated Card</Card>
</motion.div>
```

---

### Recharts グラフ

```tsx
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { date: "Mon", score: 85 },
  { date: "Tue", score: 90 },
];

<ResponsiveContainer width="100%" height={250}>
  <LineChart data={data}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="date" />
    <YAxis />
    <Tooltip />
    <Line type="monotone" dataKey="score" stroke="#0073bb" strokeWidth={3} />
  </LineChart>
</ResponsiveContainer>
```

---

## ベストプラクティス

### 1. TypeScript 型定義

```typescript
// Props は必ず interface で定義
interface ComponentProps {
  title: string;
  onAction: (id: string) => void;
  optional?: boolean;
}
```

### 2. カラーシステム

```tsx
// カスタムカラーは inline style で
<div style={{ backgroundColor: "#0073bb" }}>...</div>

// または Tailwind カスタムクラス
<div className="bg-[#0073bb]">...</div>
```

### 3. レスポンシブデザイン

```tsx
// モバイルファースト
<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
  ...
</div>
```

### 4. アクセシビリティ

```tsx
// label と input を関連付け
<label htmlFor="email">Email</label>
<Input id="email" type="email" />

// ボタンに aria-label
<Button aria-label="Close" size="icon">
  <X className="w-4 h-4" />
</Button>
```

---

**最終更新**: 2025年10月10日  
**バージョン**: 1.0.0
