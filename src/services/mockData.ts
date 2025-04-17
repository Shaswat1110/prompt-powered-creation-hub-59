
import { Transaction, Category, CategorySpending, MonthlySpending, SavingsTip, Budget } from "@/types";

// Mock transactions data
export const transactions: Transaction[] = [
  {
    id: "t1",
    date: "2025-04-15",
    description: "Grocery Store",
    amount: 85.42,
    category: "groceries",
  },
  {
    id: "t2",
    date: "2025-04-14",
    description: "Netflix Subscription",
    amount: 15.99,
    category: "entertainment",
  },
  {
    id: "t3",
    date: "2025-04-13",
    description: "Electric Bill",
    amount: 95.20,
    category: "utilities",
  },
  {
    id: "t4",
    date: "2025-04-12",
    description: "Gas Station",
    amount: 45.67,
    category: "transport",
  },
  {
    id: "t5",
    date: "2025-04-10",
    description: "Rent Payment",
    amount: 1200.00,
    category: "housing",
  },
  {
    id: "t6",
    date: "2025-04-08",
    description: "Dinner at Restaurant",
    amount: 65.30,
    category: "food",
  },
  {
    id: "t7",
    date: "2025-04-07",
    description: "Pharmacy",
    amount: 22.15,
    category: "health",
  },
  {
    id: "t8",
    date: "2025-04-05",
    description: "Clothing Store",
    amount: 87.95,
    category: "personal",
  },
  {
    id: "t9",
    date: "2025-04-03",
    description: "Online Course",
    amount: 49.99,
    category: "education",
  },
  {
    id: "t10",
    date: "2025-04-01",
    description: "Coffee Shop",
    amount: 4.75,
    category: "food",
  },
];

// Category definitions
export const categoryDetails = {
  groceries: { name: "groceries", color: "bg-budget-grocery", icon: "ShoppingCart", displayName: "Groceries" },
  utilities: { name: "utilities", color: "bg-budget-utilities", icon: "Zap", displayName: "Utilities" },
  entertainment: { name: "entertainment", color: "bg-budget-entertainment", icon: "Film", displayName: "Entertainment" },
  transport: { name: "transport", color: "bg-budget-transport", icon: "Car", displayName: "Transport" },
  housing: { name: "housing", color: "bg-budget-housing", icon: "Home", displayName: "Housing" },
  food: { name: "food", color: "bg-budget-food", icon: "Utensils", displayName: "Food & Dining" },
  health: { name: "health", color: "bg-budget-health", icon: "Activity", displayName: "Healthcare" },
  personal: { name: "personal", color: "bg-budget-personal", icon: "User", displayName: "Personal" },
  education: { name: "education", color: "bg-budget-education", icon: "BookOpen", displayName: "Education" },
  other: { name: "other", color: "bg-budget-other", icon: "Coffee", displayName: "Other" },
};

// Monthly spending data for charts
export const monthlySpending: MonthlySpending[] = [
  { month: "Jan", amount: 2580 },
  { month: "Feb", amount: 2350 },
  { month: "Mar", amount: 2790 },
  { month: "Apr", amount: 2670 },
  { month: "May", amount: 2450 },
  { month: "Jun", amount: 2380 },
];

// Category spending breakdown
export const categorySpending: CategorySpending[] = [
  { category: "housing", amount: 1200, percentage: 45 },
  { category: "groceries", amount: 450, percentage: 17 },
  { category: "utilities", amount: 320, percentage: 12 },
  { category: "transport", amount: 250, percentage: 9 },
  { category: "entertainment", amount: 180, percentage: 7 },
  { category: "food", amount: 120, percentage: 4 },
  { category: "health", amount: 80, percentage: 3 },
  { category: "other", amount: 70, percentage: 3 },
];

// Savings tips
export const savingsTips: SavingsTip[] = [
  {
    id: "tip1",
    title: "Reduce Dining Out",
    description: "You've spent $120 on dining out this month. Try cooking at home more often to save money.",
    potentialSavings: 60,
    difficulty: "medium",
  },
  {
    id: "tip2",
    title: "Entertainment Subscriptions",
    description: "Review your entertainment subscriptions and consider canceling those you don't use often.",
    potentialSavings: 30,
    difficulty: "easy",
  },
  {
    id: "tip3",
    title: "Utility Savings",
    description: "Your electricity bill seems higher than average. Try turning off lights and electronics when not in use.",
    potentialSavings: 25,
    difficulty: "easy",
  },
  {
    id: "tip4",
    title: "Grocery Shopping Strategy",
    description: "Create a shopping list before going to the grocery store to avoid impulse buys.",
    potentialSavings: 50,
    difficulty: "medium",
  },
  {
    id: "tip5",
    title: "Transportation Alternatives",
    description: "Consider using public transportation or carpooling for your daily commute.",
    potentialSavings: 45,
    difficulty: "hard",
  },
];

// Budget data
export const budgets: Budget[] = [
  { category: "groceries", limit: 500, spent: 450 },
  { category: "utilities", limit: 350, spent: 320 },
  { category: "entertainment", limit: 200, spent: 180 },
  { category: "transport", limit: 300, spent: 250 },
  { category: "food", limit: 150, spent: 120 },
];

// Get transactions with pagination
export function getTransactions(page: number = 1, limit: number = 5): Transaction[] {
  const start = (page - 1) * limit;
  const end = start + limit;
  return transactions.slice(start, end);
}

// Get total number of transactions
export function getTotalTransactions(): number {
  return transactions.length;
}

// Auto-categorize a transaction based on description
export function categorizeTransaction(description: string): Category {
  description = description.toLowerCase();
  
  if (description.includes("grocery") || description.includes("supermarket")) {
    return "groceries";
  } else if (description.includes("netflix") || description.includes("cinema") || description.includes("movie")) {
    return "entertainment";
  } else if (description.includes("electric") || description.includes("water") || description.includes("gas") || description.includes("bill")) {
    return "utilities";
  } else if (description.includes("gas station") || description.includes("uber") || description.includes("lyft")) {
    return "transport";
  } else if (description.includes("rent") || description.includes("mortgage")) {
    return "housing";
  } else if (description.includes("restaurant") || description.includes("cafe") || description.includes("coffee")) {
    return "food";
  } else if (description.includes("pharmacy") || description.includes("doctor") || description.includes("hospital")) {
    return "health";
  } else if (description.includes("clothing") || description.includes("salon")) {
    return "personal";
  } else if (description.includes("course") || description.includes("book") || description.includes("school")) {
    return "education";
  } else {
    return "other";
  }
}
