import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Category } from "@/types";
import { useTransactions } from "@/context/TransactionContext";
import { categoryDetails } from "@/services/mockData";
import { useToast } from "@/components/ui/use-toast";
import { Plus } from "lucide-react";

const AddTransactionForm: React.FC = () => {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<Category>("Shopping"); // Changed from "other" to "Shopping"
  const [isExpense, setIsExpense] = useState(true);
  const { addTransaction } = useTransactions();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!description || !amount || !category) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid amount",
        variant: "destructive"
      });
      return;
    }

    // Add the transaction
    addTransaction({
      description,
      amount: isExpense ? parsedAmount : -parsedAmount, // Negative for income
      category
    });

    // Reset form
    setDescription("");
    setAmount("");
    setCategory("Shopping");
    setIsExpense(true);

    // Show success message
    toast({
      title: "Success",
      description: "Transaction added successfully",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Transaction</CardTitle>
        <CardDescription>Record a new expense or income</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Transaction Type</label>
            <div className="flex space-x-4">
              <Button
                type="button"
                variant={isExpense ? "default" : "outline"}
                onClick={() => setIsExpense(true)}
              >
                Expense
              </Button>
              <Button
                type="button"
                variant={!isExpense ? "default" : "outline"}
                onClick={() => setIsExpense(false)}
              >
                Income
              </Button>
            </div>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              Description
            </label>
            <Input
              id="description"
              placeholder="What was this for?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="amount" className="text-sm font-medium">
              Amount
            </label>
            <Input
              id="amount"
              type="number"
              min="0.01"
              step="0.01"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="category" className="text-sm font-medium">
              Category
            </label>
            <Select 
              value={category} 
              onValueChange={(value) => setCategory(value as Category)}
            >
              <SelectTrigger id="category">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(categoryDetails).map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {categoryDetails[cat as Category].displayName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full">
            <Plus className="mr-2 h-4 w-4" />
            Add {isExpense ? 'Expense' : 'Income'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default AddTransactionForm;
