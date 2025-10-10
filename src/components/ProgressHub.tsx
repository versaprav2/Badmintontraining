import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, TrendingDown, Activity, Trophy, Target, Flame,
  Calendar, BarChart3, Users, Award
} from "lucide-react";
import {
  calculateWeeklySummary,
  getActivityHeatmap,
  getPerformanceTrends,
  getOpponentStats,
  generateSmartInsights,
  calculateMomentumScore
} from "@/lib/progressAnalytics";
import { 
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from "@/components/ui/chart";
import { Line, LineChart, XAxis, YAxis, ResponsiveContainer } from "recharts";

export const ProgressHub = () => {
  const [weeklySummary, setWeeklySummary] = useState<any>(null);
  const [heatmap, setHeatmap] = useState<any>({});
  const [trends, setTrends] = useState<any[]>([]);
  const [opponentStats, setOpponentStats] = useState<any[]>([]);
  const [insights, setInsights] = useState<string[]>([]);
  const [momentum, setMomentum] = useState(0);

  useEffect(() => {
    const summary = calculateWeeklySummary();
    const heatmapData = getActivityHeatmap(90); // Last 90 days
    const trendData = getPerformanceTrends();
    const opponents = getOpponentStats();
    const insightData = generateSmartInsights();
    const momentumScore = calculateMomentumScore();

    setWeeklySummary(summary);
    setHeatmap(heatmapData);
    setTrends(trendData);
    setOpponentStats(opponents.slice(0, 5));
    setInsights(insightData);
    setMomentum(momentumScore);
  }, []);

  if (!weeklySummary) return null;

  const getMomentumColor = (score: number) => {
    if (score >= 70) return "from-primary/20 to-accent/20 border-primary/30";
    if (score >= 40) return "from-secondary/20 to-orange-500/20 border-secondary/30";
    return "from-muted/20 to-muted/30 border-muted/30";
  };

  const getMomentumLabel = (score: number) => {
    if (score >= 70) return "🔥 On Fire!";
    if (score >= 40) return "📈 Building";
    return "💪 Keep Going";
  };

  // Prepare heatmap for last 90 days
  const last90Days = Array.from({ length: 90 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (89 - i));
    return date.toISOString().split('T')[0];
  });

  const getHeatmapIntensity = (xp: number) => {
    if (xp === 0) return "bg-muted/20";
    if (xp < 50) return "bg-primary/20";
    if (xp < 100) return "bg-primary/40";
    if (xp < 200) return "bg-primary/60";
    return "bg-primary/80";
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Progress Hub
        </h1>
        <p className="text-muted-foreground">Your complete training overview and insights</p>
      </div>

      {/* Momentum Score */}
      <Card className={`p-6 bg-gradient-to-br ${getMomentumColor(momentum)}`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Momentum Score</p>
            <div className="flex items-center gap-3">
              <h2 className="text-5xl font-bold">{momentum}</h2>
              <Badge variant="outline" className="text-lg">
                {getMomentumLabel(momentum)}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Based on recent wins, activity, and consistency
            </p>
          </div>
          <div className="p-4 bg-background/50 rounded-xl">
            <Flame className="w-12 h-12 text-primary" />
          </div>
        </div>
      </Card>

      {/* Weekly Summary */}
      <div>
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Calendar className="w-6 h-6 text-primary" />
          This Week
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Trophy className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Matches</p>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold">{weeklySummary.matchesPlayed}</p>
                  {weeklySummary.trends.matches !== 0 && (
                    <Badge variant={weeklySummary.trends.matches > 0 ? "default" : "secondary"} className="gap-1">
                      {weeklySummary.trends.matches > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      {Math.abs(weeklySummary.trends.matches)}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-secondary/10 rounded-lg">
                <Target className="w-5 h-5 text-secondary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Drills</p>
                <p className="text-2xl font-bold">{weeklySummary.drillsCompleted}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-accent/10 rounded-lg">
                <Activity className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">XP Earned</p>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold">{weeklySummary.xpEarned}</p>
                  {weeklySummary.trends.xp !== 0 && (
                    <Badge variant={weeklySummary.trends.xp > 0 ? "default" : "secondary"} className="gap-1">
                      {weeklySummary.trends.xp > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      {Math.abs(weeklySummary.trends.xp)}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Award className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Win Rate</p>
                <p className="text-2xl font-bold">{weeklySummary.winRate}%</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Smart Insights */}
      {insights.length > 0 && (
        <Card className="p-6 bg-gradient-to-br from-accent/10 to-primary/10 border-accent/20">
          <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-accent" />
            Smart Insights
          </h3>
          <div className="space-y-2">
            {insights.map((insight, i) => (
              <p key={i} className="text-sm">{insight}</p>
            ))}
          </div>
        </Card>
      )}

      {/* Activity Heatmap */}
      <div>
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Activity className="w-6 h-6 text-primary" />
          Activity Heatmap (Last 90 Days)
        </h2>
        <Card className="p-6">
          <div className="grid grid-cols-10 md:grid-cols-15 lg:grid-cols-18 gap-1">
            {last90Days.map(date => {
              const xp = heatmap[date] || 0;
              return (
                <div
                  key={date}
                  className={`w-3 h-3 rounded-sm ${getHeatmapIntensity(xp)} hover:ring-2 hover:ring-primary transition-all cursor-pointer`}
                  title={`${date}: ${xp} XP`}
                />
              );
            })}
          </div>
          <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground">
            <span>Less</span>
            <div className="flex gap-1">
              <div className="w-3 h-3 rounded-sm bg-muted/20" />
              <div className="w-3 h-3 rounded-sm bg-primary/20" />
              <div className="w-3 h-3 rounded-sm bg-primary/40" />
              <div className="w-3 h-3 rounded-sm bg-primary/60" />
              <div className="w-3 h-3 rounded-sm bg-primary/80" />
            </div>
            <span>More</span>
          </div>
        </Card>
      </div>

      {/* Performance Trends */}
      {trends.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-primary" />
            Win Rate Trends
          </h2>
          <Card className="p-6">
            <ResponsiveContainer width="100%" height={300}>
              <ChartContainer config={{
                winRate: {
                  label: "Win Rate",
                  color: "hsl(var(--primary))",
                },
              }}>
                <LineChart data={trends}>
                  <XAxis 
                    dataKey="month" 
                    tickFormatter={(value) => {
                      const [year, month] = value.split('-');
                      return `${month}/${year.slice(2)}`;
                    }}
                  />
                  <YAxis domain={[0, 100]} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line 
                    type="monotone" 
                    dataKey="winRate" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={3}
                    dot={{ fill: "hsl(var(--primary))", r: 4 }}
                  />
                </LineChart>
              </ChartContainer>
            </ResponsiveContainer>
          </Card>
        </div>
      )}

      {/* Top Opponents */}
      {opponentStats.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Users className="w-6 h-6 text-primary" />
            Top Opponents
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {opponentStats.map(stat => (
              <Card key={stat.opponent} className="p-4">
                <h3 className="font-bold mb-2">{stat.opponent}</h3>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    {stat.wins}W - {stat.losses}L
                  </span>
                  <Badge variant={stat.winRate >= 50 ? "default" : "secondary"}>
                    {stat.winRate}%
                  </Badge>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};