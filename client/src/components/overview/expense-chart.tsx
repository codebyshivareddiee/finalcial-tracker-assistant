import React from "react";
import { formatCurrency } from "@/lib/utils/format-currency";

interface CategoryExpense {
  category: string;
  amount: number;
  percentage: number;
  color: string;
}

interface ExpenseChartProps {
  totalExpenses: number;
  categoryExpenses: CategoryExpense[];
}

const ExpenseChart: React.FC<ExpenseChartProps> = ({ totalExpenses, categoryExpenses }) => {
  const colorMap: Record<string, string> = {
    "Food": "bg-blue-500",
    "Rent": "bg-green-500",
    "Transportation": "bg-indigo-500",
    "Shopping": "bg-amber-500",
    "Others": "bg-gray-500",
    "Utilities": "bg-red-500",
    "Entertainment": "bg-purple-500"
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 h-full">
      <div className="px-6 py-4 border-b border-gray-100">
        <h3 className="font-semibold text-gray-800">Expense Breakdown</h3>
        <p className="text-sm text-gray-500 mt-1">Current month</p>
      </div>
      <div className="px-6 py-4">
        <div className="flex justify-center items-center mb-6">
          <div 
            className="h-48 w-48 rounded-full relative flex items-center justify-center"
            style={{ 
              backgroundImage: "conic-gradient(" + 
                categoryExpenses.map((cat, index, arr) => {
                  const prevPercentage = arr
                    .slice(0, index)
                    .reduce((acc, curr) => acc + curr.percentage, 0);
                  return `${cat.color} ${prevPercentage}% ${prevPercentage + cat.percentage}%`;
                }).join(", ") + 
                ")"
            }}
          >
            <div className="absolute inset-4 rounded-full bg-white flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-800">{formatCurrency(totalExpenses)}</div>
                <div className="text-xs text-gray-500">Total Expenses</div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {categoryExpenses.map((category) => (
            <div key={category.category} className="flex items-center">
              <span className={`w-3 h-3 rounded-full ${colorMap[category.category] || "bg-gray-500"} mr-2`}></span>
              <span className="text-sm text-gray-600 flex-1">{category.category}</span>
              <span className="text-sm font-medium">{formatCurrency(category.amount)}</span>
              <span className="text-xs text-gray-500 ml-2">{category.percentage}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExpenseChart;
