
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

type UserRole = 'admin' | 'ceo' | 'encarregado' | 'lider_grupo' | 'inspetor' | 'financeiro' | 'colaborador';

interface Profile {
  id: string;
  email: string;
  nome: string;
  cpf?: string;
  telefone?: string;
  data_admissao?: string;
  situacao?: string;
  role: UserRole;
  grupo_id?: string;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: any }>;
  signUp: (email: string, password: string, nome: string) => Promise<{ error?: any }>;
  signOut: () => Promise<void>;
  hasRole: (role: UserRole) => boolean;
  isAdminOrCeo: () => boolean;
  canManageGroups: () => boolean;
  canRegisterProduction: () => boolean;
  canApproveProduction: () => boolean;
  canAccessFinancial: () => boolean;
  canAccessDocuments: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const cleanupAuthState = () => {
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        localStorage.removeItem(key);
      }
    });
  };

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Erro ao buscar perfil:', error);
        return;
      }

      setProfile(data);
    } catch (error) {
      console.error('Erro ao buscar perfil:', error);
    }
  };

  useEffect(() => {
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Defer profile fetching to prevent deadlocks
          setTimeout(() => {
            fetchUserProfile(session.user.id);
          }, 0);
        } else {
          setProfile(null);
        }
        
        setLoading(false);
      }
    );

    // Then check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        setTimeout(() => {
          fetchUserProfile(session.user.id);
        }, 0);
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      // Clean up existing state
      cleanupAuthState();
      
      // Attempt global sign out first
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        // Continue even if this fails
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          toast({
            title: "Erro de Login",
            description: "Email ou senha incorretos. Verifique suas credenciais.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Erro de Login",
            description: error.message,
            variant: "destructive",
          });
        }
        return { error };
      }

      if (data.user) {
        toast({
          title: "Login realizado com sucesso!",
          description: "Bem-vindo ao Conffec.",
        });
        
        // Force page reload for clean state
        setTimeout(() => {
          window.location.href = '/';
        }, 500);
      }

      return { error: null };
    } catch (error: any) {
      console.error('Erro no login:', error);
      toast({
        title: "Erro de Login",
        description: "Ocorreu um erro inesperado. Tente novamente.",
        variant: "destructive",
      });
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, nome: string) => {
    try {
      setLoading(true);
      
      const redirectUrl = `${window.location.origin}/`;

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            nome: nome,
          }
        }
      });

      if (error) {
        if (error.message.includes('User already registered')) {
          toast({
            title: "Usuário já cadastrado",
            description: "Este email já está registrado. Tente fazer login.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Erro no Cadastro",
            description: error.message,
            variant: "destructive",
          });
        }
        return { error };
      }

      if (data.user) {
        toast({
          title: "Cadastro realizado!",
          description: "Verifique seu email para confirmar a conta.",
        });
      }

      return { error: null };
    } catch (error: any) {
      console.error('Erro no cadastro:', error);
      toast({
        title: "Erro no Cadastro",
        description: "Ocorreu um erro inesperado. Tente novamente.",
        variant: "destructive",
      });
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      cleanupAuthState();
      
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        // Ignore errors
      }
      
      toast({
        title: "Logout realizado",
        description: "Você foi desconectado com sucesso.",
      });
      
      // Force page reload
      setTimeout(() => {
        window.location.href = '/auth';
      }, 500);
    } catch (error) {
      console.error('Erro no logout:', error);
    }
  };

  // Permission helper functions
  const hasRole = (role: UserRole): boolean => {
    return profile?.role === role && profile?.situacao === 'ativo';
  };

  const isAdminOrCeo = (): boolean => {
    return hasRole('admin') || hasRole('ceo');
  };

  const canManageGroups = (): boolean => {
    return hasRole('admin') || hasRole('ceo') || hasRole('encarregado');
  };

  const canRegisterProduction = (): boolean => {
    return hasRole('admin') || hasRole('ceo') || hasRole('encarregado') || hasRole('lider_grupo');
  };

  const canApproveProduction = (): boolean => {
    return hasRole('admin') || hasRole('ceo') || hasRole('inspetor');
  };

  const canAccessFinancial = (): boolean => {
    return hasRole('admin') || hasRole('ceo') || hasRole('financeiro');
  };

  const canAccessDocuments = (): boolean => {
    return hasRole('admin');
  };

  const value = {
    user,
    profile,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    hasRole,
    isAdminOrCeo,
    canManageGroups,
    canRegisterProduction,
    canApproveProduction,
    canAccessFinancial,
    canAccessDocuments,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
