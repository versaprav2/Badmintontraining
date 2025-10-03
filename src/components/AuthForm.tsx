import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

interface AuthFormProps {
  onAuth: (profile: UserProfile) => void;
}

export interface UserProfile {
  name: string;
  level: "beginner" | "intermediate" | "advanced";
  dominantHand: "left" | "right";
}

export const AuthForm = ({ onAuth }: AuthFormProps) => {
  const [isSignUp, setIsSignUp] = useState(true);
  const [name, setName] = useState("");
  const [level, setLevel] = useState<"beginner" | "intermediate" | "advanced">("beginner");
  const [dominantHand, setDominantHand] = useState<"left" | "right">("right");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast.error("Please enter your name");
      return;
    }

    const profile: UserProfile = {
      name: name.trim(),
      level,
      dominantHand,
    };

    localStorage.setItem("userProfile", JSON.stringify(profile));
    toast.success(`Welcome ${isSignUp ? "aboard" : "back"}, ${profile.name}!`);
    onAuth(profile);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background via-primary/5 to-background p-4">
      <Card className="w-full max-w-md p-8 border-2">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
            {isSignUp ? "Join BadmintonTrain" : "Welcome Back"}
          </h1>
          <p className="text-muted-foreground">
            {isSignUp ? "Create your player profile" : "Sign in to continue training"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Player Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {isSignUp && (
            <>
              <div className="space-y-2">
                <Label htmlFor="level">Skill Level</Label>
                <Select value={level} onValueChange={(value: any) => setLevel(value)}>
                  <SelectTrigger id="level">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="hand">Dominant Hand</Label>
                <Select value={dominantHand} onValueChange={(value: any) => setDominantHand(value)}>
                  <SelectTrigger id="hand">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="right">Right</SelectItem>
                    <SelectItem value="left">Left</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          <Button type="submit" className="w-full" size="lg">
            {isSignUp ? "Create Profile" : "Sign In"}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            {isSignUp ? "Already have a profile? Sign in" : "New player? Create profile"}
          </button>
        </div>
      </Card>
    </div>
  );
};
