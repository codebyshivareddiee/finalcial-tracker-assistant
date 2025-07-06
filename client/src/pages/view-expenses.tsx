import React, { useState } from 'react';
import { useExpenses } from '@/hooks/use-expenses';
import ExpenseFilters from '@/components/expenses/expense-filters';
import ExpenseTable from '@/components/expenses/expense-table';

interface FilterValues {
  dateRange: string;
  category: string;
  amountRange: string;
  search: string;
}

const ViewExpenses: React.FC = () => {
  const [filters, setFilters] = useState<FilterValues>({
    dateRange: 'thisMonth',
    category: 'all',
    amountRange: 'all',
    search: '',
  });
  
  const { expenses, isLoading } = useExpenses({ filters });

  const handleFilterChange = (newFilters: FilterValues) => {
    setFilters(newFilters);
  };

  return (
    <div className="p-4 md:p-8">
      <div className="md:flex md:justify-between md:items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Expense Tracker</h2>
          <p className="text-gray-600 mt-1">Manage and analyze your expenses</p>
        </div>
      </div>
      
      {/* Filters */}
      <ExpenseFilters onFilterChange={handleFilterChange} />
      
      {/* Expenses Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h3 className="font-semibold text-gray-800">All Expenses</h3>
          <div className="flex items-center">
            <button className="text-sm text-gray-600 hover:text-gray-900 mr-4">
              <i className="fas fa-download mr-1"></i> Export
            </button>
            <a 
              href="/add-expense" 
              className="px-4 py-1 bg-primary text-white text-sm rounded-lg hover:bg-blue-600"
            >
              <i className="fas fa-plus mr-1"></i> Add New
            </a>
          </div>
        </div>
        
        <ExpenseTable expenses={expenses} isLoading={isLoading} />
        
        {/* Pagination - can be extended later */}
        <div className="px-6 py-3 bg-gray-50 text-xs text-gray-500 flex items-center justify-between">
          <div>
            Showing <span className="font-medium">1</span> to <span className="font-medium">{expenses.length}</span> of <span className="font-medium">{expenses.length}</span> results
          </div>
          <div className="flex items-center">
            <button className="px-2 py-1 rounded border border-gray-300 text-gray-600 mr-2 disabled:opacity-50" disabled>
              <i className="fas fa-chevron-left"></i>
            </button>
            <button className="px-3 py-1 rounded bg-primary text-white mr-1">1</button>
            <button className="px-2 py-1 rounded border border-gray-300 text-gray-600 disabled:opacity-50" disabled>
              <i className="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewExpenses;
