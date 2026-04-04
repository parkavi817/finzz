import { useState, useRef, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import { formatCurrency } from "@/lib/currency";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageCircle, X, Send, Bot, User, Sparkles } from "lucide-react";

interface ChatMessage {
  id: string;
  role: "user" | "bot";
  content: string;
}

const QUICK_QUESTIONS = [
  "What's my savings rate?",
  "Top spending category?",
  "How's my portfolio?",
  "Investment tips?",
];

export default function FloatingChatbot() {
  const { totalBalance, totalIncome, totalExpenses, transactions, portfolio, role } = useApp();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: "welcome", role: "bot", content: "Hi! I'm FinFly AI 🦋✨ Ask me anything about your finances!" },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, typing]);

  const generateResponse = (q: string): string => {
    const lower = q.toLowerCase();
    const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome * 100).toFixed(1) : "0";
    const expenses = transactions.filter(t => t.type === "expense");
    const catTotals = new Map<string, number>();
    expenses.forEach(t => catTotals.set(t.category, (catTotals.get(t.category) || 0) + t.amount));
    const topCat = Array.from(catTotals.entries()).sort((a, b) => b[1] - a[1])[0];

    if (lower.includes("saving") || lower.includes("save")) {
      return `Your savings rate is **${savingsRate}%**. ${parseFloat(savingsRate) > 20 ? "Great job! 🎉" : "Consider cutting non-essential expenses to boost savings."} Your total balance is ${formatCurrency(totalBalance)}.`;
    }
    if (lower.includes("spend") || lower.includes("category") || lower.includes("top")) {
      return topCat
        ? `Your top spending category is **${topCat[0]}** at ${formatCurrency(topCat[1])}. Consider setting a budget limit for this category.`
        : "No expense data found yet. Start tracking to get insights!";
    }
    if (lower.includes("portfolio") || lower.includes("stock") || lower.includes("invest")) {
      const totalVal = portfolio.reduce((s, p) => s + p.quantity * p.currentPrice, 0);
      const totalCost = portfolio.reduce((s, p) => s + p.quantity * p.avgPrice, 0);
      const gain = totalVal - totalCost;
      return `Your portfolio is worth ${formatCurrency(totalVal)} with a ${gain >= 0 ? "gain" : "loss"} of ${formatCurrency(Math.abs(gain))} (${((gain / totalCost) * 100).toFixed(1)}%). ${gain >= 0 ? "📈 Looking good!" : "📉 Markets are volatile, stay patient."}`;
    }
    if (lower.includes("tip") || lower.includes("advice") || lower.includes("suggest")) {
      if (parseFloat(savingsRate) < 10) return "💡 **Tip:** Your savings rate is low. Try the 50/30/20 rule — 50% needs, 30% wants, 20% savings. Start with a high-yield savings account.";
      if (parseFloat(savingsRate) < 30) return "💡 **Tip:** Good savings! Consider diversifying into index funds (like Nifty 50 ETFs) for long-term growth. SIPs are a great way to start.";
      return "💡 **Tip:** Excellent savings rate! You're ready for aggressive growth — consider a mix of equity mutual funds, international ETFs, and some crypto exposure (5-10%).";
    }
    if (lower.includes("balance") || lower.includes("total")) {
      return `Your total balance is ${formatCurrency(totalBalance)}. Income: ${formatCurrency(totalIncome)} | Expenses: ${formatCurrency(totalExpenses)}.`;
    }
    if (lower.includes("hello") || lower.includes("hi") || lower.includes("hey")) {
      return `Hello! 👋 I'm here to help you understand your finances better. Try asking about your savings, spending, or portfolio!`;
    }
    return `Great question! Here's a quick summary:\n\n• **Balance:** ${formatCurrency(totalBalance)}\n• **Savings Rate:** ${savingsRate}%\n• **Top Expense:** ${topCat ? topCat[0] : "N/A"}\n\nAsk me something specific for deeper insights! 🦋`;
  };

  const sendMessage = (text?: string) => {
    const msg = text || input.trim();
    if (!msg) return;
    const userMsg: ChatMessage = { id: crypto.randomUUID(), role: "user", content: msg };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setTyping(true);

    setTimeout(() => {
      const response = generateResponse(msg);
      setMessages(prev => [...prev, { id: crypto.randomUUID(), role: "bot", content: response }]);
      setTyping(false);
    }, 800 + Math.random() * 700);
  };

  return (
    <>
      {/* Chat Window */}
      {open && (
        <div className="fixed bottom-20 right-4 z-50 w-[360px] max-w-[calc(100vw-2rem)] rounded-2xl glass-card border border-border/50 shadow-2xl animate-fade-in-up flex flex-col" style={{ height: "480px" }}>
          {/* Header */}
          <div className="gradient-butterfly rounded-t-2xl px-4 py-3 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <div>
                <h4 className="text-white font-heading font-bold text-sm">FinFly AI</h4>
                <p className="text-white/70 text-[10px]">Your financial assistant</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 h-8 w-8" onClick={() => setOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-3">
            {messages.map(msg => (
              <div key={msg.id} className={`flex gap-2 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${msg.role === "bot" ? "bg-primary/10" : "gradient-primary"}`}>
                  {msg.role === "bot" ? <Bot className="h-3.5 w-3.5 text-primary" /> : <User className="h-3.5 w-3.5 text-primary-foreground" />}
                </div>
                <div className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${msg.role === "user" ? "gradient-primary text-primary-foreground" : "bg-muted/50 text-foreground"}`}>
                  {msg.content.split("**").map((part, i) =>
                    i % 2 === 1 ? <strong key={i}>{part}</strong> : <span key={i}>{part}</span>
                  )}
                </div>
              </div>
            ))}
            {typing && (
              <div className="flex gap-2">
                <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Bot className="h-3.5 w-3.5 text-primary" />
                </div>
                <div className="bg-muted/50 rounded-2xl px-4 py-3">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: "0s" }} />
                    <span className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: "0.15s" }} />
                    <span className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: "0.3s" }} />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Questions */}
          {messages.length <= 2 && (
            <div className="px-3 pb-2 flex flex-wrap gap-1.5 shrink-0">
              {QUICK_QUESTIONS.map(q => (
                <button key={q} onClick={() => sendMessage(q)} className="text-[11px] px-2.5 py-1 rounded-full border border-border bg-muted/30 text-muted-foreground hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-all">
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="p-3 border-t border-border/50 shrink-0">
            <form onSubmit={e => { e.preventDefault(); sendMessage(); }} className="flex gap-2">
              <Input
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Ask about your finances..."
                className="bg-background text-sm h-9 rounded-xl"
              />
              <Button type="submit" size="icon" className="gradient-primary text-primary-foreground h-9 w-9 rounded-xl shrink-0" disabled={!input.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-4 right-4 z-50 w-14 h-14 rounded-full gradient-butterfly shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 flex items-center justify-center group"
      >
        {open ? (
          <X className="h-6 w-6 text-white transition-transform group-hover:rotate-90" />
        ) : (
          <MessageCircle className="h-6 w-6 text-white" />
        )}
        {!open && (
          <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-butterfly-gold animate-pulse" />
        )}
      </button>
    </>
  );
}
