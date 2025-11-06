import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle } from 'lucide-react';
import { getTrainingLoads } from '@/lib/trainingPlanStorage';
import { TrainingLoad } from '@/types/trainingPlan';

interface TrainingLoadMonitorProps {
  planId: string;
}

export function TrainingLoadMonitor({ planId }: TrainingLoadMonitorProps) {
  const [loads, setLoads] = useState<TrainingLoad[]>([]);

  useEffect(() => {
    const loadData = getTrainingLoads(planId);
    setLoads(loadData);
  }, [planId]);

  if (loads.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Training Load Monitor</CardTitle>
          <CardDescription>Complete workouts to track your training load</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No training data available yet</p>
        </CardContent>
      </Card>
    );
  }

  const currentLoad = loads[loads.length - 1];
  const acwr = currentLoad.acwr || 1.0;
  
  // ACWR thresholds
  const isOptimal = acwr >= 0.8 && acwr <= 1.3;
  const isUndertraining = acwr < 0.8;
  const isOvertraining = acwr > 1.5;

  const chartData = loads.map(load => ({
    week: `W${load.weekNumber}`,
    load: Math.round(load.totalLoad),
    acwr: load.acwr ? parseFloat(load.acwr.toFixed(2)) : undefined,
  }));

  return (
    <div className="space-y-6">
      {/* Current Status */}
      <Card>
        <CardHeader>
          <CardTitle>Training Load Status</CardTitle>
          <CardDescription>Week {currentLoad.weekNumber} Analysis</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-secondary rounded-lg">
              <div className="text-2xl font-bold">{Math.round(currentLoad.volume)}h</div>
              <div className="text-sm text-muted-foreground">Volume</div>
            </div>
            <div className="text-center p-4 bg-secondary rounded-lg">
              <div className="text-2xl font-bold">{currentLoad.intensity.toFixed(1)}</div>
              <div className="text-sm text-muted-foreground">Intensity</div>
            </div>
            <div className="text-center p-4 bg-secondary rounded-lg">
              <div className="text-2xl font-bold">{Math.round(currentLoad.totalLoad)}</div>
              <div className="text-sm text-muted-foreground">Total Load</div>
            </div>
            <div className="text-center p-4 bg-secondary rounded-lg">
              <div className="text-2xl font-bold">{acwr.toFixed(2)}</div>
              <div className="text-sm text-muted-foreground">ACWR</div>
            </div>
          </div>

          {/* ACWR Status Alert */}
          {isOptimal && (
            <Alert className="border-green-500 bg-green-500/10">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <AlertDescription className="text-green-700 dark:text-green-400">
                Optimal training load! Your acute to chronic workload ratio is in the sweet spot (0.8-1.3). 
                You're building fitness while managing fatigue well.
              </AlertDescription>
            </Alert>
          )}

          {isUndertraining && (
            <Alert className="border-blue-500 bg-blue-500/10">
              <TrendingDown className="h-4 w-4 text-blue-500" />
              <AlertDescription className="text-blue-700 dark:text-blue-400">
                Training load is relatively low. Consider gradually increasing volume or intensity 
                to continue making progress.
              </AlertDescription>
            </Alert>
          )}

          {isOvertraining && (
            <Alert className="border-red-500 bg-red-500/10">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              <AlertDescription className="text-red-700 dark:text-red-400">
                <strong>Warning:</strong> Training load spike detected (ACWR &gt; 1.5). 
                Consider adding rest days or reducing intensity to prevent overtraining and injury risk.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Load Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Training Load Trend</CardTitle>
          <CardDescription>Weekly load progression</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="load" stroke="#8884d8" name="Training Load" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* ACWR Chart */}
      {loads.some(l => l.acwr) && (
        <Card>
          <CardHeader>
            <CardTitle>ACWR Trend</CardTitle>
            <CardDescription>Acute:Chronic Workload Ratio (Target: 0.8-1.3)</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData.filter(d => d.acwr)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis domain={[0, 2]} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="acwr" stroke="#82ca9d" name="ACWR" strokeWidth={2} />
                {/* Safe zone reference lines */}
                <Line type="monotone" dataKey={() => 0.8} stroke="#888" strokeDasharray="5 5" name="Min Safe" />
                <Line type="monotone" dataKey={() => 1.3} stroke="#888" strokeDasharray="5 5" name="Max Safe" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Education */}
      <Card>
        <CardHeader>
          <CardTitle>Understanding Training Load</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div>
            <strong>Training Load:</strong> Calculated as Volume × Intensity. Represents your total training stress.
          </div>
          <div>
            <strong>ACWR (Acute:Chronic Workload Ratio):</strong> Compares your recent load (last week) to your 
            4-week average. Used to identify rapid changes in training that may increase injury risk.
          </div>
          <div className="grid gap-2 pt-2">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-blue-500/10">ACWR &lt; 0.8</Badge>
              <span>Undertraining - may lose fitness</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-green-500/10">ACWR 0.8-1.3</Badge>
              <span>Optimal - building fitness safely</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-yellow-500/10">ACWR 1.3-1.5</Badge>
              <span>Caution - monitor recovery</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-red-500/10">ACWR &gt; 1.5</Badge>
              <span>High risk - reduce load</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
