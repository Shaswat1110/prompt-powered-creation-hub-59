
import React from "react";
import { Progress } from "@/components/ui/progress";

interface ConnectionProgressProps {
  progress: number;
  type: "bank" | "file";
}

const ConnectionProgress: React.FC<ConnectionProgressProps> = ({ progress, type }) => {
  const statusText = type === "bank" ? "Connecting to bank..." : "Processing file...";
  
  return (
    <div className="space-y-2">
      <Progress value={progress} />
      <p className="text-sm text-gray-500 text-center">
        {statusText} {progress}%
      </p>
    </div>
  );
};

export default ConnectionProgress;
