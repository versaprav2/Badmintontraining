import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Settings, 
  Volume2, 
  VolumeX,
  Timer as TimerIcon,
  Zap,
  Coffee
} from "lucide-react";
import { toast } from "sonner";

interface TimerSettings {
  workDuration: number;
  restDuration: number;
  rounds: number;
  prepTime: number;
  soundEnabled: boolean;
  autoStart: boolean;
  workIntervals: number;
  longRestDuration: number;
  longRestAfter: number;
  countdownWarning: number;
  timerMode: "standard" | "tabata" | "emom" | "custom";
}

type TimerPhase = "prep" | "work" | "rest" | "longrest" | "completed";

export const WorkoutTimer = () => {
  const [settings, setSettings] = useState<TimerSettings>({
    workDuration: 40,
    restDuration: 20,
    rounds: 8,
    prepTime: 10,
    soundEnabled: true,
    autoStart: true,
    workIntervals: 1,
    longRestDuration: 60,
    longRestAfter: 4,
    countdownWarning: 3,
    timerMode: "standard",
  });

  const [isRunning, setIsRunning] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<TimerPhase>("prep");
  const [currentRound, setCurrentRound] = useState(1);
  const [currentInterval, setCurrentInterval] = useState(1);
  const [timeRemaining, setTimeRemaining] = useState(settings.prepTime);
  const [settingsOpen, setSettingsOpen] = useState(false);
  
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    if (settings.soundEnabled && !audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }, [settings.soundEnabled]);

  const playBeep = (frequency: number, duration: number) => {
    if (!settings.soundEnabled || !audioContextRef.current) return;
    
    const ctx = audioContextRef.current;
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    oscillator.frequency.value = frequency;
    oscillator.type = "sine";
    
    gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
    
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + duration);
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => {
          const newTime = prev - 1;
          
          // Warning beep
          if (newTime <= settings.countdownWarning && newTime > 0) {
            playBeep(800, 0.1);
          }
          
          // Phase end beep
          if (newTime === 0) {
            playBeep(1200, 0.2);
          }
          
          return newTime;
        });
      }, 1000);
    }

    if (timeRemaining === 0 && isRunning) {
      handlePhaseChange();
    }

    return () => clearInterval(interval);
  }, [isRunning, timeRemaining, currentPhase, currentRound, currentInterval]);

  const handlePhaseChange = () => {
    if (currentPhase === "prep") {
      setCurrentPhase("work");
      setTimeRemaining(settings.workDuration);
      toast.info("Work Time!", { description: "Give it your all!" });
    } else if (currentPhase === "work") {
      if (currentInterval < settings.workIntervals) {
        setCurrentInterval(currentInterval + 1);
        setCurrentPhase("rest");
        setTimeRemaining(settings.restDuration);
        toast.success("Rest Time", { description: "Catch your breath" });
      } else if (currentRound < settings.rounds) {
        const shouldTakeLongRest = 
          settings.longRestAfter > 0 && 
          currentRound % settings.longRestAfter === 0;
        
        if (shouldTakeLongRest) {
          setCurrentPhase("longrest");
          setTimeRemaining(settings.longRestDuration);
          toast.success("Long Rest", { description: "Well deserved break!" });
        } else {
          setCurrentPhase("rest");
          setTimeRemaining(settings.restDuration);
          toast.success("Rest Time", { description: "Catch your breath" });
        }
      } else {
        setCurrentPhase("completed");
        setIsRunning(false);
        toast.success("Workout Complete! 🎉", { 
          description: "Great job! You crushed it!" 
        });
        playBeep(1000, 0.3);
        return;
      }
    } else if (currentPhase === "rest" || currentPhase === "longrest") {
      setCurrentRound(currentRound + 1);
      setCurrentInterval(1);
      if (settings.autoStart) {
        setCurrentPhase("work");
        setTimeRemaining(settings.workDuration);
        toast.info(`Round ${currentRound + 1}`, { description: "Let's go!" });
      } else {
        setIsRunning(false);
        setCurrentPhase("work");
        setTimeRemaining(settings.workDuration);
      }
    }
  };

  const handleStart = () => {
    if (currentPhase === "completed") {
      handleReset();
    }
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setCurrentPhase("prep");
    setCurrentRound(1);
    setCurrentInterval(1);
    setTimeRemaining(settings.prepTime);
  };

  const applyPreset = (mode: string) => {
    switch (mode) {
      case "tabata":
        setSettings({
          ...settings,
          workDuration: 20,
          restDuration: 10,
          rounds: 8,
          prepTime: 10,
          workIntervals: 1,
          longRestAfter: 0,
          timerMode: "tabata",
        });
        break;
      case "emom":
        setSettings({
          ...settings,
          workDuration: 60,
          restDuration: 0,
          rounds: 10,
          prepTime: 10,
          workIntervals: 1,
          longRestAfter: 0,
          timerMode: "emom",
        });
        break;
      case "standard":
      default:
        setSettings({
          ...settings,
          workDuration: 40,
          restDuration: 20,
          rounds: 8,
          prepTime: 10,
          workIntervals: 1,
          longRestAfter: 4,
          longRestDuration: 60,
          timerMode: "standard",
        });
    }
    handleReset();
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const getPhaseColor = () => {
    switch (currentPhase) {
      case "prep":
        return "text-accent";
      case "work":
        return "text-primary";
      case "rest":
        return "text-secondary";
      case "longrest":
        return "text-secondary";
      case "completed":
        return "text-primary";
      default:
        return "";
    }
  };

  const getPhaseIcon = () => {
    switch (currentPhase) {
      case "work":
        return <Zap className="w-8 h-8" />;
      case "rest":
      case "longrest":
        return <Coffee className="w-8 h-8" />;
      default:
        return <TimerIcon className="w-8 h-8" />;
    }
  };

  const getProgress = () => {
    const totalTime = (() => {
      switch (currentPhase) {
        case "prep":
          return settings.prepTime;
        case "work":
          return settings.workDuration;
        case "rest":
          return settings.restDuration;
        case "longrest":
          return settings.longRestDuration;
        default:
          return 100;
      }
    })();
    return ((totalTime - timeRemaining) / totalTime) * 100;
  };

  return (
    <Card className="p-8 border-2">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Workout Timer</h2>
          <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="icon">
                <Settings className="w-4 h-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Timer Settings</DialogTitle>
                <DialogDescription>
                  Customize your workout timer with all available options
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6">
                <div>
                  <Label>Timer Mode</Label>
                  <Select
                    value={settings.timerMode}
                    onValueChange={(value) => applyPreset(value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Standard Intervals</SelectItem>
                      <SelectItem value="tabata">Tabata (20/10)</SelectItem>
                      <SelectItem value="emom">EMOM (Every Minute)</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Work Duration (seconds)</Label>
                    <Input
                      type="number"
                      value={settings.workDuration}
                      onChange={(e) =>
                        setSettings({ ...settings, workDuration: Number(e.target.value) })
                      }
                    />
                  </div>
                  <div>
                    <Label>Rest Duration (seconds)</Label>
                    <Input
                      type="number"
                      value={settings.restDuration}
                      onChange={(e) =>
                        setSettings({ ...settings, restDuration: Number(e.target.value) })
                      }
                    />
                  </div>
                  <div>
                    <Label>Number of Rounds</Label>
                    <Input
                      type="number"
                      value={settings.rounds}
                      onChange={(e) =>
                        setSettings({ ...settings, rounds: Number(e.target.value) })
                      }
                    />
                  </div>
                  <div>
                    <Label>Preparation Time (seconds)</Label>
                    <Input
                      type="number"
                      value={settings.prepTime}
                      onChange={(e) =>
                        setSettings({ ...settings, prepTime: Number(e.target.value) })
                      }
                    />
                  </div>
                  <div>
                    <Label>Work Intervals per Round</Label>
                    <Input
                      type="number"
                      value={settings.workIntervals}
                      onChange={(e) =>
                        setSettings({ ...settings, workIntervals: Number(e.target.value) })
                      }
                    />
                  </div>
                  <div>
                    <Label>Long Rest Duration (seconds)</Label>
                    <Input
                      type="number"
                      value={settings.longRestDuration}
                      onChange={(e) =>
                        setSettings({ ...settings, longRestDuration: Number(e.target.value) })
                      }
                    />
                  </div>
                  <div>
                    <Label>Long Rest After (rounds)</Label>
                    <Input
                      type="number"
                      value={settings.longRestAfter}
                      onChange={(e) =>
                        setSettings({ ...settings, longRestAfter: Number(e.target.value) })
                      }
                    />
                  </div>
                  <div>
                    <Label>Countdown Warning (seconds)</Label>
                    <Input
                      type="number"
                      value={settings.countdownWarning}
                      onChange={(e) =>
                        setSettings({ ...settings, countdownWarning: Number(e.target.value) })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Sound Notifications</Label>
                    <Switch
                      checked={settings.soundEnabled}
                      onCheckedChange={(checked) =>
                        setSettings({ ...settings, soundEnabled: checked })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Auto-start Next Round</Label>
                    <Switch
                      checked={settings.autoStart}
                      onCheckedChange={(checked) =>
                        setSettings({ ...settings, autoStart: checked })
                      }
                    />
                  </div>
                </div>

                <Button 
                  className="w-full" 
                  onClick={() => {
                    handleReset();
                    setSettingsOpen(false);
                    toast.success("Settings saved!");
                  }}
                >
                  Save Settings
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="text-center space-y-4">
          <div className={`flex items-center justify-center gap-3 ${getPhaseColor()}`}>
            {getPhaseIcon()}
            <Badge variant="outline" className="text-lg px-4 py-2">
              {currentPhase === "prep" && "Get Ready"}
              {currentPhase === "work" && `Work - Round ${currentRound}/${settings.rounds}`}
              {currentPhase === "rest" && "Rest"}
              {currentPhase === "longrest" && "Long Rest"}
              {currentPhase === "completed" && "Complete!"}
            </Badge>
          </div>

          <div className={`text-8xl font-bold tabular-nums ${getPhaseColor()}`}>
            {formatTime(timeRemaining)}
          </div>

          <Progress value={getProgress()} className="h-3" />

          <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
            <div>Interval: {currentInterval}/{settings.workIntervals}</div>
            <div>•</div>
            <div>Round: {currentRound}/{settings.rounds}</div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-3">
          {!isRunning ? (
            <Button
              size="lg"
              variant="gradient"
              onClick={handleStart}
              className="px-8"
            >
              <Play className="w-5 h-5 mr-2" />
              {currentPhase === "completed" ? "Restart" : "Start"}
            </Button>
          ) : (
            <Button
              size="lg"
              variant="outline"
              onClick={handlePause}
              className="px-8"
            >
              <Pause className="w-5 h-5 mr-2" />
              Pause
            </Button>
          )}
          <Button
            size="lg"
            variant="outline"
            onClick={handleReset}
          >
            <RotateCcw className="w-5 h-5 mr-2" />
            Reset
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() =>
              setSettings({ ...settings, soundEnabled: !settings.soundEnabled })
            }
          >
            {settings.soundEnabled ? (
              <Volume2 className="w-5 h-5" />
            ) : (
              <VolumeX className="w-5 h-5" />
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
};
