import React from "react";
import { formatCurrency } from "@/lib/utils/format-currency";

interface SummaryCardProps {
  title: string;
  value: string | number;
  icon: string;
  iconBackground: string;
  iconColor: string;
  change?: {
    value: number;
    isPositive: boolean;
  };
  changeText?: string;
  children?: React.ReactNode;
}

const SummaryCard: React.FC<SummaryCardProps> = ({
  title,
  value,
  icon,
  iconBackground,
  iconColor,
  change,
  changeText,
  children,
}) => {
  const formattedValue = typeof value === 'number' ? formatCurrency(value) : value;
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 mb-1">{title}</p>
          <h3 className="text-2xl font-semibold text-gray-800">{formattedValue}</h3>
        </div>
        <span className={`p-2 ${iconBackground} ${iconColor} rounded-full`}>
          <i className={`fas ${icon}`}></i>
        </span>
      </div>
      {change && (
        <div className="mt-4 flex items-center text-sm">
          <span className={`${change.isPositive ? "text-green-500" : "text-red-500"} flex items-center`}>
            <i className={`fas fa-arrow-${change.isPositive ? "up" : "down"} mr-1`}></i> {Math.abs(change.value)}%
          </span>
          {changeText && <span className="text-gray-500 ml-2">{changeText}</span>}
        </div>
      )}
      {children}
    </div>
  );
};

export default SummaryCard;
