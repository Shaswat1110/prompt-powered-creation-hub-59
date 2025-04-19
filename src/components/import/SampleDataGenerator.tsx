
import React from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Download } from "lucide-react";

const SampleDataGenerator: React.FC = () => {
  const generateSampleCSV = () => {
    // Current date for reference
    const today = new Date();
    const lastMonth = new Date(today);
    lastMonth.setMonth(today.getMonth() - 1);
    
    // Create sample transactions from the past month
    const sampleData = [
      // Header row
      ["Date", "Description", "Amount"],
      
      // Expenses
      [formatDate(today, -2), "Starbucks Coffee", "15.45"],
      [formatDate(today, -3), "Amazon Purchase", "87.99"],
      [formatDate(today, -5), "Grocery Store", "135.27"],
      [formatDate(today, -7), "Gas Station", "45.00"],
      [formatDate(today, -10), "Netflix Subscription", "14.99"],
      [formatDate(today, -12), "Restaurant Dinner", "78.50"],
      [formatDate(today, -14), "Pharmacy", "22.49"],
      [formatDate(today, -15), "Mobile Phone Bill", "65.00"],
      
      // From previous month (to test filtering)
      [formatDate(lastMonth, -5), "Internet Bill", "75.00"],
      [formatDate(lastMonth, -8), "Electric Bill", "120.35"],
      
      // Income
      [formatDate(today, -1), "Salary Deposit", "-2500.00"],
    ];
    
    // Convert to CSV format
    const csvContent = sampleData.map(row => row.join(",")).join("\n");
    
    // Create download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "sample_transactions.csv");
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success("Sample CSV file generated successfully");
  };
  
  // Helper to format dates relative to the reference date
  const formatDate = (referenceDate: Date, dayOffset: number) => {
    const date = new Date(referenceDate);
    date.setDate(date.getDate() + dayOffset);
    return date.toLocaleDateString("en-US");
  };
  
  return (
    <div className="mt-4 border-t pt-4">
      <p className="text-sm text-gray-600 mb-2">
        Not sure what format to use? Generate a sample CSV file with transaction data.
      </p>
      <Button
        variant="outline"
        size="sm"
        className="w-full"
        onClick={generateSampleCSV}
      >
        <Download className="h-4 w-4 mr-2" />
        Download Sample CSV
      </Button>
    </div>
  );
};

export default SampleDataGenerator;
