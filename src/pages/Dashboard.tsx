
import React from "react";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  CreditCard,
  DollarSign,
  TrendingDown,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StatCard from "@/components/StatCard";
import TransactionList from "@/components/TransactionList";
import CategoryBadge from "@/components/CategoryBadge";
import { transactions, categorySpending, budgets } from "@/services/mockData";
import { ResponsiveContainer, PieChart, Pie, Cell, Legend, Tooltip } from "recharts";

const Dashboard = () => {
  // Total spending
  const totalSpent = transactions.reduce((sum, t) => sum + t.amount, 0);
  
  // Recent transactions
  const recentTransactions = transactions.slice(0, 5);

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  // Colors for pie chart
  const COLORS = [
    "#F44336", // housing - red
    "#4CAF50", // groceries - green
    "#FF9800", // utilities - orange
    "#2196F3", // transport - blue
    "#9C27B0", // entertainment - purple
    "#8BC34A", // food - light green
    "#E91E63", // health - pink
    "#607D8B", // other - blue-grey
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">Your financial overview</p>
        </div>
        <div className="bg-budget-primary/10 px-4 py-2 rounded-md mt-2 md:mt-0">
          <span className="text-budget-primary font-medium">April 17, 2025</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Spending"
          value={formatCurrency(totalSpent)}
          icon={<Wallet className="h-5 w-5" />}
          trend="down"
          trendValue="5.2% less than last month"
        />
        <StatCard
          title="Remaining Budget"
          value={formatCurrency(4000 - totalSpent)}
          icon={<DollarSign className="h-5 w-5" />}
          trend="up"
          trendValue="22% of budget left"
        />
        <StatCard
          title="Largest Expense"
          value={formatCurrency(1200)}
          description="Housing"
          icon={<TrendingUp className="h-5 w-5" />}
        />
        <StatCard
          title="Transactions"
          value={transactions.length}
          description="This month"
          icon={<CreditCard className="h-5 w-5" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>
              Your latest financial activity
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TransactionList transactions={recentTransactions} compact />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Spending by Category</CardTitle>
            <CardDescription>
              How your money is being spent
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categorySpending}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="amount"
                    nameKey="category"
                    label={({ category }) => categorySpending.find(c => c.category === category)?.percentage + '%'}
                    labelLine={false}
                  >
                    {categorySpending.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={COLORS[index % COLORS.length]} 
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => formatCurrency(Number(value))}
                    labelFormatter={(category) => {
                      const cat = categorySpending.find(c => c.category === category);
                      return cat ? cat.category.charAt(0).toUpperCase() + cat.category.slice(1) : '';
                    }}
                  />
                  <Legend 
                    verticalAlign="bottom" 
                    formatter={(category) => {
                      const cat = categorySpending.find(c => c.category === category);
                      return cat ? cat.category.charAt(0).toUpperCase() + cat.category.slice(1) : '';
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div>
        <Card>
          <CardHeader>
            <CardTitle>Budget Status</CardTitle>
            <CardDescription>
              Track your spending against budget limits
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {budgets.map((budget) => {
                const percentage = Math.round((budget.spent / budget.limit) * 100);
                return (
                  <div key={budget.category} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CategoryBadge category={budget.category} size="sm" />
                        <span>{formatCurrency(budget.spent)} spent of {formatCurrency(budget.limit)}</span>
                      </div>
                      <span className={`text-sm font-medium ${percentage > 90 ? 'text-red-500' : percentage > 75 ? 'text-amber-500' : 'text-green-500'}`}>
                        {percentage}%
                      </span>
                    </div>
                    <Progress value={percentage} className="h-2" />
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
