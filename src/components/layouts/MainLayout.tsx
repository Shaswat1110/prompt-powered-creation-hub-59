
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  BarChart3,
  CreditCard,
  Home,
  PiggyBank,
  Menu,
  X,
  FileInput,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    {
      name: "Dashboard",
      path: "/",
      icon: <Home className="h-5 w-5" />,
    },
    {
      name: "Transactions",
      path: "/transactions",
      icon: <CreditCard className="h-5 w-5" />,
    },
    {
      name: "Trends",
      path: "/trends",
      icon: <BarChart3 className="h-5 w-5" />,
    },
    {
      name: "Savings",
      path: "/savings",
      icon: <PiggyBank className="h-5 w-5" />,
    },
    {
      name: "Import",
      path: "/import",
      icon: <FileInput className="h-5 w-5" />,
    },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Mobile sidebar toggle */}
      <div className="fixed top-4 left-4 z-40 md:hidden">
        <Button
          variant="outline"
          size="icon"
          className="bg-white shadow-md"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </Button>
      </div>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-30 w-64 transform bg-white shadow-lg transition-transform duration-300 md:relative md:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col">
          <div className="px-6 py-6">
            <h1 className="text-2xl font-bold text-budget-primary">
              MyBudgetAI
            </h1>
            <p className="text-sm text-gray-500">Smart Financial Assistant</p>
          </div>
          <nav className="flex-1 px-4 pb-4">
            <ul className="space-y-1">
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={cn(
                      "flex items-center rounded-md px-4 py-3 text-gray-700 hover:bg-gray-100",
                      location.pathname === item.path &&
                        "bg-budget-primary/10 font-medium text-budget-primary"
                    )}
                  >
                    {item.icon}
                    <span className="ml-3">{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="border-t border-gray-200 px-6 py-4">
            <p className="text-xs text-gray-500">
              &copy; {new Date().getFullYear()} MyBudgetAI
            </p>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="container mx-auto px-4 py-8 md:px-6">
          {children}
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
