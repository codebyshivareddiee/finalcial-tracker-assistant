import React, { useState } from 'react';
import { useMobile } from '@/hooks/use-mobile';
import CategoryBadge from '@/components/ui/category-badge';
import { formatCurrency } from '@/lib/utils/format-currency';
import { formatDate } from '@/lib/utils/date-utils';
import { apiRequest } from '@/lib/queryClient';
import { queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Expense {
  id: number;
  date: string;
  amount: number;
  category: string;
  note?: string;
  paymentMethod?: string;
}

interface ExpenseTableProps {
  expenses: Expense[];
  isLoading: boolean;
}

const ExpenseTable: React.FC<ExpenseTableProps> = ({ expenses, isLoading }) => {
  const isMobile = useMobile();
  const { toast } = useToast();
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'ascending' | 'descending' } | null>(null);

  const handleSort = (key: string) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    
    if (sortConfig && sortConfig.key === key) {
      direction = sortConfig.direction === 'ascending' ? 'descending' : 'ascending';
    }
    
    setSortConfig({ key, direction });
  };

  const sortedExpenses = React.useMemo(() => {
    if (!sortConfig) return expenses;
    
    return [...expenses].sort((a, b) => {
      if (sortConfig.key === 'date') {
        return sortConfig.direction === 'ascending'
          ? new Date(a.date).getTime() - new Date(b.date).getTime()
          : new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      
      if (sortConfig.key === 'amount') {
        return sortConfig.direction === 'ascending'
          ? a.amount - b.amount
          : b.amount - a.amount;
      }
      
      return 0;
    });
  }, [expenses, sortConfig]);

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        await apiRequest('DELETE', `/api/expenses/${id}`, undefined);
        
        toast({
          title: 'Expense deleted',
          description: 'The expense has been successfully deleted.',
        });
        
        // Invalidate the expenses query to refetch expenses
        queryClient.invalidateQueries({ queryKey: ['/api/expenses'] });
        queryClient.invalidateQueries({ queryKey: ['/api/summary'] });
      } catch (error) {
        console.error('Error deleting expense:', error);
        toast({
          title: 'Error',
          description: 'Failed to delete expense. Please try again.',
          variant: 'destructive',
        });
      }
    }
  };

  if (isLoading) {
    return (
      <div className="py-8 text-center">
        <p className="text-gray-500">Loading expenses...</p>
      </div>
    );
  }

  if (expenses.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="text-gray-500">No expenses found.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            <TableHead className="px-6 py-3">
              <div className="flex items-center cursor-pointer" onClick={() => handleSort('date')}>
                Date
                {sortConfig?.key === 'date' && (
                  <i className={`fas fa-sort-${sortConfig.direction === 'ascending' ? 'up' : 'down'} ml-1`}></i>
                )}
                {sortConfig?.key !== 'date' && <i className="fas fa-sort ml-1"></i>}
              </div>
            </TableHead>
            <TableHead className="px-6 py-3">Category</TableHead>
            {!isMobile && <TableHead className="px-6 py-3">Note</TableHead>}
            <TableHead className="px-6 py-3">
              <div className="flex items-center cursor-pointer" onClick={() => handleSort('amount')}>
                Amount
                {sortConfig?.key === 'amount' && (
                  <i className={`fas fa-sort-${sortConfig.direction === 'ascending' ? 'up' : 'down'} ml-1`}></i>
                )}
                {sortConfig?.key !== 'amount' && <i className="fas fa-sort ml-1"></i>}
              </div>
            </TableHead>
            <TableHead className="px-6 py-3 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="divide-y divide-gray-100">
          {sortedExpenses.map((expense) => (
            <TableRow key={expense.id} className="hover:bg-gray-50">
              <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                {formatDate(expense.date)}
              </TableCell>
              <TableCell className="px-6 py-4 whitespace-nowrap text-sm">
                <CategoryBadge category={expense.category} />
              </TableCell>
              {!isMobile && (
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {expense.note || '-'}
                </TableCell>
              )}
              <TableCell className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                expense.category.toLowerCase() === 'income' ? 'text-green-600' : 'text-red-600'
              }`}>
                {expense.category.toLowerCase() === 'income' ? '+' : '-'}
                {formatCurrency(expense.amount)}
              </TableCell>
              <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-right">
                <button 
                  className="text-gray-500 hover:text-red-600" 
                  onClick={() => handleDelete(expense.id)}
                >
                  <i className="fas fa-trash"></i>
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ExpenseTable;
