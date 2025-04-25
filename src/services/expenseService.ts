import {supabase} from '../utils/supabase';

export type Expense = {
  id: string;
  title: string;
  amount: number;
  category: string;
  date: Date;
  account_id: string;
  user_id: string;
};

const expenseService = {
  async getExpenses(): Promise<Expense[]> {
    try {
      const {data, error} = await supabase
        .from('Expense')
        .select('*')
        .order('date', {ascending: false});

      if (error) {
        throw error;
      }

      return data
        ? data.map(item => ({
            ...item,
            date: new Date(item.date),
          }))
        : [];
    } catch (e: any) {
      throw new Error(`Failed to get expenses: ${e.message}`);
    }
  },

  async addExpense(expense: Omit<Expense, 'id'>): Promise<Expense> {
    try {
      const {data, error} = await supabase
        .from('Expense')
        .insert({
          title: expense.title,
          amount: expense.amount,
          category: expense.category,
          date: expense.date.toISOString(),
          account_id: expense.account_id,
          user_id: expense.user_id,
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      return {
        ...data,
        date: new Date(data.date),
      };
    } catch (e: any) {
      throw new Error(`Failed to add expense: ${e.message}`);
    }
  },

  async updateExpense(id: string, expense: Partial<Expense>): Promise<Expense> {
    try {
      const updates: any = {...expense};

      if (updates.date instanceof Date) {
        updates.date = updates.date.toISOString();
      }

      const {data, error} = await supabase
        .from('Expense')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return {
        ...data,
        date: new Date(data.date),
      };
    } catch (e: any) {
      throw new Error(`Failed to update expense: ${e.message}`);
    }
  },

  async deleteExpense(id: string): Promise<void> {
    try {
      const {error} = await supabase.from('Expense').delete().eq('id', id);

      if (error) {
        throw error;
      }
    } catch (e: any) {
      throw new Error(`Failed to delete expense: ${e.message}`);
    }
  },
};

export default expenseService;
