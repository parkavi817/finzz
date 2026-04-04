import { useApp, Role } from "@/context/AppContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { LogOut, Moon, Sun } from "lucide-react";
import butterflyImg from "@/assets/butterfly.png";

export default function DashboardHeader() {
  const { role, setRole, logout, darkMode, toggleDarkMode } = useApp();

  return (
    <header className="glass-card border-b border-border/50 px-4 md:px-8 py-4 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <img src={butterflyImg} alt="FinFly" width={32} height={32} className="animate-float" />
        <h1 className="text-xl font-heading font-bold text-gradient">FinFly</h1>
      </div>

      <div className="flex items-center gap-3">
        <Select value={role} onValueChange={(v) => setRole(v as Role)}>
          <SelectTrigger className="w-[120px] bg-background text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="viewer">Viewer</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="ghost" size="icon" onClick={toggleDarkMode} className="text-muted-foreground hover:text-foreground">
          {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>

        <Button variant="ghost" size="icon" onClick={logout} className="text-muted-foreground hover:text-destructive">
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
}
