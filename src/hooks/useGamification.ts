import { useEffect, useState } from "react";

interface GamificationData {
  totalXP: number;
  currentStreak: number;
  lastActivityDate: string | null;
  level: number;
}

export const useGamification = () => {
  const [data, setData] = useState<GamificationData>({
    totalXP: 0,
    currentStreak: 0,
    lastActivityDate: null,
    level: 1,
  });

  useEffect(() => {
    loadGamificationData();
  }, []);

  const loadGamificationData = () => {
    const savedXP = parseInt(localStorage.getItem("totalXP") || "0");
    const savedStreak = parseInt(localStorage.getItem("currentStreak") || "0");
    const lastActivity = localStorage.getItem("lastActivityDate");
    const level = Math.floor(savedXP / 500) + 1;

    setData({
      totalXP: savedXP,
      currentStreak: savedStreak,
      lastActivityDate: lastActivity,
      level,
    });
  };

  const addXP = (amount: number) => {
    const newXP = data.totalXP + amount;
    localStorage.setItem("totalXP", newXP.toString());
    setData(prev => ({
      ...prev,
      totalXP: newXP,
      level: Math.floor(newXP / 500) + 1,
    }));
    return newXP;
  };

  const updateStreak = () => {
    const today = new Date().toDateString();
    const lastActivity = data.lastActivityDate;

    if (!lastActivity) {
      // First activity ever
      localStorage.setItem("currentStreak", "1");
      localStorage.setItem("lastActivityDate", today);
      setData(prev => ({ ...prev, currentStreak: 1, lastActivityDate: today }));
      return 1;
    }

    const lastDate = new Date(lastActivity);
    const todayDate = new Date(today);
    const diffTime = todayDate.getTime() - lastDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      // Same day, no change
      return data.currentStreak;
    } else if (diffDays === 1) {
      // Consecutive day, increase streak
      const newStreak = data.currentStreak + 1;
      localStorage.setItem("currentStreak", newStreak.toString());
      localStorage.setItem("lastActivityDate", today);
      setData(prev => ({ ...prev, currentStreak: newStreak, lastActivityDate: today }));
      return newStreak;
    } else {
      // Missed days, reset streak
      localStorage.setItem("currentStreak", "1");
      localStorage.setItem("lastActivityDate", today);
      setData(prev => ({ ...prev, currentStreak: 1, lastActivityDate: today }));
      return 1;
    }
  };

  const recordActivity = (activityType: "match" | "drill" | "session" | "plan") => {
    const xpRewards: { [key: string]: number } = {
      match: 50,
      drill: 30,
      session: 40,
      plan: 100,
    };

    // Log activity for analytics
    const activityLog = JSON.parse(localStorage.getItem("activityLog") || "[]");
    activityLog.push({
      date: new Date().toISOString(),
      type: activityType,
      xp: xpRewards[activityType],
    });
    localStorage.setItem("activityLog", JSON.stringify(activityLog));

    updateStreak();
    addXP(xpRewards[activityType]);
  };

  return {
    ...data,
    addXP,
    updateStreak,
    recordActivity,
    refresh: loadGamificationData,
  };
};
