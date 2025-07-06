import React from "react";
import { cn } from "@/lib/utils";

interface CategoryBadgeProps {
  category: string;
  icon?: string;
  className?: string;
}

const iconMap: Record<string, string> = {
  Food: "fa-utensils",
  Transportation: "fa-taxi",
  Transport: "fa-taxi",
  Shopping: "fa-shopping-bag",
  Entertainment: "fa-film",
  Utilities: "fa-bolt",
  Rent: "fa-home",
  Income: "fa-money-bill-wave",
  Others: "fa-ellipsis-h"
};

const CategoryBadge: React.FC<CategoryBadgeProps> = ({ 
  category, 
  icon,
  className 
}) => {
  const formattedCategory = category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();
  const categoryClass = `category-badge-${formattedCategory.toLowerCase()}`;
  const iconClass = icon || iconMap[formattedCategory] || "fa-circle";
  
  return (
    <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium", categoryClass, className)}>
      <i className={`fas ${iconClass} mr-1`}></i>
      {formattedCategory}
    </span>
  );
};

export default CategoryBadge;
