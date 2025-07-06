import { db } from "@db";
import { expenses } from "@shared/schema";
import { eq, and, gte, lte, sum, desc } from "drizzle-orm";
import { sql } from "drizzle-orm";

export const summaryService = {
  /**
   * Get financial summary
   */
  async getSummary() {
    try {
      // Get current month limits
      const now = new Date();
      const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const currentMonthEnd = new Date();
      currentMonthEnd.setHours(23, 59, 59, 999);
      
      // Get previous month limits
      const prevMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const prevMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
      prevMonthEnd.setHours(23, 59, 59, 999);
      
      // Current month expenses
      const currentMonthExpenses = await db.select().from(expenses).where(
        and(
          gte(expenses.date, currentMonthStart),
          lte(expenses.date, currentMonthEnd)
        )
      );
      
      // Previous month expenses
      const previousMonthExpenses = await db.select().from(expenses).where(
        and(
          gte(expenses.date, prevMonthStart),
          lte(expenses.date, prevMonthEnd)
        )
      );
      
      // Calculate total spent (excluding income) for current month
      const totalSpent = currentMonthExpenses
        .filter(e => e.category.toLowerCase() !== 'income')
        .reduce((acc, e) => acc + parseFloat(e.amount.toString()), 0);
      
      // Calculate total income for current month
      const totalIncome = currentMonthExpenses
        .filter(e => e.category.toLowerCase() === 'income')
        .reduce((acc, e) => acc + parseFloat(e.amount.toString()), 0);
      
      // Calculate previous month totals
      const prevTotalSpent = previousMonthExpenses
        .filter(e => e.category.toLowerCase() !== 'income')
        .reduce((acc, e) => acc + parseFloat(e.amount.toString()), 0);
      
      const prevTotalIncome = previousMonthExpenses
        .filter(e => e.category.toLowerCase() === 'income')
        .reduce((acc, e) => acc + parseFloat(e.amount.toString()), 0);
      
      // Calculate saved amount
      const totalSaved = totalIncome - totalSpent;
      const prevTotalSaved = prevTotalIncome - prevTotalSpent;
      
      // Calculate budget status (assuming 70% of income is the budget)
      const budgetLimit = totalIncome * 0.7;
      const budgetStatus = Math.min(100, Math.round((totalSpent / (budgetLimit || 1)) * 100));
      
      // Calculate expense by category
      const categorySummary: Record<string, number> = {};
      currentMonthExpenses
        .filter(e => e.category.toLowerCase() !== 'income')
        .forEach(e => {
          const amount = parseFloat(e.amount.toString());
          categorySummary[e.category] = (categorySummary[e.category] || 0) + amount;
        });
      
      const byCategory = Object.entries(categorySummary)
        .map(([category, amount]) => ({
          category,
          amount,
          percentage: Math.round((amount / (totalSpent || 1)) * 100)
        }))
        .sort((a, b) => b.amount - a.amount);
      
      // Get top spending category
      const topCategory = byCategory.length > 0 ? byCategory[0] : null;
      
      // Calculate month-over-month changes
      const spentChange = prevTotalSpent > 0
        ? Math.round(((totalSpent - prevTotalSpent) / prevTotalSpent) * 100)
        : 0;
      
      const savedChange = prevTotalSaved > 0
        ? Math.round(((totalSaved - prevTotalSaved) / prevTotalSaved) * 100)
        : 0;
      
      return {
        totalSpent,
        totalSaved,
        totalIncome,
        budgetStatus,
        topCategory,
        byCategory,
        previousMonthComparison: {
          spentChange,
          savedChange
        }
      };
    } catch (error) {
      console.error('Error generating summary:', error);
      throw error;
    }
  }
};
