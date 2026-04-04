import { useApp } from "@/context/AppContext";
import { formatCurrency } from "@/lib/currency";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TrendingUp, TrendingDown, Search } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function TradePage() {
  const { marketData, role } = useApp();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "stock" | "crypto" | "etf" | "bond">("all");

  const filtered = marketData.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) || item.symbol.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "all" || item.type === filter;
    return matchesSearch && matchesFilter;
  });

  const handleTrade = (symbol: string, action: "buy" | "sell") => {
    if (role === "viewer") {
      toast.error("Only admins can execute trades");
      return;
    }
    toast.success(`${action === "buy" ? "Bought" : "Sold"} ${symbol} successfully!`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-heading font-bold text-foreground">Trade</h2>
        <p className="text-muted-foreground text-sm">Browse market data and execute trades</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search by name or symbol..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 bg-background" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {(["all", "stock", "crypto", "etf", "bond"] as const).map(f => (
            <Button key={f} variant={filter === f ? "default" : "outline"} size="sm" onClick={() => setFilter(f)} className="capitalize rounded-lg">
              {f === "all" ? "All" : f.toUpperCase()}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map(item => (
          <Card key={item.id} className="glass-card hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-heading font-bold text-foreground">{item.symbol}</h3>
                    <Badge variant="secondary" className="text-xs capitalize">{item.type}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{item.name}</p>
                </div>
                <div className="text-right">
                  <p className="font-heading font-bold text-lg text-foreground">{formatCurrency(item.price)}</p>
                  <div className={`flex items-center gap-1 text-sm ${item.change >= 0 ? "text-income" : "text-expense"}`}>
                    {item.change >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                    <span>{item.change >= 0 ? "+" : ""}{item.changePercent.toFixed(2)}%</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">Vol: {item.volume}</p>
                {role === "admin" && (
                  <div className="flex gap-2">
                    <Button size="sm" className="rounded-lg bg-income hover:bg-income/90 text-income-foreground h-8 text-xs" onClick={() => handleTrade(item.symbol, "buy")}>Buy</Button>
                    <Button size="sm" variant="outline" className="rounded-lg border-expense text-expense hover:bg-expense/10 h-8 text-xs" onClick={() => handleTrade(item.symbol, "sell")}>Sell</Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
