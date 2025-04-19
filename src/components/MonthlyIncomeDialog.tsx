
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTransactions } from "@/context/TransactionContext";
import { useToast } from "@/components/ui/use-toast";
import { DollarSign } from "lucide-react";

const MonthlyIncomeDialog = () => {
  const { monthlyIncome, setMonthlyIncome } = useTransactions();
  const [income, setIncome] = useState(monthlyIncome.toString());
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  
  // Update local state if context value changes
  useEffect(() => {
    setIncome(monthlyIncome.toString());
  }, [monthlyIncome]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedIncome = parseFloat(income);
    
    if (isNaN(parsedIncome) || parsedIncome < 0) {
      toast({
        title: "Error",
        description: "Please enter a valid income amount",
        variant: "destructive"
      });
      return;
    }

    setMonthlyIncome(parsedIncome);
    setOpen(false);
    toast({
      title: "Success",
      description: "Monthly income updated successfully",
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="mb-4">
          <DollarSign className="mr-2 h-4 w-4" />
          Set Monthly Income
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Set Monthly Income</DialogTitle>
          <DialogDescription>
            Set your monthly income to track savings and expenses better.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="income" className="text-sm font-medium">
              Monthly Income
            </label>
            <Input
              id="income"
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              value={income}
              onChange={(e) => setIncome(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full">
            Save Monthly Income
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default MonthlyIncomeDialog;
