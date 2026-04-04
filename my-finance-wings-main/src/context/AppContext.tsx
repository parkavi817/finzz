import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

export type Role = "admin" | "viewer";
export type TransactionType = "income" | "expense";
export type Category = "Food" | "Transport" | "Entertainment" | "Shopping" | "Bills" | "Salary" | "Freelance" | "Investment" | "Health" | "Education";

export interface Transaction {
  id: string;
  date: string;
  amount: number;
  category: Category;
  type: TransactionType;
  description: string;
}

export interface Notification {
  id: string;
  type: "suggestion" | "alert" | "info";
  title: string;
  message: string;
  from: string;
  date: string;
  read: boolean;
}

export interface TradeItem {
  id: string;
  symbol: string;
  name: string;
  type: "stock" | "crypto" | "etf" | "bond";
  price: number;
  change: number;
  changePercent: number;
  volume: string;
}

export interface PortfolioItem {
  id: string;
  symbol: string;
  name: string;
  quantity: number;
  avgPrice: number;
  currentPrice: number;
  type: "stock" | "crypto" | "etf" | "bond";
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  income: number;
  expenses: number;
  savings: number;
  transactions: Transaction[];
  portfolio: PortfolioItem[];
}

interface Filters {
  search: string;
  type: TransactionType | "all";
  category: Category | "all";
  sortBy: "date" | "amount";
  sortOrder: "asc" | "desc";
}

interface AppState {
  transactions: Transaction[];
  role: Role;
  filters: Filters;
  isAuthenticated: boolean;
  darkMode: boolean;
  notifications: Notification[];
  portfolio: PortfolioItem[];
  mockUsers: UserProfile[];
}

