import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Trophy, Target, Zap } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend?: { value: number; isPositive: boolean };
}

const StatCard = ({ title, value, icon }: StatCardProps) => (
  <Card className="p-6 hover:shadow-lg transition-all duration-300 border-2">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm text-muted-foreground font-medium mb-2">{title}</p>
        <p className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          {value}
        </p>
      </div>
      <div className="p-3 bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl">
        {icon}
      </div>
    </div>
  </Card>
);

export const Dashboard = () => {
  const [matches, setMatches] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalMatches: 0,
    wins: 0,
    losses: 0,
    winRate: 0,
  });

  useEffect(() => {
    const savedMatches = localStorage.getItem("matches");
    if (savedMatches) {
      const parsedMatches = JSON.parse(savedMatches);
      setMatches(parsedMatches);
      
      const wins = parsedMatches.filter((m: any) => m.result === "win").length;
      const total = parsedMatches.length;
      const winRate = total > 0 ? Math.round((wins / total) * 100) : 0;
      
      setStats({
        totalMatches: total,
        wins,
        losses: total - wins,
        winRate,
      });
    }
  }, []);

  const chartData = [
    { name: "Wins", value: stats.wins, color: "hsl(var(--primary))" },
    { name: "Losses", value: stats.losses, color: "hsl(var(--destructive))" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Performance Overview</h2>
        <p className="text-muted-foreground">Track your badminton journey</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Matches Played"
          value={stats.totalMatches.toString()}
          icon={<Trophy className="w-6 h-6" />}
        />
        <StatCard
          title="Win Rate"
          value={`${stats.winRate}%`}
          icon={<Target className="w-6 h-6" />}
          trend={stats.winRate >= 50 ? { value: stats.winRate, isPositive: true } : undefined}
        />
        <StatCard
          title="Total Wins"
          value={stats.wins.toString()}
          icon={<Trophy className="w-6 h-6" />}
        />
        <StatCard
          title="Total Losses"
          value={stats.losses.toString()}
          icon={<Zap className="w-6 h-6" />}
        />
      </div>

      {stats.totalMatches > 0 && (
        <Card className="p-6">
          <h3 className="text-xl font-bold mb-4">Win/Loss Ratio</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry) => `${entry.name}: ${entry.value}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      )}

      <Card className="p-6">
        <h3 className="text-xl font-bold mb-4">Recent Matches</h3>
        {matches.length === 0 ? (
          <p className="text-muted-foreground">No matches logged yet. Start tracking your progress!</p>
        ) : (
          <div className="space-y-4">
            {matches.slice(0, 5).map((match, index) => (
              <div key={index} className="flex items-center gap-4 p-3 rounded-lg hover:bg-accent/5 transition-colors">
                <div className={`p-2 rounded-lg ${match.result === "win" ? "bg-primary/10" : "bg-destructive/10"}`}>
                  <Trophy className={`w-5 h-5 ${match.result === "win" ? "text-primary" : "text-destructive"}`} />
                </div>
                <div className="flex-1">
                  <p className="font-medium">
                    {match.result === "win" ? "Won" : "Lost"} vs {match.opponent}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Score: {match.playerScore}-{match.opponentScore} • {new Date(match.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};
