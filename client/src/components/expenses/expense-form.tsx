import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { queryClient } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { useMobile } from '@/hooks/use-mobile';

// Form schema for validation
const expenseFormSchema = z.object({
  date: z.string().min(1, { message: 'Date is required' }),
  amount: z.coerce.number().positive({ message: 'Amount must be greater than 0' }),
  category: z.string().min(1, { message: 'Category is required' }),
  paymentMethod: z.string().optional(),
  note: z.string().optional(),
});

type ExpenseFormValues = z.infer<typeof expenseFormSchema>;

interface ExpenseFormProps {
  className?: string;
}

const ExpenseForm: React.FC<ExpenseFormProps> = ({ className }) => {
  const { toast } = useToast();
  const isMobile = useMobile();
  
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<ExpenseFormValues>({
    resolver: zodResolver(expenseFormSchema),
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      amount: undefined,
      category: '',
      paymentMethod: 'cash',
      note: '',
    },
  });

  const onSubmit = async (data: ExpenseFormValues) => {
    try {
      await apiRequest('POST', '/api/expenses', data);
      
      toast({
        title: 'Expense added',
        description: 'Your expense has been successfully recorded.',
      });
      
      // Invalidate the expenses query to refetch expenses
      queryClient.invalidateQueries({ queryKey: ['/api/expenses'] });
      queryClient.invalidateQueries({ queryKey: ['/api/summary'] });
      
      // Reset the form
      reset();
    } catch (error) {
      console.error('Error adding expense:', error);
      toast({
        title: 'Error',
        description: 'Failed to add expense. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={cn('', className)}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">Date</Label>
          <Input
            type="date"
            id="date"
            {...register('date')}
            className="w-full rounded-lg border border-gray-300 px-4 py-2"
          />
          {errors.date && <p className="text-sm text-red-500 mt-1">{errors.date.message}</p>}
        </div>
        
        <div>
          <Label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">Amount (₹)</Label>
          <Input
            type="number"
            id="amount"
            placeholder="0.00"
            step="0.01"
            min="0"
            {...register('amount')}
            className="w-full rounded-lg border border-gray-300 px-4 py-2"
          />
          {errors.amount && <p className="text-sm text-red-500 mt-1">{errors.amount.message}</p>}
        </div>
        
        <div>
          <Label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category</Label>
          <input type="hidden" {...register('category')} />
          <Select 
            onValueChange={(value) => {
              // This properly sets the value in the form
              register('category').onChange({
                target: { name: 'category', value: value }
              });
            }}
          >
            <SelectTrigger id="category" className="w-full rounded-lg border border-gray-300 px-4 py-2">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="food">Food</SelectItem>
              <SelectItem value="transportation">Transportation</SelectItem>
              <SelectItem value="shopping">Shopping</SelectItem>
              <SelectItem value="entertainment">Entertainment</SelectItem>
              <SelectItem value="utilities">Utilities</SelectItem>
              <SelectItem value="rent">Rent</SelectItem>
              <SelectItem value="income">Income</SelectItem>
              <SelectItem value="others">Others</SelectItem>
            </SelectContent>
          </Select>
          {errors.category && <p className="text-sm text-red-500 mt-1">{errors.category.message}</p>}
        </div>
        
        <div>
          <Label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700 mb-1">Payment Method</Label>
          <input type="hidden" {...register('paymentMethod')} />
          <Select 
            defaultValue="cash"
            onValueChange={(value) => {
              register('paymentMethod').onChange({
                target: { name: 'paymentMethod', value: value }
              });
            }}
          >
            <SelectTrigger id="paymentMethod" className="w-full rounded-lg border border-gray-300 px-4 py-2">
              <SelectValue placeholder="Select payment method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cash">Cash</SelectItem>
              <SelectItem value="creditCard">Credit Card</SelectItem>
              <SelectItem value="debitCard">Debit Card</SelectItem>
              <SelectItem value="upi">UPI</SelectItem>
              <SelectItem value="bankTransfer">Bank Transfer</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="mt-6">
        <Label htmlFor="note" className="block text-sm font-medium text-gray-700 mb-1">Note</Label>
        <Textarea
          id="note"
          placeholder="Add details about this expense"
          rows={3}
          {...register('note')}
          className="w-full rounded-lg border border-gray-300 px-4 py-2"
        />
      </div>
      
      <div className="mt-6 flex items-center justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={() => reset()}
          className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-blue-600"
        >
          {isSubmitting ? "Saving..." : "Save Expense"}
        </Button>
      </div>
    </form>
  );
};

export default ExpenseForm;
