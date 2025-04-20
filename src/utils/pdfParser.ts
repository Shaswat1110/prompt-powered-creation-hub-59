
// We add the id field; also fix import of pdfjs-dist after installing it.

import { Transaction } from "@/types";
import { categorizeTransaction } from "@/services/mockData";
import * as pdfjsLib from "pdfjs-dist";

const generateId = () => Math.random().toString(36).substr(2, 9);

const parsePDF = async (file: File): Promise<Transaction[]> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

    let fullText = "";

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const strings = content.items.map((item: any) => item.str);
      fullText += strings.join(" ") + "\n";
    }

    // Simple regex to capture transactions: date in MM/DD/YYYY or YYYY-MM-DD, description, amount (currency numbers)
    const lines = fullText.split("\n");
    const transactions: Transaction[] = [];

    const regex = /(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})\s+(.+?)\s+(-?\$?\d+(\.\d{2})?)/;

    for (const line of lines) {
      const match = regex.exec(line);
      if (match) {
        const dateRaw = match[1];
        const description = match[2].trim();
        let amountRaw = match[3].replace(/[^0-9.\-]/g, ""); // remove $ and other chars
        let amount = parseFloat(amountRaw);

        const date = new Date(dateRaw);
        const dateString = !isNaN(date.getTime()) ? date.toISOString() : new Date().toISOString();

        const category = categorizeTransaction(description);

        // Standardize sign: income -> negative; expenses -> positive
        const incomeKeywords = ["deposit", "salary", "payroll", "payment from"];
        const isIncome = incomeKeywords.some(kw => description.toLowerCase().includes(kw));
        if (isIncome && amount > 0) {
          amount = -amount;
        } else if (!isIncome && amount < 0) {
          amount = Math.abs(amount);
        }

        transactions.push({
          id: generateId(),
          date: dateString,
          description,
          amount,
          category,
        });
      }
    }

    return transactions;
  } catch (error) {
    console.error("Failed to parse PDF file", error);
    return [];
  }
};

export default parsePDF;

