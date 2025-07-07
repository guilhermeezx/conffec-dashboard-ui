
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useGrupos } from '@/hooks/useGrupos';
import { useCreateRegistroProducao } from '@/hooks/useRegistrosProducao';
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
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus } from 'lucide-react';

interface RegistrarProducaoDialogProps {
  opId: string;
}

export default function RegistrarProducaoDialog({ opId }: RegistrarProducaoDialogProps) {
  const { user } = useAuth();
  const { data: grupos } = useGrupos();
  const createRegistro = useCreateRegistroProducao();
  const [open, setOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    grupo_id: '',
    qtde_produzida: '',
    qtde_reprovada: '',
    observacoes: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;

    try {
      await createRegistro.mutateAsync({
        op_id: opId,
        grupo_id: formData.grupo_id,
        responsavel_id: user.id,
        qtde_produzida: parseInt(formData.qtde_produzida),
        qtde_reprovada: formData.qtde_reprovada ? parseInt(formData.qtde_reprovada) : 0,
        observacoes: formData.observacoes || null,
        status_inspecao: 'pendente'
      });

      setFormData({
        grupo_id: '',
        qtde_produzida: '',
        qtde_reprovada: '',
        observacoes: ''
      });
      setOpen(false);
    } catch (error) {
      console.error('Erro ao registrar produção:', error);
    }
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-2">
          <Plus className="w-4 h-4" />
          Registrar Produção
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Registrar Produção</DialogTitle>
          <DialogDescription>
            Registre a quantidade produzida pelo grupo nesta ordem.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="grupo_id">Grupo *</Label>
            <Select value={formData.grupo_id} onValueChange={(value) => updateFormData('grupo_id', value)} required>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o grupo" />
              </SelectTrigger>
              <SelectContent>
                {grupos?.map((grupo) => (
                  <SelectItem key={grupo.id} value={grupo.id}>
                    {grupo.nome} ({grupo.setor})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="qtde_produzida">Qtd. Produzida *</Label>
              <Input
                id="qtde_produzida"
                type="number"
                value={formData.qtde_produzida}
                onChange={(e) => updateFormData('qtde_produzida', e.target.value)}
                placeholder="50"
                min="0"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="qtde_reprovada">Qtd. Reprovada</Label>
              <Input
                id="qtde_reprovada"
                type="number"
                value={formData.qtde_reprovada}
                onChange={(e) => updateFormData('qtde_reprovada', e.target.value)}
                placeholder="0"
                min="0"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="observacoes">Observações</Label>
            <Textarea
              id="observacoes"
              value={formData.observacoes}
              onChange={(e) => updateFormData('observacoes', e.target.value)}
              placeholder="Detalhes sobre a produção..."
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={createRegistro.isPending}>
              {createRegistro.isPending ? 'Registrando...' : 'Registrar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
