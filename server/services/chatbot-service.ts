import { db } from "@db";
import { expenses } from "@shared/schema";
import { eq, and, gte, lte } from "drizzle-orm";
import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "your-api-key-here"
});

export const chatbotService = {
  /**
   * Get data for OpenAI prompt
   */
  async getFinancialData() {
    try {
      // Get current month limits
      const now = new Date();
      const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const currentMonthEnd = new Date();
      
      // Get current week limits
      const currentWeekStart = new Date(now);
      currentWeekStart.setDate(now.getDate() - now.getDay());
      const currentWeekEnd = new Date();
      
      // Query expenses
      const monthlyExpenses = await db.select().from(expenses).where(
        and(
          gte(expenses.date, currentMonthStart),
          lte(expenses.date, currentMonthEnd)
        )
      );
      
      const weeklyExpenses = monthlyExpenses.filter(e => 
        new Date(e.date) >= currentWeekStart && new Date(e.date) <= currentWeekEnd
      );
      
      // Calculate totals
      const monthlyTotal = monthlyExpenses
        .filter(e => e.category.toLowerCase() !== 'income')
        .reduce((acc, e) => acc + parseFloat(e.amount.toString()), 0);
      
      const weeklyTotal = weeklyExpenses
        .filter(e => e.category.toLowerCase() !== 'income')
        .reduce((acc, e) => acc + parseFloat(e.amount.toString()), 0);
      
      const monthlyIncome = monthlyExpenses
        .filter(e => e.category.toLowerCase() === 'income')
        .reduce((acc, e) => acc + parseFloat(e.amount.toString()), 0);
      
      // Calculate by category
      const categorySummary: Record<string, number> = {};
      monthlyExpenses
        .filter(e => e.category.toLowerCase() !== 'income')
        .forEach(e => {
          const amount = parseFloat(e.amount.toString());
          categorySummary[e.category] = (categorySummary[e.category] || 0) + amount;
        });
      
      // Format category data
      const categoryData = Object.entries(categorySummary)
        .map(([category, amount]) => `${category}: ₹${amount.toLocaleString('en-IN')}`)
        .join(', ');
      
      return {
        monthlyTotal,
        weeklyTotal,
        monthlyIncome,
        categorySummary: categoryData
      };
    } catch (error) {
      console.error('Error fetching financial data for chatbot:', error);
      return {
        monthlyTotal: 0,
        weeklyTotal: 0,
        monthlyIncome: 0,
        categorySummary: 'No data available'
      };
    }
  },
  
  /**
   * Get response from OpenAI based on user question
   */
  async getResponse(question: string) {
    try {
      const financialData = await this.getFinancialData();
      
      // Prepare OpenAI prompt
      const systemPrompt = `You are Lucas, a personal finance assistant. Your role is to analyze expense data and provide helpful, actionable financial advice.
      
User's financial data:
- Total spending this month: ₹${financialData.monthlyTotal.toLocaleString('en-IN')}
- Total spending this week: ₹${financialData.weeklyTotal.toLocaleString('en-IN')}
- Total income this month: ₹${financialData.monthlyIncome.toLocaleString('en-IN')}
- Category breakdown: ${financialData.categorySummary}

Provide friendly, beginner-safe advice about budgeting, savings, and investment planning based on this data.
If you can't answer a specific question with the available data, suggest what information would be helpful.
Use Indian Rupee (₹) symbol when discussing money.
Format text with clear sections and bullet points when appropriate.`;

      // Check if OpenAI API key is set
      if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === "your-api-key-here") {
        // Fallback responses if no API key
        const fallbackResponses: Record<string, string> = {
          "how much did i spend this week": `Based on your expense data, you've spent ₹${financialData.weeklyTotal.toLocaleString('en-IN')} this week.`,
          "how much did i spend this month": `Your total spending this month is ₹${financialData.monthlyTotal.toLocaleString('en-IN')}.`,
          "where can i cut my spending": "Looking at your expenses, you might be able to reduce spending in your highest expense categories. Consider setting a budget for each category and tracking your expenses regularly.",
          "can i save more this month": `Based on your monthly income of ₹${financialData.monthlyIncome.toLocaleString('en-IN')} and expenses of ₹${financialData.monthlyTotal.toLocaleString('en-IN')}, you could potentially save ₹${(financialData.monthlyIncome - financialData.monthlyTotal).toLocaleString('en-IN')} this month.`,
          "help me create a budget": "To create a budget, start by allocating your income to different expense categories. A common approach is the 50/30/20 rule: 50% for needs, 30% for wants, and 20% for savings and debt repayment."
        };
        
        // Check for matching fallback or return generic response
        const matchingKey = Object.keys(fallbackResponses).find(key => 
          question.toLowerCase().includes(key)
        );
        
        return matchingKey 
          ? fallbackResponses[matchingKey]
          : "I'm sorry, I can't process your request at the moment due to API configuration. Please try again later or ask a different question about your finances.";
      }
      
      // Make API call to OpenAI
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: question }
        ],
        max_tokens: 500,
      });
      
      return response.choices[0].message.content || "I'm sorry, I couldn't generate a response. Please try again.";
    } catch (error) {
      console.error('Error generating chatbot response:', error);
      
      return "I'm sorry, I encountered an error while processing your request. Please try again later.";
    }
  }
};
