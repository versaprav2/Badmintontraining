// Analytics engine for progress tracking and insights

interface Match {
  opponent: string;
  result: "win" | "loss";
  score: string;
  date: string;
  matchType?: string;
  duration?: number;
  energyBefore?: number;
  energyAfter?: number;
  tags?: string[];
}

interface ActivityData {
  date: string;
  type: "match" | "drill" | "session" | "plan";
  xp: number;
  duration?: number;
}

export const calculateWeeklySummary = () => {
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  
  const matches = JSON.parse(localStorage.getItem("matches") || "[]");
  const activityLog = JSON.parse(localStorage.getItem("activityLog") || "[]");
  const completedDrills = new Set(JSON.parse(localStorage.getItem("completedDrills") || "[]"));
  
  // This week's data
  const thisWeekMatches = matches.filter((m: Match) => new Date(m.date) >= weekAgo);
  const thisWeekActivities = activityLog.filter((a: ActivityData) => new Date(a.date) >= weekAgo);
  
  // Last week's data
  const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
  const lastWeekMatches = matches.filter((m: Match) => {
    const date = new Date(m.date);
    return date >= twoWeeksAgo && date < weekAgo;
  });
  
  const thisWeekXP = thisWeekActivities.reduce((sum: number, a: ActivityData) => sum + a.xp, 0);
  const lastWeekXP = activityLog
    .filter((a: ActivityData) => {
      const date = new Date(a.date);
      return date >= twoWeeksAgo && date < weekAgo;
    })
    .reduce((sum: number, a: ActivityData) => sum + a.xp, 0);
  
  const thisWeekWins = thisWeekMatches.filter((m: Match) => m.result === "win").length;
  const winRate = thisWeekMatches.length > 0 ? (thisWeekWins / thisWeekMatches.length) * 100 : 0;
  
  return {
    matchesPlayed: thisWeekMatches.length,
    drillsCompleted: thisWeekActivities.filter((a: ActivityData) => a.type === "drill").length,
    sessionsCompleted: thisWeekActivities.filter((a: ActivityData) => a.type === "session").length,
    xpEarned: thisWeekXP,
    winRate: Math.round(winRate),
    trends: {
      matches: thisWeekMatches.length - lastWeekMatches.length,
      xp: thisWeekXP - lastWeekXP,
    }
  };
};

export const getActivityHeatmap = (days: number = 365) => {
  const activityLog = JSON.parse(localStorage.getItem("activityLog") || "[]");
  const heatmap: { [date: string]: number } = {};
  
  const now = new Date();
  const startDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
  
  activityLog.forEach((activity: ActivityData) => {
    const date = new Date(activity.date).toISOString().split('T')[0];
    if (new Date(date) >= startDate) {
      heatmap[date] = (heatmap[date] || 0) + activity.xp;
    }
  });
  
  return heatmap;
};

export const getPerformanceTrends = () => {
  const matches = JSON.parse(localStorage.getItem("matches") || "[]");
  
  // Group matches by month
  const monthlyData: { [month: string]: { wins: number; total: number } } = {};
  
  matches.forEach((match: Match) => {
    const date = new Date(match.date);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    
    if (!monthlyData[monthKey]) {
      monthlyData[monthKey] = { wins: 0, total: 0 };
    }
    
    monthlyData[monthKey].total++;
    if (match.result === "win") {
      monthlyData[monthKey].wins++;
    }
  });
  
  return Object.entries(monthlyData)
    .map(([month, data]) => ({
      month,
      winRate: Math.round((data.wins / data.total) * 100),
      matches: data.total
    }))
    .sort((a, b) => a.month.localeCompare(b.month));
};

