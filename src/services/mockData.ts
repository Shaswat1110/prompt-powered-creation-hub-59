import { Transaction, Category, CategorySpending, MonthlySpending, SavingsTip, Budget } from "@/types";

// Empty initial transactions
export const transactions: Transaction[] = [];

// Updated category definitions with valid Lucide icon names
export const categoryDetails = {
  "Shopping": { name: "Shopping", color: "bg-budget-primary", icon: "ShoppingCart", displayName: "Shopping" },
  "Mortgage & Rent": { name: "Mortgage & Rent", color: "bg-budget-housing", icon: "Home", displayName: "Mortgage & Rent" },
  "Restaurants": { name: "Restaurants", color: "bg-budget-food", icon: "Utensils", displayName: "Restaurants" },
  "Credit Card Payment": { name: "Credit Card Payment", color: "bg-budget-finance", icon: "CreditCard", displayName: "Credit Card Payment" },
  "Movies & DVDs": { name: "Movies & DVDs", color: "bg-budget-entertainment", icon: "Film", displayName: "Movies & DVDs" },
  "Home Improvement": { name: "Home Improvement", color: "bg-budget-housing", icon: "Wrench", displayName: "Home Improvement" },
  "Utilities": { name: "Utilities", color: "bg-budget-utilities", icon: "Zap", displayName: "Utilities" },
  "Music": { name: "Music", color: "bg-budget-entertainment", icon: "Music", displayName: "Music" },
  "Mobile Phone": { name: "Mobile Phone", color: "bg-budget-utilities", icon: "Smartphone", displayName: "Mobile Phone" },
  "Gas & Fuel": { name: "Gas & Fuel", color: "bg-budget-transport", icon: "Zap", displayName: "Gas & Fuel" },
  "Groceries": { name: "Groceries", color: "bg-budget-grocery", icon: "ShoppingCart", displayName: "Groceries" },
  "Paycheck": { name: "Paycheck", color: "bg-budget-income", icon: "DollarSign", displayName: "Paycheck" },
  "Fast Food": { name: "Fast Food", color: "bg-budget-food", icon: "Book", displayName: "Fast Food" },
  "Coffee Shops": { name: "Coffee Shops", color: "bg-budget-food", icon: "Coffee", displayName: "Coffee Shops" },
  "Internet": { name: "Internet", color: "bg-budget-utilities", icon: "Wifi", displayName: "Internet" },
  "Haircut": { name: "Haircut", color: "bg-budget-personal", icon: "Scissors", displayName: "Haircut" },
  "Alcohol & Bars": { name: "Alcohol & Bars", color: "bg-budget-entertainment", icon: "Book", displayName: "Alcohol & Bars" },
  "Auto Insurance": { name: "Auto Insurance", color: "bg-budget-transport", icon: "Shield", displayName: "Auto Insurance" },
  "Entertainment": { name: "Entertainment", color: "bg-budget-entertainment", icon: "Book", displayName: "Entertainment" },
  "Food & Dining": { name: "Food & Dining", color: "bg-budget-food", icon: "Book", displayName: "Food & Dining" },
  "Television": { name: "Television", color: "bg-budget-entertainment", icon: "Tv", displayName: "Television" },
  "Electronics & Software": { name: "Electronics & Software", color: "bg-budget-personal", icon: "Settings", displayName: "Electronics & Software" },
  "Transport": { name: "Transport", color: "bg-budget-transport", icon: "Zap", displayName: "Transport" },
  "Medical": { name: "Medical", color: "bg-budget-health", icon: "Book", displayName: "Medical" }
};

// Empty initial monthly spending data
export const monthlySpending: MonthlySpending[] = [];

// Empty initial category spending
export const categorySpending: CategorySpending[] = [];

