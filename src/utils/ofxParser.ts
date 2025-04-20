
// Simple parser for OFX files (XML-based, similar to QFX)
// Extracts transactions with fields: date, description, amount, category

import { Transaction } from "@/types";
import { categorizeTransaction } from "@/services/mockData";

const parseOFX = (content: string): Transaction[] => {
  const transactions: Transaction[] = [];
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, "text/xml");
    const stmtTrnList = [...doc.getElementsByTagName("STMTTRN")];

    stmtTrnList.forEach((trn) => {
      const dateRaw = trn.getElementsByTagName("DTPOSTED")[0]?.textContent || "";
      const desc = trn.getElementsByTagName("NAME")[0]?.textContent || "";
      const amountRaw = trn.getElementsByTagName("TRNAMT")[0]?.textContent || "0";

      // Parse date: OFX also uses YYYYMMDD or YYYYMMDDHHMMSS format
      let dateString = "";
      if (dateRaw.length >= 8) {
        const year = dateRaw.substr(0, 4);
        const month = dateRaw.substr(4, 2);
        const day = dateRaw.substr(6, 2);
        dateString = new Date(+year, +month - 1, +day).toISOString();
      } else {
        dateString = new Date().toISOString();
      }

      const amount = parseFloat(amountRaw);
      const category = categorizeTransaction(desc);

      transactions.push({
        date: dateString,
        description: desc,
        amount: Math.abs(amount), // expenses positive, income negative below
        category,
      });

      const incomeKeywords = ["deposit", "salary", "payroll", "payment from"];
      const isIncome = incomeKeywords.some(kw => desc.toLowerCase().includes(kw));
      if (isIncome && amount > 0) {
        transactions[transactions.length - 1].amount = -amount;
      }
    });
  } catch (e) {
    console.error("Failed to parse OFX content", e);
    return [];
  }

  return transactions;
};

export default parseOFX;
