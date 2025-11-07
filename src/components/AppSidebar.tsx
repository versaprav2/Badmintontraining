import { 
  Activity, 
  Trophy, 
  Target, 
  Timer, 
  Calendar, 
  Award, 
  BarChart3, 
  Flame, 
  Flag,
  Home,
  LogOut,
  User,
  TrendingUp,
  MessageSquare,
  Lightbulb,
  Video,
  Languages
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/hooks/useLanguage";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

type View = "home" | "dashboard" | "progress" | "challenges" | "goals" | "matches" | "plans" | "fundamentals" | "timer" | "achievements" | "periodization" | "coach" | "recommendations" | "video-review";

interface AppSidebarProps {
  currentView: View;
  onViewChange: (view: View) => void;
}

  const mainItems = [
    { id: "home" as View, labelKey: "nav.home", icon: Home },
    { id: "dashboard" as View, labelKey: "nav.dashboard", icon: Activity },
    { id: "progress" as View, labelKey: "nav.progress", icon: BarChart3 },
  ];

  const trainingItems = [
    { id: "periodization" as View, labelKey: "nav.periodization", icon: TrendingUp },
    { id: "plans" as View, labelKey: "nav.trainingPlans", icon: Calendar },
    { id: "fundamentals" as View, labelKey: "nav.fundamentals", icon: Target },
    { id: "timer" as View, labelKey: "nav.timer", icon: Timer },
  ];

  const trackingItems = [
    { id: "matches" as View, labelKey: "nav.matches", icon: Trophy },
    { id: "challenges" as View, labelKey: "nav.challenges", icon: Flame },
    { id: "goals" as View, labelKey: "nav.goals", icon: Flag },
    { id: "achievements" as View, labelKey: "nav.achievements", icon: Award },
  ];

  const coachingItems = [
    { id: "coach" as View, labelKey: "nav.coach", icon: MessageSquare },
    { id: "recommendations" as View, labelKey: "nav.recommendations", icon: Lightbulb },
    { id: "video-review" as View, labelKey: "nav.videoReview", icon: Video },
  ];

export function AppSidebar({ currentView, onViewChange }: AppSidebarProps) {
  const { state } = useSidebar();
  const { user, signOut } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const collapsed = state === "collapsed";

  const handleLogout = async () => {
    await signOut();
    toast.success("Logged out successfully");
  };

  const renderMenuItems = (items: typeof mainItems) => (
    items.map((item) => (
      <SidebarMenuItem key={item.id}>
        <SidebarMenuButton
          onClick={() => onViewChange(item.id)}
          isActive={currentView === item.id}
        >
          <item.icon className="w-4 h-4" />
          {!collapsed && <span>{t(item.labelKey)}</span>}
        </SidebarMenuButton>
      </SidebarMenuItem>
    ))
  );

  return (
    <Sidebar className={collapsed ? "w-16" : "w-64"}>
      <SidebarContent>
        {/* Logo Section */}
        <div className={`p-4 border-b ${collapsed ? "px-2" : ""}`}>
          <button
            onClick={() => onViewChange("home")}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity w-full"
          >
            <div className="p-2 bg-gradient-to-br from-primary to-accent rounded-xl">
              <Trophy className="w-5 h-5 text-white" />
            </div>
            {!collapsed && (
              <span className="text-lg font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                BadmintonTrain
              </span>
            )}
          </button>
        </div>

        {/* Main Navigation */}
        <SidebarGroup>
          {!collapsed && <SidebarGroupLabel>{t("nav.main")}</SidebarGroupLabel>}
          <SidebarGroupContent>
            <SidebarMenu>
              {renderMenuItems(mainItems)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Training Section */}
        <SidebarGroup>
          {!collapsed && <SidebarGroupLabel>{t("nav.training")}</SidebarGroupLabel>}
          <SidebarGroupContent>
            <SidebarMenu>
              {renderMenuItems(trainingItems)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Tracking Section */}
        <SidebarGroup>
          {!collapsed && <SidebarGroupLabel>{t("nav.trackCompete")}</SidebarGroupLabel>}
          <SidebarGroupContent>
            <SidebarMenu>
              {renderMenuItems(trackingItems)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Coaching Section */}
        <SidebarGroup>
          {!collapsed && <SidebarGroupLabel>{t("nav.coachingAnalysis")}</SidebarGroupLabel>}
          <SidebarGroupContent>
            <SidebarMenu>
              {renderMenuItems(coachingItems)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* User Section */}
        <SidebarGroup className="mt-auto border-t pt-4">
          <SidebarGroupContent>
            <SidebarMenu>
              {!collapsed && (
                <SidebarMenuItem>
                  <div className="px-3 py-2">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <Languages className="w-4 h-4" />
                        <Label htmlFor="language-switch" className="text-sm cursor-pointer">
                          {language === "en" ? "EN" : "DE"}
                        </Label>
                      </div>
                      <Switch
                        id="language-switch"
                        checked={language === "de"}
                        onCheckedChange={(checked) => {
                          setLanguage(checked ? "de" : "en");
                          toast.success(checked ? "Sprache auf Deutsch geändert" : "Language changed to English");
                        }}
                      />
                    </div>
                  </div>
                </SidebarMenuItem>
              )}
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <User className="w-4 h-4" />
                  {!collapsed && <span className="truncate">{user?.email}</span>}
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={handleLogout}>
                  <LogOut className="w-4 h-4" />
                  {!collapsed && <span>{t("nav.logout")}</span>}
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
