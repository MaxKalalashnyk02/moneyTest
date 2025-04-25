import React, {createContext, useState, useContext, useEffect} from 'react';
import {supabase} from '../utils/supabase';
import {Session, User, AuthError} from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  error: string | null;
  resetError: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: false,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  error: null,
  resetError: () => {},
});

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkSession();

    const {data: authListener} = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        setSession(newSession);
        setUser(newSession?.user ?? null);
        setLoading(false);
      },
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const checkSession = async () => {
    try {
      const {
        data: {session: currentSession},
      } = await supabase.auth.getSession();

      setSession(currentSession);
      setUser(currentSession?.user ?? null);
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  const resetError = () => {
    setError(null);
  };

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);

      const {error: signInError} = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        throw signInError;
      }
    } catch (e: any) {
      const authError = e as AuthError;
      setError(authError.message || 'An error occurred during login');
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      setLoading(true);
      setError(null);

      const {data, error: signUpError} = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
          emailRedirectTo: undefined,
        },
      });

      if (signUpError) {
        throw signUpError;
      }

      if (
        data?.user &&
        !data.user.identities?.[0]?.identity_data?.email_confirmed_at
      ) {
        setError(
          'Please check your email to confirm your account before logging in',
        );
      } else if (data?.user) {
        const {error: signInError} = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) {
          throw signInError;
        }
      }
    } catch (e: any) {
      const authError = e as AuthError;
      setError(authError.message || 'An error occurred during registration');
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      const {error: signOutError} = await supabase.auth.signOut();

      if (signOutError) {
        throw signOutError;
      }
    } catch (e: any) {
      const authError = e as AuthError;
      setError(authError.message || 'An error occurred during logout');
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        login,
        register,
        logout,
        error,
        resetError,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
