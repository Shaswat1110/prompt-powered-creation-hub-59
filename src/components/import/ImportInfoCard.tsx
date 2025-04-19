
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const ImportInfoCard = () => {
  return (
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
  );
};

export default ImportInfoCard;
