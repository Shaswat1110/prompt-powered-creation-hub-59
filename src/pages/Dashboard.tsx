
import React from "react";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  CreditCard,
  DollarSign,
  Plus,
  TrendingDown,
  TrendingUp,
  Wallet,
} from "lucide-react";
import MonthlyIncomeDialog from "@/components/MonthlyIncomeDialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import StatCard from "@/components/StatCard";
import TransactionList from "@/components/TransactionList";
import { useTransactions } from "@/context/TransactionContext";
import AddTransactionForm from "@/components/AddTransactionForm";

const Dashboard = () => {
  const { transactions, monthlyIncome } = useTransactions();
  
  // Calculate total spending and income
  const totalSpent = transactions
    .filter(t => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0);
    
  const totalIncome = transactions
    .filter(t => t.amount < 0)
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);
    
  // Calculate remaining budget from monthly income
  const remainingBudget = monthlyIncome - totalSpent;
  const remainingBudgetPercentage = monthlyIncome > 0 
    ? ((monthlyIncome - totalSpent) / monthlyIncome * 100)
    : 0;

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  // Recent transactions
  const recentTransactions = transactions.slice(-5).reverse();

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold dark:text-white">Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Your financial overview</p>
        </div>
        <div className="flex items-center gap-4">
          <MonthlyIncomeDialog />
          <div className="bg-budget-primary/10 dark:bg-blue-900/30 px-4 py-2 rounded-md">
            <span className="text-budget-primary dark:text-blue-400 font-medium">
              {new Date().toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Spending"
          value={formatCurrency(totalSpent)}
          icon={<Wallet className="h-5 w-5" />}
          trend={transactions.length > 0 ? "up" : undefined}
          trendValue={transactions.length > 0 ? `${transactions.filter(t => t.amount > 0).length} expenses` : "No expenses yet"}
        />
        <StatCard
          title="Monthly Income"
          value={formatCurrency(monthlyIncome)}
          icon={<DollarSign className="h-5 w-5" />}
          description="Set your monthly income to track savings"
        />
        <StatCard
          title="Remaining Budget"
          value={formatCurrency(remainingBudget)}
          icon={<TrendingUp className="h-5 w-5" />}
          trend={remainingBudget > 0 ? "up" : "down"}
          trendValue={monthlyIncome > 0 ? `${Math.abs(remainingBudgetPercentage).toFixed(1)}% of income` : "Set monthly income"}
          description="Available to spend this month"
        />
        <StatCard
          title="Net Balance"
          value={formatCurrency(totalIncome - totalSpent)}
          icon={totalIncome > totalSpent ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />}
        />
        <StatCard
          title="Transactions"
          value={transactions.length.toString()}
          description="Total entries"
          icon={<CreditCard className="h-5 w-5" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>
                Your latest financial activity
              </CardDescription>
            </CardHeader>
            <CardContent>
              {transactions.length > 0 ? (
                <TransactionList transactions={recentTransactions} compact />
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 dark:text-gray-400">No transactions yet</p>
                  <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                    Add your first transaction to get started
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <AddTransactionForm />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
