
export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  category: Category;
  tags?: string[];
}

export type Category = 
  | "groceries" 
  | "utilities" 
  | "entertainment" 
  | "transport" 
  | "housing" 
  | "food" 
  | "health" 
  | "personal" 
  | "education" 
  | "other";

export interface CategoryDetails {
  name: Category;
  color: string;
  icon: string;
  displayName: string;
}

export interface MonthlySpending {
  month: string;
  amount: number;
}

export interface CategorySpending {
  category: Category;
  amount: number;
  percentage: number;
}

export interface SavingsTip {
  id: string;
  title: string;
  description: string;
  potentialSavings: number;
  difficulty: "easy" | "medium" | "hard";
}

export interface Budget {
  category: Category;
  limit: number;
  spent: number;
}
