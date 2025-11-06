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
  TrendingUp
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
import { toast } from "sonner";

type View = "home" | "dashboard" | "progress" | "challenges" | "goals" | "matches" | "plans" | "fundamentals" | "timer" | "achievements" | "periodization";

interface AppSidebarProps {
  currentView: View;
  onViewChange: (view: View) => void;
}

const mainItems = [
  { id: "home" as View, label: "Home", icon: Home },
  { id: "dashboard" as View, label: "Dashboard", icon: Activity },
  { id: "progress" as View, label: "Progress", icon: BarChart3 },
];

const trainingItems = [
  { id: "periodization" as View, label: "Periodization", icon: TrendingUp },
  { id: "plans" as View, label: "Training Plans", icon: Calendar },
  { id: "fundamentals" as View, label: "Fundamentals", icon: Target },
  { id: "timer" as View, label: "Timer", icon: Timer },
];

const trackingItems = [
  { id: "matches" as View, label: "Matches", icon: Trophy },
  { id: "challenges" as View, label: "Challenges", icon: Flame },
  { id: "goals" as View, label: "Goals", icon: Flag },
  { id: "achievements" as View, label: "Achievements", icon: Award },
];

export function AppSidebar({ currentView, onViewChange }: AppSidebarProps) {
  const { state } = useSidebar();
  const { user, signOut } = useAuth();
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
          {!collapsed && <span>{item.label}</span>}
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
          {!collapsed && <SidebarGroupLabel>Main</SidebarGroupLabel>}
          <SidebarGroupContent>
            <SidebarMenu>
              {renderMenuItems(mainItems)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Training Section */}
        <SidebarGroup>
          {!collapsed && <SidebarGroupLabel>Training</SidebarGroupLabel>}
          <SidebarGroupContent>
            <SidebarMenu>
              {renderMenuItems(trainingItems)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Tracking Section */}
        <SidebarGroup>
          {!collapsed && <SidebarGroupLabel>Track & Compete</SidebarGroupLabel>}
          <SidebarGroupContent>
            <SidebarMenu>
              {renderMenuItems(trackingItems)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* User Section */}
        <SidebarGroup className="mt-auto border-t pt-4">
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <User className="w-4 h-4" />
                  {!collapsed && <span className="truncate">{user?.email}</span>}
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={handleLogout}>
                  <LogOut className="w-4 h-4" />
                  {!collapsed && <span>Logout</span>}
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
