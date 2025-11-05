import { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  CheckCircle2, 
  Clock, 
  Play, 
  Target,
  ListChecks,
  Lightbulb,
  TrendingUp,
  Calendar,
  Flame,
  Settings
} from "lucide-react";
import { toast } from "sonner";
import { useGamification } from "@/hooks/useGamification";

interface DrillDetails {
  name: string;
  duration: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  description: string;
  videoUrl?: string;
  detailedInfo: {
    objective: string;
    keyPoints: string[];
    instructions: string[];
    benefits: string[];
    commonMistakes: string[];
  };
}

interface MicroProgress {
  instructionsRead: boolean;
  instructionsReadTime: number;
  videoWatched: boolean;
  videoWatchPercentage: number;
  notesAdded: boolean;
  firstCompletion: boolean;
  mastery: boolean;
}

interface DrillProgress {
  completed: boolean;
  completionCount: number;
  lastCompleted?: string;
  notes: string;
  microProgress: MicroProgress;
  streakDays: number;
  lastPracticedDate?: string;
  masteryThreshold: 3 | 5 | 7 | 10;
  notesOptional: boolean;
}

interface DrillDetailModalProps {
  drill: DrillDetails | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const DrillDetailModal = ({ drill, open, onOpenChange }: DrillDetailModalProps) => {
  const { addXP } = useGamification();
  const [progress, setProgress] = useState<DrillProgress>({
    completed: false,
    completionCount: 0,
    notes: "",
    microProgress: {
      instructionsRead: false,
      instructionsReadTime: 0,
      videoWatched: false,
      videoWatchPercentage: 0,
      notesAdded: false,
      firstCompletion: false,
      mastery: false,
    },
    streakDays: 0,
    masteryThreshold: 5,
    notesOptional: false,
  });
  const [currentTab, setCurrentTab] = useState("overview");
  const instructionsStartTime = useRef<number | null>(null);
  const videoRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (drill) {
      const saved = localStorage.getItem(`drill_progress_${drill.name}`);
      if (saved) {
        const loadedProgress = JSON.parse(saved);
        // Ensure all new fields exist
        setProgress({
          ...loadedProgress,
          microProgress: loadedProgress.microProgress || {
            instructionsRead: false,
            instructionsReadTime: 0,
            videoWatched: false,
            videoWatchPercentage: 0,
            notesAdded: false,
            firstCompletion: false,
            mastery: false,
          },
          streakDays: loadedProgress.streakDays || 0,
          masteryThreshold: loadedProgress.masteryThreshold || 5,
          notesOptional: loadedProgress.notesOptional || false,
        });
      } else {
        setProgress({
          completed: false,
          completionCount: 0,
          notes: "",
          microProgress: {
            instructionsRead: false,
            instructionsReadTime: 0,
            videoWatched: false,
            videoWatchPercentage: 0,
            notesAdded: false,
            firstCompletion: false,
            mastery: false,
          },
          streakDays: 0,
          masteryThreshold: 5,
          notesOptional: false,
        });
      }
    }
  }, [drill]);

  // Track instructions read time
  useEffect(() => {
    if (currentTab === "instructions" && !progress.microProgress.instructionsRead) {
      instructionsStartTime.current = Date.now();
      
      return () => {
        if (instructionsStartTime.current) {
          const timeSpent = (Date.now() - instructionsStartTime.current) / 1000;
          if (timeSpent >= 10 && !progress.microProgress.instructionsRead) {
            updateMicroProgress("instructionsRead", timeSpent);
          }
        }
      };
    }
  }, [currentTab, progress.microProgress.instructionsRead]);

  // Save progress whenever it changes
  useEffect(() => {
    if (drill && progress.completionCount > 0) {
      localStorage.setItem(`drill_progress_${drill.name}`, JSON.stringify(progress));
    }
  }, [progress, drill]);

  const updateMicroProgress = (step: keyof MicroProgress, value?: number) => {
    if (!drill) return;
    
    const newMicroProgress = { ...progress.microProgress };
    let xpEarned = 0;
    let message = "";

    switch (step) {
      case "instructionsRead":
        if (!newMicroProgress.instructionsRead) {
          newMicroProgress.instructionsRead = true;
          newMicroProgress.instructionsReadTime = value || 0;
          xpEarned = 20;
          message = "Instructions read! 📖 +20 XP";
        }
        break;
      case "videoWatched":
        if (!newMicroProgress.videoWatched && value && value >= 50) {
          newMicroProgress.videoWatched = true;
          newMicroProgress.videoWatchPercentage = value;
          xpEarned = 40;
          message = "Video watched! 🎥 +40 XP";
        }
        break;
      case "notesAdded":
        if (!newMicroProgress.notesAdded && progress.notes.length > 10) {
          newMicroProgress.notesAdded = true;
          xpEarned = 30;
          message = "Notes saved! 📝 +30 XP";
        }
        break;
    }

    if (xpEarned > 0) {
      const newProgress = {
        ...progress,
        microProgress: newMicroProgress,
      };
      setProgress(newProgress);
      localStorage.setItem(`drill_progress_${drill.name}`, JSON.stringify(newProgress));
      addXP(xpEarned);
      toast.success(message);
    }
  };

  const calculateStreak = (): number => {
    if (!progress.lastPracticedDate) return 1;
    
    const lastDate = new Date(progress.lastPracticedDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    lastDate.setHours(0, 0, 0, 0);
    
    const diffTime = today.getTime() - lastDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return progress.streakDays; // Same day, keep streak
    } else if (diffDays === 1) {
      return progress.streakDays + 1; // Consecutive day
    } else {
      return 1; // Streak broken, restart
    }
  };

  const handleMarkComplete = () => {
    if (!drill) return;
    
    const newCompletionCount = progress.completionCount + 1;
    const newStreak = calculateStreak();
    const newMicroProgress = { ...progress.microProgress };
    let xpEarned = 50;
    let messages: string[] = [];

    // First completion
    if (!newMicroProgress.firstCompletion) {
      newMicroProgress.firstCompletion = true;
      xpEarned += 30;
      messages.push("First completion! 🎯 +30 XP bonus");
    }

    // Check for mastery
    if (!newMicroProgress.mastery && newCompletionCount >= progress.masteryThreshold) {
      newMicroProgress.mastery = true;
      xpEarned += 100;
      messages.push(`Mastery achieved! 🏆 +100 XP (${newCompletionCount} completions)`);
    }

    // Streak bonus
    if (newStreak >= 3) {
      const streakBonus = newStreak * 10;
      xpEarned += streakBonus;
      messages.push(`${newStreak}-day streak! 🔥 +${streakBonus} XP`);
    }

    const newProgress = {
      ...progress,
      completed: true,
      completionCount: newCompletionCount,
      lastCompleted: new Date().toISOString(),
      lastPracticedDate: new Date().toISOString(),
      streakDays: newStreak,
      microProgress: newMicroProgress,
    };
    
    setProgress(newProgress);
    localStorage.setItem(`drill_progress_${drill.name}`, JSON.stringify(newProgress));
    addXP(xpEarned);
    
    toast.success(`Drill completed! 🎉 +${xpEarned} XP`, {
      description: messages.length > 0 ? messages.join(" • ") : `Completion #${newCompletionCount}`,
    });
  };

  const handleSaveNotes = () => {
    if (!drill) return;
    
    // Check if notes qualify for progress
    if (progress.notes.length > 10) {
      updateMicroProgress("notesAdded");
    }
    
    localStorage.setItem(`drill_progress_${drill.name}`, JSON.stringify(progress));
    toast.success("Notes saved!");
  };

  const handleVideoPlay = () => {
    // Simulate video watch tracking (in real app, you'd use iframe API)
    if (!progress.microProgress.videoWatched) {
      setTimeout(() => {
        updateMicroProgress("videoWatched", 60); // Assume 60% watched after some time
      }, 30000); // 30 seconds
    }
  };

  const calculateOverallProgress = (): number => {
    const steps = progress.notesOptional ? 4 : 5;
    let completed = 0;
    
    if (progress.microProgress.instructionsRead) completed++;
    if (progress.microProgress.videoWatched) completed++;
    if (!progress.notesOptional && progress.microProgress.notesAdded) completed++;
    if (progress.microProgress.firstCompletion) completed++;
    if (progress.microProgress.mastery) completed++;
    
    return (completed / steps) * 100;
  };

  const getProgressColor = (value: number): string => {
    if (value >= 100) return "text-green-500";
    if (value >= 60) return "text-yellow-500";
    return "text-orange-500";
  };

  const getVideoEmbedUrl = (url?: string): string | null => {
    if (!url) return null;
    
    // Convert YouTube watch URL to embed URL
    const youtubeRegex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/;
    const match = url.match(youtubeRegex);
    
    if (match) {
      return `https://www.youtube.com/embed/${match[1]}`;
    }
    
    return url;
  };

  if (!drill) return null;

  const embedUrl = getVideoEmbedUrl(drill.videoUrl);
  const overallProgress = calculateOverallProgress();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <DialogTitle className="text-2xl mb-2">{drill.name}</DialogTitle>
              <DialogDescription className="text-base">
                {drill.description}
              </DialogDescription>
            </div>
            <div className="flex flex-col gap-2">
              {progress.completed && (
                <Badge variant="outline" className="bg-primary/20 text-primary border-primary/30">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  {progress.completionCount}x
                </Badge>
              )}
              {progress.streakDays > 0 && (
                <Badge variant="outline" className="bg-orange-500/20 text-orange-500 border-orange-500/30">
                  <Flame className="w-3 h-3 mr-1" />
                  {progress.streakDays} day{progress.streakDays > 1 ? 's' : ''}
                </Badge>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-3 mt-2">
            <Badge variant="outline" className="text-sm">
              <Clock className="w-3 h-3 mr-1" />
              {drill.duration}
            </Badge>
            <Badge variant="outline" className="text-sm capitalize">
              {drill.difficulty}
            </Badge>
            {progress.lastCompleted && (
              <Badge variant="outline" className="text-sm text-muted-foreground">
                <Calendar className="w-3 h-3 mr-1" />
                Last: {new Date(progress.lastCompleted).toLocaleDateString()}
              </Badge>
            )}
          </div>

          {/* Overall Progress Bar */}
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Overall Progress</span>
              <span className={`text-sm font-semibold ${getProgressColor(overallProgress)}`}>
                {Math.round(overallProgress)}%
              </span>
            </div>
            <Progress value={overallProgress} className="h-2" />
          </div>
        </DialogHeader>

        <Tabs value={currentTab} onValueChange={setCurrentTab} className="mt-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="video">
              Video
              {progress.microProgress.videoWatched && (
                <CheckCircle2 className="w-3 h-3 ml-1 text-primary" />
              )}
            </TabsTrigger>
            <TabsTrigger value="instructions">
              Instructions
              {progress.microProgress.instructionsRead && (
                <CheckCircle2 className="w-3 h-3 ml-1 text-primary" />
              )}
            </TabsTrigger>
            <TabsTrigger value="progress">Progress</TabsTrigger>
            <TabsTrigger value="settings">
              <Settings className="w-4 h-4" />
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <Card className="p-4 bg-primary/5 border-primary/20">
              <div className="flex items-start gap-3">
                <Target className="w-5 h-5 text-primary mt-1" />
                <div>
                  <h4 className="font-semibold mb-1">Objective</h4>
                  <p className="text-sm text-muted-foreground">{drill.detailedInfo.objective}</p>
                </div>
              </div>
            </Card>

            <div>
              <div className="flex items-center gap-2 mb-3">
                <ListChecks className="w-5 h-5 text-primary" />
                <h4 className="font-semibold">Key Points</h4>
              </div>
              <ul className="space-y-2">
                {drill.detailedInfo.keyPoints.map((point, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-5 h-5 text-primary" />
                <h4 className="font-semibold">Benefits</h4>
              </div>
              <ul className="space-y-2">
                {drill.detailedInfo.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <span className="text-primary">•</span>
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </TabsContent>

          <TabsContent value="video" className="space-y-4">
            {embedUrl ? (
              <>
                <div className="aspect-video rounded-lg overflow-hidden bg-muted">
                  <iframe
                    ref={videoRef}
                    src={embedUrl}
                    title={drill.name}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    onLoad={handleVideoPlay}
                  />
                </div>
                {!progress.microProgress.videoWatched && (
                  <Card className="p-3 bg-blue-500/10 border-blue-500/20">
                    <p className="text-sm text-center">
                      Watch 50%+ of the video to earn +40 XP
                    </p>
                  </Card>
                )}
              </>
            ) : (
              <Card className="p-8 text-center">
                <Play className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">No video available for this drill</p>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="instructions" className="space-y-4">
            {!progress.microProgress.instructionsRead && (
              <Card className="p-3 bg-blue-500/10 border-blue-500/20">
                <p className="text-sm text-center">
                  Read for 10+ seconds to earn +20 XP
                </p>
              </Card>
            )}
            <div>
              <h4 className="font-semibold mb-3">Step-by-Step Instructions</h4>
              <ol className="space-y-3">
                {drill.detailedInfo.instructions.map((instruction, index) => (
                  <li key={index} className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 text-primary text-sm font-semibold flex items-center justify-center">
                      {index + 1}
                    </span>
                    <span className="flex-1 text-sm pt-0.5">{instruction}</span>
                  </li>
                ))}
              </ol>
            </div>

            <Card className="p-4 bg-destructive/5 border-destructive/20">
              <div className="flex items-start gap-3">
                <Lightbulb className="w-5 h-5 text-destructive mt-1" />
                <div>
                  <h4 className="font-semibold mb-2">Common Mistakes to Avoid</h4>
                  <ul className="space-y-1">
                    {drill.detailedInfo.commonMistakes.map((mistake, index) => (
                      <li key={index} className="text-sm text-muted-foreground">
                        • {mistake}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="progress" className="space-y-4">
            {/* Micro Progress Checklist */}
            <Card className="p-4">
              <h4 className="font-semibold mb-3">Learning Steps</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  {progress.microProgress.instructionsRead ? (
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-muted" />
                  )}
                  <div className="flex-1">
                    <p className="text-sm font-medium">Instructions Read</p>
                    <p className="text-xs text-muted-foreground">Read for 10+ seconds</p>
                  </div>
                  <Badge variant={progress.microProgress.instructionsRead ? "default" : "outline"}>
                    20 XP
                  </Badge>
                </div>

                <div className="flex items-center gap-3">
                  {progress.microProgress.videoWatched ? (
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-muted" />
                  )}
                  <div className="flex-1">
                    <p className="text-sm font-medium">Video Watched</p>
                    <p className="text-xs text-muted-foreground">Watch 50%+ of video</p>
                  </div>
                  <Badge variant={progress.microProgress.videoWatched ? "default" : "outline"}>
                    40 XP
                  </Badge>
                </div>

                {!progress.notesOptional && (
                  <div className="flex items-center gap-3">
                    {progress.microProgress.notesAdded ? (
                      <CheckCircle2 className="w-5 h-5 text-primary" />
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-muted" />
                    )}
                    <div className="flex-1">
                      <p className="text-sm font-medium">Notes Added</p>
                      <p className="text-xs text-muted-foreground">Save practice notes (10+ chars)</p>
                    </div>
                    <Badge variant={progress.microProgress.notesAdded ? "default" : "outline"}>
                      30 XP
                    </Badge>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  {progress.microProgress.firstCompletion ? (
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-muted" />
                  )}
                  <div className="flex-1">
                    <p className="text-sm font-medium">First Completion</p>
                    <p className="text-xs text-muted-foreground">Complete drill once</p>
                  </div>
                  <Badge variant={progress.microProgress.firstCompletion ? "default" : "outline"}>
                    80 XP
                  </Badge>
                </div>

                <div className="flex items-center gap-3">
                  {progress.microProgress.mastery ? (
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-muted" />
                  )}
                  <div className="flex-1">
                    <p className="text-sm font-medium">Mastery Achieved</p>
                    <p className="text-xs text-muted-foreground">
                      Complete {progress.masteryThreshold} times ({progress.completionCount}/{progress.masteryThreshold})
                    </p>
                  </div>
                  <Badge variant={progress.microProgress.mastery ? "default" : "outline"}>
                    100 XP
                  </Badge>
                </div>
              </div>
            </Card>

            {/* Streak & Stats */}
            <Card className="p-4">
              <h4 className="font-semibold mb-3">Statistics</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Flame className="w-4 h-4 text-orange-500" />
                    <span className="text-sm font-medium">Current Streak</span>
                  </div>
                  <p className="text-2xl font-bold">{progress.streakDays} days</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Target className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">Total Completions</span>
                  </div>
                  <p className="text-2xl font-bold">{progress.completionCount}</p>
                </div>
              </div>
              {progress.lastCompleted && (
                <div className="text-sm text-muted-foreground mt-4">
                  Last completed: {new Date(progress.lastCompleted).toLocaleString()}
                </div>
              )}
            </Card>

            {/* Training Notes */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold">Training Notes</h4>
                {!progress.notesOptional && !progress.microProgress.notesAdded && (
                  <Badge variant="outline" className="text-xs">+30 XP when saved</Badge>
                )}
              </div>
              <Textarea
                placeholder="Add notes about your progress, challenges, or insights..."
                value={progress.notes}
                onChange={(e) => setProgress({ ...progress, notes: e.target.value })}
                rows={6}
                className="resize-none"
              />
              <Button 
                variant="outline" 
                className="mt-2"
                onClick={handleSaveNotes}
              >
                Save Notes
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <Card className="p-4">
              <h4 className="font-semibold mb-4">Progress Settings</h4>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="notes-optional">Notes Optional</Label>
                    <p className="text-sm text-muted-foreground">
                      Don't require notes for 100% progress
                    </p>
                  </div>
                  <Switch
                    id="notes-optional"
                    checked={progress.notesOptional}
                    onCheckedChange={(checked) => {
                      const newProgress = { ...progress, notesOptional: checked };
                      setProgress(newProgress);
                      localStorage.setItem(`drill_progress_${drill.name}`, JSON.stringify(newProgress));
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mastery-threshold">Mastery Threshold</Label>
                  <Select
                    value={progress.masteryThreshold.toString()}
                    onValueChange={(value) => {
                      const newProgress = {
                        ...progress,
                        masteryThreshold: parseInt(value) as 3 | 5 | 7 | 10,
                      };
                      setProgress(newProgress);
                      localStorage.setItem(`drill_progress_${drill.name}`, JSON.stringify(newProgress));
                    }}
                  >
                    <SelectTrigger id="mastery-threshold">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3">3 completions</SelectItem>
                      <SelectItem value="5">5 completions</SelectItem>
                      <SelectItem value="7">7 completions</SelectItem>
                      <SelectItem value="10">10 completions</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">
                    Number of completions needed for mastery
                  </p>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex gap-3 mt-4">
          <Button 
            variant="gradient" 
            className="flex-1"
            onClick={handleMarkComplete}
          >
            <CheckCircle2 className="w-4 h-4 mr-2" />
            Mark as Completed
          </Button>
          {embedUrl && (
            <Button 
              variant="outline"
              onClick={() => window.open(drill.videoUrl, "_blank")}
            >
              <Play className="w-4 h-4 mr-2" />
              Open Video
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
