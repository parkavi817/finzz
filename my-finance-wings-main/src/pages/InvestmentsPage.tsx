import { useApp } from "@/context/AppContext";
import { formatCurrency } from "@/lib/currency";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Lightbulb, TrendingUp, PiggyBank, ShieldCheck, Zap } from "lucide-react";

interface InvestmentPlan {
  id: string;
  name: string;
  type: string;
  risk: "Low" | "Medium" | "High";
  expectedReturn: string;
  minInvestment: number;
  description: string;
  suitableFor: string;
  icon: React.ReactNode;
}

export default function InvestmentsPage() {
  const { totalIncome, totalExpenses } = useApp();

  const monthlySavings = (totalIncome - totalExpenses) / 6;
  const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome * 100) : 0;
  const investableAmount = Math.max(0, monthlySavings * 0.5);

  const allPlans: InvestmentPlan[] = [
    { id: "1", name: "Nifty 50 Index Fund", type: "Mutual Fund", risk: "Medium", expectedReturn: "10-14% annually", minInvestment: 500, description: "Diversified exposure to top 50 Indian companies. Great for long-term wealth building via SIP.", suitableFor: "Moderate savers with steady income", icon: <TrendingUp className="h-5 w-5" /> },
    { id: "2", name: "Fixed Deposit", type: "Savings", risk: "Low", expectedReturn: "6-7% annually", minInvestment: 1000, description: "Bank FDs with guaranteed returns. Perfect for emergency funds and risk-averse investors.", suitableFor: "Everyone — start here", icon: <PiggyBank className="h-5 w-5" /> },
    { id: "3", name: "Government Bonds (G-Sec)", type: "Bond", risk: "Low", expectedReturn: "7-8% annually", minInvestment: 1000, description: "Backed by RBI. Stable returns with sovereign guarantee.", suitableFor: "Conservative investors with low expenses", icon: <ShieldCheck className="h-5 w-5" /> },
    { id: "4", name: "Small Cap Stocks", type: "Stock", risk: "High", expectedReturn: "18-30% annually", minInvestment: 500, description: "High-growth Indian small caps. Higher risk but potential for significant returns.", suitableFor: "High savers comfortable with volatility", icon: <Zap className="h-5 w-5" /> },
    { id: "5", name: "ELSS Tax Saver Fund", type: "Mutual Fund", risk: "Medium", expectedReturn: "12-16% annually", minInvestment: 500, description: "Equity-linked savings with tax benefits under Section 80C. 3-year lock-in.", suitableFor: "Tax-conscious investors", icon: <TrendingUp className="h-5 w-5" /> },
    { id: "6", name: "Crypto (BTC/ETH)", type: "Crypto", risk: "High", expectedReturn: "Variable", minInvestment: 100, description: "Digital assets with high volatility. Only invest what you can afford to lose.", suitableFor: "Risk-tolerant investors with surplus savings", icon: <Zap className="h-5 w-5" /> },
  ];

  const getSuitablePlans = () => {
    if (savingsRate < 10) return allPlans.filter(p => p.risk === "Low");
    if (savingsRate < 30) return allPlans.filter(p => p.risk !== "High");
    return allPlans;
  };

  const suitablePlans = getSuitablePlans();
  const riskColor = { Low: "text-income", Medium: "text-butterfly-gold", High: "text-expense" };
  const riskBg = { Low: "bg-income/10", Medium: "bg-butterfly-gold/10", High: "bg-expense/10" };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-heading font-bold text-foreground">Investment Suggestions</h2>
        <p className="text-muted-foreground text-sm">Personalised recommendations based on your financial profile</p>
      </div>

      <Card className="glass-card border-primary/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-heading text-foreground flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-butterfly-gold" />
            Your Financial Profile
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <div>
              <p className="text-xs text-muted-foreground">Monthly Income (avg)</p>
              <p className="text-lg font-heading font-bold text-income">{formatCurrency(totalIncome / 6)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Monthly Expenses (avg)</p>
              <p className="text-lg font-heading font-bold text-expense">{formatCurrency(totalExpenses / 6)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Investable Amount</p>
              <p className="text-lg font-heading font-bold text-primary">{formatCurrency(investableAmount)}/mo</p>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-muted-foreground">Savings Rate</span>
              <span className={`font-semibold ${savingsRate > 20 ? "text-income" : savingsRate > 10 ? "text-butterfly-gold" : "text-expense"}`}>{savingsRate.toFixed(1)}%</span>
            </div>
            <Progress value={Math.min(savingsRate, 100)} className="h-2" />
            <p className="text-xs text-muted-foreground mt-1">
              {savingsRate > 30 ? "Excellent! You can explore higher-risk investments." :
               savingsRate > 15 ? "Good savings rate. A mix of moderate investments suits you." :
               "Focus on building an emergency fund first."}
            </p>
          </div>
        </CardContent>
      </Card>

      <div>
        <h3 className="text-lg font-heading font-semibold text-foreground mb-4">
          Recommended for You ({suitablePlans.length} plans)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {suitablePlans.map(plan => (
            <Card key={plan.id} className="glass-card hover:shadow-md transition-all">
              <CardContent className="p-5">
                <div className="flex items-start gap-3 mb-3">
                  <div className={`p-2 rounded-lg ${riskBg[plan.risk]}`}>
                    <span className={riskColor[plan.risk]}>{plan.icon}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-heading font-bold text-foreground">{plan.name}</h4>
                      <Badge variant="secondary" className="text-[10px]">{plan.type}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{plan.description}</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3 text-center py-3 border-t border-border/50">
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Risk</p>
                    <p className={`text-sm font-semibold ${riskColor[plan.risk]}`}>{plan.risk}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Returns</p>
                    <p className="text-sm font-semibold text-foreground">{plan.expectedReturn}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Min</p>
                    <p className="text-sm font-semibold text-foreground">{formatCurrency(plan.minInvestment)}</p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2 italic">✨ {plan.suitableFor}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {suitablePlans.length < allPlans.length && (
        <div>
          <h3 className="text-lg font-heading font-semibold text-muted-foreground mb-4">
            Other Investment Options
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 opacity-60">
            {allPlans.filter(p => !suitablePlans.includes(p)).map(plan => (
              <Card key={plan.id} className="glass-card">
                <CardContent className="p-5">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${riskBg[plan.risk]}`}>
                      <span className={riskColor[plan.risk]}>{plan.icon}</span>
                    </div>
                    <div>
                      <h4 className="font-heading font-semibold text-foreground">{plan.name}</h4>
                      <p className="text-xs text-muted-foreground">Risk: {plan.risk} · Returns: {plan.expectedReturn}</p>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">⚠️ Consider this once your savings rate improves</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
