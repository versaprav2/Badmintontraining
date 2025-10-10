import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Trophy, Target, Flame, Plus, CheckCircle2, Trash2, Calendar } from "lucide-react";
import { toast } from "sonner";

interface Goal {
  id: string;
  title: string;
  type: "matches" | "wins" | "training" | "streak" | "xp";
  target: number;
  current: number;
  deadline: string;
  completed: boolean;
  createdAt: string;
}

export const Goals = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [open, setOpen] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: "",
    type: "matches" as Goal["type"],
    target: 10,
    deadline: "",
  });

  useEffect(() => {
    loadGoals();
  }, []);

  const loadGoals = () => {
    const saved = localStorage.getItem("userGoals");
    if (saved) {
      const loadedGoals = JSON.parse(saved) as Goal[];
      
      // Update progress
      const updatedGoals = loadedGoals.map(goal => ({
        ...goal,
        current: calculateProgress(goal),
      }));
      
      setGoals(updatedGoals);
      localStorage.setItem("userGoals", JSON.stringify(updatedGoals));
    }
  };

  const calculateProgress = (goal: Goal) => {
    const matches = JSON.parse(localStorage.getItem("matches") || "[]");
    const activityLog = JSON.parse(localStorage.getItem("activityLog") || "[]");
    const totalXP = parseInt(localStorage.getItem("totalXP") || "0");
    const streak = parseInt(localStorage.getItem("currentStreak") || "0");
    
    const goalStart = new Date(goal.createdAt);
    const goalEnd = new Date(goal.deadline);
    
    switch (goal.type) {
      case "matches":
        return matches.filter((m: any) => {
          const date = new Date(m.date);
          return date >= goalStart && date <= goalEnd;
        }).length;
      
      case "wins":
        return matches.filter((m: any) => {
          const date = new Date(m.date);
          return m.result === "win" && date >= goalStart && date <= goalEnd;
        }).length;
      
      case "training":
        return activityLog.filter((a: any) => {
          const date = new Date(a.date);
          return a.type === "drill" && date >= goalStart && date <= goalEnd;
        }).length;
      
      case "streak":
        return streak;
      
      case "xp":
        // For XP goals, we'd need to track XP at goal creation time
        // For now, use total XP if goal started this session
        return totalXP;
      
      default:
        return 0;
    }
  };

  const handleCreateGoal = () => {
    if (!newGoal.title || !newGoal.deadline) {
      toast.error("Please fill in all fields");
      return;
    }

    const goal: Goal = {
      id: Date.now().toString(),
      title: newGoal.title,
      type: newGoal.type,
      target: newGoal.target,
      current: 0,
      deadline: newGoal.deadline,
      completed: false,
      createdAt: new Date().toISOString(),
    };

    const updatedGoals = [...goals, goal];
    setGoals(updatedGoals);
    localStorage.setItem("userGoals", JSON.stringify(updatedGoals));
    
    setOpen(false);
    setNewGoal({
      title: "",
      type: "matches",
      target: 10,
      deadline: "",
    });
    
    toast.success("Goal created!", {
      description: newGoal.title,
    });
  };

  const handleDeleteGoal = (id: string) => {
    const updatedGoals = goals.filter(g => g.id !== id);
    setGoals(updatedGoals);
    localStorage.setItem("userGoals", JSON.stringify(updatedGoals));
    toast.success("Goal deleted");
  };

  const getGoalIcon = (type: string) => {
    switch (type) {
      case "matches": return <Trophy className="w-5 h-5" />;
      case "wins": return <Trophy className="w-5 h-5" />;
      case "training": return <Target className="w-5 h-5" />;
      case "streak": return <Flame className="w-5 h-5" />;
      case "xp": return <CheckCircle2 className="w-5 h-5" />;
      default: return <Target className="w-5 h-5" />;
    }
  };

  const getGoalColor = (type: string) => {
    switch (type) {
      case "matches": return "from-secondary/20 to-orange-500/20 border-secondary/30";
      case "wins": return "from-primary/20 to-accent/20 border-primary/30";
      case "training": return "from-accent/20 to-primary/20 border-accent/30";
      case "streak": return "from-destructive/20 to-orange-600/20 border-destructive/30";
      case "xp": return "from-primary/20 to-secondary/20 border-primary/30";
      default: return "";
    }
  };

  const formatDeadline = (deadline: string) => {
    const date = new Date(deadline);
    const now = new Date();
    const diff = date.getTime() - now.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    
    if (days < 0) return "Expired";
    if (days === 0) return "Today";
    if (days === 1) return "Tomorrow";
    return `${days} days left`;
  };

  const activeGoals = goals.filter(g => !g.completed && new Date(g.deadline) >= new Date());
  const completedGoals = goals.filter(g => g.current >= g.target);
  const expiredGoals = goals.filter(g => new Date(g.deadline) < new Date() && g.current < g.target);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Goals
          </h1>
          <p className="text-muted-foreground">Set and track your badminton goals</p>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="gradient" className="gap-2">
              <Plus className="w-4 h-4" />
              New Goal
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Goal</DialogTitle>
              <DialogDescription>
                Set a specific goal to work towards
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Goal Title</Label>
                <Input
                  id="title"
                  placeholder="e.g., Win 20 matches this month"
                  value={newGoal.title}
                  onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Goal Type</Label>
                <Select
                  value={newGoal.type}
                  onValueChange={(value: Goal["type"]) => setNewGoal({ ...newGoal, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="matches">Total Matches</SelectItem>
                    <SelectItem value="wins">Match Wins</SelectItem>
                    <SelectItem value="training">Training Sessions</SelectItem>
                    <SelectItem value="streak">Activity Streak</SelectItem>
                    <SelectItem value="xp">Total XP</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="target">Target</Label>
                <Input
                  id="target"
                  type="number"
                  min="1"
                  value={newGoal.target}
                  onChange={(e) => setNewGoal({ ...newGoal, target: parseInt(e.target.value) })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="deadline">Deadline</Label>
                <Input
                  id="deadline"
                  type="date"
                  value={newGoal.deadline}
                  onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateGoal}>Create Goal</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/20 rounded-lg">
              <Target className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Active Goals</p>
              <p className="text-2xl font-bold">{activeGoals.length}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-secondary/10 to-orange-500/10 border-secondary/20">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-secondary/20 rounded-lg">
              <CheckCircle2 className="w-6 h-6 text-secondary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Completed</p>
              <p className="text-2xl font-bold">{completedGoals.length}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-muted/10 to-muted/20 border-muted/30">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-muted/20 rounded-lg">
              <Calendar className="w-6 h-6 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Goals</p>
              <p className="text-2xl font-bold">{goals.length}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Active Goals */}
      {activeGoals.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Active Goals</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeGoals.map(goal => (
              <Card
                key={goal.id}
                className={`p-5 bg-gradient-to-br ${getGoalColor(goal.type)}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="p-3 bg-background/50 rounded-lg">
                      {getGoalIcon(goal.type)}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold">{goal.title}</h3>
                      <Badge variant="outline" className="mt-1 gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDeadline(goal.deadline)}
                      </Badge>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteGoal(goal.id)}
                    className="h-8 w-8"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>{goal.current}/{goal.target}</span>
                    <span className="text-muted-foreground">
                      {Math.round((goal.current / goal.target) * 100)}%
                    </span>
                  </div>
                  <Progress value={(goal.current / goal.target) * 100} className="h-3" />
                </div>

                {goal.current >= goal.target && (
                  <Badge className="w-full mt-4 justify-center gap-1 bg-primary/20 text-primary border-primary/30">
                    <CheckCircle2 className="w-4 h-4" />
                    Goal Achieved!
                  </Badge>
                )}
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Completed Goals */}
      {completedGoals.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Completed Goals</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {completedGoals.map(goal => (
              <Card key={goal.id} className="p-4 opacity-75">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    {getGoalIcon(goal.type)}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-sm">{goal.title}</h3>
                  </div>
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                </div>
                <p className="text-xs text-muted-foreground">
                  Achieved {goal.current}/{goal.target}
                </p>
              </Card>
            ))}
          </div>
        </div>
      )}

      {goals.length === 0 && (
        <Card className="p-12 text-center">
          <Target className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-xl font-bold mb-2">No goals yet</h3>
          <p className="text-muted-foreground mb-6">
            Create your first goal to start tracking your progress
          </p>
          <Button onClick={() => setOpen(true)} variant="gradient" className="gap-2">
            <Plus className="w-4 h-4" />
            Create Goal
          </Button>
        </Card>
      )}
    </div>
  );
};