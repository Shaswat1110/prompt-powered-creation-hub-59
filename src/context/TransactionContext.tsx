
import React, { createContext, useContext, useState, useEffect } from "react";
import { Transaction, Category } from "@/types";
import { useAuth } from "./AuthContext";

interface TransactionContextType {
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, "id" | "date">) => void;
  clearTransactions: () => void;
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

export const TransactionProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Load user's transactions when component mounts or user changes
  useEffect(() => {
    if (user) {
      const storedTransactions = localStorage.getItem(`transactions_${user.id}`);
      if (storedTransactions) {
        setTransactions(JSON.parse(storedTransactions));
      } else {
        setTransactions([]);
      }
    } else {
      setTransactions([]);
    }
  }, [user]);

  // Save transactions to localStorage when they change
  useEffect(() => {
    if (user) {
      localStorage.setItem(`transactions_${user.id}`, JSON.stringify(transactions));
    }
  }, [transactions, user]);

  const addTransaction = (transactionData: Omit<Transaction, "id" | "date">) => {
    const newTransaction: Transaction = {
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString(),
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
    <TransactionContext.Provider value={{ transactions, addTransaction, clearTransactions }}>
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
