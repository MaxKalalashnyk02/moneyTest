import {useState, useEffect, useCallback} from 'react';
import {useAuth} from '../contexts/AuthContext';
import accountService, {Account} from '../services/accountService';
import {supabase} from '../utils/supabase';

const formatError = (error: any): string => {
  if (!error) {
    return 'Unknown error';
  }

  try {
    if (typeof error === 'string') {
      return error;
    }
    if (error.message) {
      return error.message;
    }
    return JSON.stringify(error, null, 2);
  } catch (e) {
    return 'Error while formatting error';
  }
};

export const useAccounts = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const {user} = useAuth();

  const loadAccounts = useCallback(async () => {
    if (!user) {
      setAccounts([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const data = await accountService.getAccounts();

      const mainAccounts = data.filter(
        account => account.name === 'Main Account',
      );
      if (mainAccounts.length > 1) {
        const accountsToDelete = mainAccounts.slice(1);

        for (const account of accountsToDelete) {
          try {
            await accountService.deleteAccount(account.id);
          } catch (deleteError) {
            console.error('Error deleting duplicate account:', deleteError);
          }
        }

        const updatedData = await accountService.getAccounts();
        setAccounts(updatedData);
        return;
      }

      const hasMainAccount = data.some(
        account => account.name === 'Main Account',
      );

      if (data.length === 0 && !hasMainAccount) {
        try {
          const defaultAccount = {
            name: 'Main Account',
            currency: 'USD',
            balance: 0,
            color: '#FF6384',
            user_id: user.id,
          };

          await accountService.addAccount(defaultAccount);

          const updatedData = await accountService.getAccounts();
          setAccounts(updatedData);
        } catch (createError: any) {
          console.error(
            'Error creating default account:',
            formatError(createError),
          );
          setError(
            `Failed to create default account: ${formatError(createError)}`,
          );
        }
      } else {
        setAccounts(data);
      }
    } catch (e: any) {
      console.error('Failed to load accounts:', formatError(e));
      setError(e.message || 'Failed to load accounts');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const addAccount = async (account: Omit<Account, 'id'>) => {
    try {
      setIsLoading(true);
      const newAccount = await accountService.addAccount(account);

      setAccounts(prevAccounts => {
        const updatedAccounts = [...prevAccounts, newAccount];
        return updatedAccounts;
      });

      return newAccount.id;
    } catch (e: any) {
      console.error('Error in addAccount hook:', formatError(e));
      setError(e.message || 'Failed to add account');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updateAccount = async (id: string, account: Partial<Account>) => {
    try {
      setIsLoading(true);
      await accountService.updateAccount(id, account);
      await loadAccounts();
      return true;
    } catch (e: any) {
      console.error('Error updating account:', formatError(e));
      setError(e.message || 'Failed to update account');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteAccount = async (id: string) => {
    try {
      setIsLoading(true);
      await accountService.deleteAccount(id);
      await loadAccounts();
      return true;
    } catch (e: any) {
      console.error('Error deleting account:', formatError(e));
      setError(e.message || 'Failed to delete account');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      setAccounts([]);
      setIsLoading(false);
      return;
    }

    loadAccounts();

    const subscription = supabase
      .channel('public:Account')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'Account',
        },
        () => {
          loadAccounts();
        },
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'Account',
        },
        () => {
          loadAccounts();
        },
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'Account',
        },
        () => {
          loadAccounts();
        },
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user, loadAccounts]);

  return {
    accounts,
    isLoading,
    error,
    loadAccounts,
    addAccount,
    updateAccount,
    deleteAccount,
  };
};
