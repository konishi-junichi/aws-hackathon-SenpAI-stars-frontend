import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Brain } from "lucide-react";

interface LoginScreenProps {
  onLogin: () => void;
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin();
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <div className="w-full max-w-md p-8">
        <div className="bg-white rounded-3xl shadow-lg p-10">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-[#0073bb] rounded-2xl flex items-center justify-center mb-4">
              <Brain className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-[#0073bb]">Senpai AI</h1>
            <p className="text-muted-foreground mt-2">Your AI Learning Mentor</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-xl"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="rounded-xl"
                required
              />
            </div>

            <Button type="submit" className="w-full rounded-xl bg-[#0073bb] hover:bg-[#005a94]">
              Login
            </Button>
          </form>

          <div className="flex justify-between mt-6 text-sm">
            <button className="text-[#0073bb] hover:underline">
              Create account
            </button>
            <button className="text-muted-foreground hover:underline">
              Forgot password?
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}