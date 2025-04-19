
import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface BankSelectProps {
  selectedBank: string;
  setSelectedBank: (bank: string) => void;
}

// List of supported banks
const banks = [
  { id: "chase", name: "Chase Bank" },
  { id: "bofa", name: "Bank of America" },
  { id: "wells", name: "Wells Fargo" },
  { id: "citi", name: "Citibank" },
  { id: "discover", name: "Discover" },
  { id: "capital", name: "Capital One" },
];

const BankSelect: React.FC<BankSelectProps> = ({ selectedBank, setSelectedBank }) => {
  return (
    <div>
      <label className="text-sm font-medium">Select Your Bank</label>
      <Select value={selectedBank} onValueChange={setSelectedBank}>
        <SelectTrigger>
          <SelectValue placeholder="Choose a bank..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">Choose a bank...</SelectItem>
          {banks.map((bank) => (
            <SelectItem key={bank.id} value={bank.id}>
              {bank.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default BankSelect;
