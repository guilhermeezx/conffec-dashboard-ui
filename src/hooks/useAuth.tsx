
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

interface User {
  id: string;
  email: string;
  nome: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  profile: User | null;
  isLoading: boolean;
  loading: boolean;
  signIn: (email: string, password?: string) => Promise<void>;
  signUp: (email: string, password: string, nome: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  const canRegisterProduction = () => {
    if (!context.user) return false;
    return ['admin', 'ceo', 'encarregado', 'lider_grupo'].includes(context.user.role);
  };

  const canApproveProduction = () => {
    if (!context.user) return false;
    return ['admin', 'ceo', 'inspetor'].includes(context.user.role);
  };

  const canManageGroups = () => {
    if (!context.user) return false;
    return ['admin', 'ceo', 'encarregado'].includes(context.user.role);
  };

  const canManageOrders = () => {
    if (!context.user) return false;
    return ['admin', 'ceo', 'encarregado'].includes(context.user.role);
  };

  return {
    ...context,
    canRegisterProduction,
    canApproveProduction,
    canManageGroups,
    canManageOrders
  };
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select(`id, nome, email, role`)
          .eq('id', session.user.id)
          .single();

        if (error) {
          console.error('Erro ao buscar perfil:', error);
          setUser(null);
        } else {
          setUser(profile as User);
        }
      } else {
        setUser(null);
      }
      setIsLoading(false);
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select(`id, nome, email, role`)
          .eq('id', session.user.id)
          .single();

        if (error) {
          console.error('Erro ao buscar perfil:', error);
          setUser(null);
        } else {
          setUser(profile as User);
        }
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const signIn = async (email: string, password?: string) => {
    try {
      if (password) {
        // Email/password login
        const { error } = await supabase.auth.signInWithPassword({ 
          email, 
          password 
        });
        if (error) throw error;
      } else {
        // Magic link login
        const { error } = await supabase.auth.signInWithOtp({ email });
        if (error) throw error;
        alert('Verifique seu email para o link de login mágico!');
      }
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      throw error;
    }
  };

  const signUp = async (email: string, password: string, nome: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            nome: nome
          }
        }
      });
      if (error) throw error;
      alert('Verifique seu email para confirmar o cadastro!');
    } catch (error) {
      console.error("Erro ao fazer cadastro:", error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      navigate('/auth');
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  const value: AuthContextType = {
    user,
    profile: user, // profile is the same as user
    isLoading,
    loading: isLoading, // for backward compatibility
    signIn,
    signUp,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
