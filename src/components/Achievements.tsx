import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Trophy, Target, Zap, Award, Star, Flame, TrendingUp, Lock, Calendar } from "lucide-react";

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  unlocked: boolean;
  progress?: number;
  maxProgress?: number;
  category: "matches" | "training" | "streaks" | "milestones";
  xp: number;
}

const achievementsList: Omit<Achievement, "unlocked" | "progress">[] = [
  // Matches
  { id: "first-match", name: "First Steps", description: "Log your first match", icon: <Trophy className="w-6 h-6" />, category: "matches", maxProgress: 1, xp: 50 },
  { id: "10-matches", name: "Getting Serious", description: "Log 10 matches", icon: <Trophy className="w-6 h-6" />, category: "matches", maxProgress: 10, xp: 200 },
  { id: "50-matches", name: "Dedicated Player", description: "Log 50 matches", icon: <Trophy className="w-6 h-6" />, category: "matches", maxProgress: 50, xp: 500 },
  { id: "100-matches", name: "Century Club", description: "Log 100 matches", icon: <Trophy className="w-6 h-6" />, category: "matches", maxProgress: 100, xp: 1000 },
  { id: "first-win", name: "Taste of Victory", description: "Win your first match", icon: <Award className="w-6 h-6" />, category: "matches", maxProgress: 1, xp: 100 },
  { id: "5-win-streak", name: "On Fire", description: "Win 5 matches in a row", icon: <Flame className="w-6 h-6" />, category: "matches", maxProgress: 5, xp: 300 },
  { id: "10-win-streak", name: "Dominating", description: "Win 10 matches in a row", icon: <Flame className="w-6 h-6" />, category: "matches", maxProgress: 10, xp: 750 },
  { id: "match-drill-combo", name: "Double Down", description: "Complete a drill and match on the same day (5 times)", icon: <Zap className="w-6 h-6" />, category: "matches", maxProgress: 5, xp: 400 },
  
  // Training
  { id: "first-drill", name: "Training Begins", description: "Complete your first drill", icon: <Target className="w-6 h-6" />, category: "training", maxProgress: 1, xp: 50 },
  { id: "10-drills", name: "Skill Builder", description: "Complete 10 drills", icon: <Target className="w-6 h-6" />, category: "training", maxProgress: 10, xp: 250 },
  { id: "50-drills", name: "Training Master", description: "Complete 50 drills", icon: <Target className="w-6 h-6" />, category: "training", maxProgress: 50, xp: 750 },
  { id: "all-fundamentals", name: "Master the Basics", description: "Complete all fundamental drills", icon: <Star className="w-6 h-6" />, category: "training", maxProgress: 18, xp: 500 },
  { id: "start-plan", name: "Committed", description: "Start a training plan", icon: <TrendingUp className="w-6 h-6" />, category: "training", maxProgress: 1, xp: 100 },
  { id: "5-days-training", name: "Consistent Trainer", description: "Train 5 weekdays in a row", icon: <Calendar className="w-6 h-6" />, category: "training", maxProgress: 5, xp: 350 },
  
  // Streaks
  { id: "3-day-streak", name: "Building Habits", description: "3-day training streak", icon: <Flame className="w-6 h-6" />, category: "streaks", maxProgress: 3, xp: 150 },
  { id: "7-day-streak", name: "Week Warrior", description: "7-day training streak", icon: <Flame className="w-6 h-6" />, category: "streaks", maxProgress: 7, xp: 300 },
  { id: "14-day-streak", name: "Dedicated", description: "14-day training streak", icon: <Flame className="w-6 h-6" />, category: "streaks", maxProgress: 14, xp: 600 },
  { id: "30-day-streak", name: "Unstoppable", description: "30-day training streak", icon: <Flame className="w-6 h-6" />, category: "streaks", maxProgress: 30, xp: 1000 },
  
  // Milestones
  { id: "1000-xp", name: "Rising Star", description: "Earn 1,000 XP", icon: <Star className="w-6 h-6" />, category: "milestones", maxProgress: 1000, xp: 0 },
  { id: "5000-xp", name: "Elite Player", description: "Earn 5,000 XP", icon: <Star className="w-6 h-6" />, category: "milestones", maxProgress: 5000, xp: 0 },
  { id: "10000-xp", name: "Legend", description: "Earn 10,000 XP", icon: <Star className="w-6 h-6" />, category: "milestones", maxProgress: 10000, xp: 0 },
  { id: "level-10", name: "Experienced", description: "Reach level 10", icon: <Star className="w-6 h-6" />, category: "milestones", maxProgress: 10, xp: 0 },
  { id: "level-20", name: "Expert", description: "Reach level 20", icon: <Star className="w-6 h-6" />, category: "milestones", maxProgress: 20, xp: 0 },
];

