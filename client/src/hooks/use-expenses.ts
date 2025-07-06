import { useQuery } from '@tanstack/react-query';

interface Expense {
  id: number;
  date: string;
  amount: number;
  category: string;
  note?: string;
  paymentMethod?: string;
}

interface FilterOptions {
  dateRange?: string;
  category?: string;
  amountRange?: string;
  search?: string;
}

interface UseExpensesOptions {
  filters?: FilterOptions;
  limit?: number;
}

export function useExpenses(options: UseExpensesOptions = {}) {
  const { filters, limit } = options;
  
  // Build query string based on filters
  let queryString = '/api/expenses';
  const queryParams: string[] = [];
  
  if (filters?.dateRange && filters.dateRange !== 'all') {
    queryParams.push(`dateRange=${filters.dateRange}`);
  }
  
  if (filters?.category && filters.category !== 'all') {
    queryParams.push(`category=${filters.category}`);
  }
  
  if (filters?.amountRange && filters.amountRange !== 'all') {
    queryParams.push(`amountRange=${filters.amountRange}`);
  }
  
  if (filters?.search) {
    queryParams.push(`search=${encodeURIComponent(filters.search)}`);
  }
  
  if (limit) {
    queryParams.push(`limit=${limit}`);
  }
  
  if (queryParams.length > 0) {
    queryString += `?${queryParams.join('&')}`;
  }

  const { data, isLoading, error } = useQuery<Expense[]>({
    queryKey: [queryString],
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return {
    expenses: data || [],
    isLoading,
    error,
  };
}
