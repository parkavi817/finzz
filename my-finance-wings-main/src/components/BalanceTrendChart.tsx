import { useApp } from "@/context/AppContext";
import { useMemo } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function BalanceTrendChart() {
  const { transactions } = useApp();

  const data = useMemo(() => {
    const sorted = [...transactions].sort((a, b) => a.date.localeCompare(b.date));
    const monthlyMap = new Map<string, { income: number; expense: number }>();

    sorted.forEach(t => {
      const month = t.date.slice(0, 7);
      const entry = monthlyMap.get(month) || { income: 0, expense: 0 };
      if (t.type === "income") entry.income += t.amount;
      else entry.expense += t.amount;
      monthlyMap.set(month, entry);
    });

    let runningBalance = 0;
    return Array.from(monthlyMap.entries()).map(([month, { income, expense }]) => {
      runningBalance += income - expense;
      const label = new Date(month + "-01").toLocaleDateString("en-US", { month: "short", year: "2-digit" });
      return { month: label, balance: Math.round(runningBalance * 100) / 100, income: Math.round(income), expense: Math.round(expense) };
    });
  }, [transactions]);

  return (
    <div className="glass-card rounded-2xl p-6 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
      <h3 className="text-lg font-heading font-semibold text-foreground mb-4">Balance Trend</h3>
      {data.length === 0 ? (
        <p className="text-muted-foreground text-sm text-center py-10">No data to display</p>
      ) : (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="balanceGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(168,60%,40%)" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="hsl(168,60%,40%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(160,15%,88%)" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "hsl(210,10%,50%)" }} />
              <YAxis tick={{ fontSize: 12, fill: "hsl(210,10%,50%)" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(0,0%,100%)",
                  border: "1px solid hsl(160,15%,88%)",
                  borderRadius: "12px",
                  fontSize: 13,
                }}
              />
              <Area type="monotone" dataKey="balance" stroke="hsl(168,60%,40%)" fill="url(#balanceGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
