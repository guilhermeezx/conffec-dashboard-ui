import { useState } from 'react';
import { useCreateMeta } from '@/hooks/useMetas';
import { useGrupos } from '@/hooks/useGrupos';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { Plus } from 'lucide-react';

export default function CriarMetaDialog() {
  const createMeta = useCreateMeta();
  const { data: grupos } = useGrupos();
  const [open, setOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    grupo_id: '',
    valor_meta: '',
    periodo_inicio: '',
    periodo_fim: '',
    tipo: 'diaria'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await createMeta.mutateAsync({
        grupo_id: formData.grupo_id || undefined,
        valor_meta: parseInt(formData.valor_meta),
        periodo_inicio: formData.periodo_inicio,
        periodo_fim: formData.periodo_fim,
        tipo: formData.tipo
      });

      setFormData({
        grupo_id: '',
        valor_meta: '',
        periodo_inicio: '',
        periodo_fim: '',
        tipo: 'diaria'
      });
      setOpen(false);
    } catch (error) {
      console.error('Erro ao criar meta:', error);
    }
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Nova Meta
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Criar Nova Meta</DialogTitle>
          <DialogDescription>
            Defina uma nova meta para um grupo ou para a empresa como um todo.
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
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={createMeta.isPending}>
              {createMeta.isPending ? 'Criando...' : 'Criar Meta'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}