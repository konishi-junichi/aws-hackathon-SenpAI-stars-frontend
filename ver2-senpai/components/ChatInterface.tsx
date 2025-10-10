import { useState, useRef, useEffect } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Send, Sparkles, Upload, BookOpen, MessageSquare, Heart, Settings, History, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface Message {
  id: string;
  role: "user" | "agent";
  content: string;
  mode?: "learning" | "communication" | "counseling" | "general";
  timestamp: Date;
}

interface ChatInterfaceProps {
  onLogout: () => void;
}

const mentorPersona = {
  name: "Senpai",
  emoji: "🤖",
  modes: {
    general: { color: "#0073bb", icon: Sparkles },
    learning: { color: "#16a34a", icon: BookOpen },
    communication: { color: "#0073bb", icon: MessageSquare },
    counseling: { color: "#ec4899", icon: Heart },
  }
};

const quickActions = [
  { label: "📚 Create a quiz", mode: "learning" as const, prompt: "I'd like to create a quiz from learning materials" },
  { label: "💼 Practice presentation", mode: "communication" as const, prompt: "Help me practice a client presentation" },
  { label: "💭 Reflect & talk", mode: "counseling" as const, prompt: "I need someone to talk to about how I'm feeling" },
  { label: "📊 See my progress", mode: "general" as const, prompt: "Show me my learning progress" },
];

