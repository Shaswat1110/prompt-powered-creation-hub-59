
import React from "react";
import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FileUploadAreaProps {
  file: File | null;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const FileUploadArea: React.FC<FileUploadAreaProps> = ({ file, handleFileChange }) => {
  return (
    <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center">
      <FileText className="h-10 w-10 mx-auto text-gray-400 mb-2" />
      <p className="text-sm text-gray-500 mb-2">
        Drag and drop your file here, or click to browse
      </p>
      <input
        type="file"
        accept=".csv,.ofx,.qfx,.pdf"
        className="hidden"
        id="file-upload"
        onChange={handleFileChange}
      />
      <label htmlFor="file-upload">
        <Button variant="outline" className="mx-auto" asChild>
          <span>Browse Files</span>
        </Button>
      </label>
      {file && (
        <p className="mt-2 text-sm text-budget-primary">
          {file.name} ({(file.size / 1024).toFixed(2)} KB)
        </p>
      )}
    </div>
  );
};

export default FileUploadArea;
