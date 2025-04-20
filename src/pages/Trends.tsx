import React, { useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart2, PieChart, TrendingUp } from "lucide-react";
import { startOfMonth, endOfMonth, isSameMonth, parseISO } from "date-fns";
import DateRangeSelector from "@/components/DateRangeSelector";
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
import { formatCurrency } from "@/lib/utils";

const Trends = () => {
  const { transactions, monthlyIncome } = useTransactions();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const monthlySpendingData = useMemo(() => {
    const monthlyData = new Map<string, number>();
    
    transactions.forEach(transaction => {
      const date = new Date(transaction.date);
      const monthKey = date.toLocaleString('default', { month: 'short', year: 'numeric' });
      const currentAmount = monthlyData.get(monthKey) || 0;
      monthlyData.set(monthKey, currentAmount + (transaction.amount > 0 ? transaction.amount : 0));
    });

    return Array.from(monthlyData.entries())
      .map(([month, amount]) => ({
        month,
        amount
      }))
      .sort((a, b) => {
        const dateA = new Date(a.month);
        const dateB = new Date(b.month);
        return dateA.getTime() - dateB.getTime();
      });
  }, [transactions]);

  const filteredTransactions = useMemo(() => {
    return transactions.filter(transaction => {
      const transactionDate = parseISO(transaction.date);
      return isSameMonth(transactionDate, selectedDate);
    });
  }, [transactions, selectedDate]);

  const categorySpendingData = useMemo(() => {
    const categoryData = new Map<string, number>();
    let totalSpending = 0;

    filteredTransactions.forEach(transaction => {
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
        percentage: totalSpending > 0 ? (amount / totalSpending) : 0
      }));
  }, [filteredTransactions]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Spending Trends</h1>
          <p className="text-gray-500 mt-1">Visualize and analyze your spending patterns</p>
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
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div>
                  <CardTitle>Category Breakdown</CardTitle>
                  <CardDescription>See how your spending is distributed</CardDescription>
                </div>
                <DateRangeSelector 
                  date={selectedDate}
                  onDateChange={setSelectedDate}
                />
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
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div>
                  <CardTitle>Top Spending Categories</CardTitle>
                  <CardDescription>Where most of your money goes</CardDescription>
                </div>
                <DateRangeSelector 
                  date={selectedDate}
                  onDateChange={setSelectedDate}
                />
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
