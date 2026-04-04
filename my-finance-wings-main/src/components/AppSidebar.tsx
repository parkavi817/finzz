import { useApp } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import butterflyImg from "@/assets/butterfly.png";
import {
  LayoutDashboard, TrendingUp, Briefcase, Lightbulb,
  Bell, Users, LogOut, Moon, Sun, Menu, X, UserCircle,
} from "lucide-react";
import { useState } from "react";

interface AppSidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export default function AppSidebar({ currentPage, onNavigate }: AppSidebarProps) {
  const { role, logout, darkMode, toggleDarkMode, unreadCount } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);

  const userLinks = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "trade", label: "Trade", icon: TrendingUp },
    { id: "portfolio", label: "Portfolio", icon: Briefcase },
    { id: "investments", label: "Investments", icon: Lightbulb },
    { id: "notifications", label: "Notifications", icon: Bell, badge: unreadCount },
    { id: "profile", label: "Profile", icon: UserCircle },
  ];

  const adminLinks = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "trade", label: "Trade", icon: TrendingUp },
    { id: "portfolio", label: "Portfolio", icon: Briefcase },
    { id: "investments", label: "Investments", icon: Lightbulb },
    { id: "users", label: "Users", icon: Users },
    { id: "notifications", label: "Notifications", icon: Bell, badge: unreadCount },
    { id: "profile", label: "Profile", icon: UserCircle },
  ];

  const links = role === "admin" ? adminLinks : userLinks;

  const nav = (page: string) => {
    onNavigate(page);
    setMobileOpen(false);
  };

  const sidebarContent = (
    <>
      <div className="flex items-center gap-3 px-4 py-5 border-b border-border/50">
        <img src={butterflyImg} alt="FinFly" width={28} height={28} className="animate-float" />
        <h1 className="text-lg font-heading font-bold text-gradient">FinFly</h1>
        <Badge variant="secondary" className="text-[10px] ml-auto capitalize">{role}</Badge>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {links.map(link => {
          const Icon = link.icon;
          const isActive = currentPage === link.id;
          return (
            <button
              key={link.id}
              onClick={() => nav(link.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "gradient-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span>{link.label}</span>
              {link.badge ? (
                <span className={`ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full ${isActive ? "bg-primary-foreground/20 text-primary-foreground" : "bg-primary text-primary-foreground"}`}>
                  {link.badge}
                </span>
              ) : null}
            </button>
          );
        })}
      </nav>

      <div className="p-3 border-t border-border/50 space-y-1">
        <button onClick={toggleDarkMode} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all">
          {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          <span>{darkMode ? "Light Mode" : "Dark Mode"}</span>
        </button>
        <button onClick={logout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-expense hover:bg-expense/10 transition-all">
          <LogOut className="h-4 w-4" />
          <span>Log Out</span>
        </button>
      </div>
    </>
  );

  return (
    <>
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 glass-card border-b border-border/50 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src={butterflyImg} alt="FinFly" width={24} height={24} />
          <span className="font-heading font-bold text-gradient">FinFly</span>
        </div>
        <Button variant="ghost" size="icon" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-30 bg-background/80 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
      )}

      <div className={`lg:hidden fixed top-0 left-0 bottom-0 z-40 w-64 bg-card border-r border-border/50 flex flex-col transition-transform duration-300 ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}>
        {sidebarContent}
      </div>

      <div className="hidden lg:flex fixed top-0 left-0 bottom-0 w-56 bg-card/50 backdrop-blur-md border-r border-border/50 flex-col z-30">
        {sidebarContent}
      </div>
    </>
  );
}
