import { useApp } from "@/context/AppContext";
import { formatCurrency } from "@/lib/currency";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { TrendingUp, TrendingDown, Briefcase, IndianRupee } from "lucide-react";

export default function PortfolioPage() {
  const { portfolio } = useApp();

  const totalValue = portfolio.reduce((sum, p) => sum + p.quantity * p.currentPrice, 0);
  const totalCost = portfolio.reduce((sum, p) => sum + p.quantity * p.avgPrice, 0);
  const totalGain = totalValue - totalCost;
  const totalGainPercent = ((totalGain / totalCost) * 100);

  const typeAllocation = portfolio.reduce((acc, p) => {
    const val = p.quantity * p.currentPrice;
    acc[p.type] = (acc[p.type] || 0) + val;
    return acc;
  }, {} as Record<string, number>);

  const pieData = Object.entries(typeAllocation).map(([name, value]) => ({ name: name.toUpperCase(), value: Math.round(value) }));
  const COLORS = ["hsl(168,60%,40%)", "hsl(270,50%,60%)", "hsl(40,80%,55%)", "hsl(200,70%,50%)"];

  const barData = portfolio.map(p => ({
    name: p.symbol,
    gain: Math.round((p.currentPrice - p.avgPrice) * p.quantity),
  }));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-heading font-bold text-foreground">Portfolio Analysis</h2>
        <p className="text-muted-foreground text-sm">Track your investment performance</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="glass-card">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10"><Briefcase className="h-5 w-5 text-primary" /></div>
              <div>
                <p className="text-xs text-muted-foreground">Total Value</p>
                <p className="text-xl font-heading font-bold text-foreground">{formatCurrency(totalValue)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-income/10"><IndianRupee className="h-5 w-5 text-income" /></div>
              <div>
                <p className="text-xs text-muted-foreground">Total Cost</p>
                <p className="text-xl font-heading font-bold text-foreground">{formatCurrency(totalCost)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${totalGain >= 0 ? "bg-income/10" : "bg-expense/10"}`}>
                {totalGain >= 0 ? <TrendingUp className="h-5 w-5 text-income" /> : <TrendingDown className="h-5 w-5 text-expense" />}
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total Gain/Loss</p>
                <p className={`text-xl font-heading font-bold ${totalGain >= 0 ? "text-income" : "text-expense"}`}>
                  {totalGain >= 0 ? "+" : ""}{formatCurrency(totalGain)} ({totalGainPercent.toFixed(1)}%)
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-heading text-foreground">Asset Allocation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={4} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                    {pieData.map((_, idx) => <Cell key={idx} fill={COLORS[idx % COLORS.length]} />)}
                  </Pie>
                  <Tooltip formatter={(v: number) => formatCurrency(v)} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-heading text-foreground">Gains by Asset</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                  <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                  <Tooltip formatter={(v: number) => formatCurrency(v)} contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
                  <Bar dataKey="gain" radius={[6, 6, 0, 0]} fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="glass-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-heading text-foreground">Holdings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-2 font-semibold text-muted-foreground">Asset</th>
                  <th className="text-right py-3 px-2 font-semibold text-muted-foreground">Qty</th>
                  <th className="text-right py-3 px-2 font-semibold text-muted-foreground">Avg Price</th>
                  <th className="text-right py-3 px-2 font-semibold text-muted-foreground">Current</th>
                  <th className="text-right py-3 px-2 font-semibold text-muted-foreground">Value</th>
                  <th className="text-right py-3 px-2 font-semibold text-muted-foreground">P&L</th>
                </tr>
              </thead>
              <tbody>
                {portfolio.map(p => {
                  const value = p.quantity * p.currentPrice;
                  const cost = p.quantity * p.avgPrice;
                  const gain = value - cost;
                  const gainPct = ((gain / cost) * 100);
                  return (
                    <tr key={p.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                      <td className="py-3 px-2">
                        <div className="flex items-center gap-2">
                          <span className="font-heading font-bold text-foreground">{p.symbol}</span>
                          <Badge variant="secondary" className="text-[10px] capitalize">{p.type}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{p.name}</p>
                      </td>
                      <td className="text-right py-3 px-2 text-foreground">{p.quantity}</td>
                      <td className="text-right py-3 px-2 text-foreground">{formatCurrency(p.avgPrice)}</td>
                      <td className="text-right py-3 px-2 text-foreground">{formatCurrency(p.currentPrice)}</td>
                      <td className="text-right py-3 px-2 font-semibold text-foreground">{formatCurrency(value)}</td>
                      <td className={`text-right py-3 px-2 font-semibold ${gain >= 0 ? "text-income" : "text-expense"}`}>
                        {gain >= 0 ? "+" : ""}{formatCurrency(gain)} ({gainPct.toFixed(1)}%)
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
