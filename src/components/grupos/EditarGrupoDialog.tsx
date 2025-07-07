
import { useState, useEffect } from 'react';
import { useUpdateGrupo } from '@/hooks/useGrupos';
import { Grupo } from '@/hooks/useGrupos';
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

interface EditarGrupoDialogProps {
  grupo: Grupo | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function EditarGrupoDialog({ grupo, open, onOpenChange }: EditarGrupoDialogProps) {
  const updateGrupo = useUpdateGrupo();
  
  const [formData, setFormData] = useState({
    nome: '',
    setor: '',
    meta_diaria: ''
  });

  useEffect(() => {
    if (grupo) {
      setFormData({
        nome: grupo.nome,
        setor: grupo.setor,
        meta_diaria: grupo.meta_diaria?.toString() || ''
      });
    }
  }, [grupo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!grupo) return;

    try {
      await updateGrupo.mutateAsync({
        id: grupo.id,
        nome: formData.nome,
        setor: formData.setor,
        meta_diaria: formData.meta_diaria ? parseInt(formData.meta_diaria) : undefined
      });

      onOpenChange(false);
    } catch (error) {
      console.error('Erro ao atualizar grupo:', error);
    }
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Editar Grupo</DialogTitle>
          <DialogDescription>
            Atualize as informações do grupo.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome do Grupo *</Label>
            <Input
              id="nome"
              value={formData.nome}
              onChange={(e) => updateFormData('nome', e.target.value)}
              placeholder="Ex: Montagem A"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="setor">Setor *</Label>
            <Input
              id="setor"
              value={formData.setor}
              onChange={(e) => updateFormData('setor', e.target.value)}
              placeholder="Ex: Produção"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="meta_diaria">Meta Diária</Label>
            <Input
              id="meta_diaria"
              type="number"
              value={formData.meta_diaria}
              onChange={(e) => updateFormData('meta_diaria', e.target.value)}
              placeholder="100"
              min="0"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={updateGrupo.isPending}>
              {updateGrupo.isPending ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
