
import React from "react";
import { CheckCircle, AlertCircle } from "lucide-react";

const SecurityInfo: React.FC = () => {
  return (
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
  );
};

export default SecurityInfo;
