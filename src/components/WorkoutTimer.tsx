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
  Coffee,
  Plus,
  Trash2,
  GripVertical,
  Copy
} from "lucide-react";
import { toast } from "sonner";

interface TimerSettings {
  timerName: string;
  workDuration: number;
  restDuration: number;
  rounds: number;
  prepTime: number;
  soundEnabled: boolean;
  voiceEnabled: boolean;
  autoStart: boolean;
  workIntervals: number;
  longRestDuration: number;
  longRestAfter: number;
  countdownWarning: number;
  timerMode: "standard" | "tabata" | "emom" | "session" | "custom";
  sessionTotalMinutes: number;
  sessionIntervals: number;
  sessionPauseSeconds: number;
}

type TimerPhase = "prep" | "work" | "rest" | "longrest" | "completed";

export const WorkoutTimer = () => {
  const [workouts, setWorkouts] = useState<TimerSettings[]>([
    {
      timerName: "Workout 1",
      workDuration: 40,
      restDuration: 20,
      rounds: 8,
      prepTime: 10,
      soundEnabled: true,
      voiceEnabled: true,
      autoStart: true,
      workIntervals: 1,
      longRestDuration: 60,
      longRestAfter: 4,
      countdownWarning: 3,
      timerMode: "standard",
      sessionTotalMinutes: 45,
      sessionIntervals: 15,
      sessionPauseSeconds: 120,
    }
  ]);

  const [currentWorkoutIndex, setCurrentWorkoutIndex] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<TimerPhase>("prep");
  const [currentRound, setCurrentRound] = useState(1);
  const [currentInterval, setCurrentInterval] = useState(1);
  const [timeRemaining, setTimeRemaining] = useState(workouts[0].prepTime);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [editingWorkoutIndex, setEditingWorkoutIndex] = useState<number>(0);

  const currentWorkout = workouts[currentWorkoutIndex];
  
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    if (currentWorkout.soundEnabled && !audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }, [currentWorkout.soundEnabled]);

  const playBeep = (frequency: number, duration: number, delay: number = 0) => {
    if (!currentWorkout.soundEnabled || !audioContextRef.current) return;
    
    const ctx = audioContextRef.current;
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    oscillator.frequency.value = frequency;
    oscillator.type = "sine";
    
    const startTime = ctx.currentTime + delay;
    gainNode.gain.setValueAtTime(0.3, startTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
    
    oscillator.start(startTime);
    oscillator.stop(startTime + duration);
  };

  const playMultipleBeeps = (count: number, frequency: number) => {
    for (let i = 0; i < count; i++) {
      playBeep(frequency, 0.15, i * 0.3);
    }
  };

  const playStartSequence = () => {
    playBeep(600, 0.2, 0);
    playBeep(800, 0.2, 0.3);
    playBeep(1000, 0.3, 0.6);
  };

  const speak = (text: string) => {
    if (!currentWorkout.voiceEnabled) return;
    
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => {
          const newTime = prev - 1;
          
          // Warning beeps - 3 seconds before end
          if (newTime === 3) {
            playBeep(800, 0.1, 0);
          } else if (newTime === 2) {
            playBeep(800, 0.1, 0);
          } else if (newTime === 1) {
            playBeep(800, 0.1, 0);
          }
          
          // Phase end - 3 beeps
          if (newTime === 0) {
            playMultipleBeeps(3, 1200);
          }
          
          return newTime;
        });
      }, 1000);
    }

    if (timeRemaining === 0 && isRunning) {
      handlePhaseChange();
    }

    return () => clearInterval(interval);
  }, [isRunning, timeRemaining, currentPhase, currentRound, currentInterval, currentWorkout]);

  const handlePhaseChange = () => {
    if (currentPhase === "prep") {
      setCurrentPhase("work");
      setTimeRemaining(currentWorkout.workDuration);
      toast.info("Work Time!", { description: "Give it your all!" });
      speak("Work time");
    } else if (currentPhase === "work") {
      if (currentInterval < currentWorkout.workIntervals) {
        setCurrentInterval(currentInterval + 1);
        setCurrentPhase("rest");
        setTimeRemaining(currentWorkout.restDuration);
        toast.success("Rest Time", { description: "Catch your breath" });
        speak("Rest");
      } else if (currentRound < currentWorkout.rounds) {
        const shouldTakeLongRest = 
          currentWorkout.longRestAfter > 0 && 
          currentRound % currentWorkout.longRestAfter === 0;
        
        if (shouldTakeLongRest) {
          setCurrentPhase("longrest");
          setTimeRemaining(currentWorkout.longRestDuration);
          toast.success("Long Rest", { description: "Well deserved break!" });
          speak("Long rest");
        } else {
          setCurrentPhase("rest");
          setTimeRemaining(currentWorkout.restDuration);
          toast.success("Rest Time", { description: "Catch your breath" });
          speak("Rest");
        }
      } else {
        // Current workout completed, check for next workout
        if (currentWorkoutIndex < workouts.length - 1) {
          setCurrentWorkoutIndex(currentWorkoutIndex + 1);
          setCurrentPhase("prep");
          setCurrentRound(1);
          setCurrentInterval(1);
          setTimeRemaining(workouts[currentWorkoutIndex + 1].prepTime);
          toast.success(`${currentWorkout.timerName} Complete!`, { 
            description: `Starting ${workouts[currentWorkoutIndex + 1].timerName}...` 
          });
          speak(`${currentWorkout.timerName} complete. Starting ${workouts[currentWorkoutIndex + 1].timerName}`);
          return;
        } else {
          // All workouts completed
          setCurrentPhase("completed");
          setIsRunning(false);
          toast.success("All Workouts Complete! 🎉", { 
            description: "Amazing work! You're a champion!" 
          });
          speak("All workouts complete! Amazing work!");
          playBeep(1000, 0.3);
          return;
        }
      }
    } else if (currentPhase === "rest" || currentPhase === "longrest") {
      setCurrentRound(currentRound + 1);
      setCurrentInterval(1);
      if (currentWorkout.autoStart) {
        setCurrentPhase("work");
        setTimeRemaining(currentWorkout.workDuration);
        toast.info(`Round ${currentRound + 1}`, { description: "Let's go!" });
        speak(`Round ${currentRound + 1}`);
      } else {
        setIsRunning(false);
        setCurrentPhase("work");
        setTimeRemaining(currentWorkout.workDuration);
      }
    }
  };

  const handleStart = () => {
    if (currentPhase === "completed") {
      handleReset();
    }
    playStartSequence();
    setIsRunning(true);
    toast.success("Timer Started!", { description: "Let's go! 💪" });
    speak(`Starting ${currentWorkout.timerName}. Get ready!`);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setCurrentWorkoutIndex(0);
    setCurrentPhase("prep");
    setCurrentRound(1);
    setCurrentInterval(1);
    setTimeRemaining(workouts[0].prepTime);
  };

  const calculateSessionSettings = (workout: TimerSettings) => {
    const totalSeconds = workout.sessionTotalMinutes * 60;
    const pauseSeconds = workout.sessionPauseSeconds;
    const intervals = workout.sessionIntervals;
    
    // Total pause time
    const totalPauseTime = pauseSeconds * (intervals - 1);
    // Remaining time for work intervals
    const totalWorkTime = totalSeconds - totalPauseTime;
    // Each work interval duration
    const workDuration = Math.floor(totalWorkTime / intervals);
    
    return {
      workDuration,
      restDuration: pauseSeconds,
      rounds: intervals,
    };
  };

  const applyPreset = (mode: string, workoutIndex: number) => {
    const workout = workouts[workoutIndex];
    let updatedWorkout: TimerSettings;
    
    switch (mode) {
      case "session":
        const sessionCalc = calculateSessionSettings(workout);
        updatedWorkout = {
          ...workout,
          workDuration: sessionCalc.workDuration,
          restDuration: sessionCalc.restDuration,
          rounds: sessionCalc.rounds,
          prepTime: 10,
          workIntervals: 1,
          longRestAfter: 0,
          timerMode: "session",
        };
        toast.success("Session Mode", {
          description: `${workout.sessionIntervals} intervals of ${Math.floor(sessionCalc.workDuration / 60)}m ${sessionCalc.workDuration % 60}s work + ${Math.floor(sessionCalc.restDuration / 60)}m pause`,
        });
        break;
      case "tabata":
        updatedWorkout = {
          ...workout,
          workDuration: 20,
          restDuration: 10,
          rounds: 8,
          prepTime: 10,
          workIntervals: 1,
          longRestAfter: 0,
          timerMode: "tabata",
        };
        break;
      case "emom":
        updatedWorkout = {
          ...workout,
          workDuration: 60,
          restDuration: 0,
          rounds: 10,
          prepTime: 10,
          workIntervals: 1,
          longRestAfter: 0,
          timerMode: "emom",
        };
        break;
      case "standard":
      default:
        updatedWorkout = {
          ...workout,
          workDuration: 40,
          restDuration: 20,
          rounds: 8,
          prepTime: 10,
          workIntervals: 1,
          longRestAfter: 4,
          longRestDuration: 60,
          timerMode: "standard",
        };
    }
    
    const newWorkouts = [...workouts];
    newWorkouts[workoutIndex] = updatedWorkout;
    setWorkouts(newWorkouts);
    
    if (workoutIndex === currentWorkoutIndex && !isRunning) {
      setTimeRemaining(updatedWorkout.prepTime);
    }
  };

  const addWorkout = () => {
    const newWorkout: TimerSettings = {
      timerName: `Workout ${workouts.length + 1}`,
      workDuration: 40,
      restDuration: 20,
      rounds: 8,
      prepTime: 10,
      soundEnabled: true,
      voiceEnabled: true,
      autoStart: true,
      workIntervals: 1,
      longRestDuration: 60,
      longRestAfter: 4,
      countdownWarning: 3,
      timerMode: "standard",
      sessionTotalMinutes: 45,
      sessionIntervals: 15,
      sessionPauseSeconds: 120,
    };
    setWorkouts([...workouts, newWorkout]);
    toast.success("Workout added!");
  };

  const duplicateWorkout = (index: number) => {
    const newWorkout = {
      ...workouts[index],
      timerName: `${workouts[index].timerName} (Copy)`,
    };
    const newWorkouts = [...workouts];
    newWorkouts.splice(index + 1, 0, newWorkout);
    setWorkouts(newWorkouts);
    toast.success("Workout duplicated!");
  };

  const removeWorkout = (index: number) => {
    if (workouts.length === 1) {
      toast.error("Cannot remove the last workout!");
      return;
    }
    const newWorkouts = workouts.filter((_, i) => i !== index);
    setWorkouts(newWorkouts);
    if (currentWorkoutIndex >= newWorkouts.length) {
      setCurrentWorkoutIndex(newWorkouts.length - 1);
    }
    toast.success("Workout removed!");
  };

  const updateWorkout = (index: number, updates: Partial<TimerSettings>) => {
    const newWorkouts = [...workouts];
    newWorkouts[index] = { ...newWorkouts[index], ...updates };
    setWorkouts(newWorkouts);
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
          return currentWorkout.prepTime;
        case "work":
          return currentWorkout.workDuration;
        case "rest":
          return currentWorkout.restDuration;
        case "longrest":
          return currentWorkout.longRestDuration;
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
          <div>
            <h2 className="text-2xl font-bold">{currentWorkout.timerName}</h2>
            {workouts.length > 1 && (
              <p className="text-sm text-muted-foreground">
                Workout {currentWorkoutIndex + 1} of {workouts.length}
              </p>
            )}
          </div>
          <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="icon">
                <Settings className="w-4 h-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Workout Sequence Settings</DialogTitle>
                <DialogDescription>
                  Manage multiple workouts that run in sequence
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6">
                {/* Workout List */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <Label className="text-base font-semibold">Workout Sequence ({workouts.length})</Label>
                    <Button variant="outline" size="sm" onClick={addWorkout}>
                      <Plus className="w-4 h-4 mr-1" />
                      Add Workout
                    </Button>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    {workouts.map((workout, index) => (
                      <Card 
                        key={index} 
                        className={`p-3 cursor-pointer transition-colors ${
                          editingWorkoutIndex === index ? 'border-primary' : ''
                        }`}
                        onClick={() => setEditingWorkoutIndex(index)}
                      >
                        <div className="flex items-center gap-3">
                          <GripVertical className="w-4 h-4 text-muted-foreground" />
                          <div className="flex-1">
                            <div className="font-medium">{workout.timerName}</div>
                            <div className="text-xs text-muted-foreground">
                              {workout.rounds} rounds × {workout.workDuration}s work / {workout.restDuration}s rest
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              duplicateWorkout(index);
                            }}
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeWorkout(index);
                            }}
                            disabled={workouts.length === 1}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Edit Selected Workout */}
                <Card className="p-4 border-primary/30">
                  <h3 className="font-semibold mb-4">
                    Editing: {workouts[editingWorkoutIndex]?.timerName}
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <Label>Workout Name</Label>
                      <Input
                        type="text"
                        value={workouts[editingWorkoutIndex]?.timerName || ''}
                        onChange={(e) =>
                          updateWorkout(editingWorkoutIndex, { timerName: e.target.value })
                        }
                        placeholder="Enter workout name"
                      />
                    </div>

                    <div>
                      <Label>Timer Mode</Label>
                      <Select
                        value={workouts[editingWorkoutIndex]?.timerMode || 'standard'}
                        onValueChange={(value) => applyPreset(value, editingWorkoutIndex)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="standard">Standard Intervals</SelectItem>
                          <SelectItem value="session">Session Mode</SelectItem>
                          <SelectItem value="tabata">Tabata (20/10)</SelectItem>
                          <SelectItem value="emom">EMOM</SelectItem>
                          <SelectItem value="custom">Custom</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {workouts[editingWorkoutIndex]?.timerMode === "session" && (
                      <Card className="p-3 bg-primary/5 border-primary/20">
                        <h4 className="font-semibold mb-2 text-sm">Session Settings</h4>
                        <div className="grid grid-cols-3 gap-2">
                          <div>
                            <Label className="text-xs">Total Min</Label>
                            <Input
                              type="number"
                              value={workouts[editingWorkoutIndex]?.sessionTotalMinutes || 45}
                              onChange={(e) =>
                                updateWorkout(editingWorkoutIndex, { 
                                  sessionTotalMinutes: Number(e.target.value) 
                                })
                              }
                            />
                          </div>
                          <div>
                            <Label className="text-xs">Intervals</Label>
                            <Input
                              type="number"
                              value={workouts[editingWorkoutIndex]?.sessionIntervals || 15}
                              onChange={(e) =>
                                updateWorkout(editingWorkoutIndex, { 
                                  sessionIntervals: Number(e.target.value) 
                                })
                              }
                            />
                          </div>
                          <div>
                            <Label className="text-xs">Pause (s)</Label>
                            <Input
                              type="number"
                              value={workouts[editingWorkoutIndex]?.sessionPauseSeconds || 120}
                              onChange={(e) =>
                                updateWorkout(editingWorkoutIndex, { 
                                  sessionPauseSeconds: Number(e.target.value) 
                                })
                              }
                            />
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full mt-2"
                          onClick={() => applyPreset("session", editingWorkoutIndex)}
                        >
                          Calculate
                        </Button>
                      </Card>
                    )}

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-sm">Work (sec)</Label>
                        <Input
                          type="number"
                          value={workouts[editingWorkoutIndex]?.workDuration || 40}
                          onChange={(e) =>
                            updateWorkout(editingWorkoutIndex, { 
                              workDuration: Number(e.target.value) 
                            })
                          }
                        />
                      </div>
                      <div>
                        <Label className="text-sm">Rest (sec)</Label>
                        <Input
                          type="number"
                          value={workouts[editingWorkoutIndex]?.restDuration || 20}
                          onChange={(e) =>
                            updateWorkout(editingWorkoutIndex, { 
                              restDuration: Number(e.target.value) 
                            })
                          }
                        />
                      </div>
                      <div>
                        <Label className="text-sm">Rounds</Label>
                        <Input
                          type="number"
                          value={workouts[editingWorkoutIndex]?.rounds || 8}
                          onChange={(e) =>
                            updateWorkout(editingWorkoutIndex, { 
                              rounds: Number(e.target.value) 
                            })
                          }
                        />
                      </div>
                      <div>
                        <Label className="text-sm">Prep (sec)</Label>
                        <Input
                          type="number"
                          value={workouts[editingWorkoutIndex]?.prepTime || 10}
                          onChange={(e) =>
                            updateWorkout(editingWorkoutIndex, { 
                              prepTime: Number(e.target.value) 
                            })
                          }
                        />
                      </div>
                      <div>
                        <Label className="text-sm">Intervals/Round</Label>
                        <Input
                          type="number"
                          value={workouts[editingWorkoutIndex]?.workIntervals || 1}
                          onChange={(e) =>
                            updateWorkout(editingWorkoutIndex, { 
                              workIntervals: Number(e.target.value) 
                            })
                          }
                        />
                      </div>
                      <div>
                        <Label className="text-sm">Long Rest (sec)</Label>
                        <Input
                          type="number"
                          value={workouts[editingWorkoutIndex]?.longRestDuration || 60}
                          onChange={(e) =>
                            updateWorkout(editingWorkoutIndex, { 
                              longRestDuration: Number(e.target.value) 
                            })
                          }
                        />
                      </div>
                      <div>
                        <Label className="text-sm">Long Rest After</Label>
                        <Input
                          type="number"
                          value={workouts[editingWorkoutIndex]?.longRestAfter || 4}
                          onChange={(e) =>
                            updateWorkout(editingWorkoutIndex, { 
                              longRestAfter: Number(e.target.value) 
                            })
                          }
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm">Sound</Label>
                        <Switch
                          checked={workouts[editingWorkoutIndex]?.soundEnabled || false}
                          onCheckedChange={(checked) =>
                            updateWorkout(editingWorkoutIndex, { soundEnabled: checked })
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label className="text-sm">Voice</Label>
                        <Switch
                          checked={workouts[editingWorkoutIndex]?.voiceEnabled || false}
                          onCheckedChange={(checked) =>
                            updateWorkout(editingWorkoutIndex, { voiceEnabled: checked })
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label className="text-sm">Auto-start</Label>
                        <Switch
                          checked={workouts[editingWorkoutIndex]?.autoStart || false}
                          onCheckedChange={(checked) =>
                            updateWorkout(editingWorkoutIndex, { autoStart: checked })
                          }
                        />
                      </div>
                    </div>
                  </div>
                </Card>

                <Button 
                  className="w-full" 
                  onClick={() => {
                    if (!isRunning) handleReset();
                    setSettingsOpen(false);
                    toast.success("Settings saved!");
                  }}
                >
                  Save & Close
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
              {currentPhase === "work" && `Work - Round ${currentRound}/${currentWorkout.rounds}`}
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
            <div>Interval: {currentInterval}/{currentWorkout.workIntervals}</div>
            <div>•</div>
            <div>Round: {currentRound}/{currentWorkout.rounds}</div>
            {workouts.length > 1 && (
              <>
                <div>•</div>
                <div>Workout: {currentWorkoutIndex + 1}/{workouts.length}</div>
              </>
            )}
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
            onClick={() => {
              const newWorkouts = [...workouts];
              newWorkouts[currentWorkoutIndex] = {
                ...currentWorkout,
                soundEnabled: !currentWorkout.soundEnabled
              };
              setWorkouts(newWorkouts);
            }}
          >
            {currentWorkout.soundEnabled ? (
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
