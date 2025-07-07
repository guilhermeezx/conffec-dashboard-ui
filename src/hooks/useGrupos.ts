
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Grupo {
  id: string;
  nome: string;
  setor: string;
  meta_diaria?: number;
  created_at: string;
  updated_at: string;
}

export const useGrupos = () => {
  return useQuery({
    queryKey: ['grupos'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('grupos')
        .select('*')
        .order('nome', { ascending: true });

      if (error) {
        console.error('Erro ao buscar grupos:', error);
        throw error;
      }

      return data as Grupo[];
    }
  });
};

export const useGrupo = (id: string) => {
  return useQuery({
    queryKey: ['grupo', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('grupos')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Erro ao buscar grupo:', error);
        throw error;
      }

      return data as Grupo;
    },
    enabled: !!id
  });
};

export const useCreateGrupo = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (grupoData: {
      nome: string;
      setor: string;
      meta_diaria?: number;
    }) => {
      const { data, error } = await supabase
        .from('grupos')
        .insert([grupoData])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['grupos'] });
      toast({
        title: "Grupo criado com sucesso!",
        description: "O novo grupo foi adicionado ao sistema.",
      });
    },
    onError: (error: any) => {
      console.error('Erro ao criar grupo:', error);
      toast({
        title: "Erro ao criar grupo",
        description: "Verifique os dados e tente novamente.",
        variant: "destructive",
      });
    }
  });
};

export const useUpdateGrupo = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...updates }: { 
      id: string; 
      nome?: string;
      setor?: string;
      meta_diaria?: number;
    }) => {
      const { data, error } = await supabase
        .from('grupos')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['grupos'] });
      queryClient.invalidateQueries({ queryKey: ['grupo'] });
      toast({
        title: "Grupo atualizado!",
        description: "As alterações foram salvas com sucesso.",
      });
    },
    onError: (error: any) => {
      console.error('Erro ao atualizar grupo:', error);
      toast({
        title: "Erro ao atualizar grupo",
        description: "Verifique os dados e tente novamente.",
        variant: "destructive",
      });
    }
  });
};

export const useDeleteGrupo = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('grupos')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['grupos'] });
      toast({
        title: "Grupo excluído",
        description: "O grupo foi removido do sistema.",
      });
    },
    onError: (error: any) => {
      console.error('Erro ao deletar grupo:', error);
      toast({
        title: "Erro ao excluir grupo",
        description: "Não foi possível excluir o grupo. Verifique se ele não possui ordens de produção associadas.",
        variant: "destructive",
      });
    }
  });
};
