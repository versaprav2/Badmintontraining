// Gamification engine for challenges and XP

export interface Challenge {
  id: string;
  title: string;
  description: string;
  type: "daily" | "weekly" | "monthly" | "personal";
  category: "matches" | "training" | "consistency" | "performance";
  target: number;
  progress: number;
  xpReward: number;
  deadline: string;
  completed: boolean;
  claimedReward: boolean;
}

export const generateDailyChallenges = (): Challenge[] => {
  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
  
  return [
    {
      id: `daily-match-${today}`,
      title: "Daily Match",
      description: "Log 1 match today",
      type: "daily",
      category: "matches",
      target: 1,
      progress: 0,
      xpReward: 50,
      deadline: tomorrow,
      completed: false,
      claimedReward: false,
    },
    {
      id: `daily-drill-${today}`,
      title: "Practice Session",
      description: "Complete 2 drills today",
      type: "daily",
      category: "training",
      target: 2,
      progress: 0,
      xpReward: 75,
      deadline: tomorrow,
      completed: false,
      claimedReward: false,
    },
  ];
};

export const generateWeeklyChallenges = (): Challenge[] => {
  const now = new Date();
  const endOfWeek = new Date(now);
  endOfWeek.setDate(now.getDate() + (7 - now.getDay()));
  endOfWeek.setHours(23, 59, 59);
  
  const weekId = `${now.getFullYear()}-W${Math.ceil((now.getDate()) / 7)}`;
  
  return [
    {
      id: `weekly-matches-${weekId}`,
      title: "Weekly Warrior",
      description: "Play 5 matches this week",
      type: "weekly",
      category: "matches",
      target: 5,
      progress: 0,
      xpReward: 250,
      deadline: endOfWeek.toISOString(),
      completed: false,
      claimedReward: false,
    },
    {
      id: `weekly-training-${weekId}`,
      title: "Training Routine",
      description: "Complete 8 drills this week",
      type: "weekly",
      category: "training",
      target: 8,
      progress: 0,
      xpReward: 300,
      deadline: endOfWeek.toISOString(),
      completed: false,
      claimedReward: false,
    },
    {
      id: `weekly-consistency-${weekId}`,
      title: "Stay Consistent",
      description: "Log activity 5 days this week",
      type: "weekly",
      category: "consistency",
      target: 5,
      progress: 0,
      xpReward: 200,
      deadline: endOfWeek.toISOString(),
      completed: false,
      claimedReward: false,
    },
  ];
};

export const generateMonthlyChallenges = (): Challenge[] => {
  const now = new Date();
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
  const monthId = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  
  return [
    {
      id: `monthly-matches-${monthId}`,
      title: "Monthly Champion",
      description: "Win 15 matches this month",
      type: "monthly",
      category: "performance",
      target: 15,
      progress: 0,
      xpReward: 750,
      deadline: endOfMonth.toISOString(),
      completed: false,
      claimedReward: false,
    },
    {
      id: `monthly-training-${monthId}`,
      title: "Training Dedication",
      description: "Complete 30 drills this month",
      type: "monthly",
      category: "training",
      target: 30,
      progress: 0,
      xpReward: 1000,
      deadline: endOfMonth.toISOString(),
      completed: false,
      claimedReward: false,
    },
  ];
};

export const updateChallengeProgress = (challenges: Challenge[]): Challenge[] => {
  const matches = JSON.parse(localStorage.getItem("matches") || "[]");
  const completedDrills = JSON.parse(localStorage.getItem("completedDrills") || "[]");
  const activityLog = JSON.parse(localStorage.getItem("activityLog") || "[]");
  
  return challenges.map(challenge => {
    let progress = 0;
    const deadline = new Date(challenge.deadline);
    const startDate = challenge.type === "daily" 
      ? new Date(Date.now() - 24 * 60 * 60 * 1000)
      : challenge.type === "weekly"
      ? new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      : new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    
    switch (challenge.category) {
      case "matches":
        if (challenge.description.includes("Win")) {
          progress = matches.filter((m: any) => 
            m.result === "win" && 
            new Date(m.date) >= startDate && 
            new Date(m.date) <= deadline
          ).length;
        } else {
          progress = matches.filter((m: any) => 
            new Date(m.date) >= startDate && 
            new Date(m.date) <= deadline
          ).length;
        }
        break;
      
      case "training":
        progress = activityLog.filter((a: any) => 
          a.type === "drill" &&
          new Date(a.date) >= startDate && 
          new Date(a.date) <= deadline
        ).length;
        break;
      
      case "consistency":
        const uniqueDays = new Set(
          activityLog
            .filter((a: any) => new Date(a.date) >= startDate && new Date(a.date) <= deadline)
            .map((a: any) => new Date(a.date).toISOString().split('T')[0])
        );
        progress = uniqueDays.size;
        break;
      
      case "performance":
        progress = matches.filter((m: any) => 
          m.result === "win" && 
          new Date(m.date) >= startDate && 
          new Date(m.date) <= deadline
        ).length;
        break;
    }
    
    const completed = progress >= challenge.target;
    
    return {
      ...challenge,
      progress,
      completed,
    };
  });
};

export const loadOrCreateChallenges = (): Challenge[] => {
  const saved = localStorage.getItem("challenges");
  
  if (saved) {
    const challenges = JSON.parse(saved) as Challenge[];
    
    // Remove expired challenges
    const now = new Date();
    const activeChallenges = challenges.filter(c => new Date(c.deadline) > now);
    
    // Check if we need new challenges
    const hasDaily = activeChallenges.some(c => c.type === "daily");
    const hasWeekly = activeChallenges.some(c => c.type === "weekly");
    const hasMonthly = activeChallenges.some(c => c.type === "monthly");
    
    let newChallenges = [...activeChallenges];
    
    if (!hasDaily) {
      newChallenges.push(...generateDailyChallenges());
    }
    if (!hasWeekly) {
      newChallenges.push(...generateWeeklyChallenges());
    }
    if (!hasMonthly) {
      newChallenges.push(...generateMonthlyChallenges());
    }
    
    return updateChallengeProgress(newChallenges);
  }
  
  // Create initial challenges
  const initial = [
    ...generateDailyChallenges(),
    ...generateWeeklyChallenges(),
    ...generateMonthlyChallenges(),
  ];
  
  return updateChallengeProgress(initial);
};

export const saveChallenges = (challenges: Challenge[]) => {
  localStorage.setItem("challenges", JSON.stringify(challenges));
};