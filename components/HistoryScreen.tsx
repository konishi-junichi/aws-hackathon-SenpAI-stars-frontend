import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { ArrowLeft, BookOpen, MessageSquare, Heart, Download, RotateCcw } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface HistoryScreenProps {
  onBack: () => void;
}

const historyData = [
  { date: "Oct 1", score: 75 },
  { date: "Oct 3", score: 82 },
  { date: "Oct 5", score: 78 },
  { date: "Oct 7", score: 88 },
  { date: "Oct 9", score: 92 },
];

const learningHistory = [
  {
    id: 1,
    type: "learning",
    title: "AWS Services Quiz",
    date: "October 9, 2025",
    score: 92,
    icon: BookOpen,
    color: "#16a34a"
  },
  {
    id: 2,
    type: "communication",
    title: "Client Presentation Practice",
    date: "October 8, 2025",
    feedback: "Great structure and clarity",
    icon: MessageSquare,
    color: "#0073bb"
  },
  {
    id: 3,
    type: "counseling",
    title: "Reflection: Work-Life Balance",
    date: "October 7, 2025",
    notes: "Feeling more balanced after setting boundaries",
    icon: Heart,
    color: "#ec4899"
  },
  {
    id: 4,
    type: "learning",
    title: "Cloud Architecture Quiz",
    date: "October 5, 2025",
    score: 78,
    icon: BookOpen,
    color: "#16a34a"
  },
];

export function HistoryScreen({ onBack }: HistoryScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h2>Learning History</h2>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="rounded-2xl">
            <TabsTrigger value="all" className="rounded-xl">All</TabsTrigger>
            <TabsTrigger value="learning" className="rounded-xl">Learning</TabsTrigger>
            <TabsTrigger value="communication" className="rounded-xl">Communication</TabsTrigger>
            <TabsTrigger value="counseling" className="rounded-xl">Counseling</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-6">
            {/* Progress Chart */}
            <Card className="p-6 rounded-3xl shadow-md">
              <h3 className="mb-4">Learning Progress</h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={historyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="score" stroke="#0073bb" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </Card>

            {/* Timeline */}
            <div className="space-y-4">
              <h3>Activity Timeline</h3>
              {learningHistory.map((item) => {
                const Icon = item.icon;
                return (
                  <Card key={item.id} className="p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-4">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: `${item.color}20` }}
                      >
                        <Icon className="w-6 h-6" style={{ color: item.color }} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4>{item.title}</h4>
                            <p className="text-sm text-muted-foreground">{item.date}</p>
                          </div>
                          <div className="flex gap-2">
                            {item.type === "learning" && (
                              <Button variant="ghost" size="sm" className="rounded-xl">
                                <RotateCcw className="w-4 h-4 mr-1" />
                                Retry
                              </Button>
                            )}
                            <Button variant="ghost" size="sm" className="rounded-xl">
                              <Download className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        {item.score !== undefined && (
                          <div className="flex items-center gap-2">
                            <div className="text-2xl" style={{ color: item.color }}>
                              {item.score}%
                            </div>
                          </div>
                        )}
                        {item.feedback && (
                          <p className="text-sm text-muted-foreground">{item.feedback}</p>
                        )}
                        {item.notes && (
                          <p className="text-sm text-muted-foreground italic">{item.notes}</p>
                        )}
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="learning">
            <div className="space-y-4">
              {learningHistory
                .filter((item) => item.type === "learning")
                .map((item) => {
                  const Icon = item.icon;
                  return (
                    <Card key={item.id} className="p-6 rounded-2xl shadow-sm">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                          <Icon className="w-6 h-6 text-[#16a34a]" />
                        </div>
                        <div className="flex-1">
                          <h4>{item.title}</h4>
                          <p className="text-sm text-muted-foreground">{item.date}</p>
                          <div className="text-2xl text-[#16a34a] mt-2">{item.score}%</div>
                        </div>
                      </div>
                    </Card>
                  );
                })}
            </div>
          </TabsContent>

          <TabsContent value="communication">
            <div className="space-y-4">
              {learningHistory
                .filter((item) => item.type === "communication")
                .map((item) => {
                  const Icon = item.icon;
                  return (
                    <Card key={item.id} className="p-6 rounded-2xl shadow-sm">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                          <Icon className="w-6 h-6 text-[#0073bb]" />
                        </div>
                        <div className="flex-1">
                          <h4>{item.title}</h4>
                          <p className="text-sm text-muted-foreground">{item.date}</p>
                          <p className="text-sm mt-2">{item.feedback}</p>
                        </div>
                      </div>
                    </Card>
                  );
                })}
            </div>
          </TabsContent>

          <TabsContent value="counseling">
            <div className="space-y-4">
              {learningHistory
                .filter((item) => item.type === "counseling")
                .map((item) => {
                  const Icon = item.icon;
                  return (
                    <Card key={item.id} className="p-6 rounded-2xl shadow-sm">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center">
                          <Icon className="w-6 h-6 text-[#ec4899]" />
                        </div>
                        <div className="flex-1">
                          <h4>{item.title}</h4>
                          <p className="text-sm text-muted-foreground">{item.date}</p>
                          <p className="text-sm italic mt-2">{item.notes}</p>
                        </div>
                      </div>
                    </Card>
                  );
                })}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
