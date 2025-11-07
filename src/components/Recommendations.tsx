import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Clock, Dumbbell, Video, BookOpen, TrendingUp } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

export const Recommendations = () => {
  const { t } = useLanguage();
  
  const recommendations = [
    {
      id: 1,
      type: "Training",
      icon: Dumbbell,
      title: "Advanced Footwork Program",
      description: "Based on your recent matches, improving footwork speed could give you a competitive edge.",
      duration: "4 weeks",
      difficulty: "Intermediate",
      priority: "high",
      reason: "Your court coverage analysis shows room for improvement"
    },
    {
      id: 2,
      type: "Video",
      icon: Video,
      title: "Net Play Masterclass",
      description: "Watch this tutorial series to enhance your net game and deceptive shots.",
      duration: "45 min",
      difficulty: "All levels",
      priority: "medium",
      reason: "Complements your current training focus"
    },
    {
      id: 3,
      type: "Drill",
      icon: Star,
      title: "Multi-Shuttle Speed Training",
      description: "High-intensity drill to improve reaction time and stamina.",
      duration: "20 min/session",
      difficulty: "Advanced",
      priority: "high",
      reason: "Aligns with your competition goals"
    },
    {
      id: 4,
      type: "Reading",
      icon: BookOpen,
      title: "Mental Game Strategy Guide",
      description: "Learn techniques to stay focused during crucial match points.",
      duration: "30 min read",
      difficulty: "All levels",
      priority: "medium",
      reason: "Based on your match patterns"
    },
    {
      id: 5,
      type: "Analysis",
      icon: TrendingUp,
      title: "Performance Review Session",
      description: "Detailed analysis of your last 10 matches with actionable insights.",
      duration: "1 hour",
      difficulty: "All levels",
      priority: "high",
      reason: "Regular performance reviews recommended"
    }
  ];

  const getTypeColor = (type: string) => {
    const colors = {
      Training: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
      Video: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
      Drill: "bg-green-500/10 text-green-600 dark:text-green-400",
      Reading: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
      Analysis: "bg-pink-500/10 text-pink-600 dark:text-pink-400"
    };
    return colors[type as keyof typeof colors] || "bg-gray-500/10 text-gray-600";
  };

  const getPriorityVariant = (priority: string) => {
    return priority === "high" ? "default" : "secondary";
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">{t("rec.title")}</h2>
        <p className="text-muted-foreground">{t("rec.subtitle")}</p>
      </div>

      <div className="grid gap-6">
        {recommendations.map((rec) => (
          <Card key={rec.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg ${getTypeColor(rec.type)}`}>
                    <rec.icon className="h-5 w-5" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-xl">{rec.title}</CardTitle>
                      <Badge variant={getPriorityVariant(rec.priority)}>
                        {rec.priority}
                      </Badge>
                    </div>
                    <CardDescription>{rec.description}</CardDescription>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>{rec.duration}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{rec.difficulty}</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-primary/5">
                      {rec.type}
                    </Badge>
                  </div>
                </div>
                
                <div className="p-3 rounded-lg bg-muted/50 text-sm">
                  <span className="font-medium">{t("rec.whyRecommended")}</span>
                  <span className="text-muted-foreground">{rec.reason}</span>
                </div>

                <div className="flex gap-2">
                  <Button className="flex-1">{t("rec.startNow")}</Button>
                  <Button variant="outline">{t("rec.saveForLater")}</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("rec.getMore")}</CardTitle>
          <CardDescription>
            {t("rec.getMore.desc")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" className="w-full">
            {t("rec.updatePreferences")}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
