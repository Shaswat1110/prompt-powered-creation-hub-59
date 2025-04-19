
import React, { useMemo } from "react";
import { Calendar, BarChart2, PieChart, TrendingUp } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend,
  LineChart,
  Line,
  CartesianGrid,
  AreaChart,
  Area,
  Pie,
  Cell,
  PieChart as RechartsPieChart
} from "recharts";
import { useTransactions } from "@/context/TransactionContext";
import { CategorySpending } from "@/types";

const Trends = () => {
  const { transactions } = useTransactions();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  // Calculate monthly spending data from actual transactions
  const monthlySpendingData = useMemo(() => {
    const monthlyData = new Map<string, number>();
    transactions.forEach(transaction => {
      const date = new Date(transaction.date);
      const monthKey = date.toLocaleString('default', { month: 'short' });
      const currentAmount = monthlyData.get(monthKey) || 0;
      monthlyData.set(monthKey, currentAmount + (transaction.amount > 0 ? transaction.amount : 0));
    });

    return Array.from(monthlyData.entries()).map(([month, amount]) => ({
      month,
      amount
    }));
  }, [transactions]);

  // Calculate category spending data from actual transactions
  const categorySpendingData = useMemo(() => {
    const categoryData = new Map<string, number>();
    let totalSpending = 0;

    transactions.forEach(transaction => {
      if (transaction.amount > 0) { // Only consider expenses
        const currentAmount = categoryData.get(transaction.category) || 0;
        categoryData.set(transaction.category, currentAmount + transaction.amount);
        totalSpending += transaction.amount;
      }
    });

    return Array.from(categoryData.entries())
      .map(([category, amount]) => ({
        category,
        amount,
        percentage: totalSpending > 0 ? (amount / totalSpending) : 0
      }));
  }, [transactions]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Spending Trends</h1>
          <p className="text-gray-500 mt-1">Visualize and analyze your spending patterns</p>
        </div>
        <div className="flex gap-4 mt-4 md:mt-0">
          <Select defaultValue="6months">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Time Period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1month">Last Month</SelectItem>
              <SelectItem value="3months">Last 3 Months</SelectItem>
              <SelectItem value="6months">Last 6 Months</SelectItem>
              <SelectItem value="1year">Last Year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="monthly" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="monthly" className="flex items-center gap-2">
            <BarChart2 className="h-4 w-4" />
            <span>Monthly</span>
          </TabsTrigger>
          <TabsTrigger value="categories" className="flex items-center gap-2">
            <PieChart className="h-4 w-4" />
            <span>Categories</span>
          </TabsTrigger>
          <TabsTrigger value="trends" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            <span>Trends</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="monthly" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Spending</CardTitle>
              <CardDescription>
                Track your spending month-by-month
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlySpendingData}>
                  <XAxis dataKey="month" />
                  <YAxis 
                    tickFormatter={(value) => `$${value}`}
                    width={80}
                  />
                  <Tooltip 
                    formatter={(value) => formatCurrency(Number(value))}
                  />
                  <Legend />
                  <Bar 
                    dataKey="amount" 
                    name="Spending" 
                    fill="#0075FF" 
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Category Breakdown</CardTitle>
                <CardDescription>
                  See how your spending is distributed
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Tooltip 
                      formatter={(value) => formatCurrency(Number(value))}
                      labelFormatter={(category) => {
                        return String(category).charAt(0).toUpperCase() + String(category).slice(1);
                      }}
                    />
                    <Legend layout="vertical" verticalAlign="middle" align="right" />
                    <Pie
                      data={categorySpendingData}
                      cx="50%"
                      cy="50%"
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="amount"
                      nameKey="category"
                      label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
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
                  </RechartsPieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Spending Categories</CardTitle>
                <CardDescription>
                  Where most of your money goes
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={categorySpendingData.sort((a, b) => b.amount - a.amount).slice(0, 5)}
                    layout="vertical"
                  >
                    <XAxis 
                      type="number" 
                      tickFormatter={(value) => `$${value}`}
                    />
                    <YAxis 
                      type="category" 
                      dataKey="category" 
                      width={100} 
                      tickFormatter={(value) => String(value).charAt(0).toUpperCase() + String(value).slice(1)}
                    />
                    <Tooltip 
                      formatter={(value) => formatCurrency(Number(value))}
                      labelFormatter={(category) => {
                        return String(category).charAt(0).toUpperCase() + String(category).slice(1);
                      }}
                    />
                    <Bar 
                      dataKey="amount" 
                      fill="#0075FF" 
                      radius={[0, 4, 4, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trends">
          <Card>
            <CardHeader>
              <CardTitle>Spending Trends</CardTitle>
              <CardDescription>
                Analyze your spending patterns over time
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlySpendingData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis 
                    tickFormatter={(value) => `$${value}`}
                    width={80}
                  />
                  <Tooltip 
                    formatter={(value) => formatCurrency(Number(value))}
                  />
                  <Legend />
                  <Area 
                    type="monotone" 
                    dataKey="amount" 
                    name="Spending" 
                    stroke="#0075FF"
                    fill="#0075FF" 
                    fillOpacity={0.2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Trends;
