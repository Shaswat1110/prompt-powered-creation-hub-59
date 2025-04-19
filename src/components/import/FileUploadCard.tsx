
import React, { useState } from "react";
import { FileUp, FileText, CheckCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { useTransactions } from "@/context/TransactionContext";
import { categorizeTransaction } from "@/services/mockData";

const FileUploadCard = () => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);

  const { addTransaction } = useTransactions();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleFileUpload = async (file: File) => {
    if (!file.name.toLowerCase().endsWith('.csv')) {
      toast.error("Please upload a CSV file");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        const content = event.target.result as string;
        const lines = content.split('\n');
        
        const transactions = lines
          .filter(line => line.trim().length > 0)
          .slice(1)
          .map(line => {
            try {
              const [date, description, amount] = line.split(',').map(field => field.trim());
              const cleanAmount = amount.replace(/[^0-9.-]/g, '');
              const parsedAmount = parseFloat(cleanAmount);
              
              if (!date || !description || isNaN(parsedAmount)) {
                console.warn('Skipping invalid transaction:', line);
                return null;
              }

              const category = categorizeTransaction(description);
              
              return {
                date: new Date(date).toISOString().split('T')[0],
                description: description,
                amount: parsedAmount,
                category: category
              };
            } catch (error) {
              console.warn('Error parsing line:', line, error);
              return null;
            }
          })
          .filter(t => t !== null);

        transactions.forEach(transaction => {
          if (transaction) {
            addTransaction(transaction);
          }
        });

        toast.success(`Successfully imported ${transactions.length} transactions`);
      }
    };

    reader.onerror = () => {
      toast.error("Error reading file");
    };
    
    reader.readAsText(file);
  };

  const handleUpload = () => {
    if (!file) {
      toast.error("Please select a file to upload");
      return;
    }

    setLoading(true);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setLoading(false);
          handleFileUpload(file);
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  const fileFormats = [
    {
      name: "CSV (Comma-Separated Values)",
      description: "Most common format exported by banks and financial institutions"
    },
    {
      name: "QFX (Quicken Financial Exchange)",
      description: "Used by Quicken and other financial software"
    },
    {
      name: "OFX (Open Financial Exchange)",
      description: "XML-based format used by many banks"
    },
    {
      name: "PDF Bank Statements",
      description: "We can extract transaction data from PDF statements"
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileUp className="h-5 w-5 text-budget-primary" />
          <span>Upload Transactions</span>
        </CardTitle>
        <CardDescription>
          Import your transaction data from files
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center">
            <FileText className="h-10 w-10 mx-auto text-gray-400 mb-2" />
            <p className="text-sm text-gray-500 mb-2">
              Drag and drop your file here, or click to browse
            </p>
            <input
              type="file"
              accept=".csv,.ofx,.qfx,.pdf"
              className="hidden"
              id="file-upload"
              onChange={handleFileChange}
            />
            <label htmlFor="file-upload">
              <Button variant="outline" className="mx-auto" asChild>
                <span>Browse Files</span>
              </Button>
            </label>
            {file && (
              <p className="mt-2 text-sm text-budget-primary">
                {file.name} ({(file.size / 1024).toFixed(2)} KB)
              </p>
            )}
          </div>

          {loading && (
            <div className="space-y-2">
              <Progress value={progress} />
              <p className="text-sm text-gray-500 text-center">
                Processing file... {progress}%
              </p>
            </div>
          )}

          <Button 
            className="w-full bg-budget-primary hover:bg-budget-primary/90" 
            onClick={handleUpload}
            disabled={!file || loading}
          >
            Import Transactions
          </Button>

          <div className="pt-4">
            <h3 className="text-sm font-medium mb-2">Supported File Formats</h3>
            <div className="space-y-2">
              {fileFormats.map((format, index) => (
                <div key={index} className="flex gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">{format.name}</p>
                    <p className="text-xs text-gray-500">{format.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FileUploadCard;
