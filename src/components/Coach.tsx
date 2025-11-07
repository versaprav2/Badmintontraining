import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Lightbulb, Target, TrendingUp, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useLanguage } from "@/hooks/useLanguage";

export const Coach = () => {
  const { t } = useLanguage();
  
  const coachingInsights = [
    {
      category: t("coach.technique"),
      icon: Target,
      insights: [
        t("coach.insight.footwork"),
        t("coach.insight.netPlay"),
        t("coach.insight.backhand")
      ],
      priority: "high"
    },
    {
      category: t("coach.strategy"),
      icon: Lightbulb,
      insights: [
        t("coach.insight.shotPlacement"),
        t("coach.insight.deceptive"),
        t("coach.insight.serve")
      ],
      priority: "medium"
    },
    {
      category: t("coach.physical"),
      icon: TrendingUp,
      insights: [
        t("coach.insight.cardio"),
        t("coach.insight.plyometric"),
        t("coach.insight.core")
      ],
      priority: "medium"
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "destructive";
      case "medium": return "default";
      default: return "secondary";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">{t("coach.title")}</h2>
        <p className="text-muted-foreground">{t("coach.subtitle")}</p>
      </div>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          {t("coach.alert")}
        </AlertDescription>
      </Alert>

      <div className="grid gap-6">
        {coachingInsights.map((section) => (
          <Card key={section.category}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <section.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle>{section.category}</CardTitle>
                    <CardDescription>{t("coach.areasToFocus")}</CardDescription>
                  </div>
                </div>
                <Badge variant={getPriorityColor(section.priority)}>
                  {t(`coach.priority.${section.priority}`)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {section.insights.map((insight, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="mt-1 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                    <span className="text-sm">{insight}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("coach.weeklyFocus")}</CardTitle>
          <CardDescription>{t("coach.weeklyFocus.desc")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>{t("coach.techniques")}</span>
              <span className="font-medium">40%</span>
            </div>
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <div className="h-full bg-primary" style={{ width: '40%' }} />
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>{t("coach.matchPlay")}</span>
              <span className="font-medium">30%</span>
            </div>
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <div className="h-full bg-primary" style={{ width: '30%' }} />
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>{t("coach.conditioning")}</span>
              <span className="font-medium">20%</span>
            </div>
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <div className="h-full bg-primary" style={{ width: '20%' }} />
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>{t("coach.recovery")}</span>
              <span className="font-medium">10%</span>
            </div>
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <div className="h-full bg-primary" style={{ width: '10%' }} />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button>{t("coach.scheduleSession")}</Button>
      </div>
    </div>
  );
};
