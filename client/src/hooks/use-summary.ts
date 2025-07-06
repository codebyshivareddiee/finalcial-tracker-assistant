import { useQuery } from '@tanstack/react-query';

interface CategorySummary {
  category: string;
  amount: number;
  percentage: number;
}

interface MonthComparison {
  spentChange: number;
  savedChange: number;
}

interface Summary {
  totalSpent: number;
  totalSaved: number;
  totalIncome: number;
  budgetStatus: number;
  topCategory: CategorySummary;
  byCategory: CategorySummary[];
  previousMonthComparison: MonthComparison;
}

export function useSummary() {
  const { data, isLoading, error } = useQuery<Summary>({
    queryKey: ['/api/summary'],
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return {
    summary: data,
    isLoading,
    error,
  };
}
