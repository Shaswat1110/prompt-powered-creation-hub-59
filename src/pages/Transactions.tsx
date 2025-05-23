
import React, { useState } from "react";
import { Search, Filter, Plus, ArrowUpZA, ArrowDownAZ } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import TransactionList from "@/components/TransactionList";
import { categoryDetails } from "@/services/mockData";
import { Category, Transaction } from "@/types";
import { useTransactions } from "@/context/TransactionContext";
import { 
  Dialog, 
  DialogContent, 
  DialogTitle, 
  DialogDescription,
  DialogHeader
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import AddTransactionForm from "@/components/AddTransactionForm";

type SortOption = "date-desc" | "date-asc" | "amount-desc" | "amount-asc";

const Transactions = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Category | "all">("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>("date-desc");
  const { transactions } = useTransactions();
  
  // Filter and sort transactions
  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = searchTerm === "" || 
      transaction.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === "all" || transaction.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  }).sort((a: Transaction, b: Transaction) => {
    switch (sortBy) {
      case "date-desc":
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      case "date-asc":
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      case "amount-desc":
        return b.amount - a.amount;
      case "amount-asc":
        return a.amount - b.amount;
      default:
        return 0;
    }
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold dark:text-white">Transactions</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">View and manage your financial activities</p>
        </div>
        <Button 
          className="mt-4 md:mt-0 bg-budget-primary hover:bg-budget-primary/90 dark:bg-blue-600 dark:hover:bg-blue-700"
          onClick={() => setIsAddDialogOpen(true)}
        >
          <Plus className="mr-2 h-4 w-4" /> Add Transaction
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>
            Browse through all your transactions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search transactions..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Select 
                value={selectedCategory} 
                onValueChange={(value) => setSelectedCategory(value as Category | "all")}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {Object.keys(categoryDetails).map((category) => (
                    <SelectItem key={category} value={category}>
                      {categoryDetails[category as Category].displayName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-white dark:bg-gray-800">
                  <DropdownMenuItem onClick={() => setSortBy("date-desc")}>
                    <ArrowDownAZ className="mr-2 h-4 w-4" />
                    Newest First
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy("date-asc")}>
                    <ArrowUpZA className="mr-2 h-4 w-4" />
                    Oldest First
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy("amount-desc")}>
                    <ArrowDownAZ className="mr-2 h-4 w-4" />
                    Highest Amount
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy("amount-asc")}>
                    <ArrowUpZA className="mr-2 h-4 w-4" />
                    Lowest Amount
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {filteredTransactions.length > 0 ? (
            <TransactionList transactions={filteredTransactions} />
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">No transactions found</p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                {searchTerm || selectedCategory !== "all" 
                  ? "Try changing your search or filter settings" 
                  : "Add your first transaction to get started"}
              </p>
              {!searchTerm && selectedCategory === "all" && (
                <Button 
                  className="mt-4"
                  onClick={() => setIsAddDialogOpen(true)}
                >
                  <Plus className="mr-2 h-4 w-4" /> Add Transaction
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Transaction</DialogTitle>
            <DialogDescription>
              Enter the details of your transaction below
            </DialogDescription>
          </DialogHeader>
          <AddTransactionForm />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Transactions;
