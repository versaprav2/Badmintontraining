import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, Zap, Target, Footprints, Dumbbell } from "lucide-react";
import { toast } from "sonner";

interface Drill {
  name: string;
  duration: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  icon: React.ReactNode;
  description: string;
  videoUrl?: string;
}

const drills: Drill[] = [
  {
    name: "Footwork Fundamentals",
    duration: "30 min",
    difficulty: "beginner",
    icon: <Footprints className="w-6 h-6" />,
    description: "Master basic court movement patterns and stepping techniques",
    videoUrl: "https://www.youtube.com/watch?v=example1",
  },
  {
    name: "Basic Serving Technique",
    duration: "20 min",
    difficulty: "beginner",
    icon: <Target className="w-6 h-6" />,
    description: "Learn proper short and long serve fundamentals",
    videoUrl: "https://www.youtube.com/watch?v=example2",
  },
  {
    name: "Clear Shot Practice",
    duration: "25 min",
    difficulty: "beginner",
    icon: <Zap className="w-6 h-6" />,
    description: "Develop consistent overhead clear technique",
    videoUrl: "https://www.youtube.com/watch?v=example3",
  },
  {
    name: "Grip Mastery",
    duration: "15 min",
    difficulty: "beginner",
    icon: <CheckCircle2 className="w-6 h-6" />,
    description: "Perfect forehand and backhand grip transitions",
    videoUrl: "https://www.youtube.com/watch?v=example4",
  },
  {
    name: "Shadow Badminton",
    duration: "25 min",
    difficulty: "beginner",
    icon: <Footprints className="w-6 h-6" />,
    description: "Practice movement patterns without a shuttlecock",
    videoUrl: "https://www.youtube.com/watch?v=example5",
  },
  {
    name: "Smash Power Training",
    duration: "45 min",
    difficulty: "intermediate",
    icon: <Zap className="w-6 h-6" />,
    description: "Develop explosive smash power with targeted exercises",
    videoUrl: "https://www.youtube.com/watch?v=example6",
  },
  {
    name: "Drive Shot Drills",
    duration: "30 min",
    difficulty: "intermediate",
    icon: <Target className="w-6 h-6" />,
    description: "Master fast-paced flat drives at mid-court",
    videoUrl: "https://www.youtube.com/watch?v=example7",
  },
  {
    name: "Net Kill Practice",
    duration: "35 min",
    difficulty: "intermediate",
    icon: <CheckCircle2 className="w-6 h-6" />,
    description: "Sharpen your net kill and interception skills",
    videoUrl: "https://www.youtube.com/watch?v=example8",
  },
  {
    name: "Endurance Building",
    duration: "60 min",
    difficulty: "intermediate",
    icon: <Dumbbell className="w-6 h-6" />,
    description: "Increase stamina for longer, more intense matches",
    videoUrl: "https://www.youtube.com/watch?v=example9",
  },
  {
    name: "Defensive Tactics",
    duration: "40 min",
    difficulty: "intermediate",
    icon: <Target className="w-6 h-6" />,
    description: "Learn to read opponents and respond defensively",
    videoUrl: "https://www.youtube.com/watch?v=example10",
  },
  {
    name: "Multi-Shuttle Training",
    duration: "50 min",
    difficulty: "intermediate",
    icon: <Zap className="w-6 h-6" />,
    description: "High-intensity drill with continuous shuttle feeding",
    videoUrl: "https://www.youtube.com/watch?v=example11",
  },
  {
    name: "Advanced Drop Shots",
    duration: "40 min",
    difficulty: "advanced",
    icon: <Target className="w-6 h-6" />,
    description: "Perfect your drop shot accuracy and deception",
    videoUrl: "https://www.youtube.com/watch?v=example12",
  },
  {
    name: "Net Play Mastery",
    duration: "35 min",
    difficulty: "advanced",
    icon: <CheckCircle2 className="w-6 h-6" />,
    description: "Refine net shots, lifts, and front-court dominance",
    videoUrl: "https://www.youtube.com/watch?v=example13",
  },
  {
    name: "Deceptive Shots",
    duration: "45 min",
    difficulty: "advanced",
    icon: <Target className="w-6 h-6" />,
    description: "Master slice drops, reverse slices, and feints",
    videoUrl: "https://www.youtube.com/watch?v=example14",
  },
  {
    name: "Jump Smash Technique",
    duration: "40 min",
    difficulty: "advanced",
    icon: <Zap className="w-6 h-6" />,
    description: "Develop power and control in jump smashes",
    videoUrl: "https://www.youtube.com/watch?v=example15",
  },
  {
    name: "Match Simulation",
    duration: "90 min",
    difficulty: "advanced",
    icon: <Dumbbell className="w-6 h-6" />,
    description: "Full match scenarios with pressure situations",
    videoUrl: "https://www.youtube.com/watch?v=example16",
  },
  {
    name: "Court Coverage Optimization",
    duration: "50 min",
    difficulty: "advanced",
    icon: <Footprints className="w-6 h-6" />,
    description: "Maximize efficiency in court movement and recovery",
    videoUrl: "https://www.youtube.com/watch?v=example17",
  },
  {
    name: "Advanced Serve Variations",
    duration: "30 min",
    difficulty: "advanced",
    icon: <Target className="w-6 h-6" />,
    description: "Master flick serves, drive serves, and serve placement",
    videoUrl: "https://www.youtube.com/watch?v=example18",
  },
];

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case "beginner":
      return "bg-primary/20 text-primary border-primary/30";
    case "intermediate":
      return "bg-secondary/20 text-secondary border-secondary/30";
    case "advanced":
      return "bg-destructive/20 text-destructive border-destructive/30";
    default:
      return "";
  }
};

export const TrainingPrograms = () => {
  const handleStartDrill = (drillName: string, videoUrl?: string) => {
    if (videoUrl) {
      window.open(videoUrl, "_blank");
    }
    toast.success(`Starting "${drillName}" training!`, {
      description: "Get ready to improve your game!",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Training Programs</h2>
        <p className="text-muted-foreground">
          Structured drills to elevate your badminton skills
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {drills.map((drill, index) => (
          <Card
            key={index}
            className="p-6 border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-xl group"
          >
            <div className="mb-4">
              <div className="p-3 bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl w-fit mb-3 group-hover:scale-110 transition-transform">
                {drill.icon}
              </div>
              <h3 className="text-xl font-bold mb-2">{drill.name}</h3>
              <p className="text-sm text-muted-foreground mb-3">{drill.description}</p>
            </div>

            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                {drill.duration}
              </div>
              <Badge variant="outline" className={getDifficultyColor(drill.difficulty)}>
                {drill.difficulty}
              </Badge>
            </div>

            <Button
              variant="outline"
              className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all"
              onClick={() => handleStartDrill(drill.name, drill.videoUrl)}
            >
              {drill.videoUrl ? "Watch & Train" : "Start Training"}
            </Button>
          </Card>
        ))}
      </div>

      <Card className="p-6 bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-primary/20">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-primary/20 rounded-xl">
            <Target className="w-8 h-8 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold mb-2">Create Custom Training</h3>
            <p className="text-muted-foreground mb-4">
              Want a personalized training program? Combine drills and set your own goals.
            </p>
            <Button variant="gradient" size="lg">
              Build My Program
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};
