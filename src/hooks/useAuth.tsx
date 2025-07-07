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
  isLoading: boolean;
  signIn: (email: string) => Promise<void>;
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
    const session = supabase.auth.getSession();

    supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.session?.user) {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select(`id, nome, email, role`)
          .eq('id', session.session.user.id)
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

    if (session) {
      const getUserProfile = async () => {
        if (session.data?.session?.user) {
          const { data: profile, error } = await supabase
            .from('profiles')
            .select(`id, nome, email, role`)
            .eq('id', session.data.session.user.id)
            .single();

          if (error) {
            console.error('Erro ao buscar perfil:', error);
            setUser(null);
          } else {
            setUser(profile as User);
          }
        }
        setIsLoading(false);
      };
      getUserProfile();
    } else {
      setIsLoading(false);
    }
  }, [navigate]);

  const signIn = async (email: string) => {
    try {
      const { error } = await supabase.auth.signInWithOtp({ email });
      if (error) throw error;
      alert('Verifique seu email para o link de login mágico!');
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      alert("Erro ao fazer login: " + error);
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
    isLoading,
    signIn,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};
