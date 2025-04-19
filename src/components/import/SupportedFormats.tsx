
import React from "react";
import { CheckCircle } from "lucide-react";

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

const SupportedFormats: React.FC = () => {
  return (
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
  );
};

export default SupportedFormats;
