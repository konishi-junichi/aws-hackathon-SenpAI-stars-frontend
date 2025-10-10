import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { BookOpen, MessageSquare, Heart, History, Settings, TrendingUp } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface DashboardProps {
  onNavigate: (screen: string) => void;
  onLogout: () => void;
}

const memoryData = [
  { day: "Mon", retention: 85 },
  { day: "Tue", retention: 75 },
  { day: "Wed", retention: 82 },
  { day: "Thu", retention: 78 },
  { day: "Fri", retention: 88 },
  { day: "Sat", retention: 92 },
  { day: "Sun", retention: 90 },
];

export function Dashboard({ onNavigate, onLogout }: DashboardProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h2 className="text-[#0073bb]">Senpai AI</h2>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => onNavigate("history")}>
              <History className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => onNavigate("settings")}>
              <Settings className="w-5 h-5" />
            </Button>
            <Avatar>
              <AvatarFallback className="bg-[#0073bb] text-white">JD</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1>Welcome back, John!</h1>
          <p className="text-muted-foreground mt-1">Continue your learning journey with your AI mentors</p>
        </div>

        {/* Progress Chart */}
        <Card className="p-6 mb-8 rounded-3xl shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-[#16a34a]" />
            <h3>Memory Retention Curve</h3>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={memoryData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="retention" stroke="#0073bb" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Re-test Suggestions */}
        <div className="mb-8">
          <h3 className="mb-4">Re-test Suggestions</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="p-4 rounded-2xl shadow-sm border-l-4 border-l-[#ea580c]">
              <p className="text-sm text-muted-foreground mb-1">AWS Services Quiz</p>
              <p>Your memory retention: 72%</p>
              <Button className="mt-3 rounded-xl bg-[#ea580c] hover:bg-[#c2410c]" size="sm">
                Retake Now
              </Button>
            </Card>
            <Card className="p-4 rounded-2xl shadow-sm border-l-4 border-l-[#ea580c]">
              <p className="text-sm text-muted-foreground mb-1">Cloud Architecture</p>
              <p>Your memory retention: 68%</p>
              <Button className="mt-3 rounded-xl bg-[#ea580c] hover:bg-[#c2410c]" size="sm">
                Retake Now
              </Button>
            </Card>
          </div>
        </div>

        {/* AI Mentor Cards */}
        <div className="mb-4">
          <h3 className="mb-4">Choose Your Mentor</h3>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {/* Learning Mentor */}
          <Card 
            className="p-6 rounded-3xl shadow-md hover:shadow-xl transition-all cursor-pointer group"
            onClick={() => onNavigate("learning")}
          >
            <div className="w-14 h-14 bg-[#16a34a] rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <h3>Learning Mentor</h3>
            <p className="text-muted-foreground mt-2 mb-4">
              Create quiz questions from documents and track your progress
            </p>
            <Button className="w-full rounded-xl bg-[#16a34a] hover:bg-[#15803d]">
              Start Learning
            </Button>
          </Card>

          {/* Communication Mentor */}
          <Card 
            className="p-6 rounded-3xl shadow-md hover:shadow-xl transition-all cursor-pointer group"
            onClick={() => onNavigate("communication")}
          >
            <div className="w-14 h-14 bg-[#0073bb] rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <MessageSquare className="w-8 h-8 text-white" />
            </div>
            <h3>Communication Mentor</h3>
            <p className="text-muted-foreground mt-2 mb-4">
              Train logical thinking and professional communication
            </p>
            <Button className="w-full rounded-xl bg-[#0073bb] hover:bg-[#005a94]">
              Start Training
            </Button>
          </Card>

          {/* Counseling Mentor */}
          <Card 
            className="p-6 rounded-3xl shadow-md hover:shadow-xl transition-all cursor-pointer group"
            onClick={() => onNavigate("counseling")}
          >
            <div className="w-14 h-14 bg-[#ec4899] rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <h3>Counseling Mentor</h3>
            <p className="text-muted-foreground mt-2 mb-4">
              Get empathetic support and self-reflection guidance
            </p>
            <Button className="w-full rounded-xl bg-[#ec4899] hover:bg-[#db2777]">
              Start Session
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
