import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { formatCurrency } from "@/lib/currency";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Users, Send, Eye } from "lucide-react";
import { toast } from "sonner";

export default function AdminUsersPage() {
  const { mockUsers, sendSuggestionToUser } = useApp();
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [suggestionTitle, setSuggestionTitle] = useState("");
  const [suggestionMessage, setSuggestionMessage] = useState("");
  const [sendDialogOpen, setSendDialogOpen] = useState(false);
  const [viewUser, setViewUser] = useState<string | null>(null);

  const handleSend = () => {
    if (!selectedUser || !suggestionTitle || !suggestionMessage) {
      toast.error("Please fill all fields");
      return;
    }
    sendSuggestionToUser(selectedUser, suggestionTitle, suggestionMessage);
    toast.success("Suggestion sent successfully!");
    setSuggestionTitle("");
    setSuggestionMessage("");
    setSendDialogOpen(false);
  };

  const viewedUser = mockUsers.find(u => u.id === viewUser);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-heading font-bold text-foreground">User Management</h2>
        <p className="text-muted-foreground text-sm">View user details and send investment suggestions</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockUsers.map(user => (
          <Card key={user.id} className="glass-card hover:shadow-md transition-all">
            <CardContent className="p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-heading font-bold">
                  {user.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-heading font-semibold text-foreground">{user.name}</h3>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="text-center p-2 rounded-lg bg-income/10">
                  <p className="text-[10px] text-muted-foreground">Income</p>
                  <p className="text-sm font-bold text-income">{formatCurrency(user.income)}</p>
                </div>
                <div className="text-center p-2 rounded-lg bg-expense/10">
                  <p className="text-[10px] text-muted-foreground">Expenses</p>
                  <p className="text-sm font-bold text-expense">{formatCurrency(user.expenses)}</p>
                </div>
                <div className="text-center p-2 rounded-lg bg-primary/10">
                  <p className="text-[10px] text-muted-foreground">Savings</p>
                  <p className="text-sm font-bold text-primary">{formatCurrency(user.savings)}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="flex-1 gap-1 text-xs rounded-lg" onClick={() => setViewUser(user.id)}>
                  <Eye className="h-3 w-3" /> View Details
                </Button>
                <Dialog open={sendDialogOpen && selectedUser === user.id} onOpenChange={(open) => { setSendDialogOpen(open); if (open) setSelectedUser(user.id); }}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="flex-1 gap-1 text-xs rounded-lg gradient-primary text-primary-foreground">
                      <Send className="h-3 w-3" /> Send Plan
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle className="font-heading">Send Suggestion to {user.name}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 pt-2">
                      <div className="space-y-2">
                        <Label>Title</Label>
                        <Input placeholder="e.g., Investment Plan for Q2" value={suggestionTitle} onChange={e => setSuggestionTitle(e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label>Message</Label>
                        <Textarea placeholder="Describe the investment plan or trade suggestion..." value={suggestionMessage} onChange={e => setSuggestionMessage(e.target.value)} rows={4} />
                      </div>
                      <Button onClick={handleSend} className="w-full gradient-primary text-primary-foreground rounded-xl">
                        <Send className="h-4 w-4 mr-2" /> Send Suggestion
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* User Detail Modal */}
      <Dialog open={!!viewUser} onOpenChange={(open) => !open && setViewUser(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          {viewedUser && (
            <>
              <DialogHeader>
                <DialogTitle className="font-heading flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
                    {viewedUser.name.charAt(0)}
                  </div>
                  {viewedUser.name}'s Details
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-2">
                <div className="grid grid-cols-3 gap-3">
                  <Card className="bg-income/5 border-income/20"><CardContent className="p-3 text-center"><p className="text-[10px] text-muted-foreground">Income</p><p className="font-bold text-income">{formatCurrency(viewedUser.income)}</p></CardContent></Card>
                  <Card className="bg-expense/5 border-expense/20"><CardContent className="p-3 text-center"><p className="text-[10px] text-muted-foreground">Expenses</p><p className="font-bold text-expense">{formatCurrency(viewedUser.expenses)}</p></CardContent></Card>
                  <Card className="bg-primary/5 border-primary/20"><CardContent className="p-3 text-center"><p className="text-[10px] text-muted-foreground">Savings</p><p className="font-bold text-primary">{formatCurrency(viewedUser.savings)}</p></CardContent></Card>
                </div>

                <div>
                  <h4 className="font-heading font-semibold text-foreground mb-2">Portfolio</h4>
                  {viewedUser.portfolio.length > 0 ? (
                    <div className="space-y-2">
                      {viewedUser.portfolio.map(p => (
                        <div key={p.id} className="flex justify-between items-center p-2 rounded-lg bg-muted/30">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-foreground text-sm">{p.symbol}</span>
                            <Badge variant="secondary" className="text-[10px]">{p.type}</Badge>
                          </div>
                          <span className="text-sm text-foreground">{p.quantity} × {formatCurrency(p.currentPrice)}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No portfolio items</p>
                  )}
                </div>

                <div>
                  <h4 className="font-heading font-semibold text-foreground mb-2">Recent Transactions</h4>
                  <div className="space-y-1 max-h-48 overflow-y-auto">
                    {viewedUser.transactions.slice(0, 10).map(tx => (
                      <div key={tx.id} className="flex justify-between items-center p-2 rounded-lg hover:bg-muted/30 text-sm">
                        <div>
                          <span className="text-foreground">{tx.description}</span>
                          <span className="text-xs text-muted-foreground ml-2">{tx.date}</span>
                        </div>
                        <span className={tx.type === "income" ? "text-income font-semibold" : "text-expense font-semibold"}>
                          {tx.type === "income" ? "+" : "-"}{formatCurrency(tx.amount)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
