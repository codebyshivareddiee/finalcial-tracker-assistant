import React from 'react';
import ExpenseForm from '@/components/expenses/expense-form';

const AddExpense: React.FC = () => {
  return (
    <div className="p-4 md:p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Add New Expense</h2>
        <p className="text-gray-600 mt-1">Record your expenses to track your spending</p>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 max-w-2xl mx-auto">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-800">Expense Details</h3>
        </div>
        <div className="p-6">
          <ExpenseForm />
        </div>
      </div>
      
      <div className="max-w-2xl mx-auto mt-8">
        <div className="bg-blue-50 border-l-4 border-primary p-4 rounded">
          <div className="flex">
            <div className="flex-shrink-0">
              <i className="fas fa-lightbulb text-primary"></i>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">Quick Tip</h3>
              <div className="mt-1 text-sm text-blue-700">
                <p>Categorizing your expenses correctly helps you get better insights and recommendations from Lucas assistant.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddExpense;
