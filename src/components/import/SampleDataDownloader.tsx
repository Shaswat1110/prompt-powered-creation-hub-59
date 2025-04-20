
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Download, FileText } from "lucide-react";
import { toast } from "sonner";

// Enhanced sample data strings for each format with multiple transactions
const sampleCSV = `Date,Description,Amount
04/01/2025,Starbucks Coffee,15.45
04/02/2025,Salary Deposit,-2500.00
04/03/2025,Amazon Purchase,120.00
04/04/2025,Gas Station,40.50
04/05/2025,Restaurant Dinner,85.20
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
          <STMTTRN>
            <TRNTYPE>DEBIT</TRNTYPE>
            <DTPOSTED>20250403</DTPOSTED>
            <TRNAMT>-120.00</TRNAMT>
            <NAME>Amazon Purchase</NAME>
          </STMTTRN>
          <STMTTRN>
            <TRNTYPE>DEBIT</TRNTYPE>
            <DTPOSTED>20250404</DTPOSTED>
            <TRNAMT>-40.50</TRNAMT>
            <NAME>Gas Station</NAME>
          </STMTTRN>
          <STMTTRN>
            <TRNTYPE>DEBIT</TRNTYPE>
            <DTPOSTED>20250405</DTPOSTED>
            <TRNAMT>-85.20</TRNAMT>
            <NAME>Restaurant Dinner</NAME>
          </STMTTRN>
        </BANKTRANLIST>
      </STMTRS>
    </STMTTRNRS>
  </BANKMSGSRSV1>
</OFX>
`;

const sampleOFX = sampleQFX; // OFX format is very similar to QFX

const samplePDF = `%PDF-1.4
%âãÏÓ
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Count 1 /Kids [3 0 R] >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 300 144]
/Contents 4 0 R >>
endobj
4 0 obj
<< /Length 400 >>
stream
BT
/F1 18 Tf
10 120 Td
(04/01/2025 Starbucks Coffee $15.45) Tj
0 -18 Td
(04/02/2025 Salary Deposit -$2500.00) Tj
0 -18 Td
(04/03/2025 Amazon Purchase $120.00) Tj
0 -18 Td
(04/04/2025 Gas Station $40.50) Tj
0 -18 Td
(04/05/2025 Restaurant Dinner $85.20) Tj
ET
endstream
endobj
xref
0 5
0000000000 65535 f 
0000000010 00000 n 
0000000079 00000 n 
0000000175 00000 n 
0000000274 00000 n 
trailer
<< /Size 5 /Root 1 0 R >>
startxref
337
%%EOF`;

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
