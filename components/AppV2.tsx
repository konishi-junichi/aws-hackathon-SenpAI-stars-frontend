import { useState, useEffect } from "react";
import { LoginScreen } from "./LoginScreen";
import { DashboardV2 } from "./DashboardV2";
import { ChatInterface } from "./ChatInterface";
import { SenpaiCustomization } from "./SenpaiCustomization";
import { LearningMentor } from "./LearningMentor";
import { CommunicationMentor } from "./CommunicationMentor";
import { CounselingMentor } from "./CounselingMentor";
import { HistoryScreen } from "./HistoryScreen";
import { useCognitoAuth } from "../lib/amplify";

type Screen = "login" | "dashboard" | "chat" | "customization" | "learning" | "communication" | "counseling" | "history" | "settings";

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("login");
  const { user, loading, signOut } = useCognitoAuth();

  useEffect(() => {
    if (user) {
      setCurrentScreen("dashboard");
    } else {
      setCurrentScreen("login");
    }
  }, [user]);

  const handleLogin = () => {
    setCurrentScreen("dashboard");
  };

  const handleLogout = async () => {
    await signOut();
    setCurrentScreen("login");
  };

  const handleNavigate = (screen: string) => {
    setCurrentScreen(screen as Screen);
  };

  const handleBack = () => {
    setCurrentScreen("dashboard");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-[#0073bb] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="size-full">
      {currentScreen === "login" && <LoginScreen onLogin={handleLogin} />}
      {currentScreen === "dashboard" && (
        <DashboardV2 onNavigate={handleNavigate} onLogout={handleLogout} />
      )}
      {currentScreen === "chat" && <ChatInterface onLogout={handleLogout} />}
      {currentScreen === "customization" && <SenpaiCustomization onBack={handleBack} />}
      {currentScreen === "learning" && <LearningMentor onBack={handleBack} />}
      {currentScreen === "communication" && <CommunicationMentor onBack={handleBack} />}
      {currentScreen === "counseling" && <CounselingMentor onBack={handleBack} />}
      {currentScreen === "history" && <HistoryScreen onBack={handleBack} />}
      {currentScreen === "settings" && (
        <div className="min-h-screen bg-gradient-to-br from-[#FBEFEF] via-[#F0F4FF] to-[#E6F6FF] p-8">
          <div className="max-w-4xl mx-auto">
            <button onClick={handleBack} className="mb-6 text-[#0073bb] hover:underline">
              ← ダッシュボードに戻る
            </button>
            <h1>設定</h1>
            <p className="text-muted-foreground mt-4">設定画面は準備中です...</p>
          </div>
        </div>
      )}
    </div>
  );
}
