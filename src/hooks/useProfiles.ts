import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

type UserRole = 'admin' | 'ceo' | 'encarregado' | 'lider_grupo' | 'inspetor' | 'financeiro' | 'colaborador';

export interface Profile {
  id: string;
  email: string;
  nome: string;
  cpf?: string;
  telefone?: string;
  role: UserRole;
  grupo_id?: string;
  data_admissao?: string;
  situacao?: string;
  created_at: string;
  updated_at: string;
}

export interface ProfileCompleto extends Profile {
  grupos?: {
    id: string;
    nome: string;
    setor: string;
  };
}

export const useProfiles = () => {
  return useQuery({
    queryKey: ['profiles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          *,
          grupos (
            id,
            nome,
            setor
          )
        `)
        .order('nome', { ascending: true });

      if (error) {
        console.error('Erro ao buscar profiles:', error);
        throw error;
      }

      return data as ProfileCompleto[];
    }
  });
};

export const useProfile = (id: string) => {
  return useQuery({
    queryKey: ['profile', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          *,
          grupos (
            id,
            nome,
            setor
          )
        `)
        .eq('id', id)
        .single();

      if (error) {
        console.error('Erro ao buscar profile:', error);
        throw error;
      }

      return data as ProfileCompleto;
    },
    enabled: !!id
  });
};

// Profiles são criados automaticamente via auth trigger

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...updates }: { 
      id: string; 
      email?: string;
      nome?: string;
      cpf?: string;
      telefone?: string;
      role?: UserRole;
      grupo_id?: string;
      data_admissao?: string;
      situacao?: string;
    }) => {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profiles'] });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast({
        title: "Colaborador atualizado!",
        description: "As alterações foram salvas com sucesso.",
      });
    },
    onError: (error: any) => {
      console.error('Erro ao atualizar colaborador:', error);
      toast({
        title: "Erro ao atualizar colaborador",
        description: "Verifique os dados e tente novamente.",
        variant: "destructive",
      });
    }
  });
};

export const useDeleteProfile = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profiles'] });
      toast({
        title: "Colaborador excluído",
        description: "O colaborador foi removido do sistema.",
      });
    },
    onError: (error: any) => {
      console.error('Erro ao deletar colaborador:', error);
      toast({
        title: "Erro ao excluir colaborador",
        description: "Não foi possível excluir o colaborador.",
        variant: "destructive",
      });
    }
  });
};