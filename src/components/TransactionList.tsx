import React from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import CategoryBadge from "@/components/CategoryBadge";
import { Transaction } from "@/types";
import { formatDistanceToNow } from "date-fns";
import { formatCurrency } from "@/lib/utils";

interface TransactionListProps {
  transactions: Transaction[];
  compact?: boolean;
}

const TransactionList: React.FC<TransactionListProps> = ({ 
  transactions,
  compact = false 
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return formatDistanceToNow(date, { addSuffix: true });
  };

  return (
    <div className="w-full overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Description</TableHead>
            {!compact && <TableHead>Category</TableHead>}
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction) => (
            <TableRow key={transaction.id}>
              <TableCell className="text-sm text-gray-500">
                {formatDate(transaction.date)}
              </TableCell>
              <TableCell className="flex items-center gap-2">
                {compact && <CategoryBadge category={transaction.category} size="sm" showLabel={false} />}
                <span className="font-medium">{transaction.description}</span>
              </TableCell>
              {!compact && (
                <TableCell>
                  <CategoryBadge category={transaction.category} />
                </TableCell>
              )}
              <TableCell className={`text-right font-medium ${transaction.amount > 0 ? 'text-red-500' : 'text-green-500'}`}>
                {formatCurrency(transaction.amount)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TransactionList;
