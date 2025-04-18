import { Transaction, Category, CategorySpending, MonthlySpending, SavingsTip, Budget } from "@/types";

// Empty initial transactions
export const transactions: Transaction[] = [];

// Updated category definitions with new categories
export const categoryDetails = {
  "Shopping": { name: "Shopping", color: "bg-budget-primary", icon: "ShoppingBag", displayName: "Shopping" },
  "Mortgage & Rent": { name: "Mortgage & Rent", color: "bg-budget-housing", icon: "Home", displayName: "Mortgage & Rent" },
  "Restaurants": { name: "Restaurants", color: "bg-budget-food", icon: "Utensils", displayName: "Restaurants" },
  "Credit Card Payment": { name: "Credit Card Payment", color: "bg-budget-finance", icon: "CreditCard", displayName: "Credit Card Payment" },
  "Movies & DVDs": { name: "Movies & DVDs", color: "bg-budget-entertainment", icon: "Film", displayName: "Movies & DVDs" },
  "Home Improvement": { name: "Home Improvement", color: "bg-budget-housing", icon: "Wrench", displayName: "Home Improvement" },
  "Utilities": { name: "Utilities", color: "bg-budget-utilities", icon: "Zap", displayName: "Utilities" },
  "Music": { name: "Music", color: "bg-budget-entertainment", icon: "Music", displayName: "Music" },
  "Mobile Phone": { name: "Mobile Phone", color: "bg-budget-utilities", icon: "Smartphone", displayName: "Mobile Phone" },
  "Gas & Fuel": { name: "Gas & Fuel", color: "bg-budget-transport", icon: "Fuel", displayName: "Gas & Fuel" },
  "Groceries": { name: "Groceries", color: "bg-budget-grocery", icon: "ShoppingCart", displayName: "Groceries" },
  "Paycheck": { name: "Paycheck", color: "bg-budget-income", icon: "Wallet", displayName: "Paycheck" },
  "Fast Food": { name: "Fast Food", color: "bg-budget-food", icon: "Pizza", displayName: "Fast Food" },
  "Coffee Shops": { name: "Coffee Shops", color: "bg-budget-food", icon: "Coffee", displayName: "Coffee Shops" },
  "Internet": { name: "Internet", color: "bg-budget-utilities", icon: "Wifi", displayName: "Internet" },
  "Haircut": { name: "Haircut", color: "bg-budget-personal", icon: "Scissors", displayName: "Haircut" },
  "Alcohol & Bars": { name: "Alcohol & Bars", color: "bg-budget-entertainment", icon: "Wine", displayName: "Alcohol & Bars" },
  "Auto Insurance": { name: "Auto Insurance", color: "bg-budget-transport", icon: "Shield", displayName: "Auto Insurance" },
  "Entertainment": { name: "Entertainment", color: "bg-budget-entertainment", icon: "Gamepad2", displayName: "Entertainment" },
  "Food & Dining": { name: "Food & Dining", color: "bg-budget-food", icon: "UtensilsCrossed", displayName: "Food & Dining" },
  "Television": { name: "Television", color: "bg-budget-entertainment", icon: "Tv", displayName: "Television" },
  "Electronics & Software": { name: "Electronics & Software", color: "bg-budget-personal", icon: "Laptop", displayName: "Electronics & Software" },
  "Transport": { name: "Transport", color: "bg-budget-transport", icon: "Car", displayName: "Transport" },
  "Medical": { name: "Medical", color: "bg-budget-health", icon: "Stethoscope", displayName: "Medical" }
};

// Empty initial monthly spending data
export const monthlySpending: MonthlySpending[] = [];

// Empty initial category spending
export const categorySpending: CategorySpending[] = [];

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
