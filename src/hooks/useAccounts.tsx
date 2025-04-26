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

  const cleanupDuplicateMainAccounts = async (
    accountsList: Account[],
  ): Promise<Account[]> => {
    try {
      const mainAccounts = accountsList.filter(
        acc => acc.name === 'Main Account',
      );

      if (mainAccounts.length > 1) {
        const primaryAccount = mainAccounts[0];
        const duplicatesToDelete = mainAccounts.slice(1);

        console.log(
          'Found duplicate Main Accounts to delete:',
          duplicatesToDelete.length,
        );

        for (const account of duplicatesToDelete) {
          try {
            await accountService.deleteAccount(account.id);
          } catch (err) {
            console.error('Error deleting duplicate account:', err);
          }
        }

        return accountsList.filter(acc => {
          return acc.name !== 'Main Account' || acc.id === primaryAccount.id;
        });
      }

      return accountsList;
    } catch (err) {
      console.error('Error in cleanup:', err);
      return accountsList;
    }
  };

  const createMainAccount = async (userId: string): Promise<boolean> => {
    try {
      const {data} = await supabase
        .from('Account')
        .select('id, name')
        .eq('name', 'Main Account')
        .eq('user_id', userId);

      if (data && data.length > 0) {
        console.log('Main Account already exists, skipping creation');
        return true;
      }

      const defaultAccount = {
        name: 'Main Account',
        currency: 'USD',
        balance: 0,
        color: '#FF6384',
        user_id: userId,
      };

      await accountService.addAccount(defaultAccount);
      return true;
    } catch (err: any) {
      const errorMsg = err.message || '';
      if (errorMsg.includes('Main Account already exists')) {
        console.log('Race condition during Main Account creation, continuing');
        return true;
      }

      console.error('Error creating Main Account:', formatError(err));
      return false;
    }
  };

  const loadAccounts = useCallback(async () => {
    if (!user) {
      setAccounts([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      let data = await accountService.getAccounts();

      const cleanedAccounts = await cleanupDuplicateMainAccounts(data);

      const hasMainAccount = cleanedAccounts.some(
        acc => acc.name === 'Main Account',
      );

      if (cleanedAccounts.length === 0 && !hasMainAccount) {
        await createMainAccount(user.id);

        data = await accountService.getAccounts();
      } else {
        data = cleanedAccounts;
      }

      setAccounts(data);
    } catch (e: any) {
      if (e.message && e.message.includes('Main Account already exists')) {
        console.log('Suppressing "Main Account already exists" error');
        try {
          const data = await accountService.getAccounts();
          setAccounts(data);
        } catch (retryError) {
          console.error(
            'Error on retry load accounts:',
            formatError(retryError),
          );
          setError('Failed to load accounts');
        }
      } else {
        console.error('Failed to load accounts:', formatError(e));
        setError(e.message || 'Failed to load accounts');
      }
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const addAccount = async (account: Omit<Account, 'id'>) => {
    try {
      setIsLoading(true);

      const isMainAccount = account.name === 'Main Account';
      const mainAccountExists = accounts.some(
        acc => acc.name === 'Main Account',
      );

      if (isMainAccount && mainAccountExists) {
        throw new Error('Main Account already exists');
      }

      const newAccount = await accountService.addAccount(account);

      setAccounts(prevAccounts => {
        const updatedAccounts = [...prevAccounts, newAccount];
        return updatedAccounts;
      });

      return newAccount.id;
    } catch (e: any) {
      if (e.message && e.message.includes('Main Account already exists')) {
        console.log(
          'Suppressing "Main Account already exists" error in addAccount',
        );

        await loadAccounts();

        const mainAccount = accounts.find(acc => acc.name === 'Main Account');
        if (mainAccount) {
          return mainAccount.id;
        }
        return false;
      }

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

      if (account.name === 'Main Account') {
        const existingMainAccount = accounts.find(acc => {
          return acc.name === 'Main Account' && acc.id !== id;
        });

        if (existingMainAccount) {
          throw new Error('Main Account already exists');
        }
      }

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

      const accountToDelete = accounts.find(acc => acc.id === id);
      if (accountToDelete?.name === 'Main Account') {
        throw new Error('Cannot delete Main Account');
      }

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
