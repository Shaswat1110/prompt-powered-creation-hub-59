
import React from "react";
import { FileUploadCard, BankConnectCard, ImportInfoCard } from "@/components/import";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileUp, CreditCard, Info } from "lucide-react";

const Import = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Import Transactions</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Connect your bank or upload transaction files
          </p>
        </div>
      </div>

      <Tabs defaultValue="upload" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="upload" className="flex items-center gap-2">
            <FileUp className="h-4 w-4" />
            <span>File Upload</span>
          </TabsTrigger>
          <TabsTrigger value="bank" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            <span>Bank Connection</span>
          </TabsTrigger>
          <TabsTrigger value="info" className="flex items-center gap-2">
            <Info className="h-4 w-4" />
            <span>How It Works</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="mt-0">
          <FileUploadCard />
        </TabsContent>

        <TabsContent value="bank" className="mt-0">
          <BankConnectCard />
        </TabsContent>

        <TabsContent value="info" className="mt-0">
          <ImportInfoCard />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Import;
