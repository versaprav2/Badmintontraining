import { TrainingPlan, WeeklyPlan, WorkoutSession, TrainingLoad } from '@/types/trainingPlan';

const ACTIVE_PLAN_KEY = 'active_training_plan';
const PLAN_HISTORY_KEY = 'training_plan_history';
const WEEKLY_PLANS_KEY = 'weekly_plans';
const LOAD_DATA_KEY = 'weekly_load_data';

export function saveActivePlan(plan: TrainingPlan): void {
  localStorage.setItem(ACTIVE_PLAN_KEY, JSON.stringify(plan));
}

export function getActivePlan(): TrainingPlan | null {
  const data = localStorage.getItem(ACTIVE_PLAN_KEY);
  return data ? JSON.parse(data) : null;
}

export function clearActivePlan(): void {
  const plan = getActivePlan();
  if (plan) {
    // Archive to history before clearing
    const history = getPlanHistory();
    history.push({ ...plan, completedDate: new Date().toISOString() });
    localStorage.setItem(PLAN_HISTORY_KEY, JSON.stringify(history));
  }
  localStorage.removeItem(ACTIVE_PLAN_KEY);
}

export function updatePlanProgress(weekNumber: number): void {
  const plan = getActivePlan();
  if (plan) {
    plan.currentWeek = weekNumber;
    saveActivePlan(plan);
  }
}

export function saveWeeklyPlan(planId: string, weeklyPlan: WeeklyPlan): void {
  const key = `${WEEKLY_PLANS_KEY}_${planId}`;
  const plans = getWeeklyPlans(planId);
  const index = plans.findIndex(p => p.weekNumber === weeklyPlan.weekNumber);
  
  if (index >= 0) {
    plans[index] = weeklyPlan;
  } else {
    plans.push(weeklyPlan);
  }
  
  localStorage.setItem(key, JSON.stringify(plans));
}

export function getWeeklyPlans(planId: string): WeeklyPlan[] {
  const key = `${WEEKLY_PLANS_KEY}_${planId}`;
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
}

export function getWeeklyPlan(planId: string, weekNumber: number): WeeklyPlan | null {
  const plans = getWeeklyPlans(planId);
  return plans.find(p => p.weekNumber === weekNumber) || null;
}

export function completeWorkout(planId: string, weekNumber: number, workoutId: string, actualDuration: number, rpe: number): void {
  const weeklyPlan = getWeeklyPlan(planId, weekNumber);
  if (!weeklyPlan) return;
  
  const workout = weeklyPlan.workouts.find(w => w.id === workoutId);
  if (workout) {
    workout.completed = true;
    workout.actualDuration = actualDuration;
    workout.rpe = rpe;
    
    // Update weekly actual metrics
    const completedWorkouts = weeklyPlan.workouts.filter(w => w.completed);
    weeklyPlan.actualVolume = completedWorkouts.reduce((sum, w) => sum + (w.actualDuration || 0), 0) / 60;
    weeklyPlan.actualIntensity = completedWorkouts.reduce((sum, w) => sum + (w.rpe || 0), 0) / completedWorkouts.length;
    
    // Check if week is complete
    weeklyPlan.completed = weeklyPlan.workouts.every(w => w.completed);
    
    saveWeeklyPlan(planId, weeklyPlan);
    
    // Update training load
    if (weeklyPlan.actualVolume && weeklyPlan.actualIntensity) {
      saveTrainingLoad(planId, {
        weekNumber,
        volume: weeklyPlan.actualVolume,
        intensity: weeklyPlan.actualIntensity,
        totalLoad: weeklyPlan.actualVolume * weeklyPlan.actualIntensity,
      });
    }
  }
}

export function saveTrainingLoad(planId: string, load: TrainingLoad): void {
  const key = `${LOAD_DATA_KEY}_${planId}`;
  const loads = getTrainingLoads(planId);
  const index = loads.findIndex(l => l.weekNumber === load.weekNumber);
  
  if (index >= 0) {
    loads[index] = load;
  } else {
    loads.push(load);
  }
  
  // Calculate ACWR
  loads.sort((a, b) => a.weekNumber - b.weekNumber);
  for (let i = 0; i < loads.length; i++) {
    if (i >= 3) {
      const acuteLoad = loads[i].totalLoad;
      const chronicLoad = loads.slice(Math.max(0, i - 3), i + 1).reduce((sum, l) => sum + l.totalLoad, 0) / 4;
      loads[i].acwr = chronicLoad > 0 ? acuteLoad / chronicLoad : 1.0;
    }
  }
  
  localStorage.setItem(key, JSON.stringify(loads));
}

export function getTrainingLoads(planId: string): TrainingLoad[] {
  const key = `${LOAD_DATA_KEY}_${planId}`;
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
}

export function getPlanHistory(): (TrainingPlan & { completedDate: string })[] {
  const data = localStorage.getItem(PLAN_HISTORY_KEY);
  return data ? JSON.parse(data) : [];
}

export function calculateCompletionRate(planId: string): number {
  const weeklyPlans = getWeeklyPlans(planId);
  if (weeklyPlans.length === 0) return 0;
  
  const totalWorkouts = weeklyPlans.reduce((sum, week) => sum + week.workouts.length, 0);
  const completedWorkouts = weeklyPlans.reduce(
    (sum, week) => sum + week.workouts.filter(w => w.completed).length,
    0
  );
  
  return totalWorkouts > 0 ? completedWorkouts / totalWorkouts : 0;
}
