import { useApp } from "@/context/AppContext";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bell, Lightbulb, AlertTriangle, Info, Check } from "lucide-react";

export default function NotificationsPage() {
  const { notifications, markNotificationRead } = useApp();

  const iconMap = {
    suggestion: <Lightbulb className="h-5 w-5 text-butterfly-gold" />,
    alert: <AlertTriangle className="h-5 w-5 text-expense" />,
    info: <Info className="h-5 w-5 text-primary" />,
  };

  const bgMap = {
    suggestion: "bg-butterfly-gold/10",
    alert: "bg-expense/10",
    info: "bg-primary/10",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-heading font-bold text-foreground">Notifications</h2>
          <p className="text-muted-foreground text-sm">
            {notifications.filter(n => !n.read).length} unread notifications
          </p>
        </div>
        <Bell className="h-6 w-6 text-muted-foreground" />
      </div>

      {notifications.length === 0 ? (
        <Card className="glass-card">
          <CardContent className="p-12 text-center">
            <Bell className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground">No notifications yet</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {notifications.map(n => (
            <Card key={n.id} className={`glass-card transition-all hover:shadow-md ${!n.read ? "border-primary/30 bg-primary/5" : ""}`}>
              <CardContent className="p-4">
                <div className="flex gap-3">
                  <div className={`p-2 rounded-lg ${bgMap[n.type]} shrink-0 self-start`}>
                    {iconMap[n.type]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-heading font-semibold text-foreground">{n.title}</h4>
                        <p className="text-sm text-muted-foreground mt-1">{n.message}</p>
                      </div>
                      {!n.read && (
                        <Button size="sm" variant="ghost" className="shrink-0 h-8 text-xs gap-1" onClick={() => markNotificationRead(n.id)}>
                          <Check className="h-3 w-3" /> Mark read
                        </Button>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="secondary" className="text-[10px]">{n.from}</Badge>
                      <span className="text-xs text-muted-foreground">{n.date}</span>
                      {!n.read && <span className="w-2 h-2 rounded-full bg-primary" />}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
