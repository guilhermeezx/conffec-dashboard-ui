import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useForceRecalculateProductionTotals = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (opId?: string) => {
      let ordensToUpdate: string[] = [];

      if (opId) {
        // Se específico para uma OP
        ordensToUpdate = [opId];
      } else {
        // Para todas as OPs - força recálculo geral
        const { data: ordens, error: ordensError } = await supabase
          .from('ordens_producao')
          .select('id');

        if (ordensError) throw ordensError;
        ordensToUpdate = ordens.map(o => o.id);
      }

      for (const ordemId of ordensToUpdate) {
        // Atualizar totais para cada ordem
        const { data: registros, error: registrosError } = await supabase
          .from('registros_producao')
          .select('qtde_produzida, qtde_reprovada, status_inspecao')
          .eq('op_id', ordemId);

        if (registrosError) throw registrosError;

        const qtde_total_produzida = registros
          .filter(r => r.status_inspecao === 'aprovado')
          .reduce((sum, r) => sum + (r.qtde_produzida || 0), 0);

        const qtde_total_reprovada = registros
          .reduce((sum, r) => sum + (r.qtde_reprovada || 0), 0);

        // Atualizar a ordem
        const { error: updateError } = await supabase
          .from('ordens_producao')
          .update({
            qtde_total_produzida,
            qtde_total_reprovada,
            updated_at: new Date().toISOString()
          })
          .eq('id', ordemId);

        if (updateError) throw updateError;
      }

      return true;
    },
    onSuccess: () => {
      // Invalidar as queries para atualizar a UI
      queryClient.invalidateQueries({ queryKey: ['ordens-producao'] });
      queryClient.invalidateQueries({ queryKey: ['ordem-producao'] });
      
      toast({
        title: "Totais recalculados!",
        description: "Os totais de produção foram atualizados com sucesso.",
      });
    },
    onError: (error: any) => {
      console.error('Erro ao recalcular totais:', error);
      toast({
        title: "Erro ao recalcular totais",
        description: "Tente novamente ou contate o administrador.",
        variant: "destructive",
      });
    }
  });
};