import React from "react";
import { LightbulbIcon, TrendingDown, DollarSign, Star } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { savingsTipCategories } from "@/services/mockData";
import { useTransactions } from "@/context/TransactionContext";
import { startOfMonth, endOfMonth, subMonths } from "date-fns";

const Savings = () => {
  const { transactions, monthlyIncome } = useTransactions();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getCurrentMonthSpending = () => {
    const now = new Date();
    const start = startOfMonth(now);
    const end = endOfMonth(now);
    
    return transactions.reduce((acc, transaction) => {
      const transactionDate = new Date(transaction.date);
      if (transactionDate >= start && transactionDate <= end && transaction.amount > 0) {
        acc[transaction.category] = (acc[transaction.category] || 0) + transaction.amount;
      }
      return acc;
    }, {} as Record<string, number>);
  };

  const getPreviousMonthSpending = () => {
    const lastMonth = subMonths(new Date(), 1);
    const start = startOfMonth(lastMonth);
    const end = endOfMonth(lastMonth);
    
    return transactions.reduce((acc, transaction) => {
      const transactionDate = new Date(transaction.date);
      if (transactionDate >= start && transactionDate <= end && transaction.amount > 0) {
        acc[transaction.category] = (acc[transaction.category] || 0) + transaction.amount;
      }
      return acc;
    }, {} as Record<string, number>);
  };

  const generateSavingsTips = () => {
    const currentSpending = getCurrentMonthSpending();
    const previousSpending = getPreviousMonthSpending();
    const tips: Array<{
      id: string;
      title: string;
      description: string;
      potentialSavings: number;
      difficulty: "easy" | "medium" | "hard";
    }> = [];

    Object.entries(savingsTipCategories.highSpending).forEach(([key, category]) => {
      const totalCurrentSpending = category.categories.reduce(
        (sum, cat) => sum + (currentSpending[cat] || 0),
        0
      );

      const totalPreviousSpending = category.categories.reduce(
        (sum, cat) => sum + (previousSpending[cat] || 0),
        0
      );

      if (totalCurrentSpending > totalPreviousSpending || totalCurrentSpending > (monthlyIncome * 0.2)) {
        tips.push({
          id: key,
          title: category.title,
          description: category.description,
          potentialSavings: Math.round(totalCurrentSpending * 0.3),
          difficulty: category.difficulty
        });
      }
    });

    const hasRecurringPayments = Object.entries(currentSpending).some(
      ([category, amount]) => Math.abs((previousSpending[category] || 0) - amount) < 5
    );

    if (hasRecurringPayments) {
      tips.push({
        id: "recurring",
        ...savingsTipCategories.recurring,
        potentialSavings: 50
      });
    }

    if (monthlyIncome > 0 && tips.length < 5) {
      tips.push({
        id: "emergency",
        ...savingsTipCategories.emergency,
        potentialSavings: Math.round(monthlyIncome * 0.1)
      });
    }

    return tips;
  };

  const savingsTips = generateSavingsTips();
  const totalPotentialSavings = savingsTips.reduce(
    (total, tip) => total + tip.potentialSavings,
    0
  );

  const difficultyColor = {
    easy: "bg-green-100 text-green-800",
    medium: "bg-yellow-100 text-yellow-800",
    hard: "bg-red-100 text-red-800",
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Savings Recommendations</h1>
          <p className="text-gray-500 mt-1">Smart suggestions to help you save money</p>
        </div>
        <div className="mt-4 md:mt-0 bg-budget-primary/10 px-4 py-2 rounded-md flex items-center">
          <DollarSign className="h-5 w-5 text-budget-primary mr-2" />
          <span className="text-budget-primary font-medium">
            Potential Monthly Savings: {formatCurrency(totalPotentialSavings)}
          </span>
        </div>
      </div>

      <Card className="bg-gradient-to-br from-budget-primary/10 to-budget-secondary/5 border-none">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="bg-white p-3 rounded-full">
              <LightbulbIcon className="h-8 w-8 text-yellow-400" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">Smart Savings Analysis</h3>
              <p className="text-gray-600 mt-1">
                Based on your spending patterns, we've identified several opportunities to save money. 
                Implementing all recommendations could save you up to {formatCurrency(totalPotentialSavings)} per month.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {savingsTips.map((tip) => (
          <Card key={tip.id} className="overflow-hidden transition-all hover:shadow-md">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{tip.title}</CardTitle>
                <Badge className={difficultyColor[tip.difficulty]}>
                  {tip.difficulty.charAt(0).toUpperCase() + tip.difficulty.slice(1)}
                </Badge>
              </div>
              <CardDescription>{tip.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium">Potential Savings</span>
                  <span className="text-budget-primary font-bold">
                    {formatCurrency(tip.potentialSavings)}/month
                  </span>
                </div>
                <div className="mb-4">
                  <Progress value={tip.potentialSavings / 10} className="h-2" />
                </div>
                <Button 
                  variant="outline" 
                  className="mt-2 border-budget-primary text-budget-primary hover:bg-budget-primary hover:text-white"
                >
                  Apply This Tip
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Long-term Savings Goals</CardTitle>
          <CardDescription>
            Set and track your financial goals
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <div>
                  <h3 className="font-medium">Emergency Fund</h3>
                  <p className="text-sm text-gray-500">3 months of expenses</p>
                </div>
                <span className="text-budget-primary font-bold">60% Complete</span>
              </div>
              <Progress value={60} className="h-2" />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <div>
                  <h3 className="font-medium">Vacation Savings</h3>
                  <p className="text-sm text-gray-500">Summer trip to Europe</p>
                </div>
                <span className="text-budget-primary font-bold">35% Complete</span>
              </div>
              <Progress value={35} className="h-2" />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <div>
                  <h3 className="font-medium">New Car Fund</h3>
                  <p className="text-sm text-gray-500">Down payment for new vehicle</p>
                </div>
                <span className="text-budget-primary font-bold">15% Complete</span>
              </div>
              <Progress value={15} className="h-2" />
            </div>
            
            <Button className="w-full bg-budget-primary hover:bg-budget-primary/90">
              <Star className="mr-2 h-4 w-4" /> Add New Savings Goal
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Savings;
