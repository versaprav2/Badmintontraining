export type TrainingPhase = 'base' | 'build' | 'peak' | 'taper' | 'recovery';
export type TrainingGoal = 'tournament' | 'fitness' | 'skill' | 'competition';
export type WorkoutType = 'technique' | 'endurance' | 'speed' | 'strength' | 'match' | 'recovery';

export interface TrainingPlan {
  id: string;
  name: string;
  goal: TrainingGoal;
  duration: number; // weeks
  startDate: string;
  currentWeek: number;
  phases: PhasePlan[];
  competitionDate?: string;
  daysPerWeek: number;
  fitnessLevel: 'beginner' | 'intermediate' | 'advanced' | 'elite';
}

export interface PhasePlan {
  phase: TrainingPhase;
  startWeek: number;
  endWeek: number;
  volumeRange: [number, number]; // [min, max] hours per week
  intensityRange: [number, number]; // [min, max] 1-10 scale
  focus: string[];
  objectives: string[];
}

export interface WeeklyPlan {
  weekNumber: number;
  phase: TrainingPhase;
  plannedVolume: number; // hours
  plannedIntensity: number; // 1-10
  actualVolume?: number;
  actualIntensity?: number;
  workouts: WorkoutSession[];
  completed: boolean;
  notes: string;
  trainingLoad?: number;
}

export interface WorkoutSession {
  id: string;
  day: number; // 1-7 (Monday-Sunday)
  type: WorkoutType;
  duration: number; // minutes
  intensity: number; // 1-10
  focus: string;
  drills: string[];
  completed: boolean;
  actualDuration?: number;
  rpe?: number; // Rate of Perceived Exertion 1-10
}

export interface TrainingLoad {
  weekNumber: number;
  volume: number;
  intensity: number;
  totalLoad: number;
  acwr?: number; // Acute:Chronic Workload Ratio
}
