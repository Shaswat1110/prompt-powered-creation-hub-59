
import React, { useState } from "react";
import { FileUp } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import BankSelect from "./BankSelect";
import ConnectionProgress from "./ConnectionProgress";
import SecurityInfo from "./SecurityInfo";

const BankConnectCard: React.FC = () => {
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
          <BankSelect selectedBank={selectedBank} setSelectedBank={setSelectedBank} />

          {loading && <ConnectionProgress progress={progress} type="bank" />}

          <Button 
            className="w-full bg-budget-primary hover:bg-budget-primary/90" 
            onClick={handleBankConnect}
            disabled={selectedBank === "none" || loading}
          >
            Connect
          </Button>

          <Separator className="my-4" />

          <SecurityInfo />
        </div>
      </CardContent>
    </Card>
  );
};

export default BankConnectCard;
