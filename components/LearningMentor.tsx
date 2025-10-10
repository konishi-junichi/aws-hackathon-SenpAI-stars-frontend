import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { ArrowLeft, Upload, Youtube, Cloud, CheckCircle2, XCircle } from "lucide-react";
import { Progress } from "./ui/progress";

interface LearningMentorProps {
  onBack: () => void;
}

const mockQuestions = [
  {
    id: 1,
    question: "What is the primary purpose of Amazon S3?",
    options: [
      "Compute processing",
      "Object storage",
      "Database management",
      "Network routing"
    ],
    correctAnswer: 1
  },
  {
    id: 2,
    question: "Which AWS service is used for serverless computing?",
    options: [
      "EC2",
      "Lambda",
      "RDS",
      "S3"
    ],
    correctAnswer: 1
  },
  {
    id: 3,
    question: "What does IAM stand for in AWS?",
    options: [
      "Internet Access Manager",
      "Identity and Access Management",
      "Integrated Application Module",
      "Infrastructure Asset Monitor"
    ],
    correctAnswer: 1
  }
];

export function LearningMentor({ onBack }: LearningMentorProps) {
  const [step, setStep] = useState<"upload" | "quiz" | "results">("upload");
  const [answers, setAnswers] = useState<{ [key: number]: number }>({});
  const [showResults, setShowResults] = useState(false);

  const handleFileUpload = () => {
    setStep("quiz");
  };

  const handleSubmitQuiz = () => {
    setShowResults(true);
    setStep("results");
  };

  const score = Object.keys(answers).filter(
    (key) => answers[parseInt(key)] === mockQuestions[parseInt(key) - 1].correctAnswer
  ).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h2 className="text-[#16a34a]">Learning Mentor</h2>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {step === "upload" && (
          <div className="space-y-6">
            <div>
              <h1>Upload Learning Materials</h1>
              <p className="text-muted-foreground mt-1">
                Upload documents or provide links to generate quiz questions
              </p>
            </div>

            <Card className="p-8 rounded-3xl shadow-md">
              <div className="border-2 border-dashed border-border rounded-2xl p-12 text-center hover:border-[#16a34a] transition-colors cursor-pointer">
                <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="mb-2">Drop files here or click to upload</h3>
                <p className="text-muted-foreground text-sm">
                  Supports PDF, DOCX, TXT files
                </p>
              </div>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-6 rounded-2xl shadow-sm">
                <Youtube className="w-8 h-8 text-[#ff0000] mb-3" />
                <h3 className="mb-2">YouTube URL</h3>
                <Textarea
                  placeholder="Paste YouTube video URL..."
                  className="rounded-xl mb-3"
                />
                <Button className="w-full rounded-xl bg-[#16a34a] hover:bg-[#15803d]">
                  Import from YouTube
                </Button>
              </Card>

              <Card className="p-6 rounded-2xl shadow-sm">
                <Cloud className="w-8 h-8 text-[#0073bb] mb-3" />
                <h3 className="mb-2">Cloud Storage</h3>
                <Textarea
                  placeholder="OneDrive or SharePoint URL..."
                  className="rounded-xl mb-3"
                />
                <Button className="w-full rounded-xl bg-[#16a34a] hover:bg-[#15803d]">
                  Import from Cloud
                </Button>
              </Card>
            </div>

            <div className="flex justify-end">
              <Button
                onClick={handleFileUpload}
                className="rounded-xl bg-[#16a34a] hover:bg-[#15803d]"
              >
                Generate Questions
              </Button>
            </div>
          </div>
        )}

        {step === "quiz" && (
          <div className="space-y-6">
            <div>
              <h1>Quiz Time!</h1>
              <p className="text-muted-foreground mt-1">
                Answer the following questions generated from your materials
              </p>
            </div>

            <Progress value={(Object.keys(answers).length / mockQuestions.length) * 100} className="h-2" />

            <div className="space-y-4">
              {mockQuestions.map((q, idx) => (
                <Card key={q.id} className="p-6 rounded-2xl shadow-sm">
                  <h4 className="mb-4">
                    Question {idx + 1}: {q.question}
                  </h4>
                  <div className="space-y-2">
                    {q.options.map((option, optIdx) => (
                      <button
                        key={optIdx}
                        onClick={() => setAnswers({ ...answers, [q.id]: optIdx })}
                        className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                          answers[q.id] === optIdx
                            ? "border-[#16a34a] bg-green-50"
                            : "border-border hover:border-muted-foreground"
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </Card>
              ))}
            </div>

            <div className="flex justify-end">
              <Button
                onClick={handleSubmitQuiz}
                disabled={Object.keys(answers).length !== mockQuestions.length}
                className="rounded-xl bg-[#16a34a] hover:bg-[#15803d]"
              >
                Submit Quiz
              </Button>
            </div>
          </div>
        )}

        {step === "results" && (
          <div className="space-y-6">
            <div>
              <h1>Quiz Results</h1>
              <p className="text-muted-foreground mt-1">
                Great work! Here's how you did
              </p>
            </div>

            <Card className="p-8 rounded-3xl shadow-md bg-gradient-to-br from-green-50 to-white">
              <div className="text-center">
                <div className="text-6xl mb-4">
                  {score === mockQuestions.length ? "🎉" : score >= 2 ? "👍" : "💪"}
                </div>
                <h1 className="text-[#16a34a] mb-2">
                  {score}/{mockQuestions.length}
                </h1>
                <p className="text-muted-foreground">
                  You got {Math.round((score / mockQuestions.length) * 100)}% correct!
                </p>
              </div>
            </Card>

            <div className="space-y-4">
              {mockQuestions.map((q, idx) => {
                const userAnswer = answers[q.id];
                const isCorrect = userAnswer === q.correctAnswer;
                
                return (
                  <Card key={q.id} className="p-6 rounded-2xl shadow-sm">
                    <div className="flex items-start gap-4">
                      {isCorrect ? (
                        <CheckCircle2 className="w-6 h-6 text-[#16a34a] flex-shrink-0 mt-1" />
                      ) : (
                        <XCircle className="w-6 h-6 text-destructive flex-shrink-0 mt-1" />
                      )}
                      <div className="flex-1">
                        <h4 className="mb-2">{q.question}</h4>
                        <p className="text-sm text-muted-foreground mb-2">
                          Your answer: {q.options[userAnswer]}
                        </p>
                        {!isCorrect && (
                          <p className="text-sm text-[#16a34a]">
                            Correct answer: {q.options[q.correctAnswer]}
                          </p>
                        )}
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>

            {score < mockQuestions.length && (
              <Card className="p-6 rounded-2xl shadow-sm bg-blue-50 border-[#0073bb]">
                <h4 className="mb-2 text-[#0073bb]">💡 Re-test Suggestion</h4>
                <p className="text-sm mb-4">
                  To improve retention, we recommend retaking this quiz in 3 days.
                </p>
                <Button className="rounded-xl bg-[#0073bb] hover:bg-[#005a94]">
                  Schedule Re-test
                </Button>
              </Card>
            )}

            <div className="flex gap-4">
              <Button
                onClick={() => {
                  setStep("upload");
                  setAnswers({});
                  setShowResults(false);
                }}
                variant="outline"
                className="rounded-xl flex-1"
              >
                New Quiz
              </Button>
              <Button
                onClick={() => {
                  setAnswers({});
                  setStep("quiz");
                  setShowResults(false);
                }}
                className="rounded-xl flex-1 bg-[#16a34a] hover:bg-[#15803d]"
              >
                Retry Quiz
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}