interface AppContextType extends AppState {
  setRole: (role: Role) => void;
  setFilters: (filters: Partial<Filters>) => void;
  addTransaction: (tx: Omit<Transaction, "id">) => void;
  editTransaction: (id: string, tx: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  login: (role: Role) => void;
  logout: () => void;
  toggleDarkMode: () => void;
  filteredTransactions: Transaction[];
  totalBalance: number;
  totalIncome: number;
  totalExpenses: number;
  addNotification: (n: Omit<Notification, "id" | "date" | "read">) => void;
  markNotificationRead: (id: string) => void;
  unreadCount: number;
  sendSuggestionToUser: (userId: string, title: string, message: string) => void;
  marketData: TradeItem[];
}

const CATEGORIES: Category[] = ["Food", "Transport", "Entertainment", "Shopping", "Bills", "Salary", "Freelance", "Investment", "Health", "Education"];

const MOCK_MARKET_DATA: TradeItem[] = [
  { id: "1", symbol: "RELIANCE", name: "Reliance Industries", type: "stock", price: 2890.50, change: 34.20, changePercent: 1.20, volume: "12.3M" },
  { id: "2", symbol: "TCS", name: "Tata Consultancy", type: "stock", price: 3945.80, change: -28.50, changePercent: -0.72, volume: "8.1M" },
  { id: "3", symbol: "INFY", name: "Infosys Ltd.", type: "stock", price: 1678.25, change: 18.40, changePercent: 1.11, volume: "11.7M" },
  { id: "4", symbol: "BTC", name: "Bitcoin", type: "crypto", price: 5620000, change: 105000, changePercent: 1.89, volume: "42.8B" },
  { id: "5", symbol: "ETH", name: "Ethereum", type: "crypto", price: 293500, change: -3760, changePercent: -1.27, volume: "18.2B" },
  { id: "6", symbol: "NIFTYBEES", name: "Nifty 50 ETF", type: "etf", price: 245.60, change: 2.10, changePercent: 0.86, volume: "15.5M" },
  { id: "7", symbol: "HDFCBANK", name: "HDFC Bank", type: "stock", price: 1685.30, change: -12.40, changePercent: -0.73, volume: "9.2M" },
  { id: "8", symbol: "BHARTIARTL", name: "Bharti Airtel", type: "stock", price: 1520.75, change: 22.30, changePercent: 1.49, volume: "6.9M" },
  { id: "9", symbol: "GSEC2033", name: "Govt Bond 2033", type: "bond", price: 102.45, change: 0.12, changePercent: 0.12, volume: "2.2M" },
  { id: "10", symbol: "SOL", name: "Solana", type: "crypto", price: 12400, change: 702, changePercent: 6.02, volume: "3.1B" },
];

function generateMockTransactions(): Transaction[] {
  const descriptions: Record<Category, string[]> = {
    Food: ["Grocery shopping", "Restaurant dinner", "Coffee shop", "Food delivery"],
    Transport: ["Uber ride", "Gas station", "Bus pass", "Car maintenance"],
    Entertainment: ["Movie tickets", "Concert", "Streaming subscription", "Gaming"],
    Shopping: ["New clothes", "Electronics", "Home decor", "Books"],
    Bills: ["Electricity bill", "Internet bill", "Phone bill", "Water bill"],
    Salary: ["Monthly salary", "Bonus payment", "Overtime pay"],
    Freelance: ["Web design project", "Consulting fee", "Content writing"],
    Investment: ["Stock dividends", "Crypto gains", "Rental income"],
    Health: ["Gym membership", "Doctor visit", "Pharmacy", "Health insurance"],
    Education: ["Online course", "Books", "Workshop fee", "Certification"],
  };

  const txs: Transaction[] = [];
  const now = new Date();

  for (let i = 0; i < 50; i++) {
    const daysAgo = Math.floor(Math.random() * 180);
    const date = new Date(now);
    date.setDate(date.getDate() - daysAgo);

    const isIncome = Math.random() > 0.65;
    const category = isIncome
      ? (["Salary", "Freelance", "Investment"] as Category[])[Math.floor(Math.random() * 3)]
      : (["Food", "Transport", "Entertainment", "Shopping", "Bills", "Health", "Education"] as Category[])[Math.floor(Math.random() * 7)];

    const amount = isIncome
      ? Math.round((Math.random() * 80000 + 20000) * 100) / 100
      : Math.round((Math.random() * 5000 + 200) * 100) / 100;

    const descs = descriptions[category];

    txs.push({
      id: crypto.randomUUID(),
      date: date.toISOString().split("T")[0],
      amount,
      category,
      type: isIncome ? "income" : "expense",
      description: descs[Math.floor(Math.random() * descs.length)],
    });
  }

  return txs.sort((a, b) => b.date.localeCompare(a.date));
}

function generateMockPortfolio(): PortfolioItem[] {
  return [
    { id: "1", symbol: "RELIANCE", name: "Reliance Industries", quantity: 15, avgPrice: 2650, currentPrice: 2890.50, type: "stock" },
    { id: "2", symbol: "NIFTYBEES", name: "Nifty 50 ETF", quantity: 100, avgPrice: 220, currentPrice: 245.60, type: "etf" },
    { id: "3", symbol: "BTC", name: "Bitcoin", quantity: 0.05, avgPrice: 4500000, currentPrice: 5620000, type: "crypto" },
    { id: "4", symbol: "TCS", name: "Tata Consultancy", quantity: 10, avgPrice: 3600, currentPrice: 3945.80, type: "stock" },
    { id: "5", symbol: "GSEC2033", name: "Govt Bond 2033", quantity: 50, avgPrice: 100.50, currentPrice: 102.45, type: "bond" },
  ];
}

function generateMockUsers(): UserProfile[] {
  return [
    {
      id: "u1", name: "Alice Johnson", email: "alice@example.com",
      income: 85000, expenses: 42000, savings: 43000,
      transactions: generateMockTransactions().slice(0, 15),
      portfolio: [
        { id: "1", symbol: "RELIANCE", name: "Reliance Industries", quantity: 5, avgPrice: 2700, currentPrice: 2890.50, type: "stock" },
        { id: "2", symbol: "ETH", name: "Ethereum", quantity: 0.5, avgPrice: 250000, currentPrice: 293500, type: "crypto" },
      ],
    },
    {
      id: "u2", name: "Bob Smith", email: "bob@example.com",
      income: 62000, expenses: 51000, savings: 11000,
      transactions: generateMockTransactions().slice(0, 12),
      portfolio: [
        { id: "1", symbol: "NIFTYBEES", name: "Nifty 50 ETF", quantity: 50, avgPrice: 225, currentPrice: 245.60, type: "etf" },
      ],
    },
    {
      id: "u3", name: "Carol Davis", email: "carol@example.com",
      income: 120000, expenses: 68000, savings: 52000,
      transactions: generateMockTransactions().slice(0, 20),
      portfolio: [
        { id: "1", symbol: "TCS", name: "Tata Consultancy", quantity: 20, avgPrice: 3400, currentPrice: 3945.80, type: "stock" },
        { id: "2", symbol: "BTC", name: "Bitcoin", quantity: 0.02, avgPrice: 4200000, currentPrice: 5620000, type: "crypto" },
        { id: "3", symbol: "GSEC2033", name: "Govt Bond 2033", quantity: 30, avgPrice: 100, currentPrice: 102.45, type: "bond" },
      ],
    },
  ];
}

const STORAGE_KEY = "finfly-app-state";

function loadState(): Partial<AppState> {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  return {};
}

function saveState(state: Partial<AppState>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      transactions: state.transactions,
      darkMode: state.darkMode,
      notifications: state.notifications,
    }));
  } catch {}
}

