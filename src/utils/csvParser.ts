
import { Category } from "@/types";
import { categorizeTransaction } from "@/services/mockData";

interface ParsedTransaction {
  date: string;
  description: string;
  amount: number;
  category: Category;
}

/**
 * Parse a CSV file from common bank statement formats
 * 
 * This parser is designed to handle multiple CSV formats from different banks:
 * - Standard format: Date,Description,Amount
 * - Will attempt to detect date, description and amount columns automatically
 * - Handles different date formats (MM/DD/YYYY, YYYY-MM-DD, DD/MM/YYYY)
 * - Detects income vs expenses based on amount sign or description keywords
 * 
 * @param content CSV file content as string
 * @returns Array of parsed transactions
 */
export const parseCSV = (content: string): ParsedTransaction[] => {
  try {
    const lines = content.split('\n');
    if (lines.length <= 1) {
      throw new Error("CSV file appears to be empty or invalid");
    }

    // Try to detect header to determine CSV format
    const header = lines[0].toLowerCase();
    const isDateFirst = header.includes('date') && header.split(',')[0].includes('date');
    const hasCategory = header.includes('category');
    
    // Skip header row (first line)
    return lines
      .filter(line => line.trim().length > 0)
      .slice(1)
      .map(line => {
        try {
          const parts = line.split(',').map(field => field.trim());
          
          // Handle different CSV formats
          // Common format: Date, Description, Amount
          if (parts.length >= 3) {
            let date, description, amount, categoryField;
            
            if (isDateFirst) {
              [date, description, amount, categoryField] = parts;
            } else {
              // Try to detect date column by format
              const dateIndex = parts.findIndex(part => 
                /^\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}$/.test(part) || 
                /^\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2}$/.test(part)
              );
              
              if (dateIndex >= 0) {
                date = parts[dateIndex];
                description = parts.find(p => p.length > 3 && !/^[\d.,\-$]+$/.test(p) && p !== date) || '';
                amount = parts.find(p => /^[\-$]?\d+(\.\d{2})?$/.test(p)) || '0';
              } else {
                // Fallback to assuming fixed positions
                [description, amount, date] = parts;
              }
            }
            
            // Clean up amount (remove currency symbols, handle negatives)
            const cleanAmount = amount.replace(/[^0-9.\-]/g, '');
            let parsedAmount = parseFloat(cleanAmount);
            
            // Some banks show expenses as negative, others as positive
            // Standardize: expenses are positive, income is negative
            // Check for common income-related keywords
            const isIncome = description.toLowerCase().includes('deposit') || 
                             description.toLowerCase().includes('salary') ||
                             description.toLowerCase().includes('payroll') ||
                             description.toLowerCase().includes('payment from');
                             
            if (isIncome && parsedAmount > 0) {
              parsedAmount = -parsedAmount;
            } else if (!isIncome && parsedAmount < 0) {
              parsedAmount = Math.abs(parsedAmount);
            }
            
            // Parse date (try different formats)
            let parsedDate: Date;
            try {
              parsedDate = new Date(date);
              if (isNaN(parsedDate.getTime())) {
                // Try DD/MM/YYYY format
                const [day, month, year] = date.split(/[\/\-]/).map(Number);
                parsedDate = new Date(year, month - 1, day);
              }
            } catch (e) {
              // Default to current date if parsing fails
              parsedDate = new Date();
            }
            
            // Use provided category or auto-categorize
            const category = hasCategory && categoryField ? 
              categoryField as Category : 
              categorizeTransaction(description);
            
            return {
              // Make sure we have a valid date, otherwise fall back to current date
              date: !isNaN(parsedDate.getTime()) ? 
                    parsedDate.toISOString() : 
                    new Date().toISOString(),
              description,
              amount: parsedAmount,
              category
            };
          }
          return null;
        } catch (error) {
          console.warn('Error parsing line:', line, error);
          return null;
        }
      })
      .filter((t): t is ParsedTransaction => t !== null);
  } catch (error) {
    console.error("Failed to parse CSV:", error);
    return [];
  }
};
