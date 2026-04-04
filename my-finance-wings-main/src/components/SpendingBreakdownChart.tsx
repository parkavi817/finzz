import { useApp } from "@/context/AppContext";
import { formatCurrency } from "@/lib/currency";
import { useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

const COLORS = [
  "hsl(168,60%,40%)", "hsl(270,50%,60%)", "hsl(40,80%,55%)",
  "hsl(320,50%,65%)", "hsl(200,70%,50%)", "hsl(145,60%,42%)",
  "hsl(30,70%,50%)", "hsl(190,60%,45%)", "hsl(350,60%,55%)", "hsl(80,50%,45%)",
];

export default function SpendingBreakdownChart() {
  const { transactions } = useApp();

  const data = useMemo(() => {
    const catMap = new Map<string, number>();
    transactions
      .filter(t => t.type === "expense")
      .forEach(t => catMap.set(t.category, (catMap.get(t.category) || 0) + t.amount));

    return Array.from(catMap.entries())
      .map(([name, value]) => ({ name, value: Math.round(value) }))
      .sort((a, b) => b.value - a.value);
  }, [transactions]);

  return (
    <div className="glass-card rounded-2xl p-6 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
      <h3 className="text-lg font-heading font-semibold text-foreground mb-4">Spending Breakdown</h3>
      {data.length === 0 ? (
        <p className="text-muted-foreground text-sm text-center py-10">No expenses to display</p>
      ) : (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} dataKey="value" cx="50%" cy="50%" outerRadius={80} innerRadius={40} paddingAngle={3}>
                {data.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(0,0%,100%)",
                  border: "1px solid hsl(160,15%,88%)",
                  borderRadius: "12px",
                  fontSize: 13,
                }}
                formatter={(value: number) => [formatCurrency(value), ""]}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
