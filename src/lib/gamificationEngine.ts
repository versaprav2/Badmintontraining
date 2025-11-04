// Gamification engine for challenges and XP

export type ChallengeTier = "rookie" | "pro" | "elite";
export type ChallengeCategory = "endurance" | "speed" | "agility" | "consistency" | "competition";
export type ChallengeType = "daily" | "weekly" | "monthly" | "custom";

export interface Challenge {
  id: string;
  title: string;
  description: string;
  type: ChallengeType;
  category: ChallengeCategory;
  tier: ChallengeTier;
  target: number;
  progress: number;
  xpReward: number;
  deadline: string;
  completed: boolean;
  claimedReward: boolean;
  locked: boolean;
  requirements?: string;
  customTimeLimit?: number;
  badge?: string;
}

// Master challenge library - all available challenges
export const CHALLENGE_LIBRARY: Omit<Challenge, "progress" | "completed" | "claimedReward" | "deadline">[] = [
  // ROOKIE TIER - Endurance
  {
    id: "rookie-endurance-1",
    title: "First Steps",
    description: "Complete 3 training sessions this week",
    type: "weekly",
    category: "endurance",
    tier: "rookie",
    target: 3,
    xpReward: 100,
    locked: false,
    badge: "🎯"
  },
  {
    id: "rookie-endurance-2",
    title: "Building Stamina",
    description: "Train for a total of 2 hours this week",
    type: "weekly",
    category: "endurance",
    tier: "rookie",
    target: 120,
    xpReward: 150,
    locked: false,
    badge: "💪"
  },
  
  // ROOKIE TIER - Speed
  {
    id: "rookie-speed-1",
    title: "Quick Feet",
    description: "Complete 5 footwork drills",
    type: "weekly",
    category: "speed",
    tier: "rookie",
    target: 5,
    xpReward: 100,
    locked: false,
    badge: "⚡"
  },
  {
    id: "rookie-speed-2",
    title: "Rapid Response",
    description: "Complete 10 reaction drills",
    type: "weekly",
    category: "speed",
    tier: "rookie",
    target: 10,
    xpReward: 120,
    locked: false,
    badge: "🏃"
  },

  // ROOKIE TIER - Agility
  {
    id: "rookie-agility-1",
    title: "Direction Master",
    description: "Complete 8 change-of-direction drills",
    type: "weekly",
    category: "agility",
    tier: "rookie",
    target: 8,
    xpReward: 100,
    locked: false,
    badge: "🔄"
  },
  {
    id: "rookie-agility-2",
    title: "Court Coverage",
    description: "Complete 6 full-court movement drills",
    type: "weekly",
    category: "agility",
    tier: "rookie",
    target: 6,
    xpReward: 130,
    locked: false,
    badge: "🎪"
  },

  // ROOKIE TIER - Consistency
  {
    id: "rookie-consistency-1",
    title: "Daily Habit",
    description: "Log activity 3 days this week",
    type: "weekly",
    category: "consistency",
    tier: "rookie",
    target: 3,
    xpReward: 80,
    locked: false,
    badge: "📅"
  },
  {
    id: "rookie-consistency-2",
    title: "Week Warrior",
    description: "Train 5 days this week",
    type: "weekly",
    category: "consistency",
    tier: "rookie",
    target: 5,
    xpReward: 150,
    locked: false,
    badge: "🔥"
  },

  // ROOKIE TIER - Competition
  {
    id: "rookie-competition-1",
    title: "First Victory",
    description: "Win 1 match",
    type: "weekly",
    category: "competition",
    tier: "rookie",
    target: 1,
    xpReward: 100,
    locked: false,
    badge: "🏆"
  },
  {
    id: "rookie-competition-2",
    title: "Match Ready",
    description: "Play 3 matches this week",
    type: "weekly",
    category: "competition",
    tier: "rookie",
    target: 3,
    xpReward: 120,
    locked: false,
    badge: "🎮"
  },

  // PRO TIER - Endurance
  {
    id: "pro-endurance-1",
    title: "Endurance Builder",
    description: "Complete 6 training sessions this week",
    type: "weekly",
    category: "endurance",
    tier: "pro",
    target: 6,
    xpReward: 250,
    locked: true,
    requirements: "Complete 70% of Rookie challenges",
    badge: "💎"
  },
  {
    id: "pro-endurance-2",
    title: "Hour Power",
    description: "Train for 5 hours this week",
    type: "weekly",
    category: "endurance",
    tier: "pro",
    target: 300,
    xpReward: 300,
    locked: true,
    requirements: "Complete 70% of Rookie challenges",
    badge: "⏰"
  },

  // PRO TIER - Speed
  {
    id: "pro-speed-1",
    title: "Speed Demon",
    description: "Complete 15 footwork drills",
    type: "weekly",
    category: "speed",
    tier: "pro",
    target: 15,
    xpReward: 250,
    locked: true,
    requirements: "Complete 70% of Rookie challenges",
    badge: "🚀"
  },
  {
    id: "pro-speed-2",
    title: "Lightning Reflexes",
    description: "Complete 20 reaction drills",
    type: "weekly",
    category: "speed",
    tier: "pro",
    target: 20,
    xpReward: 280,
    locked: true,
    requirements: "Complete 70% of Rookie challenges",
    badge: "⚡"
  },

  // PRO TIER - Agility
  {
    id: "pro-agility-1",
    title: "Agility Expert",
    description: "Complete 15 change-of-direction drills",
    type: "weekly",
    category: "agility",
    tier: "pro",
    target: 15,
    xpReward: 260,
    locked: true,
    requirements: "Complete 70% of Rookie challenges",
    badge: "🌀"
  },
  {
    id: "pro-agility-2",
    title: "Court Commander",
    description: "Complete 12 full-court movement drills",
    type: "weekly",
    category: "agility",
    tier: "pro",
    target: 12,
    xpReward: 270,
    locked: true,
    requirements: "Complete 70% of Rookie challenges",
    badge: "👑"
  },

  // PRO TIER - Consistency
  {
    id: "pro-consistency-1",
    title: "Dedicated Athlete",
    description: "Train every day this week",
    type: "weekly",
    category: "consistency",
    tier: "pro",
    target: 7,
    xpReward: 300,
    locked: true,
    requirements: "Complete 70% of Rookie challenges",
    badge: "🎖️"
  },
  {
    id: "pro-consistency-2",
    title: "Two Week Streak",
    description: "Train 12 days in 2 weeks",
    type: "custom",
    category: "consistency",
    tier: "pro",
    target: 12,
    xpReward: 350,
    locked: true,
    requirements: "Complete 70% of Rookie challenges",
    customTimeLimit: 14,
    badge: "🔥"
  },

  // PRO TIER - Competition
  {
    id: "pro-competition-1",
    title: "Win Streak",
    description: "Win 3 matches in a row",
    type: "weekly",
    category: "competition",
    tier: "pro",
    target: 3,
    xpReward: 300,
    locked: true,
    requirements: "Complete 70% of Rookie challenges",
    badge: "🔱"
  },
  {
    id: "pro-competition-2",
    title: "Match Dominator",
    description: "Win 5 matches this week",
    type: "weekly",
    category: "competition",
    tier: "pro",
    target: 5,
    xpReward: 350,
    locked: true,
    requirements: "Complete 70% of Rookie challenges",
    badge: "👊"
  },

  // ELITE TIER - Endurance
  {
    id: "elite-endurance-1",
    title: "Elite Endurance",
    description: "Train 10 sessions this week",
    type: "weekly",
    category: "endurance",
    tier: "elite",
    target: 10,
    xpReward: 500,
    locked: true,
    requirements: "Complete 70% of Pro challenges",
    badge: "🏅"
  },
  {
    id: "elite-endurance-2",
    title: "Marathon Warrior",
    description: "Train for 10 hours this week",
    type: "weekly",
    category: "endurance",
    tier: "elite",
    target: 600,
    xpReward: 600,
    locked: true,
    requirements: "Complete 70% of Pro challenges",
    badge: "🌟"
  },

  // ELITE TIER - Speed
  {
    id: "elite-speed-1",
    title: "Speed Master",
    description: "Complete 30 footwork drills",
    type: "weekly",
    category: "speed",
    tier: "elite",
    target: 30,
    xpReward: 500,
    locked: true,
    requirements: "Complete 70% of Pro challenges",
    badge: "💨"
  },
  {
    id: "elite-speed-2",
    title: "Ultimate Reflexes",
    description: "Complete 40 reaction drills",
    type: "weekly",
    category: "speed",
    tier: "elite",
    target: 40,
    xpReward: 550,
    locked: true,
    requirements: "Complete 70% of Pro challenges",
    badge: "✨"
  },

  // ELITE TIER - Agility
  {
    id: "elite-agility-1",
    title: "Agility Legend",
    description: "Complete 25 change-of-direction drills",
    type: "weekly",
    category: "agility",
    tier: "elite",
    target: 25,
    xpReward: 520,
    locked: true,
    requirements: "Complete 70% of Pro challenges",
    badge: "🎯"
  },
  {
    id: "elite-agility-2",
    title: "Court Wizard",
    description: "Complete 20 full-court movement drills",
    type: "weekly",
    category: "agility",
    tier: "elite",
    target: 20,
    xpReward: 530,
    locked: true,
    requirements: "Complete 70% of Pro challenges",
    badge: "🧙"
  },

  // ELITE TIER - Consistency
  {
    id: "elite-consistency-1",
    title: "Unstoppable",
    description: "Train every day for 2 weeks",
    type: "custom",
    category: "consistency",
    tier: "elite",
    target: 14,
    xpReward: 700,
    locked: true,
    requirements: "Complete 70% of Pro challenges",
    customTimeLimit: 14,
    badge: "🔥"
  },
  {
    id: "elite-consistency-2",
    title: "Month Champion",
    description: "Train 25 days this month",
    type: "monthly",
    category: "consistency",
    tier: "elite",
    target: 25,
    xpReward: 800,
    locked: true,
    requirements: "Complete 70% of Pro challenges",
    badge: "👑"
  },

  // ELITE TIER - Competition
  {
    id: "elite-competition-1",
    title: "Champion",
    description: "Win 10 matches this week",
    type: "weekly",
    category: "competition",
    tier: "elite",
    target: 10,
    xpReward: 600,
    locked: true,
    requirements: "Complete 70% of Pro challenges",
    badge: "🏆"
  },
  {
    id: "elite-competition-2",
    title: "Undefeated",
    description: "Win 5 matches without a loss",
    type: "custom",
    category: "competition",
    tier: "elite",
    target: 5,
    xpReward: 700,
    locked: true,
    requirements: "Complete 70% of Pro challenges",
    customTimeLimit: 14,
    badge: "💫"
  },
];

