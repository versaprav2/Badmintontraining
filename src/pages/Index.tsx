import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Activity, Target, Trophy, Menu, X, LogOut, User, Timer, Calendar, Award, BarChart3, Flame, Flag } from "lucide-react";
import { Dashboard } from "@/components/Dashboard";
import { MatchTracker } from "@/components/MatchTracker";
import { TrainingPrograms } from "@/components/TrainingPrograms";
import { TrainingPlans } from "@/components/TrainingPlans";
import { WorkoutTimer } from "@/components/WorkoutTimer";
import { Achievements } from "@/components/Achievements";
import { Onboarding } from "@/components/Onboarding";
import { QuickActions } from "@/components/QuickActions";
import { MilestoneCelebration, checkMilestones } from "@/components/MilestoneCelebration";
import { ShareProgress } from "@/components/ShareProgress";
import { ProgressHub } from "@/components/ProgressHub";
import { Challenges } from "@/components/Challenges";
import { Goals } from "@/components/Goals";
import { AuthForm, UserProfile } from "@/components/AuthForm";
import heroImage from "@/assets/hero-badminton.jpg";
import { toast } from "sonner";
import { useGamification } from "@/hooks/useGamification";

type View = "home" | "dashboard" | "progress" | "challenges" | "goals" | "matches" | "plans" | "fundamentals" | "timer" | "achievements";

