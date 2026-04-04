import { useApp } from "@/context/AppContext";
import { formatCurrency } from "@/lib/currency";
import SummaryCards from "@/components/SummaryCards";
import BalanceTrendChart from "@/components/BalanceTrendChart";
import SpendingBreakdownChart from "@/components/SpendingBreakdownChart";
import TransactionList from "@/components/TransactionList";
import InsightsSection from "@/components/InsightsSection";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, TrendingUp, Bell } from "lucide-react";

export default function Dashboard() {
  const { role, mockUsers, unreadCount } = useApp();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-heading font-bold text-foreground">
            {role === "admin" ? "Admin Dashboard" : "My Dashboard"}
          </h2>
          <p className="text-muted-foreground text-sm">
            {role === "admin" ? "Overview of all users and financial data" : "Your personal financial overview"}
          </p>
        </div>
        <Badge variant="secondary" className="capitalize font-heading">{role}</Badge>
      </div>

      {role === "admin" && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="glass-card border-primary/20">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10"><Users className="h-5 w-5 text-primary" /></div>
              <div>
                <p className="text-xs text-muted-foreground">Total Users</p>
                <p className="text-xl font-heading font-bold text-foreground">{mockUsers.length}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="glass-card border-income/20">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-income/10"><TrendingUp className="h-5 w-5 text-income" /></div>
              <div>
                <p className="text-xs text-muted-foreground">Avg User Savings</p>
                <p className="text-xl font-heading font-bold text-income">
                  {formatCurrency(Math.round(mockUsers.reduce((s, u) => s + u.savings, 0) / mockUsers.length))}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card className="glass-card border-butterfly-lavender/20">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-butterfly-lavender/10"><Bell className="h-5 w-5 text-butterfly-lavender" /></div>
              <div>
                <p className="text-xs text-muted-foreground">Pending Notifications</p>
                <p className="text-xl font-heading font-bold text-foreground">{unreadCount}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <SummaryCards />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BalanceTrendChart />
        <SpendingBreakdownChart />
      </div>

      <InsightsSection />
      <TransactionList />
    </div>
  );
}
