import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { ArrowLeft, MessageSquare, Lightbulb } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

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
  const [conversation, setConversation] = useState<Array<{ role: "user" | "ai"; message: string }>>([
    {
      role: "ai",
      message: "Hello! I'm your Communication Mentor. Let's work on structuring your thoughts clearly. Start by describing a situation or topic you need to communicate about."
    }
  ]);
  const [showFeedback, setShowFeedback] = useState(false);

  const handleSend = () => {
    if (!userInput.trim()) return;

    setConversation([
      ...conversation,
      { role: "user", message: userInput },
      {
        role: "ai",
        message: "Great! Let me help you structure this using the Pyramid Structure. Start with your main conclusion first - what's the key message you want to convey?"
      }
    ]);
    setUserInput("");
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
                      <p className="text-sm">{msg.message}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Input */}
              <div className="flex gap-2">
                <Textarea
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder="Describe your situation or message..."
                  className="rounded-xl resize-none"
                  rows={3}
                />
                <Button
                  onClick={handleSend}
                  className="rounded-xl bg-[#0073bb] hover:bg-[#005a94]"
                >
                  <MessageSquare className="w-5 h-5" />
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