// Calculate unlock status based on tier completion
export const calculateUnlockStatus = (tier: ChallengeTier, completedChallenges: Challenge[]): boolean => {
  if (tier === "rookie") return true;
  
  const previousTier = tier === "pro" ? "rookie" : "pro";
  const previousTierChallenges = CHALLENGE_LIBRARY.filter(c => c.tier === previousTier);
  const completedPreviousTier = completedChallenges.filter(
    c => c.tier === previousTier && c.completed
  );
  
  const completionRate = completedPreviousTier.length / previousTierChallenges.length;
  return completionRate >= 0.7;
};

// Create active challenge instances from library
export const createChallengeInstance = (
  libraryChallenge: typeof CHALLENGE_LIBRARY[0],
  isUnlocked: boolean
): Challenge => {
  const now = new Date();
  let deadline: Date;
  
  if (libraryChallenge.customTimeLimit) {
    deadline = new Date(now.getTime() + libraryChallenge.customTimeLimit * 24 * 60 * 60 * 1000);
  } else {
    switch (libraryChallenge.type) {
      case "daily":
        deadline = new Date(now.getTime() + 24 * 60 * 60 * 1000);
        break;
      case "weekly":
        deadline = new Date(now);
        deadline.setDate(now.getDate() + (7 - now.getDay()));
        deadline.setHours(23, 59, 59);
        break;
      case "monthly":
        deadline = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
        break;
      default:
        deadline = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    }
  }
  
  return {
    ...libraryChallenge,
    progress: 0,
    completed: false,
    claimedReward: false,
    locked: !isUnlocked,
    deadline: deadline.toISOString(),
  };
};

