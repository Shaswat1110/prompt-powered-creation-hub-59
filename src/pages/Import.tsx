import React, { useState } from "react";
import { FileUp, FileText, CheckCircle, AlertCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { categorizeTransaction } from "@/services/mockData";
import { toast } from "sonner";

const Import = () => {
  const [selectedBank, setSelectedBank] = useState<string>("none");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
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
          toast.success("Transactions imported successfully!");
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  const handleBankConnect = () => {
    if (selectedBank === "none") {
      toast.error("Please select a bank to connect");
      return;
    }

    setLoading(true);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setLoading(false);
          toast.success(`Connected to ${selectedBank} successfully!`);
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  const handleFileUpload = async (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        const content = event.target.result as string;
        const lines = content.split('\n');
        
        const transactions = lines.slice(1).map(line => {
          const [date, description, amount] = line.split(',');
          const category = categorizeTransaction(description);
          
          return {
            date: date,
            description: description,
            amount: parseFloat(amount),
            category: category
          };
        }).filter(t => !isNaN(t.amount));

        console.log('Parsed transactions:', transactions);
        toast.success(`Successfully parsed ${transactions.length} transactions`);
      }
    };
    
    reader.readAsText(file);
  };

  const banks = [
    { id: "chase", name: "Chase Bank" },
    { id: "bofa", name: "Bank of America" },
    { id: "wells", name: "Wells Fargo" },
    { id: "citi", name: "Citibank" },
    { id: "discover", name: "Discover" },
    { id: "capital", name: "Capital One" },
  ];

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
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Import Transactions</h1>
          <p className="text-gray-500 mt-1">Connect your bank or upload transaction files</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileUp className="h-5 w-5 text-budget-primary" />
              <span>Connect Bank Account</span>
            </CardTitle>
            <CardDescription>
              Securely connect your bank for automatic import
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Select Your Bank</label>
                <Select value={selectedBank} onValueChange={setSelectedBank}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a bank..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Choose a bank...</SelectItem>
                    {banks.map((bank) => (
                      <SelectItem key={bank.id} value={bank.id}>
                        {bank.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {loading && (
                <div className="space-y-2">
                  <Progress value={progress} />
                  <p className="text-sm text-gray-500 text-center">
                    Connecting to bank... {progress}%
                  </p>
                </div>
              )}

              <Button 
                className="w-full bg-budget-primary hover:bg-budget-primary/90" 
                onClick={handleBankConnect}
                disabled={selectedBank === "none" || loading}
              >
                Connect
              </Button>

              <Separator className="my-4" />

              <div>
                <h3 className="text-sm font-medium mb-2">Security Information</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                    <p>Bank-level 256-bit encryption</p>
                  </div>
                  <div className="flex gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                    <p>Read-only access to your transactions</p>
                  </div>
                  <div className="flex gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                    <p>Your credentials are never stored</p>
                  </div>
                  <div className="flex gap-2">
                    <AlertCircle className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
                    <p>You can disconnect at any time</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>How It Works</CardTitle>
          <CardDescription>
            Our AI-powered transaction categorization process
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border rounded-lg p-4">
              <div className="bg-budget-primary/10 rounded-full w-10 h-10 flex items-center justify-center mb-4">
                <span className="text-budget-primary font-bold">1</span>
              </div>
              <h3 className="font-medium mb-2">Import Data</h3>
              <p className="text-sm text-gray-600">
                Upload your transaction files or connect your bank account to import your financial data.
              </p>
            </div>
            <div className="border rounded-lg p-4">
              <div className="bg-budget-primary/10 rounded-full w-10 h-10 flex items-center justify-center mb-4">
                <span className="text-budget-primary font-bold">2</span>
              </div>
              <h3 className="font-medium mb-2">AI Categorization</h3>
              <p className="text-sm text-gray-600">
                Our AI automatically categorizes your transactions based on their descriptions and patterns.
              </p>
            </div>
            <div className="border rounded-lg p-4">
              <div className="bg-budget-primary/10 rounded-full w-10 h-10 flex items-center justify-center mb-4">
                <span className="text-budget-primary font-bold">3</span>
              </div>
              <h3 className="font-medium mb-2">Smart Analysis</h3>
              <p className="text-sm text-gray-600">
                View detailed insights, spending trends, and receive personalized saving recommendations.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Import;
