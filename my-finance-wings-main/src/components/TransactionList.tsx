import { useState } from "react";
import { useApp, CATEGORIES, type Category, type TransactionType, type Transaction } from "@/context/AppContext";
import { formatCurrency } from "@/lib/currency";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Plus, Pencil, Trash2, Search, ArrowUpDown, Download } from "lucide-react";

function TransactionForm({ initial, onSave, onCancel }: {
  initial?: Transaction;
  onSave: (tx: Omit<Transaction, "id">) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState({
    date: initial?.date || new Date().toISOString().split("T")[0],
    amount: initial?.amount?.toString() || "",
    category: initial?.category || ("Food" as Category),
    type: initial?.type || ("expense" as TransactionType),
    description: initial?.description || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...form, amount: parseFloat(form.amount) || 0 });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-foreground">Date</Label>
          <Input type="date" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} className="bg-background" />
        </div>
        <div className="space-y-2">
          <Label className="text-foreground">Amount (₹)</Label>
          <Input type="number" step="0.01" placeholder="0.00" value={form.amount} onChange={e => setForm(p => ({ ...p, amount: e.target.value }))} className="bg-background" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-foreground">Type</Label>
          <Select value={form.type} onValueChange={v => setForm(p => ({ ...p, type: v as TransactionType }))}>
            <SelectTrigger className="bg-background"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="income">Income</SelectItem>
              <SelectItem value="expense">Expense</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label className="text-foreground">Category</Label>
          <Select value={form.category} onValueChange={v => setForm(p => ({ ...p, category: v as Category }))}>
            <SelectTrigger className="bg-background"><SelectValue /></SelectTrigger>
            <SelectContent>
              {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="space-y-2">
        <Label className="text-foreground">Description</Label>
        <Input value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="What's this for?" className="bg-background" />
      </div>
      <div className="flex gap-2 justify-end">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit" className="gradient-primary text-primary-foreground">Save</Button>
      </div>
    </form>
  );
}

export default function TransactionList() {
  const { filteredTransactions, filters, setFilters, role, addTransaction, editTransaction, deleteTransaction } = useApp();
  const [addOpen, setAddOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const isAdmin = role === "admin";

  const exportCSV = () => {
    const header = "Date,Description,Category,Type,Amount\n";
    const rows = filteredTransactions.map(t => `${t.date},"${t.description}",${t.category},${t.type},${t.amount}`).join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "transactions.csv";
    a.click();
  };

  return (
    <div className="glass-card rounded-2xl p-6 animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <h3 className="text-lg font-heading font-semibold text-foreground">Transactions</h3>
        <div className="flex gap-2 flex-wrap">
          {isAdmin && (
            <Dialog open={addOpen} onOpenChange={setAddOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="gradient-primary text-primary-foreground gap-1">
                  <Plus className="h-4 w-4" /> Add
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle className="font-heading">Add Transaction</DialogTitle></DialogHeader>
                <TransactionForm onSave={(tx) => { addTransaction(tx); setAddOpen(false); }} onCancel={() => setAddOpen(false)} />
              </DialogContent>
            </Dialog>
          )}
          <Button size="sm" variant="outline" onClick={exportCSV} className="gap-1">
            <Download className="h-4 w-4" /> CSV
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search transactions..." value={filters.search} onChange={e => setFilters({ search: e.target.value })} className="pl-9 bg-background" />
        </div>
        <Select value={filters.type} onValueChange={v => setFilters({ type: v as any })}>
          <SelectTrigger className="w-[130px] bg-background"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="income">Income</SelectItem>
            <SelectItem value="expense">Expense</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filters.category} onValueChange={v => setFilters({ category: v as any })}>
          <SelectTrigger className="w-[140px] bg-background"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
        <Button variant="outline" size="icon" onClick={() => setFilters({ sortOrder: filters.sortOrder === "asc" ? "desc" : "asc" })} title="Toggle sort order">
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      </div>

      {/* Table */}
      {filteredTransactions.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p className="text-lg mb-1">No transactions found</p>
          <p className="text-sm">Try adjusting your filters or add a new transaction</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-muted-foreground">
                <th className="text-left py-3 px-2 font-medium">Date</th>
                <th className="text-left py-3 px-2 font-medium">Description</th>
                <th className="text-left py-3 px-2 font-medium hidden sm:table-cell">Category</th>
                <th className="text-right py-3 px-2 font-medium">Amount</th>
                {isAdmin && <th className="text-right py-3 px-2 font-medium w-20">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.slice(0, 20).map(t => (
                <tr key={t.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                  <td className="py-3 px-2 text-muted-foreground">{new Date(t.date).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}</td>
                  <td className="py-3 px-2 text-foreground font-medium">{t.description}</td>
                  <td className="py-3 px-2 hidden sm:table-cell">
                    <span className="px-2 py-1 rounded-full text-xs bg-muted text-muted-foreground">{t.category}</span>
                  </td>
                  <td className={`py-3 px-2 text-right font-semibold ${t.type === "income" ? "text-income" : "text-expense"}`}>
                    {t.type === "income" ? "+" : "-"}{formatCurrency(t.amount)}
                  </td>
                  {isAdmin && (
                    <td className="py-3 px-2 text-right">
                      <div className="flex justify-end gap-1">
                        <Dialog open={editId === t.id} onOpenChange={(open) => setEditId(open ? t.id : null)}>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground">
                              <Pencil className="h-3 w-3" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader><DialogTitle className="font-heading">Edit Transaction</DialogTitle></DialogHeader>
                            <TransactionForm initial={t} onSave={(updates) => { editTransaction(t.id, updates); setEditId(null); }} onCancel={() => setEditId(null)} />
                          </DialogContent>
                        </Dialog>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive" onClick={() => deleteTransaction(t.id)}>
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
          {filteredTransactions.length > 20 && (
            <p className="text-sm text-muted-foreground text-center mt-3">Showing 20 of {filteredTransactions.length} transactions</p>
          )}
        </div>
      )}
    </div>
  );
}
