import { db } from "./index";
import * as schema from "@shared/schema";

async function seed() {
  try {
    // Check if categories exist before seeding
    const existingCategories = await db.query.categories.findMany();
    
    if (existingCategories.length === 0) {
      console.log("Seeding categories...");
      
      // Seed categories
      await db.insert(schema.categories).values([
        { name: "Food", icon: "fa-utensils", color: "#6366F1" },
        { name: "Transportation", icon: "fa-taxi", color: "#8B5CF6" },
        { name: "Shopping", icon: "fa-shopping-bag", color: "#3B82F6" },
        { name: "Entertainment", icon: "fa-film", color: "#EC4899" },
        { name: "Utilities", icon: "fa-bolt", color: "#F59E0B" },
        { name: "Rent", icon: "fa-home", color: "#10B981" },
        { name: "Income", icon: "fa-money-bill-wave", color: "#34D399" },
        { name: "Others", icon: "fa-ellipsis-h", color: "#6B7280" }
      ]);
      
      console.log("Categories seeded successfully");
    } else {
      console.log("Categories already exist, skipping seed");
    }
    
    // Check if expenses exist before seeding
    const existingExpenses = await db.query.expenses.findMany();
    
    if (existingExpenses.length === 0) {
      console.log("Seeding sample expenses...");
      
      const currentDate = new Date();
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(currentDate.getMonth() - 1);
      
      // Seed sample expenses for the current month
      await db.insert(schema.expenses).values([
        { 
          date: new Date(currentDate.getFullYear(), currentDate.getMonth(), 15), 
          amount: "2400", 
          category: "Shopping", 
          note: "Grocery shopping at BigBasket",
          paymentMethod: "creditCard"
        },
        { 
          date: new Date(currentDate.getFullYear(), currentDate.getMonth(), 14), 
          amount: "1850", 
          category: "Food", 
          note: "Dinner at Mainland China",
          paymentMethod: "creditCard"
        },
        { 
          date: new Date(currentDate.getFullYear(), currentDate.getMonth(), 13), 
          amount: "350", 
          category: "Transportation", 
          note: "Uber to office",
          paymentMethod: "upi"
        },
        { 
          date: new Date(currentDate.getFullYear(), currentDate.getMonth(), 10), 
          amount: "65000", 
          category: "Income", 
          note: "Monthly salary",
          paymentMethod: "bankTransfer"
        },
        { 
          date: new Date(currentDate.getFullYear(), currentDate.getMonth(), 8), 
          amount: "6000", 
          category: "Rent", 
          note: "Monthly apartment rent",
          paymentMethod: "bankTransfer"
        },
        { 
          date: new Date(currentDate.getFullYear(), currentDate.getMonth(), 7), 
          amount: "4200", 
          category: "Food", 
          note: "Weekly groceries",
          paymentMethod: "debitCard"
        },
        { 
          date: new Date(currentDate.getFullYear(), currentDate.getMonth(), 5), 
          amount: "1200", 
          category: "Utilities", 
          note: "Electricity bill",
          paymentMethod: "upi"
        },
        { 
          date: new Date(currentDate.getFullYear(), currentDate.getMonth(), 3), 
          amount: "2500", 
          category: "Entertainment", 
          note: "Movie and dinner",
          paymentMethod: "creditCard"
        },
        { 
          date: new Date(currentDate.getFullYear(), currentDate.getMonth(), 2), 
          amount: "1800", 
          category: "Transportation", 
          note: "Monthly fuel expenses",
          paymentMethod: "debitCard"
        },
        { 
          date: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1), 
          amount: "3200", 
          category: "Shopping", 
          note: "New clothes",
          paymentMethod: "creditCard"
        }
      ]);
      
      // Seed sample expenses for the previous month
      await db.insert(schema.expenses).values([
        { 
          date: new Date(oneMonthAgo.getFullYear(), oneMonthAgo.getMonth(), 25), 
          amount: "2100", 
          category: "Shopping", 
          note: "Grocery shopping",
          paymentMethod: "creditCard"
        },
        { 
          date: new Date(oneMonthAgo.getFullYear(), oneMonthAgo.getMonth(), 20), 
          amount: "1500", 
          category: "Food", 
          note: "Dinner with friends",
          paymentMethod: "cash"
        },
        { 
          date: new Date(oneMonthAgo.getFullYear(), oneMonthAgo.getMonth(), 18), 
          amount: "300", 
          category: "Transportation", 
          note: "Taxi fare",
          paymentMethod: "cash"
        },
        { 
          date: new Date(oneMonthAgo.getFullYear(), oneMonthAgo.getMonth(), 10), 
          amount: "62000", 
          category: "Income", 
          note: "Monthly salary",
          paymentMethod: "bankTransfer"
        },
        { 
          date: new Date(oneMonthAgo.getFullYear(), oneMonthAgo.getMonth(), 5), 
          amount: "6000", 
          category: "Rent", 
          note: "Monthly apartment rent",
          paymentMethod: "bankTransfer"
        }
      ]);
      
      console.log("Sample expenses seeded successfully");
    } else {
      console.log("Expenses already exist, skipping seed");
    }
  } 
  catch (error) {
    console.error("Error seeding database:", error);
  }
}

seed();
