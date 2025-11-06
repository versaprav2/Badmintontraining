# Periodization Implementation Plan

## Overview
Implement Olympic-level periodized training system with 8-16 week cycles, progressive phases, load management, and competition preparation.

---

## Phase 1: Core Data Structure & Storage (Foundation)

### 1.1 Create Training Plan Data Models
**File**: `src/types/trainingPlan.ts`
- `TrainingPlan` interface (id, name, goal, duration, startDate, currentWeek, phases)
- `TrainingPhase` type (Base, Build, Peak, Taper, Recovery)
- `WeeklyPlan` interface (weekNumber, phase, volume, intensity, focus, workouts)
- `WorkoutSession` interface (day, type, duration, drills, load)
- `TrainingLoad` interface (volume, intensity, totalLoad, rpe)

### 1.2 Create Plan Management Utility
**File**: `src/lib/periodizationEngine.ts`
- `generatePeriodizedPlan()` - Create plan based on goal and duration
- `calculateTrainingLoad()` - Compute weekly load from volume × intensity
- `getPhaseRecommendations()` - Suggest exercises per phase
- `adjustPlanDifficulty()` - Adaptive difficulty based on performance
- `checkDeloadWeek()` - Identify when deload is needed
- Plan templates for common goals (tournament prep, fitness, skill development)

### 1.3 Local Storage Management
**File**: `src/lib/trainingPlanStorage.ts`
- Save/load active plans
- Track plan progress and completion
- Store historical plan data for analysis

---

## Phase 2: Plan Creation Interface

### 2.1 Plan Builder Wizard Component
**File**: `src/components/PlanBuilder.tsx`
- Multi-step wizard (Goal Selection → Duration → Customization → Preview → Create)
- Goal options: Tournament Preparation, General Fitness, Skill Development, Competition Peak
- Duration selector: 8, 12, 16 weeks
- Current fitness level assessment
- Available training days per week
- Competition date input (for tournament prep)
- Generate preview of plan structure

### 2.2 Plan Templates
**Preset templates**:
- **8-Week Tournament Prep**: Weeks 1-3 Base, 4-5 Build, 6-7 Peak, 8 Taper
- **12-Week Fitness Builder**: Weeks 1-4 Base, 5-8 Build, 9-11 Peak, 12 Recovery
- **16-Week Elite Preparation**: Weeks 1-6 Base, 7-11 Build, 12-14 Peak, 15 Taper, 16 Competition

---

## Phase 3: Training Plan View & Management

### 3.1 Active Plan Dashboard
**File**: `src/components/ActivePlanView.tsx`
- Current week overview with phase indicator
- Weekly focus and goals
- Daily workout cards with completion checkboxes
- Progress bar for overall plan completion
- Phase timeline visualization
- Training load graph (current week vs planned)

### 3.2 Weekly Plan Detail
**File**: `src/components/WeeklyPlanDetail.tsx`
- Day-by-day workout breakdown
- Drill recommendations per session
- Duration and intensity targets
- Notes section for coach feedback/personal notes
- Mark sessions complete
- Log actual vs planned metrics

### 3.3 Phase Information Component
**File**: `src/components/PhaseInfo.tsx`
- Phase description and objectives
- Key focus areas (technique, endurance, speed, etc.)
- Typical intensity and volume ranges
- What to expect in this phase
- Tips for success

---

## Phase 4: Load Management & Monitoring

### 4.1 Training Load Tracker
**File**: `src/components/TrainingLoadMonitor.tsx`
- Weekly load calculation display
- Acute:Chronic Workload Ratio (ACWR) graph
- Overtraining risk indicator
- Recovery status badge
- Load distribution chart (volume vs intensity)
- Recommended adjustments

### 4.2 Load Calculation Integration
- Integrate with existing `WorkoutTimer` completion data
- Integrate with `MatchTracker` match data
- Calculate RPE (Rate of Perceived Exertion) from session duration and intensity
- Store load data in localStorage

---

## Phase 5: Plan Adaptation & Intelligence

### 5.1 Adaptive Plan Adjustments
**File**: `src/lib/planAdaptation.ts`
- Monitor completion rates per week
- Adjust difficulty if consistently over/under-performing
- Suggest deload week if load spikes
- Recommend plan modifications based on missed sessions
- Auto-reschedule if user misses multiple days