const Index = () => {
  const [currentView, setCurrentView] = useState<View>("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [milestone, setMilestone] = useState<any>(null);
  const [shareData, setShareData] = useState<any>(null);
  const { addXP, updateStreak } = useGamification();

  useEffect(() => {
    const saved = localStorage.getItem("userProfile");
    if (saved) {
      setUserProfile(JSON.parse(saved));
      
      // Check if onboarding completed
      const onboardingComplete = localStorage.getItem("onboardingComplete");
      if (!onboardingComplete) {
        setShowOnboarding(true);
      }

      // Check for milestones
      const detectedMilestone = checkMilestones();
      if (detectedMilestone) {
        setMilestone(detectedMilestone);
        if (detectedMilestone.xp) {
          addXP(detectedMilestone.xp);
        }
      }

      // Update streak
      updateStreak();
    }
  }, []);

  const handleAuth = (profile: UserProfile) => {
    setUserProfile(profile);
    setShowOnboarding(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("userProfile");
    localStorage.removeItem("matches");
    setUserProfile(null);
    setCurrentView("home");
    toast.success("Logged out successfully");
  };

  const handleQuickAction = (action: "match" | "timer" | "drill") => {
    switch (action) {
      case "match":
        setCurrentView("matches");
        toast.info("Quick log a match!");
        break;
      case "timer":
        setCurrentView("timer");
        toast.info("Timer ready!");
        break;
      case "drill":
        setCurrentView("fundamentals");
        toast.info("Choose a drill to complete!");
        break;
    }
  };

  const handleShareMilestone = () => {
    if (milestone) {
      setShareData({
        type: milestone.type === "level" ? "milestone" : milestone.type,
        stats: milestone.xp ? { xp: milestone.xp, level: Math.floor(parseInt(localStorage.getItem("userXP") || "0") / 500) + 1 } : {},
        achievement: milestone.type === "achievement" ? { name: milestone.title, description: milestone.message } : undefined,
      });
    }
  };

  if (!userProfile) {
    return <AuthForm onAuth={handleAuth} />;
  }

  const navigationItems = [
    { id: "dashboard" as View, label: "Dashboard", icon: <Activity className="w-5 h-5" /> },
    { id: "progress" as View, label: "Progress", icon: <BarChart3 className="w-5 h-5" /> },
    { id: "challenges" as View, label: "Challenges", icon: <Flame className="w-5 h-5" /> },
    { id: "goals" as View, label: "Goals", icon: <Flag className="w-5 h-5" /> },
    { id: "matches" as View, label: "Matches", icon: <Trophy className="w-5 h-5" /> },
    { id: "plans" as View, label: "Training Plans", icon: <Calendar className="w-5 h-5" /> },
    { id: "fundamentals" as View, label: "Fundamentals", icon: <Target className="w-5 h-5" /> },
    { id: "timer" as View, label: "Timer", icon: <Timer className="w-5 h-5" /> },
    { id: "achievements" as View, label: "Achievements", icon: <Award className="w-5 h-5" /> },
  ];

  const renderContent = () => {
    switch (currentView) {
      case "dashboard":
        return <Dashboard />;
      case "progress":
        return <ProgressHub />;
      case "challenges":
        return <Challenges />;
      case "goals":
        return <Goals />;
      case "matches":
        return <MatchTracker />;
      case "plans":
        return <TrainingPlans />;
      case "fundamentals":
        return <TrainingPrograms />;
      case "timer":
        return <WorkoutTimer />;
      case "achievements":
        return <Achievements />;
      default:
        return (
          <div className="space-y-12">
            {/* Hero Section */}
            <div className="relative rounded-3xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-accent/90 z-10" />
              <img
                src={heroImage}
                alt="Badminton training"
                className="w-full h-[500px] object-cover"
              />
              <div className="absolute inset-0 z-20 flex items-center justify-center">
                <div className="text-center space-y-6 px-4">
                  <h1 className="text-5xl md:text-7xl font-bold text-white drop-shadow-lg">
                    Elevate Your Game
                  </h1>
                  <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto">
                    Track matches, follow structured training, and reach your badminton potential
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button
                      variant="energy"
                      size="lg"
                      onClick={() => setCurrentView("plans")}
                      className="text-lg"
                    >
                      View Training Plans
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => setCurrentView("fundamentals")}
                      className="text-lg bg-white/10 text-white border-white hover:bg-white hover:text-primary backdrop-blur-sm"
                    >
                      Practice Drills
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Features Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="p-6 border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-xl cursor-pointer group" onClick={() => setCurrentView("plans")}>
                <div className="p-4 bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl w-fit mb-4 group-hover:scale-110 transition-transform">
                  <Calendar className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Training Plans</h3>
                <p className="text-sm text-muted-foreground">
                  Structured programs from weekly to yearly
                </p>
              </Card>

              <Card className="p-6 border-2 hover:border-secondary/50 transition-all duration-300 hover:shadow-xl cursor-pointer group" onClick={() => setCurrentView("fundamentals")}>
                <div className="p-4 bg-gradient-to-br from-secondary/10 to-orange-500/10 rounded-xl w-fit mb-4 group-hover:scale-110 transition-transform">
                  <Target className="w-8 h-8 text-secondary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Fundamentals</h3>
                <p className="text-sm text-muted-foreground">
                  Master essential badminton techniques
                </p>
              </Card>

              <Card className="p-6 border-2 hover:border-accent/50 transition-all duration-300 hover:shadow-xl cursor-pointer group" onClick={() => setCurrentView("achievements")}>
                <div className="p-4 bg-gradient-to-br from-accent/10 to-primary/10 rounded-xl w-fit mb-4 group-hover:scale-110 transition-transform">
                  <Award className="w-8 h-8 text-accent" />
                </div>
                <h3 className="text-xl font-bold mb-2">Achievements</h3>
                <p className="text-sm text-muted-foreground">
                  Unlock badges and track your progress
                </p>
              </Card>
            </div>

            {/* CTA Section */}
            <Card className="p-12 bg-gradient-to-br from-primary/10 via-accent/5 to-secondary/10 border-2 border-primary/20 text-center">
              <h2 className="text-4xl font-bold mb-4">Ready to become a better player?</h2>
              <p className="text-xl text-muted-foreground mb-6 max-w-2xl mx-auto">
                Join thousands of badminton players who are tracking their progress and achieving their goals
              </p>
              <Button variant="gradient" size="lg" onClick={() => setCurrentView("dashboard")} className="text-lg">
                View Your Dashboard
              </Button>
            </Card>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-primary/5 to-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-lg border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setCurrentView("home")}
              className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            >
              <div className="p-2 bg-gradient-to-br from-primary to-accent rounded-xl">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                BadmintonTrain
              </span>
            </button>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-2">
              {navigationItems.map((item) => (
                <Button
                  key={item.id}
                  variant={currentView === item.id ? "default" : "ghost"}
                  onClick={() => setCurrentView(item.id)}
                  className="gap-2"
                >
                  {item.icon}
                  {item.label}
                </Button>
              ))}
              <Button variant="ghost" className="gap-2">
                <User className="w-5 h-5" />
                {userProfile.name}
              </Button>
              <Button variant="ghost" onClick={handleLogout} className="gap-2">
                <LogOut className="w-5 h-5" />
              </Button>
            </nav>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 hover:bg-accent/10 rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <nav className="md:hidden mt-4 space-y-2 pb-4">
              {navigationItems.map((item) => (
                <Button
                  key={item.id}
                  variant={currentView === item.id ? "default" : "ghost"}
                  onClick={() => {
                    setCurrentView(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className="w-full justify-start gap-2"
                >
                  {item.icon}
                  {item.label}
                </Button>
              ))}
              <Button variant="ghost" className="w-full justify-start gap-2">
                <User className="w-5 h-5" />
                {userProfile.name}
              </Button>
              <Button variant="ghost" onClick={handleLogout} className="w-full justify-start gap-2">
                <LogOut className="w-5 h-5" />
                Logout
              </Button>
            </nav>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {renderContent()}
      </main>

      {/* Footer */}
      <footer className="border-t mt-16 py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© 2025 BadmintonTrain. Train smarter, play better.</p>
        </div>
      </footer>

      {/* Quick Actions FAB */}
      <QuickActions onAction={handleQuickAction} />

      {/* Onboarding Modal */}
      {showOnboarding && <Onboarding onComplete={() => setShowOnboarding(false)} />}

      {/* Milestone Celebration */}
      <MilestoneCelebration
        milestone={milestone}
        onClose={() => setMilestone(null)}
        onShare={handleShareMilestone}
      />

      {/* Share Progress Dialog */}
      {shareData && (
        <ShareProgress
          open={!!shareData}
          onClose={() => setShareData(null)}
          data={shareData}
        />
      )}
    </div>
  );
};

export default Index;
