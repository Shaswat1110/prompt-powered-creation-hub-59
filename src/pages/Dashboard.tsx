import React, { useMemo } from "react";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  CreditCard,
  DollarSign,
  Plus,
  TrendingDown,
  TrendingUp,
  Wallet,
  BarChart2,
  IndianRupee,
} from "lucide-react";
import MonthlyIncomeDialog from "@/components/MonthlyIncomeDialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import StatCard from "@/components/StatCard";
import TransactionList from "@/components/TransactionList";
import { useTransactions } from "@/context/TransactionContext";
import AddTransactionForm from "@/components/AddTransactionForm";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import { format } from "date-fns";
import { formatCurrency } from "@/lib/utils";

const Dashboard = () => {
  const { transactions, monthlyIncome, setMonthlyIncome } = useTransactions();
  
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const currentMonthTransactions = useMemo(() => {
    return transactions.filter(transaction => {
      try {
        const transactionDate = new Date(transaction.date);
        return (
          transactionDate.getMonth() === currentMonth &&
          transactionDate.getFullYear() === currentYear
        );
      } catch (error) {
        console.warn("Invalid transaction date", transaction.date);
        return false;
      }
    });
  }, [transactions, currentMonth, currentYear]);
  
  const totalSpent = currentMonthTransactions
    .filter(t => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0);
    
  const totalIncome = currentMonthTransactions
    .filter(t => t.amount < 0)
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);
    
  const remainingBudget = monthlyIncome - totalSpent;
  const remainingBudgetPercentage = monthlyIncome > 0 
    ? ((monthlyIncome - totalSpent) / monthlyIncome * 100)
    : 0;

  const recentTransactions = transactions.slice(-5).reverse();

  const spendingTrendsData = useMemo(() => {
    const dailySpending = new Map();
    
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
    
    for (let day = 1; day <= lastDayOfMonth.getDate(); day++) {
      const date = new Date(currentYear, currentMonth, day);
      if (date <= currentDate) {
        const formattedDate = format(date, 'dd');
        dailySpending.set(formattedDate, 0);
      }
    }
    
    currentMonthTransactions.forEach(transaction => {
      if (transaction.amount > 0) {
        const transactionDate = new Date(transaction.date);
        const formattedDate = format(transactionDate, 'dd');
        const currentAmount = dailySpending.get(formattedDate) || 0;
        dailySpending.set(formattedDate, currentAmount + transaction.amount);
      }
    });
    
    return Array.from(dailySpending.entries())
      .map(([date, amount]) => ({
        date,
        amount
      }));
  }, [currentMonthTransactions, currentMonth, currentYear, currentDate]);

  const categorySpendingData = useMemo(() => {
    const categoryData = new Map();
    let totalSpending = 0;
    
    currentMonthTransactions.forEach(transaction => {
      if (transaction.amount > 0) {
        const currentAmount = categoryData.get(transaction.category) || 0;
        categoryData.set(transaction.category, currentAmount + transaction.amount);
        totalSpending += transaction.amount;
      }
    });
    
    return Array.from(categoryData.entries())
      .map(([category, amount]) => ({
        category,
        amount,
        percentage: totalSpending > 0 ? (amount / totalSpending) * 100 : 0
      }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);
  }, [currentMonthTransactions]);

  const currentMonthName = new Date().toLocaleString('default', { month: 'long' });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold dark:text-white">Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Your financial overview</p>
        </div>
        <div className="flex items-center gap-4">
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
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <MonthlyIncomeDialog />
        {monthlyIncome > 0 && (
          <div className="mt-3 md:mt-0 bg-green-100 dark:bg-green-900/30 px-4 py-2 rounded-md flex items-center">
            <Wallet className="mr-2 h-4 w-4 text-green-600 dark:text-green-400" />
            <span className="text-green-600 dark:text-green-400 font-medium">
              This Month's Savings: {formatCurrency(monthlyIncome - totalSpent)}
            </span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Spending"
          value={formatCurrency(totalSpent)}
          icon={<Wallet className="h-5 w-5" />}
          trend={currentMonthTransactions.length > 0 ? "up" : undefined}
          trendValue={currentMonthTransactions.length > 0 ? `${currentMonthTransactions.filter(t => t.amount > 0).length} expenses` : "No expenses yet"}
          description={`For ${currentMonthName}`}
        />
        <StatCard
          title="Monthly Income"
          value={formatCurrency(monthlyIncome)}
          icon={<IndianRupee className="h-5 w-5" />}
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
          description={`For ${currentMonthName}`}
        />
        <StatCard
          title="Transactions"
          value={transactions.length.toString()}
          description="Total entries"
          icon={<CreditCard className="h-5 w-5" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Daily Spending</CardTitle>
              <CardDescription>
                {`Daily spending trends for ${currentMonthName}`}
              </CardDescription>
            </div>
            <BarChart2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="h-[300px]">
            {spendingTrendsData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={spendingTrendsData}>
                  <XAxis dataKey="date" />
                  <YAxis 
                    tickFormatter={(value) => `₹${value}`}
                    width={80}
                  />
                  <Tooltip 
                    formatter={(value) => formatCurrency(Number(value))}
                  />
                  <Bar 
                    dataKey="amount" 
                    name="Spending" 
                    fill="#0075FF" 
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground">No spending data for this month yet</p>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Top Categories</CardTitle>
              <CardDescription>
                {`Where your money went in ${currentMonthName}`}
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="h-[300px]">
            {categorySpendingData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip 
                    formatter={(value) => formatCurrency(Number(value))}
                    labelFormatter={(category) => {
                      return String(category).charAt(0).toUpperCase() + String(category).slice(1);
                    }}
                  />
                  <Pie
                    data={categorySpendingData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    fill="#8884d8"
                    dataKey="amount"
                    nameKey="category"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {categorySpendingData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={[
                          "#F44336", "#4CAF50", "#FF9800", "#2196F3", 
                          "#9C27B0", "#8BC34A", "#E91E63", "#607D8B"
                        ][index % 8]} 
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground">No category data for this month yet</p>
              </div>
            )}
          </CardContent>
        </Card>

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
