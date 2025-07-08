
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
    let mounted = true;

    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (!mounted) return;

        if (error) {
          console.error('Erro ao buscar sessão:', error);
          setUser(null);
          setIsLoading(false);
          return;
        }
        
        if (session?.user) {
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select(`id, nome, email, role`)
            .eq('id', session.user.id)
            .single();

          if (!mounted) return;

          if (profileError) {
            console.error('Erro ao buscar perfil:', profileError);
            setUser(null);
          } else {
            setUser(profile as User);
          }
        } else {
          setUser(null);
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Erro na inicialização da sessão:', error);
        if (mounted) {
          setUser(null);
          setIsLoading(false);
        }
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state change:', event, session?.user?.email);
      
      if (!mounted) return;

      if (session?.user) {
        try {
          const { data: profile, error } = await supabase
            .from('profiles')
            .select(`id, nome, email, role`)
            .eq('id', session.user.id)
            .single();

          if (!mounted) return;

          if (error) {
            console.error('Erro ao buscar perfil:', error);
            setUser(null);
          } else {
            setUser(profile as User);
            // Navigate to dashboard on successful login
            if (event === 'SIGNED_IN') {
              navigate('/');
            }
          }
        } catch (error) {
          console.error('Erro ao processar perfil:', error);
          if (mounted) setUser(null);
        }
      } else {
        setUser(null);
      }
      
      if (mounted) setIsLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [navigate]);

  const signIn = async (email: string, password?: string) => {
    try {
      setIsLoading(true);
      
      if (password) {
        // Email/password login
        const { error } = await supabase.auth.signInWithPassword({ 
          email, 
          password 
        });
        if (error) {
          console.error('Erro no login:', error);
          throw error;
        }
      } else {
        // Magic link login
        const { error } = await supabase.auth.signInWithOtp({ email });
        if (error) {
          console.error('Erro no magic link:', error);
          throw error;
        }
        alert('Verifique seu email para o link de login mágico!');
      }
    } catch (error) {
      setIsLoading(false);
      console.error("Erro ao fazer login:", error);
      throw error;
    }
  };

  const signUp = async (email: string, password: string, nome: string) => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            nome: nome
          }
        }
      });
      if (error) {
        console.error('Erro no cadastro:', error);
        throw error;
      }
      alert('Verifique seu email para confirmar o cadastro!');
    } catch (error) {
      setIsLoading(false);
      console.error("Erro ao fazer cadastro:", error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      setIsLoading(true);
      await supabase.auth.signOut();
      setUser(null);
      navigate('/auth');
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    } finally {
      setIsLoading(false);
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
