import {supabase} from '../utils/supabase';

export type Account = {
  id: string;
  name: string;
  currency: string;
  balance: number;
  color: string;
  user_id: string;
};

const inspectError = (error: any): string => {
  if (!error) {
    return 'Unknown error (null error object)';
  }

  try {
    if (typeof error === 'string') {
      return error;
    }

    const details = {
      message: error.message || 'No message',
      code: error.code || 'No code',
      details: error.details || 'No details',
      hint: error.hint || 'No hint',
      toString: String(error),
      keys: Object.keys(error).join(', '),
    };

    return JSON.stringify(details, null, 2);
  } catch (e) {
    return `Error while inspecting error: ${e}`;
  }
};

const accountService = {
  async getAccounts(): Promise<Account[]> {
    try {
      const {data, error} = await supabase
        .from('Account')
        .select('*')
        .order('name');

      if (error) {
        console.error('Error fetching accounts:', inspectError(error));
        throw error;
      }

      return data || [];
    } catch (e) {
      console.error('Exception in getAccounts:', inspectError(e));
      throw e;
    }
  },

  async addAccount(account: Omit<Account, 'id'>): Promise<Account> {
    try {
      if (!account.name) {
        throw new Error('Account name is required');
      }
      if (!account.currency) {
        throw new Error('Account currency is required');
      }
      if (account.balance === undefined) {
        throw new Error('Account balance is required');
      }
      if (!account.color) {
        throw new Error('Account color is required');
      }
      if (!account.user_id) {
        throw new Error('User ID is required');
      }

      if (account.name === 'Main Account') {
        const {data: existingAccounts} = await supabase
          .from('Account')
          .select('id, name')
          .eq('name', 'Main Account')
          .eq('user_id', account.user_id);

        if (existingAccounts && existingAccounts.length > 0) {
          throw new Error('Main Account already exists');
        }
      }

      const {data, error} = await supabase
        .from('Account')
        .insert(account)
        .select()
        .single();

      if (error) {
        console.error('Supabase error adding account:', inspectError(error));
        throw error;
      }

      if (!data) {
        console.error('No data returned from adding account');
        throw new Error('Failed to create account: No data returned');
      }

      return data;
    } catch (e) {
      console.error('Exception in addAccount service:', inspectError(e));
      throw e;
    }
  },

  async updateAccount(id: string, account: Partial<Account>): Promise<Account> {
    try {
      const {data, error} = await supabase
        .from('Account')
        .update(account)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating account:', inspectError(error));
        throw error;
      }

      if (!data) {
        throw new Error('Failed to update account: No data returned');
      }

      return data;
    } catch (e) {
      console.error('Exception in updateAccount:', inspectError(e));
      throw e;
    }
  },

  async deleteAccount(id: string): Promise<void> {
    try {
      const {error} = await supabase.from('Account').delete().eq('id', id);

      if (error) {
        console.error('Error deleting account:', inspectError(error));
        throw error;
      }
    } catch (e) {
      console.error('Exception in deleteAccount:', inspectError(e));
      throw e;
    }
  },
};

export default accountService;
