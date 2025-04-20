
// We update imports and integrate SampleDataDownloader instead of SampleDataGenerator
import React, { useState } from "react";
import { FileUp } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useTransactions } from "@/context/TransactionContext";
import { parseCSV } from "@/utils/csvParser";
import FileUploadArea from "./FileUploadArea";
import ConnectionProgress from "./ConnectionProgress";
import SupportedFormats from "./SupportedFormats";
import SampleDataDownloader from "./SampleDataDownloader";

const FileUploadCard: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);

  const { addTransaction } = useTransactions();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  // Updated to handle CSV parsing only; show error for other formats for now
  const handleFileUpload = async (file: File) => {
    const fileExtension = file.name.split('.').pop()?.toLowerCase() || '';
    if (!["csv", "qfx", "ofx", "pdf"].includes(fileExtension)) {
      toast.error("Unsupported file type. Allowed: CSV, QFX, OFX, PDF");
      return;
    }

    if (fileExtension === "csv") {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const content = event.target.result as string;
          try {
            const transactions = parseCSV(content);

            if (transactions.length === 0) {
              toast.error("No valid transactions found in the CSV file");
              return;
            }

            let successCount = 0;
            transactions.forEach(transaction => {
              try {
                addTransaction(transaction);
                successCount++;
              } catch (err) {
                console.error("Failed to add transaction:", transaction, err);
              }
            });

            toast.success(`Successfully imported ${successCount} transactions`);
          } catch (error) {
            console.error("Error processing CSV file:", error);
            toast.error("Failed to process CSV file. Please check the format.");
          }
        }
      };

      reader.onerror = () => {
        toast.error("Error reading CSV file");
      };

      reader.readAsText(file);
    } else {
      toast.error(`Import for .${fileExtension} files is not supported yet. Please upload CSV.`);
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
          handleFileUpload(file);
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
          <span>Upload Transactions</span>
        </CardTitle>
        <CardDescription>
          Import your transaction data from files
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <FileUploadArea file={file} handleFileChange={handleFileChange} />

          {loading && <ConnectionProgress progress={progress} type="file" />}

          <Button 
            className="w-full bg-budget-primary hover:bg-budget-primary/90" 
            onClick={handleUpload}
            disabled={!file || loading}
          >
            Import Transactions
          </Button>

          <SupportedFormats />
          <SampleDataDownloader />
        </div>
      </CardContent>
    </Card>
  );
};

export default FileUploadCard;

