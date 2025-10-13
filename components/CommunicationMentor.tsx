import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { ArrowLeft, MessageSquare, Lightbulb, Copy } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { useBedrockAgent } from "../lib/bedrock-agent";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface CommunicationMentorProps {
  onBack: () => void;
}

const frameworks = [
  { name: "5W1H", description: "Who, What, When, Where, Why, How" },
  { name: "Pyramid Structure", description: "Conclusion → Key Points → Details" },
  { name: "PREP", description: "Point, Reason, Example, Point" },
];

export function CommunicationMentor({ onBack }: CommunicationMentorProps) {
  const [role, setRole] = useState("client");
  const [userInput, setUserInput] = useState("");
  const [conversation, setConversation] = useState<Array<{ role: "user" | "ai"; message: string }>>([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [loading, setLoading] = useState(false);
  const [buttonStatus, setButtonStatus] = useState<{[key: string]: string}>({});
  const { sendMessage } = useBedrockAgent();

  const handleSend = async () => {
    if (!userInput.trim() || loading) return;

    const userMessage = userInput;
    setUserInput("");
    setLoading(true);
    
    setConversation(prev => [...prev, { role: "user", message: userMessage }]);
    
    try {
      const contextMessage = `Role: ${role}. Communication context: ${userMessage}`;
      const response = await sendMessage(contextMessage, 'communication-session');
      setConversation(prev => [...prev, { role: "ai", message: response }]);
    } catch (error) {
      setConversation(prev => [...prev, { role: "ai", message: "Sorry, I'm having trouble connecting right now. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  const handleShowFeedback = () => {
    setShowFeedback(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h2 className="text-[#0073bb]">Communication Mentor</h2>
        </div>
      </div>

      {/* Welcome Message */}
      <div className="max-w-6xl mx-auto px-6 py-4 bg-blue-50 border-b">
        <p className="text-sm text-[#0073bb]">
          Hello! I'm your Communication Mentor. Let's work on structuring your thoughts clearly. Start by describing a situation or topic you need to communicate about.
        </p>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid md:grid-cols-3 gap-6">
          {/* Sidebar */}
          <div className="space-y-4">
            <Card className="p-4 rounded-2xl shadow-sm">
              <h4 className="mb-3">Select Role</h4>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="client">Client</SelectItem>
                  <SelectItem value="leader">Leader</SelectItem>
                  <SelectItem value="colleague">Colleague</SelectItem>
                </SelectContent>
              </Select>
            </Card>

            <Card className="p-4 rounded-2xl shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb className="w-5 h-5 text-[#ea580c]" />
                <h4>Logic Frameworks</h4>
              </div>
              <div className="space-y-2">
                {frameworks.map((framework) => (
                  <div key={framework.name} className="p-3 bg-muted rounded-xl">
                    <p className="mb-1">{framework.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {framework.description}
                    </p>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Chat Area */}
          <div className="md:col-span-2 space-y-4">
            <Card className="p-6 rounded-3xl shadow-md min-h-[500px] flex flex-col">
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
                          ? "bg-[#0073bb] text-white"
                          : "bg-muted"
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
                              {buttonStatus[`copy-${idx}` as string] || 'コピー'}
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
                              {buttonStatus[`like-${idx}` as string] ? '✓' : '👍'}
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
                              {buttonStatus[`bad-${idx}` as string] ? '✓' : '👎'}
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
                    <div className="bg-muted p-4 rounded-2xl">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Input */}
              <div className="flex gap-2">
                <Textarea
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder="Describe your situation or message..."
                  className="rounded-xl resize-none"
                  rows={3}
                />
                <Button
                  onClick={handleSend}
                  disabled={loading}
                  className="rounded-xl bg-[#0073bb] hover:bg-[#005a94]"
                >
                  {loading ? "..." : <MessageSquare className="w-5 h-5" />}
                </Button>
              </div>
            </Card>

            {conversation.length > 4 && (
              <Button
                onClick={handleShowFeedback}
                className="w-full rounded-xl bg-[#ea580c] hover:bg-[#c2410c]"
              >
                Get Feedback
              </Button>
            )}

            {showFeedback && (
              <div className="space-y-4">
                <Card className="p-6 rounded-2xl shadow-sm bg-green-50 border-[#16a34a]">
                  <h4 className="text-[#16a34a] mb-3">✓ Well Done</h4>
                  <ul className="space-y-2 text-sm">
                    <li>• Clear opening statement</li>
                    <li>• Good use of specific examples</li>
                    <li>• Maintained professional tone</li>
                  </ul>
                </Card>

                <Card className="p-6 rounded-2xl shadow-sm bg-blue-50 border-[#0073bb]">
                  <h4 className="text-[#0073bb] mb-3">💡 To Improve</h4>
                  <ul className="space-y-2 text-sm">
                    <li>• Consider adding more context about the "why"</li>
                    <li>• Structure your points in order of priority</li>
                    <li>• Include a clear call-to-action at the end</li>
                  </ul>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}