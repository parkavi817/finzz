import { useApp } from "@/context/AppContext";
import { formatCurrency } from "@/lib/currency";
import { TrendingUp, TrendingDown, Wallet } from "lucide-react";

const cards = [
  { key: "balance", label: "Total Balance", icon: Wallet, colorClass: "text-primary" },
  { key: "income", label: "Total Income", icon: TrendingUp, colorClass: "text-income" },
  { key: "expenses", label: "Total Expenses", icon: TrendingDown, colorClass: "text-expense" },
] as const;

export default function SummaryCards() {
  const { totalBalance, totalIncome, totalExpenses } = useApp();
  const values = { balance: totalBalance, income: totalIncome, expenses: totalExpenses };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {cards.map(({ key, label, icon: Icon, colorClass }, i) => (
        <div
          key={key}
          className="glass-card rounded-2xl p-6 animate-fade-in-up"
          style={{ animationDelay: `${i * 0.1}s` }}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-muted-foreground font-medium">{label}</span>
            <div className={`p-2 rounded-xl bg-muted ${colorClass}`}>
              <Icon className="h-4 w-4" />
            </div>
          </div>
          <p className={`text-2xl font-heading font-bold ${colorClass}`}>
            {formatCurrency(values[key])}
          </p>
        </div>
      ))}
    </div>
  );
}
