import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface FilterValues {
  dateRange: string;
  category: string;
  amountRange: string;
  search: string;
}

interface ExpenseFiltersProps {
  onFilterChange: (filters: FilterValues) => void;
}

const ExpenseFilters: React.FC<ExpenseFiltersProps> = ({ onFilterChange }) => {
  const [filters, setFilters] = useState<FilterValues>({
    dateRange: 'thisMonth',
    category: 'all',
    amountRange: 'all',
    search: '',
  });

  const handleChange = (field: keyof FilterValues, value: string) => {
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);
  };

  const applyFilters = () => {
    onFilterChange(filters);
  };

  const resetFilters = () => {
    const defaultFilters = {
      dateRange: 'thisMonth',
      category: 'all',
      amountRange: 'all',
      search: '',
    };
    setFilters(defaultFilters);
    onFilterChange(defaultFilters);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 mb-6 p-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <Label htmlFor="dateRange" className="block text-sm font-medium text-gray-700 mb-1">Date Range</Label>
          <Select 
            value={filters.dateRange} 
            onValueChange={(value) => handleChange('dateRange', value)}
          >
            <SelectTrigger id="dateRange" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm">
              <SelectValue placeholder="Select date range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="thisMonth">This Month</SelectItem>
              <SelectItem value="lastMonth">Last Month</SelectItem>
              <SelectItem value="last3Months">Last 3 Months</SelectItem>
              <SelectItem value="thisYear">This Year</SelectItem>
              <SelectItem value="custom">Custom Range</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category</Label>
          <Select 
            value={filters.category} 
            onValueChange={(value) => handleChange('category', value)}
          >
            <SelectTrigger id="category" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
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
        </div>
        
        <div>
          <Label htmlFor="amountRange" className="block text-sm font-medium text-gray-700 mb-1">Amount Range</Label>
          <Select 
            value={filters.amountRange} 
            onValueChange={(value) => handleChange('amountRange', value)}
          >
            <SelectTrigger id="amountRange" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm">
              <SelectValue placeholder="Select amount range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Amounts</SelectItem>
              <SelectItem value="under500">Under ₹500</SelectItem>
              <SelectItem value="500to1000">₹500 - ₹1,000</SelectItem>
              <SelectItem value="1000to5000">₹1,000 - ₹5,000</SelectItem>
              <SelectItem value="over5000">Over ₹5,000</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">Search</Label>
          <Input
            type="text"
            id="search"
            placeholder="Search by note or description"
            value={filters.search}
            onChange={(e) => handleChange('search', e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />
        </div>
      </div>
      
      <div className="mt-4 flex justify-end">
        <Button
          onClick={resetFilters}
          variant="outline"
          className="px-3 py-1 text-sm border border-gray-300 rounded mr-2 text-gray-600 hover:bg-gray-50"
        >
          Reset
        </Button>
        <Button
          onClick={applyFilters}
          className="px-3 py-1 text-sm bg-primary text-white rounded hover:bg-blue-600"
        >
          Apply Filters
        </Button>
      </div>
    </div>
  );
};

export default ExpenseFilters;
