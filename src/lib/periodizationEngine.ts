import { TrainingPlan, PhasePlan, WeeklyPlan, WorkoutSession, TrainingGoal, TrainingPhase } from '@/types/trainingPlan';

const PHASE_DESCRIPTIONS = {
  base: {
    objectives: ['Build aerobic foundation', 'Develop general fitness', 'Master fundamental techniques'],
    focus: ['Endurance', 'Basic techniques', 'Movement patterns', 'Consistency'],
    volumeMultiplier: 0.7,
    intensityMultiplier: 0.6,
  },
  build: {
    objectives: ['Increase training intensity', 'Develop specific skills', 'Build strength and power'],
    focus: ['Sport-specific drills', 'Speed work', 'Tactical training', 'Match simulation'],
    volumeMultiplier: 1.0,
    intensityMultiplier: 0.8,
  },
  peak: {
    objectives: ['Achieve peak performance', 'Fine-tune techniques', 'Maximize competition readiness'],
    focus: ['High-intensity training', 'Match play', 'Competition simulation', 'Mental preparation'],
    volumeMultiplier: 0.9,
    intensityMultiplier: 0.95,
  },
  taper: {
    objectives: ['Reduce fatigue', 'Maintain fitness', 'Optimize recovery for competition'],
    focus: ['Light technical work', 'Active recovery', 'Mental rehearsal', 'Strategy review'],
    volumeMultiplier: 0.5,
    intensityMultiplier: 0.7,
  },
  recovery: {
    objectives: ['Full recovery', 'Prevent burnout', 'Prepare for next cycle'],
    focus: ['Light activity', 'Cross-training', 'Injury prevention', 'Rest'],
    volumeMultiplier: 0.4,
    intensityMultiplier: 0.5,
  },
};

export function generatePeriodizedPlan(
  goal: TrainingGoal,
  duration: number,
  daysPerWeek: number,
  fitnessLevel: 'beginner' | 'intermediate' | 'advanced' | 'elite',
  competitionDate?: string
): TrainingPlan {
  const phases = calculatePhaseDistribution(goal, duration);
  const baseVolume = getBaseVolume(fitnessLevel, daysPerWeek);
  
  return {
    id: `plan_${Date.now()}`,
    name: `${goal.charAt(0).toUpperCase() + goal.slice(1)} - ${duration} Week Plan`,
    goal,
    duration,
    startDate: new Date().toISOString(),
    currentWeek: 1,
    phases,
    competitionDate,
    daysPerWeek,
    fitnessLevel,
  };
}

function calculatePhaseDistribution(goal: TrainingGoal, duration: number): PhasePlan[] {
  const phases: PhasePlan[] = [];
  
  if (duration === 8) {
    // 8-week plan
    phases.push(createPhasePlan('base', 1, 3));
    phases.push(createPhasePlan('build', 4, 5));
    phases.push(createPhasePlan('peak', 6, 7));
    phases.push(createPhasePlan('taper', 8, 8));
  } else if (duration === 12) {
    // 12-week plan
    phases.push(createPhasePlan('base', 1, 4));
    phases.push(createPhasePlan('build', 5, 8));
    phases.push(createPhasePlan('peak', 9, 11));
    phases.push(createPhasePlan(goal === 'tournament' ? 'taper' : 'recovery', 12, 12));
  } else if (duration === 16) {
    // 16-week plan
    phases.push(createPhasePlan('base', 1, 6));
    phases.push(createPhasePlan('build', 7, 11));
    phases.push(createPhasePlan('peak', 12, 14));
    phases.push(createPhasePlan('taper', 15, 15));
    phases.push(createPhasePlan('recovery', 16, 16));
  }
  
  return phases;
}

function createPhasePlan(phase: TrainingPhase, startWeek: number, endWeek: number): PhasePlan {
  const desc = PHASE_DESCRIPTIONS[phase];
  
  return {
    phase,
    startWeek,
    endWeek,
    volumeRange: [8 * desc.volumeMultiplier, 12 * desc.volumeMultiplier],
    intensityRange: [6 * desc.intensityMultiplier, 10 * desc.intensityMultiplier],
    focus: desc.focus,
    objectives: desc.objectives,
  };
}

function getBaseVolume(fitnessLevel: string, daysPerWeek: number): number {
  const levelMultipliers = {
    beginner: 0.7,
    intermediate: 1.0,
    advanced: 1.2,
    elite: 1.5,
  };
  return daysPerWeek * 90 * (levelMultipliers[fitnessLevel as keyof typeof levelMultipliers] || 1.0);
}