export const getOpponentStats = () => {
  const matches = JSON.parse(localStorage.getItem("matches") || "[]");
  const opponentStats: { [opponent: string]: { wins: number; losses: number } } = {};
  
  matches.forEach((match: Match) => {
    if (!opponentStats[match.opponent]) {
      opponentStats[match.opponent] = { wins: 0, losses: 0 };
    }
    
    if (match.result === "win") {
      opponentStats[match.opponent].wins++;
    } else {
      opponentStats[match.opponent].losses++;
    }
  });
  
  return Object.entries(opponentStats)
    .map(([opponent, stats]) => ({
      opponent,
      wins: stats.wins,
      losses: stats.losses,
      winRate: Math.round((stats.wins / (stats.wins + stats.losses)) * 100)
    }))
    .sort((a, b) => (b.wins + b.losses) - (a.wins + a.losses));
};

export const generateSmartInsights = () => {
  const matches = JSON.parse(localStorage.getItem("matches") || "[]");
  const activityLog = JSON.parse(localStorage.getItem("activityLog") || "[]");
  const streak = parseInt(localStorage.getItem("currentStreak") || "0");
  const insights: string[] = [];
  
  // Activity insights
  const lastActivity = activityLog[activityLog.length - 1];
  if (lastActivity) {
    const daysSinceLastActivity = Math.floor((Date.now() - new Date(lastActivity.date).getTime()) / (1000 * 60 * 60 * 24));
    if (daysSinceLastActivity >= 3) {
      insights.push(`You haven't logged activity in ${daysSinceLastActivity} days. Ready to get back on the court?`);
    }
  }
  
  // Streak insights
  if (streak >= 7) {
    insights.push(`Amazing! You're on a ${streak}-day streak. Keep the momentum going! 🔥`);
  } else if (streak >= 3) {
    insights.push(`You're building a solid ${streak}-day streak. Don't break it now!`);
  }
  
  // Performance by day of week
  const dayPerformance: { [day: number]: { wins: number; total: number } } = {};
  matches.forEach((match: Match) => {
    const day = new Date(match.date).getDay();
    if (!dayPerformance[day]) {
      dayPerformance[day] = { wins: 0, total: 0 };
    }
    dayPerformance[day].total++;
    if (match.result === "win") {
      dayPerformance[day].wins++;
    }
  });
  
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  let bestDay = { day: '', winRate: 0 };
  
  Object.entries(dayPerformance).forEach(([day, stats]) => {
    const winRate = (stats.wins / stats.total) * 100;
    if (winRate > bestDay.winRate && stats.total >= 3) {
      bestDay = { day: days[parseInt(day)], winRate: Math.round(winRate) };
    }
  });
  
  if (bestDay.day) {
    insights.push(`You perform best on ${bestDay.day}s with a ${bestDay.winRate}% win rate!`);
  }
  
  // Training correlation
  const recentMatches = matches.slice(-10);
  if (recentMatches.length >= 5) {
    const wins = recentMatches.filter((m: Match) => m.result === "win").length;
    const winRate = (wins / recentMatches.length) * 100;
    
    if (winRate >= 70) {
      insights.push(`Your recent form is excellent! ${Math.round(winRate)}% win rate in last ${recentMatches.length} matches.`);
    } else if (winRate < 40) {
      insights.push(`Consider extra training - your recent win rate is ${Math.round(winRate)}%. You've got this!`);
    }
  }
  
  return insights;
};

export const calculateMomentumScore = () => {
  const matches = JSON.parse(localStorage.getItem("matches") || "[]");
  const activityLog = JSON.parse(localStorage.getItem("activityLog") || "[]");
  const streak = parseInt(localStorage.getItem("currentStreak") || "0");
  
  // Recent matches (last 10)
  const recentMatches = matches.slice(-10);
  const recentWins = recentMatches.filter((m: Match) => m.result === "win").length;
  const recentWinRate = recentMatches.length > 0 ? (recentWins / recentMatches.length) : 0;
  
  // Recent activity (last 7 days)
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const recentActivity = activityLog.filter((a: ActivityData) => new Date(a.date) >= weekAgo).length;
  
  // Calculate momentum (0-100)
  const winRateScore = recentWinRate * 40;
  const activityScore = Math.min(recentActivity * 5, 30);
  const streakScore = Math.min(streak * 2, 30);
  
  return Math.round(winRateScore + activityScore + streakScore);
};