export const Achievements = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [totalXP, setTotalXP] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);

  useEffect(() => {
    // Load data from localStorage
    const matches = JSON.parse(localStorage.getItem("matches") || "[]");
    const completedDrills = new Set(JSON.parse(localStorage.getItem("completedDrills") || "[]"));
    const activePlans = JSON.parse(localStorage.getItem("activePlans") || "{}");
    const savedXP = parseInt(localStorage.getItem("totalXP") || "0");
    const savedStreak = parseInt(localStorage.getItem("currentStreak") || "0");
    
    setTotalXP(savedXP);
    setCurrentStreak(savedStreak);

    // Calculate achievements
    const wins = matches.filter((m: any) => m.result === "win").length;
    const matchCount = matches.length;
    
    // Check for win streak
    let currentWinStreak = 0;
    let maxWinStreak = 0;
    matches.forEach((m: any) => {
      if (m.result === "win") {
        currentWinStreak++;
        maxWinStreak = Math.max(maxWinStreak, currentWinStreak);
      } else {
        currentWinStreak = 0;
      }
    });

    // Check combo achievements
    const activityLog = JSON.parse(localStorage.getItem("activityLog") || "[]");
    const activityByDate: { [date: string]: Set<string> } = {};
    activityLog.forEach((activity: any) => {
      const date = new Date(activity.date).toISOString().split('T')[0];
      if (!activityByDate[date]) activityByDate[date] = new Set();
      activityByDate[date].add(activity.type);
    });
    const comboDays = Object.values(activityByDate).filter(types => types.has("match") && types.has("drill")).length;
    
    // Check weekday training
    const weekdayTraining = activityLog.filter((a: any) => {
      const day = new Date(a.date).getDay();
      return a.type === "drill" && day >= 1 && day <= 5;
    });
    
    const level = Math.floor(savedXP / 500) + 1;

    const processedAchievements = achievementsList.map(achievement => {
      let unlocked = false;
      let progress = 0;

      switch (achievement.id) {
        case "first-match":
          progress = Math.min(matchCount, 1);
          unlocked = matchCount >= 1;
          break;
        case "10-matches":
          progress = matchCount;
          unlocked = matchCount >= 10;
          break;
        case "50-matches":
          progress = matchCount;
          unlocked = matchCount >= 50;
          break;
        case "100-matches":
          progress = matchCount;
          unlocked = matchCount >= 100;
          break;
        case "first-win":
          progress = Math.min(wins, 1);
          unlocked = wins >= 1;
          break;
        case "5-win-streak":
          progress = maxWinStreak;
          unlocked = maxWinStreak >= 5;
          break;
        case "10-win-streak":
          progress = maxWinStreak;
          unlocked = maxWinStreak >= 10;
          break;
        case "match-drill-combo":
          progress = comboDays;
          unlocked = comboDays >= 5;
          break;
        case "first-drill":
          progress = Math.min(completedDrills.size, 1);
          unlocked = completedDrills.size >= 1;
          break;
        case "10-drills":
          progress = completedDrills.size;
          unlocked = completedDrills.size >= 10;
          break;
        case "50-drills":
          progress = completedDrills.size;
          unlocked = completedDrills.size >= 50;
          break;
        case "all-fundamentals":
          progress = completedDrills.size;
          unlocked = completedDrills.size >= 18;
          break;
        case "start-plan":
          progress = Object.keys(activePlans).length > 0 ? 1 : 0;
          unlocked = Object.keys(activePlans).length > 0;
          break;
        case "5-days-training":
          progress = weekdayTraining.length;
          unlocked = weekdayTraining.length >= 5;
          break;
        case "3-day-streak":
          progress = savedStreak;
          unlocked = savedStreak >= 3;
          break;
        case "7-day-streak":
          progress = savedStreak;
          unlocked = savedStreak >= 7;
          break;
        case "14-day-streak":
          progress = savedStreak;
          unlocked = savedStreak >= 14;
          break;
        case "30-day-streak":
          progress = savedStreak;
          unlocked = savedStreak >= 30;
          break;
        case "1000-xp":
          progress = savedXP;
          unlocked = savedXP >= 1000;
          break;
        case "5000-xp":
          progress = savedXP;
          unlocked = savedXP >= 5000;
          break;
        case "10000-xp":
          progress = savedXP;
          unlocked = savedXP >= 10000;
          break;
        case "level-10":
          progress = level;
          unlocked = level >= 10;
          break;
        case "level-20":
          progress = level;
          unlocked = level >= 20;
          break;
      }

      return { ...achievement, unlocked, progress };
    });

    setAchievements(processedAchievements);
  }, []);

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalCount = achievements.length;
  const level = Math.floor(totalXP / 500) + 1;
  const xpToNextLevel = (level * 500) - totalXP;

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "matches": return <Trophy className="w-4 h-4" />;
      case "training": return <Target className="w-4 h-4" />;
      case "streaks": return <Flame className="w-4 h-4" />;
      case "milestones": return <Star className="w-4 h-4" />;
      default: return <Award className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "matches": return "from-secondary/20 to-orange-500/20 border-secondary/30";
      case "training": return "from-primary/20 to-accent/20 border-primary/30";
      case "streaks": return "from-destructive/20 to-orange-600/20 border-destructive/30";
      case "milestones": return "from-accent/20 to-primary/20 border-accent/30";
      default: return "";
    }
  };

  const categories = ["matches", "training", "streaks", "milestones"] as const;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Achievements
          </h1>
          <p className="text-muted-foreground">Track your progress and unlock rewards</p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/20 rounded-lg">
              <Trophy className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Unlocked</p>
              <p className="text-2xl font-bold">{unlockedCount}/{totalCount}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-secondary/10 to-orange-500/10 border-secondary/20">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-secondary/20 rounded-lg">
              <Star className="w-6 h-6 text-secondary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Level</p>
              <p className="text-2xl font-bold">{level}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-accent/10 to-primary/10 border-accent/20">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-accent/20 rounded-lg">
              <Zap className="w-6 h-6 text-accent" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total XP</p>
              <p className="text-2xl font-bold">{totalXP.toLocaleString()}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-destructive/10 to-orange-600/10 border-destructive/20">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-destructive/20 rounded-lg">
              <Flame className="w-6 h-6 text-destructive" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Streak</p>
              <p className="text-2xl font-bold">{currentStreak} days</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Level Progress */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg">
              <Star className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Level {level}</h3>
              <p className="text-sm text-muted-foreground">{xpToNextLevel} XP to next level</p>
            </div>
          </div>
          <Badge variant="outline" className="gap-1">
            <Zap className="w-3 h-3" />
            {totalXP} XP
          </Badge>
        </div>
        <Progress value={(totalXP % 500) / 5} className="h-3" />
      </Card>

      {/* Achievement Categories */}
      {categories.map(category => (
        <div key={category}>
          <div className="flex items-center gap-2 mb-4">
            {getCategoryIcon(category)}
            <h2 className="text-2xl font-bold capitalize">{category}</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements
              .filter(a => a.category === category)
              .map(achievement => (
                <Card
                  key={achievement.id}
                  className={`p-5 transition-all duration-300 hover:scale-105 ${
                    achievement.unlocked
                      ? `bg-gradient-to-br ${getCategoryColor(category)} hover:shadow-lg animate-fade-in`
                      : 'opacity-60 hover:opacity-80'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-lg ${
                      achievement.unlocked
                        ? 'bg-white/50 dark:bg-black/30'
                        : 'bg-muted'
                    }`}>
                      {achievement.unlocked ? achievement.icon : <Lock className="w-6 h-6" />}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold mb-1">{achievement.name}</h3>
                      <p className="text-sm text-muted-foreground mb-3">{achievement.description}</p>
                      
                      {achievement.maxProgress && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span>{achievement.progress}/{achievement.maxProgress}</span>
                            <Badge variant="outline" className="text-xs">
                              +{achievement.xp} XP
                            </Badge>
                          </div>
                          <Progress
                            value={((achievement.progress || 0) / achievement.maxProgress) * 100}
                            className="h-2"
                          />
                        </div>
                      )}
                      
                      {achievement.unlocked && (
                        <Badge className="mt-2 gap-1 bg-primary/20 text-primary border-primary/30">
                          <Award className="w-3 h-3" />
                          Unlocked!
                        </Badge>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
};