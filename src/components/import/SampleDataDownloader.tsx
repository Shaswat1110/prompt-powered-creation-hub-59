
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Download, FileText } from "lucide-react";
import { toast } from "sonner";

// Sample data strings for each format (small dummy data)
const sampleCSV = `Date,Description,Amount
04/01/2025,Starbucks Coffee,15.45
04/02/2025,Salary Deposit,-2500.00
`;

const sampleQFX = `
<?xml version="1.0" encoding="UTF-8"?>
<OFX>
  <SIGNONMSGSRSV1>
    <SONRS>
      <STATUS>
        <CODE>0</CODE>
        <SEVERITY>INFO</SEVERITY>
      </STATUS>
      <DTSERVER>20250420</DTSERVER>
      <LANGUAGE>ENG</LANGUAGE>
    </SONRS>
  </SIGNONMSGSRSV1>
  <BANKMSGSRSV1>
    <STMTTRNRS>
      <TRNUID>1001</TRNUID>
      <STATUS>
        <CODE>0</CODE>
        <SEVERITY>INFO</SEVERITY>
      </STATUS>
      <STMTRS>
        <CURDEF>USD</CURDEF>
        <BANKACCTFROM>
          <BANKID>123456789</BANKID>
          <ACCTID>987654321</ACCTID>
          <ACCTTYPE>CHECKING</ACCTTYPE>
        </BANKACCTFROM>
        <BANKTRANLIST>
          <STMTTRN>
            <TRNTYPE>DEBIT</TRNTYPE>
            <DTPOSTED>20250401</DTPOSTED>
            <TRNAMT>-15.45</TRNAMT>
            <NAME>Starbucks Coffee</NAME>
          </STMTTRN>
          <STMTTRN>
            <TRNTYPE>CREDIT</TRNTYPE>
            <DTPOSTED>20250402</DTPOSTED>
            <TRNAMT>2500.00</TRNAMT>
            <NAME>Salary Deposit</NAME>
          </STMTTRN>
        </BANKTRANLIST>
      </STMTRS>
    </STMTTRNRS>
  </BANKMSGSRSV1>
</OFX>
`;

const sampleOFX = sampleQFX; // OFX format is very similar to QFX

const samplePDF = "%PDF-1.4\n%âãÏÓ\n1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n2 0 obj\n<< /Type /Pages /Count 1 /Kids [3 0 R] >>\nendobj\n3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 300 144]\n/Contents 4 0 R >>\nendobj\n4 0 obj\n<< /Length 44 >>\nstream\nBT\n/F1 24 Tf\n100 100 Td\n(Sample PDF) Tj\nET\nendstream\nendobj\nxref\n0 5\n0000000000 65535 f \n0000000010 00000 n \n0000000079 00000 n \n0000000175 00000 n \n0000000274 00000 n \ntrailer\n<< /Size 5 /Root 1 0 R >>\nstartxref\n337\n%%EOF";

const samples = {
  csv: {
    name: "CSV",
    filename: "sample_transactions.csv",
    content: sampleCSV,
    type: "text/csv",
  },
  qfx: {
    name: "QFX",
    filename: "sample_transactions.qfx",
    content: sampleQFX,
    type: "application/x-qfx",
  },
  ofx: {
    name: "OFX",
    filename: "sample_transactions.ofx",
    content: sampleOFX,
    type: "application/x-ofx",
  },
  pdf: {
    name: "PDF",
    filename: "sample_statement.pdf",
    content: samplePDF,
    type: "application/pdf",
  },
};

const SampleDataDownloader: React.FC = () => {
  const [selectedFormat, setSelectedFormat] = useState<keyof typeof samples>("csv");

  const handleDownload = () => {
    const sample = samples[selectedFormat];
    if (!sample) {
      toast.error("Selected format is not supported");
      return;
    }

    const blob = new Blob([sample.content], { type: sample.type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", sample.filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success(`${sample.name} sample file downloaded.`);
  };

  return (
    <div className="mt-4 border-t pt-4">
      <p className="text-sm text-gray-600 mb-2">
        Need a sample bank statement? Select a format and download a sample file.
      </p>
      <div className="flex space-x-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <FileText className="h-4 w-4" />
              {samples[selectedFormat].name}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {Object.entries(samples).map(([key, sample]) => (
              <DropdownMenuItem
                key={key}
                onSelect={() => setSelectedFormat(key as keyof typeof samples)}
              >
                {sample.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <Button size="sm" className="flex items-center gap-1" onClick={handleDownload}>
          <Download className="h-4 w-4" />
          Download
        </Button>
      </div>
    </div>
  );
};

export default SampleDataDownloader;

