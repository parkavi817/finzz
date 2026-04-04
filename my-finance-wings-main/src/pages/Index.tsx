import { useState } from "react";
import { useApp } from "@/context/AppContext";
import LoginPage from "./LoginPage";
import Dashboard from "./Dashboard";
import TradePage from "./TradePage";
import PortfolioPage from "./PortfolioPage";
import InvestmentsPage from "./InvestmentsPage";
import NotificationsPage from "./NotificationsPage";
import AdminUsersPage from "./AdminUsersPage";
import ProfilePage from "./ProfilePage";
import AppSidebar from "@/components/AppSidebar";
import FloatingChatbot from "@/components/FloatingChatbot";

export default function Index() {
  const { isAuthenticated, role } = useApp();
  const [currentPage, setCurrentPage] = useState("dashboard");

  if (!isAuthenticated) return <LoginPage />;

  const renderPage = () => {
    switch (currentPage) {
      case "trade": return <TradePage />;
      case "portfolio": return <PortfolioPage />;
      case "investments": return <InvestmentsPage />;
      case "notifications": return <NotificationsPage />;
      case "users": return role === "admin" ? <AdminUsersPage /> : <Dashboard />;
      case "profile": return <ProfilePage />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <AppSidebar currentPage={currentPage} onNavigate={setCurrentPage} />
      <main className="lg:ml-56 pt-16 lg:pt-0">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">
          {renderPage()}
        </div>
      </main>
      <FloatingChatbot />
    </div>
  );
}
