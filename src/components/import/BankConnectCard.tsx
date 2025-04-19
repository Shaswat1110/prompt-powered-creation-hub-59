
import React, { useState } from "react";
import { FileUp, CheckCircle, AlertCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

const banks = [
  { id: "chase", name: "Chase Bank" },
  { id: "bofa", name: "Bank of America" },
  { id: "wells", name: "Wells Fargo" },
  { id: "citi", name: "Citibank" },
  { id: "discover", name: "Discover" },
  { id: "capital", name: "Capital One" },
];

const BankConnectCard = () => {
  const [selectedBank, setSelectedBank] = useState<string>("none");
  const [loading, setLoading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);

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

  return (
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
  );
};

export default BankConnectCard;
