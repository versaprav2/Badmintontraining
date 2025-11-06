import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CheckCircle2, Circle, Clock, Flame, Trophy } from 'lucide-react';
import { TrainingPlan, WeeklyPlan, WorkoutSession } from '@/types/trainingPlan';
import { saveWeeklyPlan, completeWorkout } from '@/lib/trainingPlanStorage';
import { useGamification } from '@/hooks/useGamification';
import { useToast } from '@/hooks/use-toast';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

interface WeeklyPlanDetailProps {
  plan: TrainingPlan;
  weeklyPlan: WeeklyPlan;
  onUpdate: () => void;
}

export function WeeklyPlanDetail({ plan, weeklyPlan, onUpdate }: WeeklyPlanDetailProps) {
  const { toast } = useToast();
  const { addXP } = useGamification();
  const [notes, setNotes] = useState(weeklyPlan.notes || '');
  const [selectedWorkout, setSelectedWorkout] = useState<WorkoutSession | null>(null);
  const [actualDuration, setActualDuration] = useState('');
  const [rpe, setRpe] = useState('7');

  const handleSaveNotes = () => {
    weeklyPlan.notes = notes;
    saveWeeklyPlan(plan.id, weeklyPlan);
    toast({ title: "Notes saved" });
  };

  const handleCompleteWorkout = () => {
    if (!selectedWorkout) return;
    
    const duration = parseInt(actualDuration) || selectedWorkout.duration;
    const rpeValue = parseInt(rpe) || 7;
    
    completeWorkout(plan.id, weeklyPlan.weekNumber, selectedWorkout.id, duration, rpeValue);
    
    // Award XP
    const xp = Math.round(duration * rpeValue / 10);
    addXP(xp);
    
    toast({
      title: "Workout Complete!",
      description: `Great job! +${xp} XP earned`,
    });
    
    setSelectedWorkout(null);
    onUpdate();
  };

  const workoutsByDay = DAYS.map((day, index) => ({
    day,
    workout: weeklyPlan.workouts.find(w => w.day === index + 1),
  }));

  const completedCount = weeklyPlan.workouts.filter(w => w.completed).length;
  const completionRate = (completedCount / weeklyPlan.workouts.length) * 100;

  return (
    <div className="space-y-6">
      {/* Week Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Week {weeklyPlan.weekNumber}</CardTitle>
              <CardDescription className="capitalize mt-1">
                {weeklyPlan.phase} Phase
              </CardDescription>
            </div>
            <Badge variant={completionRate === 100 ? 'default' : 'secondary'} className="text-lg px-4 py-2">
              {completedCount}/{weeklyPlan.workouts.length} Complete
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <div>
                <div className="text-sm text-muted-foreground">Volume</div>
                <div className="font-semibold">{Math.round(weeklyPlan.plannedVolume)}h</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Flame className="h-5 w-5 text-muted-foreground" />
              <div>
                <div className="text-sm text-muted-foreground">Intensity</div>
                <div className="font-semibold">{weeklyPlan.plannedIntensity.toFixed(1)}/10</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Trophy className="h-5 w-5 text-muted-foreground" />
              <div>
                <div className="text-sm text-muted-foreground">Training Load</div>
                <div className="font-semibold">{Math.round(weeklyPlan.trainingLoad || 0)}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-muted-foreground" />
              <div>
                <div className="text-sm text-muted-foreground">Progress</div>
                <div className="font-semibold">{Math.round(completionRate)}%</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Daily Workouts */}
      <div className="space-y-3">
        {workoutsByDay.map(({ day, workout }) => (
          <Card key={day} className={!workout ? 'opacity-50' : ''}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{day}</CardTitle>
                {workout && (
                  <Badge variant={workout.completed ? 'default' : 'outline'}>
                    {workout.completed ? 'Completed' : 'Scheduled'}
                  </Badge>
                )}
              </div>
            </CardHeader>
            {workout ? (
              <CardContent className="space-y-3">
                <div className="flex items-center gap-4 text-sm">
                  <Badge variant="secondary" className="capitalize">{workout.type}</Badge>
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {workout.duration} min
                  </span>
                  <span className="flex items-center gap-1">
                    <Flame className="h-4 w-4" />
                    Intensity {workout.intensity}/10
                  </span>
                </div>
                
                <div>
                  <div className="text-sm font-medium mb-1">Focus: {workout.focus}</div>
                  <div className="text-sm text-muted-foreground">
                    Recommended drills: {workout.drills.join(', ')}
                  </div>
                </div>

                {!workout.completed && (
                  <Button
                    onClick={() => {
                      setSelectedWorkout(workout);
                      setActualDuration(workout.duration.toString());
                    }}
                    className="w-full"
                  >
                    Mark Complete
                  </Button>
                )}

                {workout.completed && (
                  <div className="bg-primary/10 p-3 rounded-lg text-sm">
                    <div className="flex justify-between">
                      <span>Actual Duration:</span>
                      <span className="font-semibold">{workout.actualDuration} min</span>
                    </div>
                    <div className="flex justify-between">
                      <span>RPE:</span>
                      <span className="font-semibold">{workout.rpe}/10</span>
                    </div>
                  </div>
                )}
              </CardContent>
            ) : (
              <CardContent>
                <p className="text-sm text-muted-foreground">Rest day</p>
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      {/* Notes */}
      <Card>
        <CardHeader>
          <CardTitle>Week Notes</CardTitle>
          <CardDescription>Track your progress, challenges, and observations</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Textarea
            placeholder="How did the week go? Any insights or challenges?"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
          />
          <Button onClick={handleSaveNotes}>Save Notes</Button>
        </CardContent>
      </Card>

      {/* Complete Workout Dialog */}
      <Dialog open={!!selectedWorkout} onOpenChange={() => setSelectedWorkout(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Complete Workout</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="duration">Actual Duration (minutes)</Label>
              <Input
                id="duration"
                type="number"
                value={actualDuration}
                onChange={(e) => setActualDuration(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="rpe">Rate of Perceived Exertion (1-10)</Label>
              <Input
                id="rpe"
                type="number"
                min="1"
                max="10"
                value={rpe}
                onChange={(e) => setRpe(e.target.value)}
              />
              <p className="text-xs text-muted-foreground mt-1">
                1 = Very easy, 10 = Maximum effort
              </p>
            </div>
            <Button onClick={handleCompleteWorkout} className="w-full">
              Complete Workout
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
