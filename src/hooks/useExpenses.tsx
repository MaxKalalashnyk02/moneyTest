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
      setExpenses(data);
      setFilteredExpenses(sortedData);
      return sortedData;
    } catch (e: any) {
      setError(e.message || 'Failed to load expenses');
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [user, sortExpensesByDate, currentSortOrder]);

  const addExpense = async (expense: Omit<Expense, 'id'>) => {
    try {
      const newExpense = await expenseService.addExpense(expense);

      setExpenses(prevExpenses => {
        const updatedExpenses = [...prevExpenses, newExpense];
        return updatedExpenses;
      });

      setFilteredExpenses(prevFiltered => {
        const updatedFiltered = [...prevFiltered, newExpense];
        return sortExpensesByDate(updatedFiltered, currentSortOrder);
      });

      return newExpense.id;
    } catch (e: any) {
      setError(e.message || 'Failed to add expense');
      return false;
    }
  };

  const updateExpense = async (id: string, expense: Partial<Expense>) => {
    try {
      setIsLoading(true);
      await expenseService.updateExpense(id, expense);

      if (expense.amount || expense.date || expense.category) {
        await loadExpenses();
      } else {
        setExpenses(prevExpenses =>
          prevExpenses.map(exp => (exp.id === id ? {...exp, ...expense} : exp)),
        );
        setFilteredExpenses(prevFiltered =>
          prevFiltered.map(exp => (exp.id === id ? {...exp, ...expense} : exp)),
        );
      }

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

      setExpenses(prevExpenses => prevExpenses.filter(exp => exp.id !== id));
      setFilteredExpenses(prevFiltered =>
        prevFiltered.filter(exp => exp.id !== id),
      );

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
      setCurrentSortOrder(sortOrder);

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

      setFilteredExpenses(sortExpensesByDate(filtered, sortOrder));
    },
    [expenses, sortExpensesByDate],
  );

  const changeSortOrder = useCallback(
    (newSortOrder: string) => {
      setCurrentSortOrder(newSortOrder);
      setFilteredExpenses(prevFiltered =>
        sortExpensesByDate(prevFiltered, newSortOrder),
      );
    },
    [sortExpensesByDate],
  );

  useEffect(() => {
    if (!user) {
      setExpenses([]);
      setFilteredExpenses([]);
      setIsLoading(false);
      return;
    }

    loadExpenses();

    const handleDatabaseChange = () => {
      loadExpenses();
    };

    const subscription = supabase
      .channel('public:Expense')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'Expense',
        },
        handleDatabaseChange,
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'Expense',
        },
        handleDatabaseChange,
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'Expense',
        },
        handleDatabaseChange,
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
    changeSortOrder,
    currentSortOrder,
  };
};
