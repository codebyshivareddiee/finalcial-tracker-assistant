import { db } from "@db";
import { expenses, expenseInsertSchema, ExpenseInsert } from "@shared/schema";
import { eq, and, like, gte, lte, desc } from "drizzle-orm";
import { getDateRangeTimestamps, getAmountRange } from "@/lib/utils/date-utils";

interface ExpenseFilters {
  dateRange?: string;
  category?: string;
  amountRange?: string;
  search?: string;
  limit?: number;
}

export const expenseService = {
  /**
   * Get expenses with optional filtering
   */
  async getExpenses(filters: ExpenseFilters = {}) {
    try {
      let query = db.select().from(expenses);
      
      // Apply date range filter
      if (filters.dateRange && filters.dateRange !== 'all') {
        const { start, end } = getDateRangeTimestamps(filters.dateRange);
        query = query.where(
          and(
            gte(expenses.date, start),
            lte(expenses.date, end)
          )
        );
      }
      
      // Apply category filter
      if (filters.category && filters.category !== 'all') {
        query = query.where(eq(expenses.category, filters.category));
      }
      
      // Apply amount range filter
      if (filters.amountRange && filters.amountRange !== 'all') {
        const { min, max } = getAmountRange(filters.amountRange);
        
        if (min !== null) {
          query = query.where(gte(expenses.amount, min.toString()));
        }
        
        if (max !== null) {
          query = query.where(lte(expenses.amount, max.toString()));
        }
      }
      
      // Apply search filter
      if (filters.search) {
        query = query.where(like(expenses.note, `%${filters.search}%`));
      }
      
      // Apply sorting and limit
      query = query.orderBy(desc(expenses.date));
      
      if (filters.limit) {
        query = query.limit(filters.limit);
      }
      
      const result = await query;
      return result;
    } catch (error) {
      console.error('Error fetching expenses:', error);
      throw error;
    }
  },
  
  /**
   * Add a new expense
   */
  async addExpense(data: any) {
    try {
      // Convert the data to match the database schema
      const expenseData = {
        date: new Date(data.date),
        amount: data.amount.toString(),
        category: data.category,
        note: data.note || null,
        paymentMethod: data.paymentMethod || 'cash'
      };
      
      // Insert into database
      const [expense] = await db.insert(expenses)
        .values(expenseData)
        .returning();
        
      return expense;
    } catch (error) {
      console.error('Error adding expense:', error);
      throw error;
    }
  },
  
  /**
   * Delete an expense
   */
  async deleteExpense(id: number) {
    try {
      await db.delete(expenses).where(eq(expenses.id, id));
    } catch (error) {
      console.error('Error deleting expense:', error);
      throw error;
    }
  }
};
