import { useState, useEffect } from 'react';
import { useUpdateMeta, MetaCompleta } from '@/hooks/useMetas';
import { useGrupos } from '@/hooks/useGrupos';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface EditarMetaDialogProps {
  meta: MetaCompleta | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function EditarMetaDialog({ meta, open, onOpenChange }: EditarMetaDialogProps) {
  const updateMeta = useUpdateMeta();
  const { data: grupos } = useGrupos();
  
  const [formData, setFormData] = useState({
    grupo_id: '',
    valor_meta: '',
    periodo_inicio: '',
    periodo_fim: '',
    tipo: 'diaria'
  });

  useEffect(() => {
    if (meta) {
      setFormData({
        grupo_id: meta.grupo_id || '',
        valor_meta: meta.valor_meta.toString(),
        periodo_inicio: meta.periodo_inicio,
        periodo_fim: meta.periodo_fim,
        tipo: meta.tipo
      });
    }
  }, [meta]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!meta) return;
    
    try {
      await updateMeta.mutateAsync({
        id: meta.id,
        grupo_id: formData.grupo_id || undefined,
        valor_meta: parseInt(formData.valor_meta),
        periodo_inicio: formData.periodo_inicio,
        periodo_fim: formData.periodo_fim,
        tipo: formData.tipo
      });

      onOpenChange(false);
    } catch (error) {
      console.error('Erro ao atualizar meta:', error);
    }
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Editar Meta</DialogTitle>
          <DialogDescription>
            Atualize as informações da meta selecionada.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="tipo">Tipo de Meta *</Label>
            <Select value={formData.tipo} onValueChange={(value) => updateFormData('tipo', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="diaria">Diária</SelectItem>
                <SelectItem value="semanal">Semanal</SelectItem>
                <SelectItem value="mensal">Mensal</SelectItem>
                <SelectItem value="anual">Anual</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="grupo_id">Grupo (Opcional)</Label>
            <Select value={formData.grupo_id} onValueChange={(value) => updateFormData('grupo_id', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um grupo ou deixe vazio para meta geral" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Meta Geral</SelectItem>
                {grupos?.map((grupo) => (
                  <SelectItem key={grupo.id} value={grupo.id}>
                    {grupo.nome} - {grupo.setor}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="valor_meta">Valor da Meta *</Label>
            <Input
              id="valor_meta"
              type="number"
              value={formData.valor_meta}
              onChange={(e) => updateFormData('valor_meta', e.target.value)}
              placeholder="Ex: 500"
              min="1"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="periodo_inicio">Data Início *</Label>
              <Input
                id="periodo_inicio"
                type="date"
                value={formData.periodo_inicio}
                onChange={(e) => updateFormData('periodo_inicio', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="periodo_fim">Data Fim *</Label>
              <Input
                id="periodo_fim"
                type="date"
                value={formData.periodo_fim}
                onChange={(e) => updateFormData('periodo_fim', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={updateMeta.isPending}>
              {updateMeta.isPending ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}