export function generateWeeklyPlan(
  plan: TrainingPlan,
  weekNumber: number
): WeeklyPlan {
  const phase = plan.phases.find(p => weekNumber >= p.startWeek && weekNumber <= p.endWeek);
  if (!phase) throw new Error('Invalid week number');
  
  const weekPosition = (weekNumber - phase.startWeek) / (phase.endWeek - phase.startWeek + 1);
  const volume = phase.volumeRange[0] + (phase.volumeRange[1] - phase.volumeRange[0]) * weekPosition;
  const intensity = phase.intensityRange[0] + (phase.intensityRange[1] - phase.intensityRange[0]) * weekPosition;
  
  // Check if this should be a deload week (every 4th week in build/peak phases)
  const isDeloadWeek = weekNumber % 4 === 0 && (phase.phase === 'build' || phase.phase === 'peak');
  const adjustedVolume = isDeloadWeek ? volume * 0.6 : volume;
  const adjustedIntensity = isDeloadWeek ? intensity * 0.7 : intensity;
  
  const workouts = generateWorkouts(plan, phase.phase, adjustedVolume, adjustedIntensity);
  
  return {
    weekNumber,
    phase: phase.phase,
    plannedVolume: adjustedVolume,
    plannedIntensity: adjustedIntensity,
    workouts,
    completed: false,
    notes: isDeloadWeek ? 'Deload week - reduced volume for recovery' : '',
    trainingLoad: calculateTrainingLoad(adjustedVolume, adjustedIntensity),
  };
}

function generateWorkouts(
  plan: TrainingPlan,
  phase: TrainingPhase,
  volume: number,
  intensity: number
): WorkoutSession[] {
  const workouts: WorkoutSession[] = [];
  const sessionDuration = volume / plan.daysPerWeek * 60; // Convert hours to minutes
  
  const phaseWorkoutTemplates = {
    base: ['endurance', 'technique', 'endurance', 'technique', 'endurance'],
    build: ['technique', 'speed', 'match', 'strength', 'endurance'],
    peak: ['match', 'speed', 'match', 'technique', 'match'],
    taper: ['technique', 'recovery', 'match', 'recovery'],
    recovery: ['recovery', 'technique', 'recovery'],
  };
  
  const templates = phaseWorkoutTemplates[phase] || [];
  
  for (let i = 0; i < plan.daysPerWeek && i < templates.length; i++) {
    workouts.push({
      id: `workout_${Date.now()}_${i}`,
      day: i + 1,
      type: templates[i] as any,
      duration: sessionDuration,
      intensity: intensity,
      focus: PHASE_DESCRIPTIONS[phase].focus[i % PHASE_DESCRIPTIONS[phase].focus.length],
      drills: getDrillRecommendations(templates[i] as any, phase),
      completed: false,
    });
  }
  
  return workouts;
}

function getDrillRecommendations(type: string, phase: TrainingPhase): string[] {
  const drillLibrary: Record<string, string[]> = {
    technique: ['Shadow badminton', 'Multi-shuttle drills', 'Footwork patterns', 'Clear technique'],
    endurance: ['Continuous rallies', 'Court movement drills', 'Long rallies', 'Stamina building'],
    speed: ['Fast-paced multi-shuttle', 'Reaction drills', 'Speed smashes', 'Quick net shots'],
    strength: ['Jump smash practice', 'Resistance training', 'Power clears', 'Explosive movements'],
    match: ['Practice matches', 'Competition simulation', 'Tactical scenarios', 'Match analysis'],
    recovery: ['Light rallies', 'Stretching', 'Mobility work', 'Active recovery'],
  };
  
  return drillLibrary[type] || [];
}

export function calculateTrainingLoad(volume: number, intensity: number): number {
  return volume * intensity;
}

export function calculateACWR(recentLoads: number[]): number {
  if (recentLoads.length < 4) return 1.0;
  
  const acuteLoad = recentLoads.slice(-1)[0]; // Last week
  const chronicLoad = recentLoads.slice(-4).reduce((a, b) => a + b, 0) / 4; // 4-week average
  
  return chronicLoad > 0 ? acuteLoad / chronicLoad : 1.0;
}

export function getPhaseRecommendations(phase: TrainingPhase) {
  return PHASE_DESCRIPTIONS[phase];
}

export function adjustPlanDifficulty(plan: TrainingPlan, completionRate: number): TrainingPlan {
  // If completion rate is too low (<60%), reduce volume by 10%
  // If completion rate is high (>90%), can increase volume by 5%
  const adjustmentFactor = completionRate < 0.6 ? 0.9 : completionRate > 0.9 ? 1.05 : 1.0;
  
  if (adjustmentFactor !== 1.0) {
    plan.phases = plan.phases.map(phase => ({
      ...phase,
      volumeRange: [
        phase.volumeRange[0] * adjustmentFactor,
        phase.volumeRange[1] * adjustmentFactor,
      ] as [number, number],
    }));
  }
  
  return plan;
}
