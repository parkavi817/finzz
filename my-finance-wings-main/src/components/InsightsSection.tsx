import { useApp } from "@/context/AppContext";
import { formatCurrency } from "@/lib/currency";
import { useMemo } from "react";
import { TrendingUp, Award, BarChart3, Lightbulb } from "lucide-react";

export default function InsightsSection() {
  const { transactions } = useApp();

  const insights = useMemo(() => {
    if (transactions.length === 0) return [];

    const expenses = transactions.filter(t => t.type === "expense");
    const incomes = transactions.filter(t => t.type === "income");

    const catTotals = new Map<string, number>();
    expenses.forEach(t => catTotals.set(t.category, (catTotals.get(t.category) || 0) + t.amount));
    const topCat = Array.from(catTotals.entries()).sort((a, b) => b[1] - a[1])[0];

    const now = new Date();
    const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthKey = `${lastMonth.getFullYear()}-${String(lastMonth.getMonth() + 1).padStart(2, "0")}`;

    const thisMonthExp = expenses.filter(t => t.date.startsWith(thisMonth)).reduce((s, t) => s + t.amount, 0);
    const lastMonthExp = expenses.filter(t => t.date.startsWith(lastMonthKey)).reduce((s, t) => s + t.amount, 0);
    const monthChange = lastMonthExp > 0 ? ((thisMonthExp - lastMonthExp) / lastMonthExp * 100) : 0;

    const totalInc = incomes.reduce((s, t) => s + t.amount, 0);
    const totalExp = expenses.reduce((s, t) => s + t.amount, 0);
    const savingsRate = totalInc > 0 ? ((totalInc - totalExp) / totalInc * 100) : 0;

    const avgExpense = expenses.length > 0 ? totalExp / expenses.length : 0;

    const result = [];

    if (topCat) {
      result.push({
        icon: Award,
        title: "Top Spending Category",
        value: topCat[0],
        detail: `${formatCurrency(topCat[1])} total spent`,
        color: "text-butterfly-gold",
        bgColor: "bg-butterfly-gold/10",
      });
    }

    result.push({
      icon: BarChart3,
      title: "Monthly Comparison",
      value: monthChange === 0 ? "No change" : `${monthChange > 0 ? "+" : ""}${monthChange.toFixed(1)}%`,
      detail: `vs last month (${formatCurrency(thisMonthExp)} this month)`,
      color: monthChange > 0 ? "text-expense" : "text-income",
      bgColor: monthChange > 0 ? "bg-expense/10" : "bg-income/10",
    });

    result.push({
      icon: TrendingUp,
      title: "Savings Rate",
      value: `${savingsRate.toFixed(1)}%`,
      detail: `of income saved overall`,
      color: savingsRate >= 20 ? "text-income" : "text-butterfly-gold",
      bgColor: savingsRate >= 20 ? "bg-income/10" : "bg-butterfly-gold/10",
    });

    result.push({
      icon: Lightbulb,
      title: "Avg Expense",
      value: formatCurrency(avgExpense),
      detail: `across ${expenses.length} expense transactions`,
      color: "text-butterfly-lavender",
      bgColor: "bg-butterfly-lavender/10",
    });

    return result;
  }, [transactions]);

  if (insights.length === 0) {
    return (
      <div className="glass-card rounded-2xl p-6 text-center text-muted-foreground animate-fade-in-up">
        <p>Add transactions to see insights</p>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-2xl p-6 animate-fade-in-up" style={{ animationDelay: "0.5s" }}>
      <h3 className="text-lg font-heading font-semibold text-foreground mb-4">Insights</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {insights.map((insight, i) => (
          <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors">
            <div className={`p-2 rounded-xl ${insight.bgColor}`}>
              <insight.icon className={`h-5 w-5 ${insight.color}`} />
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">{insight.title}</p>
              <p className={`text-lg font-heading font-bold ${insight.color}`}>{insight.value}</p>
              <p className="text-xs text-muted-foreground">{insight.detail}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
