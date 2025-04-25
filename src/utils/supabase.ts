import 'react-native-url-polyfill/auto';
import {createClient} from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {SUPABASE_URL, SUPABASE_ANON_KEY} from '@env';

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error(
    'Missing Supabase environment variables. Check your .env file.',
  );
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

const testConnection = async () => {
  try {
    const {error} = await supabase
      .from('Account')
      .select('count', {count: 'exact', head: true});

    if (error) {
      console.error('Supabase connection failed:', error.message);
    }
  } catch (err) {
    console.error('Supabase connection error');
  }
};

testConnection();
