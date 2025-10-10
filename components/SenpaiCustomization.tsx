import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { ArrowLeft, Sparkles } from "lucide-react";

interface SenpaiCustomizationProps {
  onBack: () => void;
}

const characterTypes = [
  { id: "kind", label: "Kind", emoji: "😊", color: "#ec4899" },
  { id: "strict", label: "Strict", emoji: "📚", color: "#0073bb" },
  { id: "logical", label: "Logical", emoji: "🤔", color: "#8b5cf6" },
  { id: "funny", label: "Funny", emoji: "😄", color: "#f59e0b" },
];

export function SenpaiCustomization({ onBack }: SenpaiCustomizationProps) {
  const [selectedType, setSelectedType] = useState("kind");
  const [name, setName] = useState("Senpai");

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white border-b border-border">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h2>Customize Your Senpai</h2>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <Card className="p-8 rounded-3xl shadow-lg">
          <div className="flex flex-col items-center mb-8">
            <div className="relative">
              <Avatar className="w-32 h-32 mb-4">
                <AvatarFallback className="bg-gradient-to-br from-[#0073bb] to-[#005a94]">
                  <span className="text-5xl">{characterTypes.find(t => t.id === selectedType)?.emoji}</span>
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md">
                <Sparkles className="w-5 h-5 text-[#0073bb]" />
              </div>
            </div>
            <h2 className="mt-4">{name}</h2>
            <p className="text-muted-foreground">Your AI Mentor</p>
          </div>

          <div className="space-y-6">
            <div className="space-y-3">
              <Label>Character Type</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {characterTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setSelectedType(type.id)}
                    className={`p-4 rounded-2xl border-2 transition-all ${
                      selectedType === type.id
                        ? "border-[#0073bb] bg-blue-50"
                        : "border-border hover:border-muted-foreground"
                    }`}
                  >
                    <div className="text-3xl mb-2">{type.emoji}</div>
                    <div className="text-sm">{type.label}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Mentor Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter a name for your mentor"
                className="rounded-xl"
              />
            </div>

            <div className="pt-4">
              <Button className="w-full rounded-xl bg-[#0073bb] hover:bg-[#005a94]">
                Save Changes
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}