// Add the missing savingsTips array
export const savingsTips: SavingsTip[] = [
  {
    id: "1",
    title: "Reduce Coffee Spending",
    description: "Try brewing coffee at home instead of buying at coffee shops. This can save you a significant amount each month.",
    potentialSavings: 75,
    difficulty: "easy"
  },
  {
    id: "2",
    title: "Optimize Streaming Services",
    description: "Review your streaming subscriptions and cancel ones you don't use regularly. Consider rotating services monthly.",
    potentialSavings: 35,
    difficulty: "easy"
  },
  {
    id: "3",
    title: "Meal Planning",
    description: "Plan your meals for the week and shop with a grocery list to reduce food waste and impulse purchases.",
    potentialSavings: 120,
    difficulty: "medium"
  },
  {
    id: "4",
    title: "Public Transportation",
    description: "Use public transportation or carpooling options when possible instead of driving alone.",
    potentialSavings: 150,
    difficulty: "medium"
  },
  {
    id: "5",
    title: "Refinance Loans",
    description: "Consider refinancing high-interest loans or consolidating debt to reduce monthly payments.",
    potentialSavings: 200,
    difficulty: "hard"
  }
];

// Update categorizeTransaction function with new categories
export function categorizeTransaction(description: string): Category {
  description = description.toLowerCase();
  
  if (description.includes("shop") || description.includes("store")) {
    return "Shopping";
  } else if (description.includes("rent") || description.includes("mortgage")) {
    return "Mortgage & Rent";
  } else if (description.includes("restaurant")) {
    return "Restaurants";
  } else if (description.includes("credit") || description.includes("card payment")) {
    return "Credit Card Payment";
  } else if (description.includes("movie") || description.includes("netflix")) {
    return "Movies & DVDs";
  } else if (description.includes("home") || description.includes("repair")) {
    return "Home Improvement";
  } else if (description.includes("electric") || description.includes("water") || description.includes("gas bill")) {
    return "Utilities";
  } else if (description.includes("spotify") || description.includes("music")) {
    return "Music";
  } else if (description.includes("phone") || description.includes("mobile")) {
    return "Mobile Phone";
  } else if (description.includes("gas station") || description.includes("fuel")) {
    return "Gas & Fuel";
  } else if (description.includes("grocery") || description.includes("supermarket")) {
    return "Groceries";
  } else if (description.includes("salary") || description.includes("paycheck")) {
    return "Paycheck";
  } else if (description.includes("mcdonalds") || description.includes("burger")) {
    return "Fast Food";
  } else if (description.includes("starbucks") || description.includes("coffee")) {
    return "Coffee Shops";
  } else if (description.includes("internet") || description.includes("wifi")) {
    return "Internet";
  } else if (description.includes("haircut") || description.includes("salon")) {
    return "Haircut";
  } else if (description.includes("bar") || description.includes("pub")) {
    return "Alcohol & Bars";
  } else if (description.includes("insurance") && description.includes("auto")) {
    return "Auto Insurance";
  } else if (description.includes("doctor") || description.includes("hospital")) {
    return "Medical";
  } else if (description.includes("bus") || description.includes("train")) {
    return "Transport";
  } else {
    return "Shopping"; // Default category
  }
}

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

export const savingsTipCategories = {
  highSpending: {
    food: {
      title: "Reduce Food Expenses",
      description: "Your food spending is higher than usual. Consider meal planning and cooking at home more often.",
      difficulty: "medium" as const,
      categories: ["Food & Dining", "Restaurants", "Fast Food", "Coffee Shops"]
    },
    entertainment: {
      title: "Optimize Entertainment Costs",
      description: "Look for free or low-cost entertainment options and review your subscription services.",
      difficulty: "easy" as const,
      categories: ["Entertainment", "Movies & DVDs", "Music", "Television"]
    },
    transport: {
      title: "Reduce Transportation Costs",
      description: "Consider using public transport, carpooling, or cycling for regular commutes.",
      difficulty: "medium" as const,
      categories: ["Transport", "Gas & Fuel", "Auto Insurance"]
    },
    shopping: {
      title: "Optimize Shopping Habits",
      description: "Try to buy items during sales, use coupons, and compare prices before purchasing.",
      difficulty: "easy" as const,
      categories: ["Shopping", "Electronics & Software"]
    }
  },
  recurring: {
    title: "Review Recurring Payments",
    description: "Analyze your subscription services and recurring bills for potential savings.",
    difficulty: "easy" as const
  },
  emergency: {
    title: "Build Emergency Fund",
    description: "Start saving for unexpected expenses by setting aside a portion of your income.",
    difficulty: "medium" as const
  }
};
