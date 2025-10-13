import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { ArrowLeft, Heart, BookOpen, CheckSquare, Copy } from "lucide-react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Checkbox } from "./ui/checkbox";
import { useBedrockAgent } from "../lib/bedrock-agent";

interface CounselingMentorProps {
  onBack: () => void;
}

const emotions = [
  { id: "sad", label: "Sad", emoji: "😢", color: "#6b7280" },
  { id: "confused", label: "Confused", emoji: "😕", color: "#8b5cf6" },
  { id: "anxious", label: "Anxious", emoji: "😰", color: "#ea580c" },
  { id: "hopeful", label: "Hopeful", emoji: "🌟", color: "#16a34a" },
];

const stories = [
  {
    title: "Overcoming Imposter Syndrome",
    summary: "How a junior consultant learned to trust their abilities",
    content: "When I started as a consultant, I felt like everyone knew more than me..."
  },
  {
    title: "Managing Work-Life Balance",
    summary: "Finding harmony between career growth and personal time",
    content: "Learning to set boundaries was one of the hardest but most rewarding..."
  },
];

export function CounselingMentor({ onBack }: CounselingMentorProps) {
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);
  const [userMessage, setUserMessage] = useState("");
  const [conversation, setConversation] = useState<Array<{ role: "user" | "ai"; message: string; emotion?: string }>>([]);
  const [actionItems, setActionItems] = useState([
    { id: 1, text: "Take a 10-minute walk outside", completed: false },
    { id: 2, text: "Write down 3 things you're grateful for", completed: false },
    { id: 3, text: "Share your feelings with a trusted friend", completed: false },
  ]);
  const [loading, setLoading] = useState(false);
  const [buttonStatus, setButtonStatus] = useState<{[key: number]: string}>({});
  const { sendMessage } = useBedrockAgent();

  const handleSend = async () => {
    if (!userMessage.trim() || loading) return;

    const message = userMessage;
    const emotion = selectedEmotion;
    setUserMessage("");
    setSelectedEmotion(null);
    setLoading(true);
    
    setConversation(prev => [...prev, { role: "user", message, emotion: emotion || undefined }]);
    
    try {
      const contextMessage = `Emotion: ${emotion || 'neutral'}. Message: ${message}`;
      const response = await sendMessage(contextMessage, 'counseling-session', 'advice');
      setConversation(prev => [...prev, { role: "ai", message: response }]);
    } catch (error) {
      setConversation(prev => [...prev, { role: "ai", message: "I'm here for you. Sometimes technology has hiccups, but my support for you remains constant. Please try sharing again." }]);
    } finally {
      setLoading(false);
    }
  };

  const toggleActionItem = (id: number) => {
    setActionItems(actionItems.map(item =>
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  };

  const getBgColor = () => {
    if (!selectedEmotion) return "from-blue-50 to-pink-50";
    const emotion = emotions.find(e => e.id === selectedEmotion);
    if (emotion?.id === "sad") return "from-gray-100 to-blue-50";
    if (emotion?.id === "confused") return "from-purple-50 to-blue-50";
    if (emotion?.id === "anxious") return "from-orange-50 to-pink-50";
    if (emotion?.id === "hopeful") return "from-green-50 to-blue-50";
    return "from-blue-50 to-pink-50";
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${getBgColor()} transition-all duration-500`}>
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-border">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h2 className="text-[#ec4899]">Counseling Mentor</h2>
        </div>
      </div>

      {/* Welcome Message */}
      <div className="max-w-5xl mx-auto px-6 py-4 bg-pink-50 border-b">
        <p className="text-sm text-[#ec4899]">
          Hello, I'm here to listen. How are you feeling today? 💙
        </p>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="grid md:grid-cols-3 gap-6">
          {/* Main Chat */}
          <div className="md:col-span-2 space-y-4">
            <Card className="p-6 rounded-3xl shadow-md bg-white/90 backdrop-blur-sm min-h-[500px] flex flex-col">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto mb-4 space-y-4">
                {conversation.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] p-4 rounded-2xl ${
                        msg.role === "user"
                          ? "bg-[#ec4899] text-white"
                          : "bg-pink-50 border border-pink-200"
                      }`}
                    >
                      {msg.role === "ai" ? (
                        <div>
                          <div className="markdown-content">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                              {msg.message.replace(/\\n/g, '\n').replace(/^["“”&quot;]+|["“”&quot;]+$/g, '')}
                            </ReactMarkdown>
                          </div>
                          <div className="flex gap-1 mt-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 px-2 text-xs"
                              onClick={() => {
                                navigator.clipboard.writeText(msg.message.replace(/\\n/g, '\n').replace(/^["“”&quot;]+|["“”&quot;]+$/g, ''));
                                setButtonStatus(prev => ({...prev, [`copy-${idx}`]: 'コピーしました'}));
                                setTimeout(() => setButtonStatus(prev => ({...prev, [`copy-${idx}`]: ''})), 2000);
                              }}
                            >
                              <Copy className="w-3 h-3 mr-1" />
                              {buttonStatus[`copy-${idx}`] || 'コピー'}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 px-2 text-xs"
                              onClick={() => {
                                setButtonStatus(prev => ({...prev, [`like-${idx}`]: '評価しました'}));
                                setTimeout(() => setButtonStatus(prev => ({...prev, [`like-${idx}`]: ''})), 2000);
                              }}
                            >
                              {buttonStatus[`like-${idx}`] ? '✓' : '👍'}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 px-2 text-xs"
                              onClick={() => {
                                setButtonStatus(prev => ({...prev, [`bad-${idx}`]: '評価しました'}));
                                setTimeout(() => setButtonStatus(prev => ({...prev, [`bad-${idx}`]: ''})), 2000);
                              }}
                            >
                              {buttonStatus[`bad-${idx}`] ? '✓' : '👎'}
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm">{msg.message}</p>
                      )}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-pink-50 border border-pink-200 p-4 rounded-2xl">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Emotion Selector */}
              <div className="mb-4">
                <p className="text-sm text-muted-foreground mb-2">How are you feeling?</p>
                <div className="flex gap-2 flex-wrap">
                  {emotions.map((emotion) => (
                    <button
                      key={emotion.id}
                      onClick={() => setSelectedEmotion(emotion.id)}
                      className={`px-4 py-2 rounded-xl border-2 transition-all ${
                        selectedEmotion === emotion.id
                          ? "border-[#ec4899] bg-pink-50"
                          : "border-border hover:border-muted-foreground"
                      }`}
                    >
                      <span className="mr-2">{emotion.emoji}</span>
                      <span className="text-sm">{emotion.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Input */}
              <div className="flex gap-2">
                <Textarea
                  value={userMessage}
                  onChange={(e) => setUserMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder="Share what's on your mind..."
                  className="rounded-xl resize-none"
                  rows={3}
                />
                <Button
                  onClick={handleSend}
                  disabled={loading}
                  className="rounded-xl bg-[#ec4899] hover:bg-[#db2777]"
                >
                  {loading ? "..." : <Heart className="w-5 h-5" />}
                </Button>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Stories */}
            <Card className="p-4 rounded-2xl shadow-sm bg-white/90 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-3">
                <BookOpen className="w-5 h-5 text-[#ec4899]" />
                <h4>Mentor Stories</h4>
              </div>
              <div className="space-y-2">
                {stories.map((story, idx) => (
                  <Dialog key={idx}>
                    <DialogTrigger asChild>
                      <button className="w-full p-3 bg-pink-50 hover:bg-pink-100 rounded-xl text-left transition-colors">
                        <p className="text-sm mb-1">{story.title}</p>
                        <p className="text-xs text-muted-foreground">{story.summary}</p>
                      </button>
                    </DialogTrigger>
                    <DialogContent className="rounded-3xl">
                      <DialogHeader>
                        <DialogTitle>{story.title}</DialogTitle>
                      </DialogHeader>
                      <p className="text-sm">{story.content}</p>
                    </DialogContent>
                  </Dialog>
                ))}
              </div>
            </Card>

            {/* Action Plan */}
            <Card className="p-4 rounded-2xl shadow-sm bg-white/90 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-3">
                <CheckSquare className="w-5 h-5 text-[#16a34a]" />
                <h4>Action Plan</h4>
              </div>
              <div className="space-y-2">
                {actionItems.map((item) => (
                  <div key={item.id} className="flex items-start gap-2">
                    <Checkbox
                      id={`action-${item.id}`}
                      checked={item.completed}
                      onCheckedChange={() => toggleActionItem(item.id)}
                      className="mt-1"
                    />
                    <label
                      htmlFor={`action-${item.id}`}
                      className={`text-sm cursor-pointer flex-1 ${
                        item.completed ? "line-through text-muted-foreground" : ""
                      }`}
                    >
                      {item.text}
                    </label>
                  </div>
                ))}
              </div>
            </Card>

            {/* Save Reflection */}
            {conversation.length > 2 && (
              <Button className="w-full rounded-xl bg-[#ec4899] hover:bg-[#db2777]">
                Save Reflection
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}