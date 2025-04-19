import React, { createContext, useContext, useState, useEffect } from "react";
import { Transaction, Category } from "@/types";
import { useAuth } from "./AuthContext";

interface TransactionContextType {
  transactions: Transaction[];
  monthlyIncome: number;
  addTransaction: (transaction: Omit<Transaction, "id">) => void;
  clearTransactions: () => void;
  setMonthlyIncome: (amount: number) => void;
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

export const TransactionProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [monthlyIncome, setMonthlyIncome] = useState<number>(0);

  useEffect(() => {
    if (user) {
      const storedTransactions = localStorage.getItem(`transactions_${user.id}`);
      const storedIncome = localStorage.getItem(`monthlyIncome_${user.id}`);
      
      if (storedTransactions) {
        setTransactions(JSON.parse(storedTransactions));
      }
      if (storedIncome) {
        setMonthlyIncome(JSON.parse(storedIncome));
      }
    } else {
      setTransactions([]);
      setMonthlyIncome(0);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      localStorage.setItem(`transactions_${user.id}`, JSON.stringify(transactions));
    }
  }, [transactions, user]);

  useEffect(() => {
    if (user) {
      localStorage.setItem(`monthlyIncome_${user.id}`, JSON.stringify(monthlyIncome));
    }
  }, [monthlyIncome, user]);

  const addTransaction = (transactionData: Omit<Transaction, "id">) => {
    const newTransaction: Transaction = {
      id: Math.random().toString(36).substr(2, 9),
      ...transactionData
    };

    setTransactions(prevTransactions => [...prevTransactions, newTransaction]);
  };

  const clearTransactions = () => {
    setTransactions([]);
    if (user) {
      localStorage.removeItem(`transactions_${user.id}`);
    }
  };

  return (
    <TransactionContext.Provider value={{ 
      transactions, 
      monthlyIncome,
      addTransaction, 
      clearTransactions,
      setMonthlyIncome
    }}>
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransactions = () => {
  const context = useContext(TransactionContext);
  if (context === undefined) {
    throw new Error("useTransactions must be used within a TransactionProvider");
  }
  return context;
};
