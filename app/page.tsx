'use client'

import { useState } from "react";
import { LoginScreen } from "@/components/LoginScreen";
import { Dashboard } from "@/components/Dashboard";
import { ChatInterface } from "@/components/ChatInterface";
import { SenpaiCustomization } from "@/components/SenpaiCustomization";
import { LearningMentor } from "@/components/LearningMentor";
import { CommunicationMentor } from "@/components/CommunicationMentor";
import { CounselingMentor } from "@/components/CounselingMentor";
import { HistoryScreen } from "@/components/HistoryScreen";

type Screen = "login" | "dashboard" | "chat" | "customization" | "learning" | "communication" | "counseling" | "history" | "settings";

export default function HomePage() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("login");

  const handleLogin = () => {
    setCurrentScreen("dashboard");
  };

  const handleLogout = () => {
    setCurrentScreen("login");
  };

  const handleNavigate = (screen: string) => {
    setCurrentScreen(screen as Screen);
  };

  const handleBack = () => {
    setCurrentScreen("dashboard");
  };

  return (
    <div className="size-full">
      {currentScreen === "login" && <LoginScreen onLogin={handleLogin} />}
      {currentScreen === "dashboard" && (
        <Dashboard onNavigate={handleNavigate} />
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
