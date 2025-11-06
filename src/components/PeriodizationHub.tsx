import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, TrendingUp, Target, Zap } from 'lucide-react';
import { getActivePlan, clearActivePlan } from '@/lib/trainingPlanStorage';
import { PlanBuilder } from './PlanBuilder';
import { ActivePlanView } from './ActivePlanView';
import { TrainingPlan } from '@/types/trainingPlan';
import { useToast } from '@/hooks/use-toast';

export function PeriodizationHub() {
  const { toast } = useToast();
  const [activePlan, setActivePlan] = useState<TrainingPlan | null>(null);
  const [showBuilder, setShowBuilder] = useState(false);

  useEffect(() => {
    loadActivePlan();
  }, []);

  const loadActivePlan = () => {
    const plan = getActivePlan();
    setActivePlan(plan);
    setShowBuilder(!plan);
  };

  const handleEndPlan = () => {
    if (confirm('Are you sure you want to end this training plan? It will be archived.')) {
      clearActivePlan();
      setActivePlan(null);
      setShowBuilder(false);
      toast({
        title: "Plan Ended",
        description: "Your training plan has been archived.",
      });
    }
  };

  if (showBuilder) {
    return (
      <div>
        {activePlan && (
          <Button variant="outline" onClick={() => setShowBuilder(false)} className="mb-4">
            Back to Active Plan
          </Button>
        )}
        <PlanBuilder onPlanCreated={loadActivePlan} />
      </div>
    );
  }

  if (activePlan) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold">Periodized Training</h2>
            <p className="text-muted-foreground">Olympic-level structured training</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowBuilder(true)}>
              View Templates
            </Button>
            <Button variant="destructive" onClick={handleEndPlan}>
              End Plan
            </Button>
          </div>
        </div>
        <ActivePlanView />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Periodized Training</h2>
        <p className="text-muted-foreground">Olympic-level structured training plans</p>
      </div>

      {/* Introduction */}
      <Card>
        <CardHeader>
          <CardTitle>What is Periodization?</CardTitle>
          <CardDescription>Professional training methodology used by elite athletes</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm">
            Periodization divides training into distinct phases to optimize performance and prevent overtraining.
            Each phase has specific objectives, volume, and intensity targets.
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3 p-4 bg-secondary rounded-lg">
              <Target className="h-6 w-6 text-primary mt-1" />
              <div>
                <h4 className="font-semibold mb-1">Base Phase</h4>
                <p className="text-sm text-muted-foreground">Build foundation with volume and technique</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-secondary rounded-lg">
              <TrendingUp className="h-6 w-6 text-primary mt-1" />
              <div>
                <h4 className="font-semibold mb-1">Build Phase</h4>
                <p className="text-sm text-muted-foreground">Increase intensity and sport-specific skills</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-secondary rounded-lg">
              <Zap className="h-6 w-6 text-primary mt-1" />
              <div>
                <h4 className="font-semibold mb-1">Peak Phase</h4>
                <p className="text-sm text-muted-foreground">Reach maximum performance level</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-secondary rounded-lg">
              <Calendar className="h-6 w-6 text-primary mt-1" />
              <div>
                <h4 className="font-semibold mb-1">Taper Phase</h4>
                <p className="text-sm text-muted-foreground">Reduce volume before competition</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Benefits */}
      <Card>
        <CardHeader>
          <CardTitle>Benefits of Periodized Training</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-primary">✓</span>
              <span className="text-sm">Systematic progression preventing plateaus</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">✓</span>
              <span className="text-sm">Reduced injury risk through proper load management</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">✓</span>
              <span className="text-sm">Peak at the right time for competitions</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">✓</span>
              <span className="text-sm">Balanced development of all physical qualities</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">✓</span>
              <span className="text-sm">Built-in recovery to prevent overtraining</span>
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* CTA */}
      <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
        <CardHeader>
          <CardTitle>Ready to Start?</CardTitle>
          <CardDescription>Create your personalized periodized training plan</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => setShowBuilder(true)} size="lg" className="w-full">
            <Calendar className="h-5 w-5 mr-2" />
            Create Training Plan
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
