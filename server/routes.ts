import type { Express } from "express";
import { expenseService } from "./services/expense-service";
import { summaryService } from "./services/summary-service";
import { chatbotService } from "./services/chatbot-service";

export async function registerRoutes(app: Express): Promise<void> {
  // API Routes
  
  // Get all expenses with optional filtering
  app.get('/api/expenses', async (req, res) => {
    try {
      const filters = {
        dateRange: req.query.dateRange as string,
        category: req.query.category as string,
        amountRange: req.query.amountRange as string,
        search: req.query.search as string,
        limit: req.query.limit ? parseInt(req.query.limit as string) : undefined
      };
      
      const expenses = await expenseService.getExpenses(filters);
      res.json(expenses);
    } catch (error) {
      console.error('Error fetching expenses:', error);
      res.status(500).json({ message: 'Failed to fetch expenses' });
    }
  });
  
  // Add a new expense
  app.post('/api/expenses', async (req, res) => {
    try {
      const expense = await expenseService.addExpense(req.body);
      res.status(201).json(expense);
    } catch (error) {
      console.error('Error adding expense:', error);
      
      if (error.message?.includes('validation')) {
        return res.status(400).json({ message: error.message });
      }
      
      res.status(500).json({ message: 'Failed to add expense' });
    }
  });
  
  // Delete an expense
  app.delete('/api/expenses/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid expense ID' });
      }
      
      await expenseService.deleteExpense(id);
      res.status(200).json({ message: 'Expense deleted successfully' });
    } catch (error) {
      console.error('Error deleting expense:', error);
      res.status(500).json({ message: 'Failed to delete expense' });
    }
  });
  
  // Get financial summary
  app.get('/api/summary', async (req, res) => {
    try {
      const summary = await summaryService.getSummary();
      res.json(summary);
    } catch (error) {
      console.error('Error fetching summary:', error);
      res.status(500).json({ message: 'Failed to fetch financial summary' });
    }
  });
  
  // Chatbot query
  app.get('/api/chatbot-query', async (req, res) => {
    try {
      const question = req.query.question as string;
      
      if (!question) {
        return res.status(400).json({ message: 'Question is required' });
      }
      
      const response = await chatbotService.getResponse(question);
      res.json({ response });
    } catch (error) {
      console.error('Error processing chatbot query:', error);
      res.status(500).json({ message: 'Failed to process chatbot query' });
    }
  });

}
