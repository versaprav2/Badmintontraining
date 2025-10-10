import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Trophy, Target, Flame, TrendingUp, Calendar, 
  Clock, Gift, CheckCircle2
} from "lucide-react";
import { 
  Challenge,
  loadOrCreateChallenges,
  saveChallenges
} from "@/lib/gamificationEngine";
import { toast } from "sonner";
import { useGamification } from "@/hooks/useGamification";

export const Challenges = () => {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const { addXP } = useGamification();

  useEffect(() => {
    const loadedChallenges = loadOrCreateChallenges();
    setChallenges(loadedChallenges);
    saveChallenges(loadedChallenges);
  }, []);

  const handleClaimReward = (challengeId: string) => {
    const challenge = challenges.find(c => c.id === challengeId);
    if (!challenge || !challenge.completed || challenge.claimedReward) return;

    addXP(challenge.xpReward);
    
    const updatedChallenges = challenges.map(c =>
      c.id === challengeId ? { ...c, claimedReward: true } : c
    );
    
    setChallenges(updatedChallenges);
    saveChallenges(updatedChallenges);
    
    toast.success(`Claimed ${challenge.xpReward} XP!`, {
      description: challenge.title,
    });
  };

  const getChallengeIcon = (category: string) => {
    switch (category) {
      case "matches": return <Trophy className="w-5 h-5" />;
      case "training": return <Target className="w-5 h-5" />;
      case "consistency": return <Flame className="w-5 h-5" />;
      case "performance": return <TrendingUp className="w-5 h-5" />;
      default: return <Trophy className="w-5 h-5" />;
    }
  };

  const getChallengeColor = (category: string) => {
    switch (category) {
      case "matches": return "from-secondary/20 to-orange-500/20 border-secondary/30";
      case "training": return "from-primary/20 to-accent/20 border-primary/30";
      case "consistency": return "from-destructive/20 to-orange-600/20 border-destructive/30";
      case "performance": return "from-accent/20 to-primary/20 border-accent/30";
      default: return "";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "daily": return <Calendar className="w-4 h-4" />;
      case "weekly": return <Calendar className="w-4 h-4" />;
      case "monthly": return <Calendar className="w-4 h-4" />;
      case "personal": return <TrendingUp className="w-4 h-4" />;
      default: return null;
    }
  };

  const formatTimeLeft = (deadline: string) => {
    const now = new Date();
    const end = new Date(deadline);
    const diff = end.getTime() - now.getTime();
    
    if (diff < 0) return "Expired";
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days}d ${hours}h left`;
    return `${hours}h left`;
  };

  const dailyChallenges = challenges.filter(c => c.type === "daily");
  const weeklyChallenges = challenges.filter(c => c.type === "weekly");
  const monthlyChallenges = challenges.filter(c => c.type === "monthly");

  const completedCount = challenges.filter(c => c.completed).length;
  const totalXP = challenges.reduce((sum, c) => sum + (c.claimedReward ? c.xpReward : 0), 0);
  const availableXP = challenges.reduce((sum, c) => sum + (c.completed && !c.claimedReward ? c.xpReward : 0), 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Challenges
        </h1>
        <p className="text-muted-foreground">Complete challenges to earn bonus XP</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/20 rounded-lg">
              <CheckCircle2 className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Completed</p>
              <p className="text-2xl font-bold">{completedCount}/{challenges.length}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-secondary/10 to-orange-500/10 border-secondary/20">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-secondary/20 rounded-lg">
              <Gift className="w-6 h-6 text-secondary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">XP Earned</p>
              <p className="text-2xl font-bold">{totalXP}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-accent/10 to-primary/10 border-accent/20">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-accent/20 rounded-lg">
              <Trophy className="w-6 h-6 text-accent" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Available XP</p>
              <p className="text-2xl font-bold">{availableXP}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Daily Challenges */}
      {dailyChallenges.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Calendar className="w-6 h-6 text-primary" />
            Daily Challenges
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {dailyChallenges.map(challenge => (
              <Card
                key={challenge.id}
                className={`p-5 bg-gradient-to-br ${getChallengeColor(challenge.category)}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-background/50 rounded-lg">
                      {getChallengeIcon(challenge.category)}
                    </div>
                    <div>
                      <h3 className="font-bold">{challenge.title}</h3>
                      <p className="text-sm text-muted-foreground">{challenge.description}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="gap-1">
                    <Clock className="w-3 h-3" />
                    {formatTimeLeft(challenge.deadline)}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>{challenge.progress}/{challenge.target}</span>
                    <Badge variant="outline">+{challenge.xpReward} XP</Badge>
                  </div>
                  <Progress value={(challenge.progress / challenge.target) * 100} className="h-2" />
                </div>

                {challenge.completed && !challenge.claimedReward && (
                  <Button
                    onClick={() => handleClaimReward(challenge.id)}
                    className="w-full mt-4 gap-2"
                    variant="gradient"
                  >
                    <Gift className="w-4 h-4" />
                    Claim Reward
                  </Button>
                )}

                {challenge.claimedReward && (
                  <Badge className="w-full mt-4 justify-center gap-1 bg-primary/20 text-primary border-primary/30">
                    <CheckCircle2 className="w-4 h-4" />
                    Claimed!
                  </Badge>
                )}
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Weekly Challenges */}
      {weeklyChallenges.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Flame className="w-6 h-6 text-secondary" />
            Weekly Challenges
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {weeklyChallenges.map(challenge => (
              <Card
                key={challenge.id}
                className={`p-5 bg-gradient-to-br ${getChallengeColor(challenge.category)}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-background/50 rounded-lg">
                      {getChallengeIcon(challenge.category)}
                    </div>
                    <div>
                      <h3 className="font-bold">{challenge.title}</h3>
                      <p className="text-sm text-muted-foreground">{challenge.description}</p>
                    </div>
                  </div>
                </div>

                <Badge variant="outline" className="gap-1 mb-3">
                  <Clock className="w-3 h-3" />
                  {formatTimeLeft(challenge.deadline)}
                </Badge>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>{challenge.progress}/{challenge.target}</span>
                    <Badge variant="outline">+{challenge.xpReward} XP</Badge>
                  </div>
                  <Progress value={(challenge.progress / challenge.target) * 100} className="h-2" />
                </div>

                {challenge.completed && !challenge.claimedReward && (
                  <Button
                    onClick={() => handleClaimReward(challenge.id)}
                    className="w-full mt-4 gap-2"
                    variant="gradient"
                  >
                    <Gift className="w-4 h-4" />
                    Claim Reward
                  </Button>
                )}

                {challenge.claimedReward && (
                  <Badge className="w-full mt-4 justify-center gap-1 bg-primary/20 text-primary border-primary/30">
                    <CheckCircle2 className="w-4 h-4" />
                    Claimed!
                  </Badge>
                )}
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Monthly Challenges */}
      {monthlyChallenges.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Trophy className="w-6 h-6 text-accent" />
            Monthly Challenges
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {monthlyChallenges.map(challenge => (
              <Card
                key={challenge.id}
                className={`p-5 bg-gradient-to-br ${getChallengeColor(challenge.category)}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-background/50 rounded-lg">
                      {getChallengeIcon(challenge.category)}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{challenge.title}</h3>
                      <p className="text-sm text-muted-foreground">{challenge.description}</p>
                    </div>
                  </div>
                </div>

                <Badge variant="outline" className="gap-1 mb-3">
                  <Clock className="w-3 h-3" />
                  {formatTimeLeft(challenge.deadline)}
                </Badge>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>{challenge.progress}/{challenge.target}</span>
                    <Badge variant="outline" className="text-base">+{challenge.xpReward} XP</Badge>
                  </div>
                  <Progress value={(challenge.progress / challenge.target) * 100} className="h-3" />
                </div>

                {challenge.completed && !challenge.claimedReward && (
                  <Button
                    onClick={() => handleClaimReward(challenge.id)}
                    className="w-full mt-4 gap-2"
                    variant="gradient"
                    size="lg"
                  >
                    <Gift className="w-5 h-5" />
                    Claim {challenge.xpReward} XP
                  </Button>
                )}

                {challenge.claimedReward && (
                  <Badge className="w-full mt-4 justify-center gap-1 bg-primary/20 text-primary border-primary/30 py-2">
                    <CheckCircle2 className="w-4 h-4" />
                    Claimed!
                  </Badge>
                )}
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};