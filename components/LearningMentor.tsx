import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { ArrowLeft, Upload, Database, FileText, Link, Plus, X, CheckCircle, XCircle } from "lucide-react";
import { BedrockAgentCoreClient, InvokeAgentRuntimeCommand } from '@aws-sdk/client-bedrock-agentcore';
import { useCognitoAuth } from '../lib/amplify';

interface LearningMentorProps {
  onBack: () => void;
}

export function LearningMentor({ onBack }: LearningMentorProps) {
  const { getCredentials } = useCognitoAuth();
  const [database, setDatabase] = useState<string>("");
  const [files, setFiles] = useState<File[]>([]);
  const [requirements, setRequirements] = useState<string>("");
  const [urls, setUrls] = useState<string[]>([""]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [step, setStep] = useState<'setup' | 'quiz' | 'results'>('setup');
  const [quizData, setQuizData] = useState<any>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);
    setFiles(prev => [...prev, ...selectedFiles]);
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const addUrlField = () => {
    setUrls(prev => [...prev, ""]);
  };

  const removeUrlField = (index: number) => {
    setUrls(prev => prev.filter((_, i) => i !== index));
  };

  const updateUrl = (index: number, value: string) => {
    setUrls(prev => prev.map((url, i) => i === index ? value : url));
  };

  const handleGenerateQuiz = async () => {
    if (!requirements.trim()) {
      alert('Please enter quiz generation requirements');
      return;
    }

    setIsGenerating(true);
    try {
      const credentials = await getCredentials();
      
      const client = new BedrockAgentCoreClient({
        region: process.env.NEXT_PUBLIC_AWS_BEDROCK_REGION || process.env.NEXT_PUBLIC_AWS_REGION,
        credentials
      });

      const command = new InvokeAgentRuntimeCommand({
        runtimeSessionId: 'training-session-' + Date.now().toString().padEnd(33, '0'),
        agentRuntimeArn: process.env.NEXT_PUBLIC_TRAINING_AGENT_ARN,
        qualifier: 'DEFAULT',
        payload: new TextEncoder().encode(JSON.stringify({ prompt: requirements }))
      });

      const response = await client.send(command);
      const textResponse = await response.response?.transformToString();
      
      // JSONが文字列として返される場合の処理
      let parsedData;
      try {
        // まず直接パース
        parsedData = JSON.parse(textResponse || '{}');
        // もしstringの場合は再度パース
        if (typeof parsedData === 'string') {
          parsedData = JSON.parse(parsedData);
        }
      } catch (e) {
        console.error('JSON parse error:', e);
        parsedData = {};
      }
      
      console.log('Final parsed data:', parsedData);
      setQuizData(parsedData);
      setCurrentQuestion(0);
      setUserAnswers([]);
      setStep('quiz');
    } catch (error) {
      console.error('Quiz generation error:', error);
      alert('Failed to generate quiz');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAnswerSelect = (answer: string) => {
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestion] = answer;
    setUserAnswers(newAnswers);
  };

  const handleNext = () => {
    if (quizData?.questions && currentQuestion < quizData.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setStep('results');
    }
  };

  const handleRestart = () => {
    setStep('setup');
    setQuizData(null);
    setCurrentQuestion(0);
    setUserAnswers([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white border-b border-border">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={step === 'setup' ? onBack : handleRestart}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h2 className="text-[#16a34a]">Learning Mentor</h2>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {step === 'setup' ? (
          <div className="space-y-8">
            <div>
              <h1>Quiz Generation</h1>
              <p className="text-muted-foreground mt-1">
                Configure the following settings to generate a customized quiz
              </p>
            </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 1. Database Selection - Left */}
            <Card className="p-4 rounded-2xl shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <Database className="w-5 h-5 text-[#0073bb]" />
                <h3 className="text-sm font-medium">Internal Learning Database</h3>
              </div>
              <Select value={database} onValueChange={setDatabase}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Select Database" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="nothing">Nothing</SelectItem>
                  <SelectItem value="business-writing">Business Writing</SelectItem>
                  <SelectItem value="logical-thinking">Logical Thinking</SelectItem>
                  <SelectItem value="meeting-skills">Meeting Skills</SelectItem>
                  <SelectItem value="project-management">Project Management</SelectItem>
                  <SelectItem value="task-management">Task Management</SelectItem>
                  <SelectItem value="ms-office-skills">MS Office Skills</SelectItem>
                  <SelectItem value="si-basic">SI Basic</SelectItem>
                  <SelectItem value="ai-literacy">AI Literacy</SelectItem>
                  <SelectItem value="data-visualization-basics">Data & Visualization Basics</SelectItem>
                  <SelectItem value="ai-business-application">AI Business Application</SelectItem>
                  <SelectItem value="prompt-engineering">Prompt Engineering for Consultants</SelectItem>
                  <SelectItem value="ai-problem-solving">AI × Problem Solving</SelectItem>
                  <SelectItem value="ai-collaboration-ethics">AI Collaboration & Ethics</SelectItem>
                </SelectContent>
              </Select>
            </Card>

            {/* 2. File Upload & Requirements - Right */}
            <Card className="lg:col-span-2 p-4 rounded-2xl shadow-sm">
              <div className="space-y-4">
                {/* Requirements Input */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <FileText className="w-5 h-5 text-[#ea580c]" />
                    <h3 className="text-sm font-medium">Quiz Generation Requirements</h3>
                  </div>
                  <Textarea
                    value={requirements}
                    onChange={(e) => setRequirements(e.target.value)}
                    placeholder="Describe what kind of quiz you want to generate...&#10;Example: 5 multiple choice questions about AWS S3 basic features"
                    className="rounded-xl min-h-[120px] resize-none text-sm"
                  />
                </div>

                {/* File Upload - Compact */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="w-4 h-4 text-[#16a34a]" />
                    <h3 className="text-sm font-medium">File Upload</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="cursor-pointer flex items-center gap-2 px-3 py-2 border-2 border-dashed border-border rounded-lg hover:border-[#16a34a] transition-colors">
                      <input
                        type="file"
                        multiple
                        accept=".pdf,.html,.txt"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <Plus className="w-4 h-4 text-[#16a34a]" />
                      <span className="text-xs font-medium text-[#16a34a]">
                        Select Files
                      </span>
                    </label>
                    <span className="text-xs text-muted-foreground">PDF, HTML, TXT</span>
                  </div>
                  {files.length > 0 && (
                    <div className="space-y-1 mt-2">
                      {files.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-green-50 rounded-lg border border-green-200">
                          <span className="text-xs font-medium truncate">{file.name}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile(index)}
                            className="h-5 w-5 p-0 hover:bg-red-100"
                          >
                            <X className="w-3 h-3 text-red-500" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </div>

          {/* 3. URL Links - Compact */}
          <Card className="p-4 rounded-2xl shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <Link className="w-4 h-4 text-[#0073bb]" />
              <h3 className="text-sm font-medium">Reference URLs</h3>
            </div>
            
            <div className="space-y-2">
              {urls.map((url, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={url}
                    onChange={(e) => updateUrl(index, e.target.value)}
                    placeholder="https://example.com"
                    className="rounded-lg flex-1 text-sm h-8"
                  />
                  {urls.length > 1 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeUrlField(index)}
                      className="rounded-lg h-8 w-8 p-0"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  )}
                </div>
              ))}
              
              <Button
                variant="outline"
                onClick={addUrlField}
                className="rounded-lg w-full border-dashed h-8 text-sm"
              >
                <Plus className="w-3 h-3 mr-1" />
                Add URL
              </Button>
            </div>
          </Card>

          {/* Generate Button */}
          <div className="flex justify-center pt-6">
            <Button
              onClick={handleGenerateQuiz}
              disabled={isGenerating}
              className="rounded-xl bg-[#16a34a] hover:bg-[#15803d] px-8 py-3 text-lg"
              size="lg"
            >
              {isGenerating ? 'Generating...' : 'Generate Quiz'}
            </Button>
          </div>
        </div>
        ) : step === 'results' ? (
          <div className="space-y-6">
            <h1>Results</h1>
            <Card className="p-8 rounded-2xl text-center">
              <div className="text-6xl mb-4">
                {userAnswers.filter((answer, i) => answer === quizData?.answers?.[i]).length === quizData?.questions?.length ? '🎉' : '💪'}
              </div>
              <h1 className="text-4xl font-bold text-[#16a34a] mb-2">
                {Math.round((userAnswers.filter((answer, i) => answer === quizData?.answers?.[i]).length / (quizData?.questions?.length || 1)) * 100)}%
              </h1>
              <p className="text-lg mb-6">
                {userAnswers.filter((answer, i) => answer === quizData?.answers?.[i]).length}/{quizData?.questions?.length || 0} Correct
              </p>
            </Card>
            
            <div className="space-y-4">
              {quizData?.questions?.map((question: string, i: number) => {
                const isCorrect = userAnswers[i] === quizData?.answers?.[i];
                return (
                  <Card key={i} className={`p-4 rounded-xl border-2 ${
                    isCorrect ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'
                  }`}>
                    <div className="flex items-start gap-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                        isCorrect ? 'bg-green-500' : 'bg-red-500'
                      }`}>
                        {isCorrect ? '✓' : '×'}
                      </div>
                      <div className="flex-1">
                        <h3 className="mb-2 font-medium">Question {i + 1}: {question}</h3>
                        <p className="text-sm mb-1">Your Answer: <span className={isCorrect ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>{userAnswers[i] || 'No Answer'}</span></p>
                        {!isCorrect && (
                          <p className="text-sm mb-2 text-green-600 font-medium">Correct Answer: {quizData?.answers?.[i]}</p>
                        )}
                        <p className="text-sm text-muted-foreground">{quizData?.explanations?.[i]}</p>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
            
            <div className="flex gap-4 justify-center">
              <Button onClick={handleRestart} className="rounded-xl bg-[#16a34a] hover:bg-[#15803d]">
                Create New Quiz
              </Button>
              <Button onClick={onBack} variant="outline" className="rounded-xl">
                Exit
              </Button>
            </div>
          </div>
        ) : step === 'quiz' && quizData && quizData.questions ? (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h1>Question {currentQuestion + 1}/{quizData.questions.length}</h1>
              <div className="text-sm text-muted-foreground">
                Progress: {Math.round(((currentQuestion + 1) / quizData.questions.length) * 100)}%
              </div>
            </div>
            <Card className="p-6 rounded-2xl">
              <h2 className="mb-6">{quizData.questions[currentQuestion]}</h2>
              <div className="space-y-3">
                {quizData.selects && quizData.selects[currentQuestion] && Object.entries(quizData.selects[currentQuestion]).map(([key, value]) => (
                  <button
                    key={key}
                    onClick={() => handleAnswerSelect(key)}
                    className={`w-full p-4 text-left rounded-xl border-2 transition-all ${
                      userAnswers[currentQuestion] === key
                        ? 'border-[#16a34a] bg-green-50'
                        : 'border-border hover:border-muted-foreground'
                    }`}
                  >
                    {key}. {value as string}
                  </button>
                ))}
              </div>
              <div className="flex justify-end mt-6">
                <Button
                  onClick={handleNext}
                  disabled={!userAnswers[currentQuestion]}
                  className="rounded-xl bg-[#16a34a] hover:bg-[#15803d]"
                >
                  {currentQuestion < quizData.questions.length - 1 ? 'Next' : 'View Results'}
                </Button>
              </div>
            </Card>
          </div>
        ) : (
          <div className="text-center py-8">
            <p>Loading quiz data...</p>
            <pre className="mt-4 text-xs text-left">{JSON.stringify(quizData, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
}