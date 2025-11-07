import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Calendar, Target, Trophy, Dumbbell, Zap } from 'lucide-react';
import { TrainingGoal } from '@/types/trainingPlan';
import { generatePeriodizedPlan } from '@/lib/periodizationEngine';
import { saveActivePlan } from '@/lib/trainingPlanStorage';
import { useToast } from '@/hooks/use-toast';

interface PlanBuilderProps {
  onPlanCreated: () => void;
}

export function PlanBuilder({ onPlanCreated }: PlanBuilderProps) {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [goal, setGoal] = useState<TrainingGoal>('fitness');
  const [duration, setDuration] = useState<8 | 12 | 16>(12);
  const [daysPerWeek, setDaysPerWeek] = useState(4);
  const [fitnessLevel, setFitnessLevel] = useState<'beginner' | 'intermediate' | 'advanced' | 'elite'>('intermediate');
  const [competitionDate, setCompetitionDate] = useState('');

  const goals = [
    { value: 'fitness', label: 'General Fitness', icon: Dumbbell, desc: 'Build overall fitness and endurance' },
    { value: 'skill', label: 'Skill Development', icon: Target, desc: 'Improve techniques and tactical ability' },
    { value: 'tournament', label: 'Tournament Prep', icon: Trophy, desc: 'Peak for a specific tournament' },
    { value: 'competition', label: 'Competition Peak', icon: Zap, desc: 'Reach elite competition form' },
  ];

  const handleCreatePlan = () => {
    const plan = generatePeriodizedPlan(
      goal,
      duration,
      daysPerWeek,
      fitnessLevel,
      competitionDate || undefined
    );
    
    saveActivePlan(plan);
    
    toast({
      title: "Training Plan Created!",
      description: `Your ${duration}-week ${goal} plan is ready to start.`,
    });
    
    onPlanCreated();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Progress indicator */}
      <div className="flex items-center justify-between mb-8">
        {[1, 2, 3, 4].map((s) => (
          <div key={s} className="flex items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              step >= s ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'
            }`}>
              {s}
            </div>
            {s < 4 && <div className={`w-24 h-1 ${step > s ? 'bg-primary' : 'bg-secondary'}`} />}
          </div>
        ))}
      </div>

      {/* Step 1: Goal Selection */}
      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>What's Your Goal?</CardTitle>
            <CardDescription>Choose the primary focus of your training plan</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {goals.map((g) => (
                <Card
                  key={g.value}
                  className={`cursor-pointer transition-all ${
                    goal === g.value ? 'border-primary ring-2 ring-primary' : 'hover:border-primary/50'
                  }`}
                  onClick={() => setGoal(g.value as TrainingGoal)}
                >
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <g.icon className="h-6 w-6 text-primary" />
                      <CardTitle className="text-lg">{g.label}</CardTitle>
                    </div>
                    <CardDescription>{g.desc}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
            <Button onClick={() => setStep(2)} className="w-full">Next</Button>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Duration & Schedule */}
      {step === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>Plan Duration & Schedule</CardTitle>
            <CardDescription>Configure your training schedule</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label className="text-base mb-3 block">Plan Duration</Label>
              <RadioGroup value={duration.toString()} onValueChange={(v) => setDuration(parseInt(v) as 8 | 12 | 16)}>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="8" id="dur8" />
                    <Label htmlFor="dur8" className="cursor-pointer">8 weeks - Quick preparation</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="12" id="dur12" />
                    <Label htmlFor="dur12" className="cursor-pointer">12 weeks - Balanced development (recommended)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="16" id="dur16" />
                    <Label htmlFor="dur16" className="cursor-pointer">16 weeks - Complete transformation</Label>
                  </div>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label htmlFor="days" className="text-base mb-3 block">Training Days Per Week</Label>
              <Input
                id="days"
                type="number"
                min="3"
                max="6"
                value={daysPerWeek}
                onChange={(e) => setDaysPerWeek(parseInt(e.target.value) || 4)}
              />
            </div>

            {(goal === 'tournament' || goal === 'competition') && (
              <div>
                <Label htmlFor="compDate" className="text-base mb-3 block flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Competition Date (Optional)
                </Label>
                <Input
                  id="compDate"
                  type="date"
                  value={competitionDate}
                  onChange={(e) => setCompetitionDate(e.target.value)}
                />
              </div>
            )}

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => {
                console.log('Back button clicked, current step:', step);
                setStep(1);
              }} className="flex-1">Back</Button>
              <Button onClick={() => {
                console.log('Next button clicked from step 2', { duration, daysPerWeek, goal });
                setStep(3);
                console.log('Step should now be 3');
              }} className="flex-1">Next</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Fitness Level */}
      {step === 3 && (
        <Card>
          <CardHeader>
            <CardTitle>Current Fitness Level</CardTitle>
            <CardDescription>This helps us adjust training intensity</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <RadioGroup value={fitnessLevel} onValueChange={(v: any) => setFitnessLevel(v)}>
              <div className="space-y-3">
                <Card className={`cursor-pointer ${fitnessLevel === 'beginner' ? 'border-primary ring-2 ring-primary' : ''}`}>
                  <CardHeader className="p-4" onClick={() => setFitnessLevel('beginner')}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="beginner" id="beg" />
                      <div>
                        <Label htmlFor="beg" className="cursor-pointer font-semibold">Beginner</Label>
                        <p className="text-sm text-muted-foreground">New to badminton or returning after a break</p>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
                <Card className={`cursor-pointer ${fitnessLevel === 'intermediate' ? 'border-primary ring-2 ring-primary' : ''}`}>
                  <CardHeader className="p-4" onClick={() => setFitnessLevel('intermediate')}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="intermediate" id="int" />
                      <div>
                        <Label htmlFor="int" className="cursor-pointer font-semibold">Intermediate</Label>
                        <p className="text-sm text-muted-foreground">Regular player with solid fundamentals</p>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
                <Card className={`cursor-pointer ${fitnessLevel === 'advanced' ? 'border-primary ring-2 ring-primary' : ''}`}>
                  <CardHeader className="p-4" onClick={() => setFitnessLevel('advanced')}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="advanced" id="adv" />
                      <div>
                        <Label htmlFor="adv" className="cursor-pointer font-semibold">Advanced</Label>
                        <p className="text-sm text-muted-foreground">Competitive player with tournament experience</p>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
                <Card className={`cursor-pointer ${fitnessLevel === 'elite' ? 'border-primary ring-2 ring-primary' : ''}`}>
                  <CardHeader className="p-4" onClick={() => setFitnessLevel('elite')}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="elite" id="eli" />
                      <div>
                        <Label htmlFor="eli" className="cursor-pointer font-semibold">Elite</Label>
                        <p className="text-sm text-muted-foreground">High-level competitor training intensively</p>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              </div>
            </RadioGroup>

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep(2)} className="flex-1">Back</Button>
              <Button onClick={() => setStep(4)} className="flex-1">Next</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 4: Review & Create */}
      {step === 4 && (
        <Card>
          <CardHeader>
            <CardTitle>Review Your Plan</CardTitle>
            <CardDescription>Confirm your training plan details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4">
              <div className="flex justify-between p-3 bg-secondary rounded-lg">
                <span className="font-medium">Goal:</span>
                <span className="capitalize">{goal.replace('-', ' ')}</span>
              </div>
              <div className="flex justify-between p-3 bg-secondary rounded-lg">
                <span className="font-medium">Duration:</span>
                <span>{duration} weeks</span>
              </div>
              <div className="flex justify-between p-3 bg-secondary rounded-lg">
                <span className="font-medium">Training Days:</span>
                <span>{daysPerWeek} days/week</span>
              </div>
              <div className="flex justify-between p-3 bg-secondary rounded-lg">
                <span className="font-medium">Fitness Level:</span>
                <span className="capitalize">{fitnessLevel}</span>
              </div>
              {competitionDate && (
                <div className="flex justify-between p-3 bg-secondary rounded-lg">
                  <span className="font-medium">Competition Date:</span>
                  <span>{new Date(competitionDate).toLocaleDateString()}</span>
                </div>
              )}
            </div>

            <div className="bg-primary/10 p-4 rounded-lg">
              <p className="text-sm">
                Your plan will include {duration === 8 ? '4' : duration === 12 ? '4' : '5'} distinct training phases: 
                Base building, Skill development, Peak performance, and Taper/Recovery periods to maximize your results.
              </p>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep(3)} className="flex-1">Back</Button>
              <Button onClick={handleCreatePlan} className="flex-1">Create Plan</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
