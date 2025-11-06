import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Calendar, TrendingUp, Target, ChevronLeft, ChevronRight, Award } from 'lucide-react';
import { TrainingPlan, WeeklyPlan } from '@/types/trainingPlan';
import { getActivePlan, getWeeklyPlan, updatePlanProgress } from '@/lib/trainingPlanStorage';
import { generateWeeklyPlan } from '@/lib/periodizationEngine';
import { WeeklyPlanDetail } from './WeeklyPlanDetail';
import { TrainingLoadMonitor } from './TrainingLoadMonitor';

export function ActivePlanView() {
  const [plan, setPlan] = useState<TrainingPlan | null>(null);
  const [weeklyPlan, setWeeklyPlan] = useState<WeeklyPlan | null>(null);
  const [view, setView] = useState<'overview' | 'week' | 'load'>('overview');

  useEffect(() => {
    loadPlan();
  }, []);

  const loadPlan = () => {
    const activePlan = getActivePlan();
    if (activePlan) {
      setPlan(activePlan);
      loadWeeklyPlan(activePlan, activePlan.currentWeek);
    }
  };

  const loadWeeklyPlan = (currentPlan: TrainingPlan, weekNumber: number) => {
    let weekly = getWeeklyPlan(currentPlan.id, weekNumber);
    if (!weekly) {
      weekly = generateWeeklyPlan(currentPlan, weekNumber);
    }
    setWeeklyPlan(weekly);
  };

  const handleWeekChange = (delta: number) => {
    if (!plan) return;
    const newWeek = Math.max(1, Math.min(plan.duration, plan.currentWeek + delta));
    updatePlanProgress(newWeek);
    setPlan({ ...plan, currentWeek: newWeek });
    loadWeeklyPlan(plan, newWeek);
  };

  if (!plan) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No active training plan</p>
      </div>
    );
  }

  const currentPhase = plan.phases.find(
    p => plan.currentWeek >= p.startWeek && plan.currentWeek <= p.endWeek
  );

  const overallProgress = (plan.currentWeek / plan.duration) * 100;

  if (view === 'week' && weeklyPlan) {
    return (
      <div>
        <Button variant="ghost" onClick={() => setView('overview')} className="mb-4">
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back to Overview
        </Button>
        <WeeklyPlanDetail plan={plan} weeklyPlan={weeklyPlan} onUpdate={loadPlan} />
      </div>
    );
  }

  if (view === 'load') {
    return (
      <div>
        <Button variant="ghost" onClick={() => setView('overview')} className="mb-4">
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back to Overview
        </Button>
        <TrainingLoadMonitor planId={plan.id} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Plan Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl">{plan.name}</CardTitle>
              <CardDescription className="mt-2">
                Started: {new Date(plan.startDate).toLocaleDateString()}
              </CardDescription>
            </div>
            <Badge variant="outline" className="text-lg px-4 py-2">
              Week {plan.currentWeek} of {plan.duration}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Overall Progress</span>
              <span>{Math.round(overallProgress)}%</span>
            </div>
            <Progress value={overallProgress} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Current Phase */}
      {currentPhase && (
        <Card className="border-primary/50">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Target className="h-6 w-6 text-primary" />
              <div>
                <CardTitle className="capitalize">{currentPhase.phase} Phase</CardTitle>
                <CardDescription>
                  Weeks {currentPhase.startWeek}-{currentPhase.endWeek}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Objectives:</h4>
              <ul className="space-y-1">
                {currentPhase.objectives.map((obj, i) => (
                  <li key={i} className="text-sm flex items-start gap-2">
                    <Award className="h-4 w-4 mt-0.5 text-primary" />
                    {obj}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Focus Areas:</h4>
              <div className="flex flex-wrap gap-2">
                {currentPhase.focus.map((f, i) => (
                  <Badge key={i} variant="secondary">{f}</Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Week Navigation */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Current Week</CardTitle>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleWeekChange(-1)}
                disabled={plan.currentWeek === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleWeekChange(1)}
                disabled={plan.currentWeek === plan.duration}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {weeklyPlan && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-secondary rounded-lg">
                  <div className="text-2xl font-bold">{weeklyPlan.workouts.length}</div>
                  <div className="text-sm text-muted-foreground">Workouts</div>
                </div>
                <div className="text-center p-3 bg-secondary rounded-lg">
                  <div className="text-2xl font-bold">{Math.round(weeklyPlan.plannedVolume)}h</div>
                  <div className="text-sm text-muted-foreground">Volume</div>
                </div>
                <div className="text-center p-3 bg-secondary rounded-lg">
                  <div className="text-2xl font-bold">{weeklyPlan.plannedIntensity.toFixed(1)}/10</div>
                  <div className="text-sm text-muted-foreground">Intensity</div>
                </div>
                <div className="text-center p-3 bg-secondary rounded-lg">
                  <div className="text-2xl font-bold">
                    {weeklyPlan.workouts.filter(w => w.completed).length}/{weeklyPlan.workouts.length}
                  </div>
                  <div className="text-sm text-muted-foreground">Complete</div>
                </div>
              </div>

              {weeklyPlan.notes && (
                <div className="p-3 bg-primary/10 rounded-lg">
                  <p className="text-sm">{weeklyPlan.notes}</p>
                </div>
              )}

              <Button onClick={() => setView('week')} className="w-full">
                <Calendar className="h-4 w-4 mr-2" />
                View Week Details
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-4">
        <Button variant="outline" onClick={() => setView('load')} className="h-20">
          <TrendingUp className="h-5 w-5 mr-2" />
          Training Load Monitor
        </Button>
        <Button variant="outline" className="h-20" disabled>
          <Target className="h-5 w-5 mr-2" />
          Phase Timeline (Coming Soon)
        </Button>
      </div>
    </div>
  );
}
