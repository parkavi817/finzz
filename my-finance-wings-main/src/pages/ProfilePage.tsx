import { useApp } from "@/context/AppContext";
import { formatCurrency } from "@/lib/currency";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  User, Shield, Wallet, TrendingUp, TrendingDown, PiggyBank,
  Briefcase, Target, Activity, CreditCard, IndianRupee,
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

export default function ProfilePage() {
  const { role, totalBalance, totalIncome, totalExpenses, transactions, portfolio } = useApp();

  const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome * 100) : 0;
  const monthlySavings = (totalIncome - totalExpenses) / 6;
  const avgMonthlyIncome = totalIncome / 6;
  const avgMonthlyExpenses = totalExpenses / 6;

  // Expense category breakdown
  const catTotals = new Map<string, number>();
  transactions.filter(t => t.type === "expense").forEach(t => catTotals.set(t.category, (catTotals.get(t.category) || 0) + t.amount));
  const catData = Array.from(catTotals.entries())
    .map(([name, value]) => ({ name, value: Math.round(value) }))
    .sort((a, b) => b.value - a.value);
  const COLORS = ["hsl(168,60%,40%)", "hsl(270,50%,60%)", "hsl(40,80%,55%)", "hsl(320,50%,65%)", "hsl(200,70%,50%)", "hsl(145,60%,42%)", "hsl(30,70%,50%)"];

  // Portfolio
  const portfolioValue = portfolio.reduce((s, p) => s + p.quantity * p.currentPrice, 0);
  const portfolioCost = portfolio.reduce((s, p) => s + p.quantity * p.avgPrice, 0);
  const portfolioGain = portfolioValue - portfolioCost;

  // Financial health score (0-100)
  const healthScore = Math.min(100, Math.round(
    (savingsRate > 0 ? Math.min(savingsRate, 40) : 0) +
    (portfolioValue > 0 ? 20 : 0) +
    (transactions.length > 10 ? 15 : transactions.length * 1.5) +
    (catTotals.size >= 3 ? 10 : catTotals.size * 3) +
    (portfolioGain > 0 ? 15 : 5)
  ));

  const healthColor = healthScore >= 75 ? "text-income" : healthScore >= 50 ? "text-butterfly-gold" : "text-expense";
  const healthLabel = healthScore >= 75 ? "Excellent" : healthScore >= 50 ? "Good" : "Needs Improvement";

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="glass-card rounded-2xl p-6 animate-fade-in-up">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl gradient-butterfly flex items-center justify-center shadow-lg">
            {role === "admin" ? <Shield className="h-8 w-8 text-white" /> : <User className="h-8 w-8 text-white" />}
          </div>
          <div>
            <h2 className="text-2xl font-heading font-bold text-foreground">
              {role === "admin" ? "Admin" : "User"} Profile
            </h2>
            <p className="text-muted-foreground text-sm">Your complete financial overview</p>
            <Badge variant="secondary" className="mt-1 capitalize">{role}</Badge>
          </div>
        </div>
      </div>

      {/* Financial Health Score */}
      <Card className="glass-card border-primary/20 animate-fade-in-up overflow-hidden" style={{ animationDelay: "0.1s" }}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-heading font-bold text-foreground text-lg">Financial Health Score</h3>
              <p className="text-muted-foreground text-sm">Based on savings, investments & spending habits</p>
            </div>
            <div className="text-right">
              <p className={`text-4xl font-heading font-bold ${healthColor}`}>{healthScore}</p>
              <p className={`text-sm font-medium ${healthColor}`}>{healthLabel}</p>
            </div>
          </div>
          <div className="relative h-3 rounded-full bg-muted overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 rounded-full transition-all duration-1000 ease-out"
              style={{
                width: `${healthScore}%`,
                background: `linear-gradient(90deg, hsl(var(--expense)), hsl(var(--butterfly-gold)), hsl(var(--income)))`,
              }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
            <span>Poor</span><span>Average</span><span>Good</span><span>Excellent</span>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Balance", value: formatCurrency(totalBalance), icon: Wallet, color: "text-primary", bg: "bg-primary/10" },
          { label: "Total Income", value: formatCurrency(totalIncome), icon: TrendingUp, color: "text-income", bg: "bg-income/10" },
          { label: "Total Expenses", value: formatCurrency(totalExpenses), icon: TrendingDown, color: "text-expense", bg: "bg-expense/10" },
          { label: "Portfolio Value", value: formatCurrency(portfolioValue), icon: Briefcase, color: "text-butterfly-lavender", bg: "bg-butterfly-lavender/10" },
        ].map((m, i) => (
          <Card key={m.label} className="glass-card animate-fade-in-up" style={{ animationDelay: `${0.15 + i * 0.05}s` }}>
            <CardContent className="p-4">
              <div className={`p-2 rounded-lg ${m.bg} w-fit mb-2`}>
                <m.icon className={`h-4 w-4 ${m.color}`} />
              </div>
              <p className="text-[11px] text-muted-foreground">{m.label}</p>
              <p className={`text-lg font-heading font-bold ${m.color}`}>{m.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Monthly Averages & Savings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-card animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-heading text-foreground flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Monthly Averages
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-muted-foreground">Avg Monthly Income</span>
                <span className="font-semibold text-income">{formatCurrency(avgMonthlyIncome)}</span>
              </div>
              <Progress value={100} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-muted-foreground">Avg Monthly Expenses</span>
                <span className="font-semibold text-expense">{formatCurrency(avgMonthlyExpenses)}</span>
              </div>
              <Progress value={totalIncome > 0 ? (avgMonthlyExpenses / avgMonthlyIncome) * 100 : 0} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-muted-foreground">Avg Monthly Savings</span>
                <span className="font-semibold text-primary">{formatCurrency(monthlySavings)}</span>
              </div>
              <Progress value={savingsRate} className="h-2" />
            </div>
            <div className="pt-2 border-t border-border/50">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <PiggyBank className="h-4 w-4 text-butterfly-gold" />
                  <span className="text-sm font-medium text-foreground">Savings Rate</span>
                </div>
                <span className={`text-xl font-heading font-bold ${savingsRate >= 20 ? "text-income" : "text-butterfly-gold"}`}>
                  {savingsRate.toFixed(1)}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Spending Distribution */}
        <Card className="glass-card animate-fade-in-up" style={{ animationDelay: "0.35s" }}>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-heading text-foreground flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-expense" />
              Spending Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            {catData.length === 0 ? (
              <p className="text-muted-foreground text-sm text-center py-8">No expense data</p>
            ) : (
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={catData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                      {catData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip formatter={(v: number) => formatCurrency(v)} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
            <div className="grid grid-cols-2 gap-1 mt-2">
              {catData.slice(0, 6).map((c, i) => (
                <div key={c.name} className="flex items-center gap-1.5 text-xs">
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                  <span className="text-muted-foreground truncate">{c.name}</span>
                  <span className="font-medium text-foreground ml-auto">{formatCurrency(c.value)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Investment Summary */}
      <Card className="glass-card animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-heading text-foreground flex items-center gap-2">
            <IndianRupee className="h-5 w-5 text-butterfly-gold" />
            Investment Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <div className="text-center p-3 rounded-xl bg-primary/5">
              <p className="text-xs text-muted-foreground">Invested</p>
              <p className="text-lg font-heading font-bold text-foreground">{formatCurrency(portfolioCost)}</p>
            </div>
            <div className="text-center p-3 rounded-xl bg-income/5">
              <p className="text-xs text-muted-foreground">Current Value</p>
              <p className="text-lg font-heading font-bold text-income">{formatCurrency(portfolioValue)}</p>
            </div>
            <div className={`text-center p-3 rounded-xl ${portfolioGain >= 0 ? "bg-income/5" : "bg-expense/5"}`}>
              <p className="text-xs text-muted-foreground">Gain/Loss</p>
              <p className={`text-lg font-heading font-bold ${portfolioGain >= 0 ? "text-income" : "text-expense"}`}>
                {portfolioGain >= 0 ? "+" : ""}{formatCurrency(portfolioGain)}
              </p>
            </div>
          </div>
          <div className="space-y-2">
            {portfolio.map(p => {
              const val = p.quantity * p.currentPrice;
              const gain = val - p.quantity * p.avgPrice;
              return (
                <div key={p.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/30 transition-colors">
                  <div className="flex items-center gap-2">
                    <span className="font-heading font-bold text-foreground text-sm">{p.symbol}</span>
                    <Badge variant="secondary" className="text-[10px] capitalize">{p.type}</Badge>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-foreground">{formatCurrency(val)}</p>
                    <p className={`text-[11px] ${gain >= 0 ? "text-income" : "text-expense"}`}>
                      {gain >= 0 ? "+" : ""}{formatCurrency(gain)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Financial Tips */}
      <Card className="glass-card border-butterfly-gold/20 animate-fade-in-up" style={{ animationDelay: "0.45s" }}>
        <CardContent className="p-5">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-butterfly-gold/10 shrink-0">
              <Target className="h-5 w-5 text-butterfly-gold" />
            </div>
            <div>
              <h4 className="font-heading font-bold text-foreground mb-1">Personalised Insight</h4>
              <p className="text-sm text-muted-foreground">
                {savingsRate >= 30
                  ? "You're saving excellently! Consider increasing your SIP investments or exploring international funds for diversification."
                  : savingsRate >= 15
                  ? "Good progress! Try automating your savings with a recurring deposit and gradually increase your investment allocation."
                  : "Focus on building an emergency fund of 6 months' expenses. Track your spending closely and cut discretionary expenses."}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
