import React from 'react';
import { useMobile } from '@/hooks/use-mobile';
import { useSummary } from '@/hooks/use-summary';
import { useExpenses } from '@/hooks/use-expenses';
import SummaryCard from '@/components/overview/summary-card';
import ExpenseChart from '@/components/overview/expense-chart';
import CategoryBadge from '@/components/ui/category-badge';
import { formatCurrency } from '@/lib/utils/format-currency';
import { formatDate } from '@/lib/utils/date-utils';

const Dashboard: React.FC = () => {
  const isMobile = useMobile();
  const { summary, isLoading: isSummaryLoading } = useSummary();
  const { expenses, isLoading: isExpensesLoading } = useExpenses({ limit: 5 });

  // Calculate color mappings for the chart
  const colorMap: Record<string, string> = {
    'Food': '#6366F1',
    'Rent': '#10B981',
    'Transportation': '#8B5CF6',
    'Shopping': '#3B82F6',
    'Entertainment': '#EC4899',
    'Utilities': '#F59E0B',
    'Others': '#6B7280'
  };

  // Format expense data for the chart
  const categoryExpenses = summary?.byCategory.map(cat => ({
    category: cat.category,
    amount: cat.amount,
    percentage: cat.percentage,
    color: colorMap[cat.category] || '#6B7280'
  })) || [];

  const currentDate = new Date();
  const currentMonth = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <div className="p-4 md:p-8">
      <div className="md:flex md:justify-between md:items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Financial Dashboard</h2>
          <p className="text-gray-600 mt-1">Welcome back! Here's your financial overview</p>
        </div>
        <div className="mt-4 md:mt-0">
          <span className="text-sm text-gray-500">Current Month:</span>
          <span className="ml-2 font-medium">{currentMonth}</span>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <SummaryCard
          title="Total Spent"
          value={isSummaryLoading ? "Loading..." : formatCurrency(summary?.totalSpent || 0)}
          icon="fa-rupee-sign"
          iconBackground="bg-blue-100"
          iconColor="text-primary"
          change={
            summary?.previousMonthComparison 
              ? { 
                  value: summary.previousMonthComparison.spentChange, 
                  isPositive: summary.previousMonthComparison.spentChange < 0 
                }
              : undefined
          }
          changeText="from last month"
        />
        
        <SummaryCard
          title="Total Saved"
          value={isSummaryLoading ? "Loading..." : formatCurrency(summary?.totalSaved || 0)}
          icon="fa-piggy-bank"
          iconBackground="bg-green-100"
          iconColor="text-secondary"
          change={
            summary?.previousMonthComparison 
              ? { 
                  value: summary.previousMonthComparison.savedChange, 
                  isPositive: summary.previousMonthComparison.savedChange > 0 
                }
              : undefined
          }
          changeText="from last month"
        />
        
        <SummaryCard
          title="Budget Status"
          value={isSummaryLoading ? "Loading..." : `${summary?.budgetStatus || 0}% used`}
          icon="fa-chart-pie"
          iconBackground="bg-amber-100"
          iconColor="text-amber-500"
        >
          <div className="mt-3">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-amber-500 h-2 rounded-full" 
                style={{ width: `${summary?.budgetStatus || 0}%` }}
              ></div>
            </div>
          </div>
        </SummaryCard>
        
        <SummaryCard
          title="Top Category"
          value={isSummaryLoading ? "Loading..." : summary?.topCategory?.category || "None"}
          icon={
            summary?.topCategory?.category === "Food" ? "fa-utensils" :
            summary?.topCategory?.category === "Shopping" ? "fa-shopping-bag" :
            summary?.topCategory?.category === "Transportation" ? "fa-taxi" :
            summary?.topCategory?.category === "Rent" ? "fa-home" :
            summary?.topCategory?.category === "Utilities" ? "fa-bolt" :
            summary?.topCategory?.category === "Entertainment" ? "fa-film" : "fa-ellipsis-h"
          }
          iconBackground="bg-indigo-100"
          iconColor="text-accent"
        >
          {summary?.topCategory && (
            <div className="mt-4 flex items-center text-sm">
              <span className="text-indigo-500 font-medium">
                {formatCurrency(summary.topCategory.amount)}
              </span>
              <span className="text-gray-500 ml-2">this month</span>
            </div>
          )}
        </SummaryCard>
      </div>

      {/* Recent Transactions & Expense Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Transactions */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-semibold text-gray-800">Recent Transactions</h3>
              <a href="/expenses" className="text-sm text-primary hover:underline">View All</a>
            </div>
            
            {isExpensesLoading ? (
              <div className="p-6 text-center text-gray-500">Loading transactions...</div>
            ) : expenses.length === 0 ? (
              <div className="p-6 text-center text-gray-500">No transactions found.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <th className="px-6 py-3">Date</th>
                      <th className="px-6 py-3">Category</th>
                      {!isMobile && <th className="px-6 py-3">Note</th>}
                      <th className="px-6 py-3 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {expenses.map((expense) => (
                      <tr key={expense.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {formatDate(expense.date)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <CategoryBadge category={expense.category} />
                        </td>
                        {!isMobile && (
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {expense.note || '-'}
                          </td>
                        )}
                        <td className={`px-6 py-4 whitespace-nowrap text-sm text-right font-medium ${
                          expense.category.toLowerCase() === 'income' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {expense.category.toLowerCase() === 'income' ? '+' : '-'}
                          {formatCurrency(expense.amount)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            
            <div className="px-6 py-3 bg-gray-50 text-right">
              <button className="text-sm text-gray-600 hover:text-gray-900">
                <i className="fas fa-download mr-1"></i> Export
              </button>
            </div>
          </div>
        </div>

        {/* Expense Breakdown */}
        <div className="lg:col-span-1">
          {isSummaryLoading ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 h-full p-6 flex items-center justify-center">
              <p className="text-gray-500">Loading expense breakdown...</p>
            </div>
          ) : (
            <ExpenseChart 
              totalExpenses={summary?.totalSpent || 0} 
              categoryExpenses={categoryExpenses} 
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
