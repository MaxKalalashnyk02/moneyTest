import {useState, useEffect, useCallback} from 'react';
import {useAuth} from '../contexts/AuthContext';
import expenseService, {Expense} from '../services/expenseService';
import {supabase} from '../utils/supabase';

export const useExpenses = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [filteredExpenses, setFilteredExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentSortOrder, setCurrentSortOrder] = useState<string>('desc');
  const {user} = useAuth();

  const sortExpensesByDate = useCallback(
    (expenseList: Expense[], order: string = 'desc') => {
      return [...expenseList].sort((a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();

        return order === 'desc' ? dateB - dateA : dateA - dateB;
      });
    },
    [],
  );

  const loadExpenses = useCallback(async () => {
    if (!user) {
      setExpenses([]);
      setFilteredExpenses([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const data = await expenseService.getExpenses();

      const sortedData = sortExpensesByDate(data, currentSortOrder);

      setExpenses(sortedData);
      setFilteredExpenses(sortedData);
    } catch (e: any) {
      setError(e.message || 'Failed to load expenses');
    } finally {
      setIsLoading(false);
    }
  }, [user, sortExpensesByDate, currentSortOrder]);

  const addExpense = async (expense: Omit<Expense, 'id'>) => {
    try {
      setIsLoading(true);
      const newExpense = await expenseService.addExpense(expense);

      setExpenses(prevExpenses => {
        const updatedExpenses = [...prevExpenses, newExpense];
        return sortExpensesByDate(updatedExpenses, currentSortOrder);
      });

      setFilteredExpenses(prevFiltered => {
        const updatedFiltered = [...prevFiltered, newExpense];
        return sortExpensesByDate(updatedFiltered, currentSortOrder);
      });

      return newExpense.id;
    } catch (e: any) {
      setError(e.message || 'Failed to add expense');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updateExpense = async (id: string, expense: Partial<Expense>) => {
    try {
      setIsLoading(true);
      await expenseService.updateExpense(id, expense);
      await loadExpenses();
      return true;
    } catch (e: any) {
      setError(e.message || 'Failed to update expense');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteExpense = async (id: string) => {
    try {
      setIsLoading(true);
      await expenseService.deleteExpense(id);
      await loadExpenses();
      return true;
    } catch (e: any) {
      setError(e.message || 'Failed to delete expense');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const filterExpenses = useCallback(
    (
      startDate: Date | null,
      endDate: Date | null,
      categories: string[],
      sortOrder: string = 'desc',
    ) => {
      if (sortOrder !== currentSortOrder) {
        setCurrentSortOrder(sortOrder);
      }

      let filtered = [...expenses];

      if (startDate) {
        filtered = filtered.filter(
          expense => new Date(expense.date) >= startDate,
        );
      }

      if (endDate) {
        filtered = filtered.filter(
          expense => new Date(expense.date) <= endDate,
        );
      }

      if (categories && categories.length > 0) {
        filtered = filtered.filter(expense =>
          categories.includes(expense.category),
        );
      }

      const sortedFiltered = sortExpensesByDate(filtered, sortOrder);
      setFilteredExpenses(sortedFiltered);
    },
    [expenses, sortExpensesByDate, currentSortOrder],
  );

  useEffect(() => {
    if (!user) {
      setExpenses([]);
      setFilteredExpenses([]);
      setIsLoading(false);
      return;
    }

    loadExpenses();

    const subscription = supabase
      .channel('public:Expense')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'Expense',
        },
        () => {
          loadExpenses();
        },
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'Expense',
        },
        () => {
          loadExpenses();
        },
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'Expense',
        },
        () => {
          loadExpenses();
        },
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user, loadExpenses]);

  return {
    expenses: filteredExpenses,
    allExpenses: expenses,
    isLoading,
    error,
    loadExpenses,
    addExpense,
    updateExpense,
    deleteExpense,
    filterExpenses,
    currentSortOrder,
  };
};
