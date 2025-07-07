
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface OrdemProducao {
  id: string;
  numero_op: string;
  produto: string;
  tipo_peca?: string;
  grupo_id?: string;
  qtde_total_produzida?: number;
  qtde_total_reprovada?: number;
  status?: string;
  prazo_entrega?: string;
  meta_producao?: number;
  created_at: string;
  updated_at: string;
  grupos?: {
    id: string;
    nome: string;
    setor: string;
  };
}

export const useOrdens = () => {
  const { toast } = useToast();

  return useQuery({
    queryKey: ['ordens-producao'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ordens_producao')
        .select(`
          *,
          grupos:grupo_id (
            id,
            nome,
            setor
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao buscar ordens:', error);
        throw error;
      }

      return data as OrdemProducao[];
    }
  });
};

export const useOrdem = (id: string) => {
  return useQuery({
    queryKey: ['ordem-producao', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ordens_producao')
        .select(`
          *,
          grupos:grupo_id (
            id,
            nome,
            setor
          )
        `)
        .eq('id', id)
        .single();

      if (error) {
        console.error('Erro ao buscar ordem:', error);
        throw error;
      }

      return data as OrdemProducao;
    },
    enabled: !!id
  });
};

export const useCreateOrdem = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (ordemData: Partial<OrdemProducao>) => {
      const { data, error } = await supabase
        .from('ordens_producao')
        .insert([ordemData])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ordens-producao'] });
      toast({
        title: "Ordem criada com sucesso!",
        description: "A nova ordem de produção foi registrada no sistema.",
      });
    },
    onError: (error: any) => {
      console.error('Erro ao criar ordem:', error);
      toast({
        title: "Erro ao criar ordem",
        description: "Verifique os dados e tente novamente.",
        variant: "destructive",
      });
    }
  });
};

export const useUpdateOrdem = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<OrdemProducao> & { id: string }) => {
      const { data, error } = await supabase
        .from('ordens_producao')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ordens-producao'] });
      queryClient.invalidateQueries({ queryKey: ['ordem-producao'] });
      toast({
        title: "Ordem atualizada!",
        description: "As alterações foram salvas com sucesso.",
      });
    },
    onError: (error: any) => {
      console.error('Erro ao atualizar ordem:', error);
      toast({
        title: "Erro ao atualizar ordem",
        description: "Verifique os dados e tente novamente.",
        variant: "destructive",
      });
    }
  });
};
