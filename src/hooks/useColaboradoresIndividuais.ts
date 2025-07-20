import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface ColaboradorIndividual {
  id: string;
  user_id: string;
  nome: string;
  email: string;
  funcao: string;
  tipo_remuneracao: string;
  valor_por_peca?: number;
  situacao: string;
  data_admissao?: string;
  observacoes?: string;
  created_at: string;
  updated_at: string;
}

export const useColaboradoresIndividuais = () => {
  return useQuery({
    queryKey: ['colaboradores-individuais'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('colaboradores_individuais')
        .select('*')
        .order('nome', { ascending: true });

      if (error) {
        console.error('Erro ao buscar colaboradores individuais:', error);
        throw error;
      }

      return data as ColaboradorIndividual[];
    }
  });
};

export const useColaboradorIndividual = (id: string) => {
  return useQuery({
    queryKey: ['colaborador-individual', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('colaboradores_individuais')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Erro ao buscar colaborador individual:', error);
        throw error;
      }

      return data as ColaboradorIndividual;
    },
    enabled: !!id
  });
};

export const useCreateColaboradorIndividual = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (colaboradorData: {
      user_id: string;
      nome: string;
      email: string;
      funcao: string;
      tipo_remuneracao: string;
      valor_por_peca?: number;
      data_admissao?: string;
      observacoes?: string;
    }) => {
      const { data, error } = await supabase
        .from('colaboradores_individuais')
        .insert([colaboradorData])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['colaboradores-individuais'] });
      toast({
        title: "Colaborador criado com sucesso!",
        description: "O colaborador individual foi adicionado ao sistema.",
      });
    },
    onError: (error: any) => {
      console.error('Erro ao criar colaborador individual:', error);
      toast({
        title: "Erro ao criar colaborador",
        description: "Verifique os dados e tente novamente.",
        variant: "destructive",
      });
    }
  });
};

export const useUpdateColaboradorIndividual = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...updates }: { 
      id: string; 
      nome?: string;
      email?: string;
      funcao?: string;
      tipo_remuneracao?: string;
      valor_por_peca?: number;
      situacao?: string;
      data_admissao?: string;
      observacoes?: string;
    }) => {
      const { data, error } = await supabase
        .from('colaboradores_individuais')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['colaboradores-individuais'] });
      queryClient.invalidateQueries({ queryKey: ['colaborador-individual'] });
      toast({
        title: "Colaborador atualizado!",
        description: "As alterações foram salvas com sucesso.",
      });
    },
    onError: (error: any) => {
      console.error('Erro ao atualizar colaborador individual:', error);
      toast({
        title: "Erro ao atualizar colaborador",
        description: "Verifique os dados e tente novamente.",
        variant: "destructive",
      });
    }
  });
};

export const useDeleteColaboradorIndividual = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('colaboradores_individuais')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['colaboradores-individuais'] });
      toast({
        title: "Colaborador excluído",
        description: "O colaborador foi removido do sistema.",
      });
    },
    onError: (error: any) => {
      console.error('Erro ao deletar colaborador individual:', error);
      toast({
        title: "Erro ao excluir colaborador",
        description: "Não foi possível excluir o colaborador.",
        variant: "destructive",
      });
    }
  });
};