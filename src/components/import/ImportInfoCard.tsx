
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface StepProps {
  number: number;
  title: string;
  description: string;
}

const ProcessStep: React.FC<StepProps> = ({ number, title, description }) => (
  <div className="border rounded-lg p-4">
    <div className="bg-budget-primary/10 rounded-full w-10 h-10 flex items-center justify-center mb-4">
      <span className="text-budget-primary font-bold">{number}</span>
    </div>
    <h3 className="font-medium mb-2">{title}</h3>
    <p className="text-sm text-gray-600">
      {description}
    </p>
  </div>
);

const ImportInfoCard: React.FC = () => {
  const steps = [
    {
      number: 1,
      title: "Import Data",
      description: "Upload your transaction files or connect your bank account to import your financial data."
    },
    {
      number: 2,
      title: "AI Categorization",
      description: "Our AI automatically categorizes your transactions based on their descriptions and patterns."
    },
    {
      number: 3,
      title: "Smart Analysis",
      description: "View detailed insights, spending trends, and receive personalized saving recommendations."
    }
  ];

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
          {steps.map((step) => (
            <ProcessStep
              key={step.number}
              number={step.number}
              title={step.title}
              description={step.description}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ImportInfoCard;