const defaultFilters: Filters = {
  search: "",
  type: "all",
  category: "all",
  sortBy: "date",
  sortOrder: "desc",
};

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const saved = loadState();
  const [transactions, setTransactions] = useState<Transaction[]>(
    saved.transactions?.length ? saved.transactions : generateMockTransactions()
  );
  const [role, setRole] = useState<Role>("admin");
  const [filters, setFiltersState] = useState<Filters>(defaultFilters);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [darkMode, setDarkMode] = useState(saved.darkMode ?? false);
  const [notifications, setNotifications] = useState<Notification[]>(
    (saved as any).notifications?.length ? (saved as any).notifications : [
      { id: "n1", type: "info" as const, title: "Welcome to FinFly!", message: "Start tracking your finances and explore investment opportunities.", from: "System", date: new Date().toISOString().split("T")[0], read: false },
      { id: "n2", type: "suggestion" as const, title: "Investment Recommendation", message: "Based on your savings rate, consider allocating 20% to index funds like VOO for long-term growth.", from: "Admin", date: new Date().toISOString().split("T")[0], read: false },
    ]
  );
  const [portfolio] = useState<PortfolioItem[]>(generateMockPortfolio());
  const [mockUsers] = useState<UserProfile[]>(generateMockUsers());

  useEffect(() => {
    saveState({ transactions, darkMode, notifications });
  }, [transactions, darkMode, notifications]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const setFilters = useCallback((partial: Partial<Filters>) => {
    setFiltersState(prev => ({ ...prev, ...partial }));
  }, []);

  const addTransaction = useCallback((tx: Omit<Transaction, "id">) => {
    setTransactions(prev => [{ ...tx, id: crypto.randomUUID() }, ...prev]);
  }, []);

  const editTransaction = useCallback((id: string, updates: Partial<Transaction>) => {
    setTransactions(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  }, []);

  const deleteTransaction = useCallback((id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  }, []);

  const addNotification = useCallback((n: Omit<Notification, "id" | "date" | "read">) => {
    setNotifications(prev => [{
      ...n,
      id: crypto.randomUUID(),
      date: new Date().toISOString().split("T")[0],
      read: false,
    }, ...prev]);
  }, []);

  const markNotificationRead = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }, []);

  const sendSuggestionToUser = useCallback((userId: string, title: string, message: string) => {
    const user = mockUsers.find(u => u.id === userId);
    addNotification({
      type: "suggestion",
      title,
      message: `Sent to ${user?.name}: ${message}`,
      from: "Admin",
    });
  }, [mockUsers, addNotification]);

  const filteredTransactions = transactions.filter(t => {
    if (filters.type !== "all" && t.type !== filters.type) return false;
    if (filters.category !== "all" && t.category !== filters.category) return false;
    if (filters.search && !t.description.toLowerCase().includes(filters.search.toLowerCase()) && !t.category.toLowerCase().includes(filters.search.toLowerCase())) return false;
    return true;
  }).sort((a, b) => {
    const mul = filters.sortOrder === "asc" ? 1 : -1;
    if (filters.sortBy === "date") return mul * a.date.localeCompare(b.date);
    return mul * (a.amount - b.amount);
  });

  const totalIncome = transactions.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const totalExpenses = transactions.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0);
  const totalBalance = totalIncome - totalExpenses;
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <AppContext.Provider value={{
      transactions, role, filters, isAuthenticated, darkMode, notifications, portfolio, mockUsers,
      setRole, setFilters, addTransaction, editTransaction, deleteTransaction,
      login: (r: Role) => { setRole(r); setIsAuthenticated(true); },
      logout: () => setIsAuthenticated(false),
      toggleDarkMode: () => setDarkMode(p => !p),
      filteredTransactions, totalBalance, totalIncome, totalExpenses,
      addNotification, markNotificationRead, unreadCount, sendSuggestionToUser,
      marketData: MOCK_MARKET_DATA,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be inside AppProvider");
  return ctx;
}

export { CATEGORIES };
