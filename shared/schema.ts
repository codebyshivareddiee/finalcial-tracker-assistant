import { pgTable, text, serial, integer, decimal, timestamp } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  icon: text("icon").notNull(),
  color: text("color").notNull()
});

export const expenses = pgTable("expenses", {
  id: serial("id").primaryKey(),
  date: timestamp("date").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  category: text("category").notNull(),
  note: text("note"),
  paymentMethod: text("payment_method").default("cash")
});

// Create schemas for validation
export const expenseInsertSchema = createInsertSchema(expenses, {
  date: (schema) => z.coerce.date({
    errorMap: () => ({ message: "Valid date is required" })
  }),
  amount: (schema) => z.coerce.number().positive("Amount must be positive"),
  category: (schema) => z.string().min(1, "Category is required"),
  note: (schema) => z.string().optional(),
  paymentMethod: (schema) => z.string().optional()
});

export const categoryInsertSchema = createInsertSchema(categories);

export const expenseSelectSchema = createSelectSchema(expenses);
export const categorySelectSchema = createSelectSchema(categories);

export type ExpenseInsert = z.infer<typeof expenseInsertSchema>;
export type Expense = z.infer<typeof expenseSelectSchema>;
export type Category = z.infer<typeof categorySelectSchema>;

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