export function ChatInterface({ onLogout }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "agent",
      content: "Hi! I'm Senpai, your AI learning mentor. I'm here to help you learn, communicate better, and reflect on your journey. What would you like to work on today? 😊",
      mode: "general",
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [currentMode, setCurrentMode] = useState<"learning" | "communication" | "counseling" | "general">("general");
  const [isTyping, setIsTyping] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue,
      mode: currentMode,
      timestamp: new Date(),
    };

    setMessages([...messages, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const agentMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "agent",
        content: getAgentResponse(inputValue, currentMode),
        mode: currentMode,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, agentMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleQuickAction = (action: typeof quickActions[0]) => {
    setCurrentMode(action.mode);
    setInputValue(action.prompt);
  };

  const getAgentResponse = (input: string, mode: string): string => {
    const responses = {
      learning: "Great! I can help you create an interactive quiz. You can upload a document, paste a YouTube link, or share content from your cloud storage. What would you like to use as study material?",
      communication: "Perfect! Let's work on your presentation skills. First, tell me: who is your audience and what's the main message you want to convey? I'll help you structure it using proven frameworks like the Pyramid Structure or 5W1H.",
      counseling: "I'm here to listen. Take your time and share what's on your mind. Remember, this is a safe space and everything you share stays between us. 💙",
      general: "I'm here to help! You can ask me to create quizzes from your materials, practice your communication skills, or just have a conversation about how you're feeling. What sounds most helpful right now?"
    };
    return responses[mode as keyof typeof responses] || responses.general;
  };

  const getModeColor = () => mentorPersona.modes[currentMode].color;

  return (
    <div className="h-screen flex overflow-hidden bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ x: sidebarOpen ? 0 : "-100%" }}
        className={`fixed lg:relative lg:translate-x-0 inset-y-0 left-0 z-50 w-80 bg-white border-r border-border flex flex-col transition-transform lg:transition-none`}
      >
        {/* Sidebar Header */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-[#0073bb] to-[#005a94] rounded-2xl flex items-center justify-center">
                <span className="text-2xl">{mentorPersona.emoji}</span>
              </div>
              <div>
                <h3>{mentorPersona.name}</h3>
                <p className="text-xs text-muted-foreground">AI Mentor</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="w-2 h-2 bg-[#16a34a] rounded-full animate-pulse" />
            <span className="text-muted-foreground">Online & ready to help</span>
          </div>
        </div>

        {/* Mode Indicator */}
        <div className="p-4 bg-muted/50">
          <p className="text-xs text-muted-foreground mb-2">Current Mode</p>
          <div 
            className="flex items-center gap-2 p-3 rounded-xl"
            style={{ backgroundColor: `${getModeColor()}20` }}
          >
            {(() => {
              const ModeIcon = mentorPersona.modes[currentMode].icon;
              return <ModeIcon className="w-5 h-5" style={{ color: getModeColor() }} />;
            })()}
            <span className="capitalize" style={{ color: getModeColor() }}>
              {currentMode === "general" ? "Chat" : currentMode}
            </span>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex-1 overflow-y-auto p-4">
          <p className="text-xs text-muted-foreground mb-3">Quick Actions</p>
          <div className="space-y-2">
            {quickActions.map((action, idx) => (
              <button
                key={idx}
                onClick={() => handleQuickAction(action)}
                className="w-full p-3 text-left rounded-xl border border-border hover:border-[#0073bb] hover:bg-blue-50 transition-all"
              >
                <p className="text-sm">{action.label}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-border space-y-2">
          <Button variant="outline" className="w-full justify-start rounded-xl" onClick={() => {}}>
            <History className="w-4 h-4 mr-2" />
            View History
          </Button>
          <Button variant="outline" className="w-full justify-start rounded-xl" onClick={() => {}}>
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
        </div>
      </motion.aside>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-sm border-b border-border px-4 lg:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </Button>
            <h2 className="text-[#0073bb]">Chat with Senpai</h2>
          </div>
          <Avatar>
            <AvatarFallback className="bg-[#0073bb] text-white">JD</AvatarFallback>
          </Avatar>
        </header>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-4">
          <AnimatePresence initial={false}>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className={`flex gap-3 ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}
              >
                {message.role === "agent" && (
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${getModeColor()}20` }}
                  >
                    <span className="text-xl">{mentorPersona.emoji}</span>
                  </div>
                )}
                <div
                  className={`max-w-[70%] lg:max-w-[60%] p-4 rounded-2xl ${
                    message.role === "user"
                      ? "bg-[#0073bb] text-white rounded-tr-sm"
                      : "bg-white border border-border rounded-tl-sm shadow-sm"
                  }`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                  <p className={`text-xs mt-2 ${message.role === "user" ? "text-blue-100" : "text-muted-foreground"}`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-3"
            >
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ backgroundColor: `${getModeColor()}20` }}
              >
                <span className="text-xl">{mentorPersona.emoji}</span>
              </div>
              <div className="bg-white border border-border p-4 rounded-2xl rounded-tl-sm shadow-sm">
                <div className="flex gap-1">
                  <motion.div
                    className="w-2 h-2 bg-muted-foreground rounded-full"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ repeat: Infinity, duration: 1, delay: 0 }}
                  />
                  <motion.div
                    className="w-2 h-2 bg-muted-foreground rounded-full"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}
                  />
                  <motion.div
                    className="w-2 h-2 bg-muted-foreground rounded-full"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ repeat: Infinity, duration: 1, delay: 0.4 }}
                  />
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="bg-white/80 backdrop-blur-sm border-t border-border p-4 lg:p-6">
          <Card className="p-4 rounded-2xl shadow-md">
            <div className="flex gap-3">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-xl flex-shrink-0"
                onClick={() => {}}
              >
                <Upload className="w-5 h-5 text-muted-foreground" />
              </Button>
              <Textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Type your message... (Shift+Enter for new line)"
                className="resize-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 min-h-[60px]"
                rows={2}
              />
              <Button
                onClick={handleSend}
                disabled={!inputValue.trim()}
                className="rounded-xl flex-shrink-0 h-full"
                style={{ backgroundColor: getModeColor() }}
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>
          </Card>
          <p className="text-xs text-muted-foreground text-center mt-2">
            Senpai AI can make mistakes. Consider checking important information.
          </p>
        </div>
      </div>
    </div>
  );
}