### 5.2 Progress Analytics
**File**: `src/components/PlanProgressAnalytics.tsx`
- Week-by-week completion rates
- Load progression graph
- Performance improvements over plan duration
- Compare actual vs planned workload
- Insights and recommendations

---

## Phase 6: Integration with Existing Systems

### 6.1 Connect to Gamification
- Award XP for completing planned sessions
- Special XP bonus for completing full weeks
- Achievement for completing full plan
- Phase completion milestones

### 6.2 Connect to Goals System
- Link training plans to specific goals
- Auto-update goal progress based on plan completion
- Suggest creating goals when starting new plan

### 6.3 Connect to Training Programs
- Recommend specific drills from `TrainingPrograms` based on phase
- Integrate program completion with plan tracking

---

## Phase 7: Advanced Features

### 7.1 Competition Preparation Mode
- Countdown to competition date
- Reverse-engineer plan from competition
- Peak week optimization
- Taper strategy customization
- Pre-competition checklist
- Day-of routine builder

### 7.2 Multiple Plan Management
**File**: `src/components/PlanLibrary.tsx`
- View all past plans
- Compare plans side-by-side
- Duplicate and modify previous plans
- Archive completed plans
- Plan success rate analytics

### 7.3 Plan Sharing & Export
- Export plan as PDF
- Share plan with coach/training partner
- Import plan from template

---

## Implementation Order (Recommended)

### Sprint 1 (Core Foundation)
1. Create data types (`trainingPlan.ts`)
2. Build periodization engine (`periodizationEngine.ts`)
3. Setup storage (`trainingPlanStorage.ts`)

### Sprint 2 (Plan Creation)
4. Plan Builder Wizard (`PlanBuilder.tsx`)
5. Preset templates
6. Plan preview

### Sprint 3 (Active Plan Display)
7. Active Plan Dashboard (`ActivePlanView.tsx`)
8. Weekly Plan Detail (`WeeklyPlanDetail.tsx`)
9. Phase Info component (`PhaseInfo.tsx`)

### Sprint 4 (Load Management)
10. Training Load Monitor (`TrainingLoadMonitor.tsx`)
11. Load calculation integration
12. ACWR tracking

### Sprint 5 (Intelligence & Adaptation)
13. Adaptive adjustments (`planAdaptation.ts`)
14. Progress analytics (`PlanProgressAnalytics.tsx`)
15. Integration with existing systems

### Sprint 6 (Advanced Features)
16. Competition prep mode
17. Plan library
18. Sharing & export

---

## Technical Considerations

### Data Structure Example
```typescript
interface TrainingPlan {
  id: string;
  name: string;
  goal: 'tournament' | 'fitness' | 'skill' | 'competition';
  duration: number; // weeks
  startDate: string;
  currentWeek: number;
  phases: PhasePlan[];
  competitionDate?: string;
}

interface PhasePlan {
  phase: 'base' | 'build' | 'peak' | 'taper' | 'recovery';
  startWeek: number;
  endWeek: number;
  volumeRange: [number, number]; // [min, max] hours per week
  intensityRange: [number, number]; // [min, max] 1-10 scale
  focus: string[];
  objectives: string[];
}

interface WeeklyPlan {
  weekNumber: number;
  phase: string;
  plannedVolume: number;
  plannedIntensity: number;
  actualVolume?: number;
  actualIntensity?: number;
  workouts: WorkoutSession[];
  completed: boolean;
  notes: string;
}
```

### Storage Keys
- `active_training_plan` - Current active plan
- `training_plan_history` - Array of completed plans
- `weekly_load_data` - Load tracking data

### Integration Points
- `useGamification` - XP rewards
- `Goals` component - Link plans to goals
- `TrainingPrograms` - Drill recommendations
- `WorkoutTimer` - Session tracking
- `MatchTracker` - Competition data

---

## Success Metrics
- Users can create 8-16 week periodized plans in < 2 minutes
- Clear visualization of current phase and progress
- Automatic load monitoring prevents overtraining
- Plan completion rate > 60%
- Users understand when to peak for competition

---

## Next Steps
1. Review plan with stakeholders
2. Confirm implementation priority
3. Begin Sprint 1 development
4. Create detailed component specifications for each file
