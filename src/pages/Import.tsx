
import React from "react";
import FileUploadCard from "@/components/import/FileUploadCard";
import BankConnectCard from "@/components/import/BankConnectCard";
import ImportInfoCard from "@/components/import/ImportInfoCard";

const Import = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Import Transactions</h1>
          <p className="text-gray-500 mt-1">Connect your bank or upload transaction files</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FileUploadCard />
        <BankConnectCard />
      </div>

      <ImportInfoCard />
    </div>
  );
};

export default Import;