export const updateChallengeProgress = (challenges: Challenge[]): Challenge[] => {
  const matches = JSON.parse(localStorage.getItem("matches") || "[]");
  const activityLog = JSON.parse(localStorage.getItem("activityLog") || "[]");
  
  return challenges.map(challenge => {
    if (challenge.locked) return challenge;
    
    let progress = 0;
    const deadline = new Date(challenge.deadline);
    const startDate = challenge.customTimeLimit
      ? new Date(Date.now() - challenge.customTimeLimit * 24 * 60 * 60 * 1000)
      : challenge.type === "daily" 
      ? new Date(Date.now() - 24 * 60 * 60 * 1000)
      : challenge.type === "weekly"
      ? new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      : new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    
    switch (challenge.category) {
      case "endurance":
        if (challenge.title.includes("hour") || challenge.title.includes("Hour")) {
          progress = activityLog
            .filter((a: any) => 
              (a.type === "drill" || a.type === "session") &&
              new Date(a.date) >= startDate && 
              new Date(a.date) <= deadline
            )
            .reduce((total: number, a: any) => total + (a.duration || 30), 0);
        } else {
          progress = activityLog.filter((a: any) => 
            (a.type === "drill" || a.type === "session") &&
            new Date(a.date) >= startDate && 
            new Date(a.date) <= deadline
          ).length;
        }
        break;
      
      case "speed":
        progress = activityLog.filter((a: any) => 
          a.type === "drill" &&
          (a.name?.toLowerCase().includes("footwork") || 
           a.name?.toLowerCase().includes("reaction") ||
           a.name?.toLowerCase().includes("speed")) &&
          new Date(a.date) >= startDate && 
          new Date(a.date) <= deadline
        ).length;
        break;
      
      case "agility":
        progress = activityLog.filter((a: any) => 
          a.type === "drill" &&
          (a.name?.toLowerCase().includes("agility") || 
           a.name?.toLowerCase().includes("direction") ||
           a.name?.toLowerCase().includes("court") ||
           a.name?.toLowerCase().includes("movement")) &&
          new Date(a.date) >= startDate && 
          new Date(a.date) <= deadline
        ).length;
        break;
      
      case "consistency":
        const uniqueDays = new Set(
          activityLog
            .filter((a: any) => 
              new Date(a.date) >= startDate && 
              new Date(a.date) <= deadline
            )
            .map((a: any) => new Date(a.date).toISOString().split('T')[0])
        );
        progress = uniqueDays.size;
        break;
      
      case "competition":
        if (challenge.title.includes("row") || challenge.title.includes("Streak")) {
          const recentMatches = matches
            .filter((m: any) => 
              new Date(m.date) >= startDate && 
              new Date(m.date) <= deadline
            )
            .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
          
          let streak = 0;
          for (const match of recentMatches) {
            if (match.result === "win") streak++;
            else break;
          }
          progress = streak;
        } else if (challenge.title.includes("Win") || challenge.title.includes("win")) {
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
  let activeChallenges: Challenge[] = [];
  
  if (saved) {
    activeChallenges = JSON.parse(saved) as Challenge[];
    
    const now = new Date();
    activeChallenges = activeChallenges.filter(c => new Date(c.deadline) > now);
  }
  
  const proUnlocked = calculateUnlockStatus("pro", activeChallenges);
  const eliteUnlocked = calculateUnlockStatus("elite", activeChallenges);
  
  activeChallenges = activeChallenges.map(challenge => {
    const isUnlocked = 
      challenge.tier === "rookie" ? true :
      challenge.tier === "pro" ? proUnlocked :
      eliteUnlocked;
    
    return { ...challenge, locked: !isUnlocked };
  });
  
  return updateChallengeProgress(activeChallenges);
};

export const activateChallenge = (challengeId: string): Challenge[] => {
  const challenges = loadOrCreateChallenges();
  const libraryChallenge = CHALLENGE_LIBRARY.find(c => c.id === challengeId);
  
  if (!libraryChallenge) return challenges;
  
  if (challenges.some(c => c.id === challengeId)) return challenges;
  
  const proUnlocked = calculateUnlockStatus("pro", challenges);
  const eliteUnlocked = calculateUnlockStatus("elite", challenges);
  const isUnlocked = 
    libraryChallenge.tier === "rookie" ? true :
    libraryChallenge.tier === "pro" ? proUnlocked :
    eliteUnlocked;
  
  if (!isUnlocked) return challenges;
  
  const newChallenge = createChallengeInstance(libraryChallenge, isUnlocked);
  const updated = [...challenges, newChallenge];
  saveChallenges(updated);
  
  return updated;
};

export const saveChallenges = (challenges: Challenge[]) => {
  localStorage.setItem("challenges", JSON.stringify(challenges));
};
