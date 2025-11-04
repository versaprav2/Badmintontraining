import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Trophy, Zap, Target, Calendar, Clock, Award, Lock, Unlock,
  Flame, Wind, Repeat, Swords
} from "lucide-react";
import { 
  Challenge, ChallengeTier, ChallengeCategory, CHALLENGE_LIBRARY,
  loadOrCreateChallenges, saveChallenges, updateChallengeProgress,
  activateChallenge, calculateUnlockStatus
} from "@/lib/gamificationEngine";
import { useToast } from "@/hooks/use-toast";
import { useGamification } from "@/hooks/useGamification";

export default function Challenges() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [selectedTier, setSelectedTier] = useState<ChallengeTier>("rookie");
  const [selectedCategory, setSelectedCategory] = useState<ChallengeCategory | "all">("all");
  const { toast } = useToast();
  const { addXP } = useGamification();

  useEffect(() => {
    const loadedChallenges = loadOrCreateChallenges();
    setChallenges(loadedChallenges);
    saveChallenges(loadedChallenges);
  }, []);

  const handleActivateChallenge = (challengeId: string) => {
    const updated = activateChallenge(challengeId);
    setChallenges(updated);
    toast({ title: "Challenge Activated!", description: "Good luck! 💪" });
  };

  const handleClaimReward = (challengeId: string) => {
    const challenge = challenges.find(c => c.id === challengeId);
    if (!challenge || !challenge.completed || challenge.claimedReward) return;

    addXP(challenge.xpReward);
    const updatedChallenges = challenges.map(c =>
      c.id === challengeId ? { ...c, claimedReward: true } : c
    );
    setChallenges(updatedChallenges);
    saveChallenges(updatedChallenges);
    toast({ title: `Claimed ${challenge.xpReward} XP!`, description: challenge.title });
  };

  const getChallengeIcon = (category: ChallengeCategory) => {
    const icons = { endurance: Flame, speed: Zap, agility: Wind, consistency: Calendar, competition: Swords };
    return icons[category] || Target;
  };

  const formatTimeLeft = (deadline: string) => {
    const diff = new Date(deadline).getTime() - Date.now();
    if (diff < 0) return "Expired";
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    return days > 0 ? `${days}d ${hours}h left` : `${hours}h left`;
  };

  const proUnlocked = calculateUnlockStatus("pro", challenges);
  const eliteUnlocked = calculateUnlockStatus("elite", challenges);

  const filteredLibrary = CHALLENGE_LIBRARY.filter(c => 
    c.tier === selectedTier && (selectedCategory === "all" || c.category === selectedCategory)
  );

  const activeChallengeIds = new Set(challenges.map(c => c.id));
  const activeChallenges = challenges.filter(c => !c.locked);
  const completedCount = activeChallenges.filter(c => c.completed).length;
  const availableXP = challenges.filter(c => c.completed && !c.claimedReward).reduce((sum, c) => sum + c.xpReward, 0);

  const renderChallengeCard = (challenge: typeof CHALLENGE_LIBRARY[0]) => {
    const isActive = activeChallengeIds.has(challenge.id);
    const activeChallenge = challenges.find(c => c.id === challenge.id);
    const Icon = getChallengeIcon(challenge.category);
    const isLocked = challenge.tier === "pro" ? !proUnlocked : challenge.tier === "elite" ? !eliteUnlocked : false;

    return (
      <Card key={challenge.id} className={isLocked ? "opacity-60" : ""}>
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <Icon className="w-5 h-5" />
            <Badge variant="outline">{challenge.category}</Badge>
            {challenge.badge && <span className="text-xl">{challenge.badge}</span>}
          </div>
          <CardTitle className="flex items-center gap-2">
            {challenge.title}
            {isLocked && <Lock className="w-4 h-4" />}
          </CardTitle>
          <CardDescription>{challenge.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLocked ? (
            <div className="text-sm text-muted-foreground bg-muted p-3 rounded-lg">
              <Lock className="w-4 h-4 inline mr-2" />
              {challenge.requirements}
            </div>
          ) : !isActive ? (
            <Button onClick={() => handleActivateChallenge(challenge.id)} className="w-full">
              <Unlock className="w-4 h-4 mr-2" />
              Activate Challenge
            </Button>
          ) : (
            <>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>{activeChallenge?.progress || 0} / {challenge.target}</span>
                </div>
                <Progress value={((activeChallenge?.progress || 0) / challenge.target) * 100} />
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {activeChallenge && formatTimeLeft(activeChallenge.deadline)}
                </div>
                <div className="flex items-center gap-1 font-semibold">
                  <Zap className="w-4 h-4" />
                  {challenge.xpReward} XP
                </div>
              </div>
              {activeChallenge?.completed && !activeChallenge.claimedReward && (
                <Button onClick={() => handleClaimReward(challenge.id)} className="w-full">
                  <Trophy className="w-4 h-4 mr-2" />
                  Claim Reward
                </Button>
              )}
              {activeChallenge?.claimedReward && <Badge className="w-full justify-center">✓ Claimed!</Badge>}
            </>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Challenge Library</h1>
          <p className="text-muted-foreground">Choose your path and push your limits</p>
        </div>
        <Award className="w-12 h-12 text-primary" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card><CardHeader><CardTitle>Active</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{activeChallenges.length}</div></CardContent></Card>
        <Card><CardHeader><CardTitle>Completed</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{completedCount}</div></CardContent></Card>
        <Card><CardHeader><CardTitle>Available XP</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold text-primary">{availableXP}</div></CardContent></Card>
      </div>

      <Tabs value={selectedTier} onValueChange={(v) => setSelectedTier(v as ChallengeTier)}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="rookie">Rookie</TabsTrigger>
          <TabsTrigger value="pro" disabled={!proUnlocked}>Pro {!proUnlocked && <Lock className="w-3 h-3 ml-1" />}</TabsTrigger>
          <TabsTrigger value="elite" disabled={!eliteUnlocked}>Elite {!eliteUnlocked && <Lock className="w-3 h-3 ml-1" />}</TabsTrigger>
        </TabsList>

        <div className="mt-4 space-y-4">
          <div className="flex flex-wrap gap-2">
            <Button variant={selectedCategory === "all" ? "default" : "outline"} size="sm" onClick={() => setSelectedCategory("all")}>All</Button>
            {(["endurance", "speed", "agility", "consistency", "competition"] as ChallengeCategory[]).map(cat => (
              <Button key={cat} variant={selectedCategory === cat ? "default" : "outline"} size="sm" onClick={() => setSelectedCategory(cat)}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </Button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredLibrary.map(challenge => renderChallengeCard(challenge))}
          </div>
        </div>
      </Tabs>
    </div>
  );
}
