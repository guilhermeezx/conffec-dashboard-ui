
import { useState } from 'react';
import { useCreateGrupo } from '@/hooks/useGrupos';
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
import { Plus } from 'lucide-react';

export default function CriarGrupoDialog() {
  const createGrupo = useCreateGrupo();
  const [open, setOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    nome: '',
    setor: '',
    meta_diaria: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await createGrupo.mutateAsync({
        nome: formData.nome,
        setor: formData.setor,
        meta_diaria: formData.meta_diaria ? parseInt(formData.meta_diaria) : undefined
      });

      setFormData({
        nome: '',
        setor: '',
        meta_diaria: ''
      });
      setOpen(false);
    } catch (error) {
      console.error('Erro ao criar grupo:', error);
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
          Novo Grupo
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Criar Novo Grupo</DialogTitle>
          <DialogDescription>
            Adicione um novo grupo de trabalho ao sistema.
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
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={createGrupo.isPending}>
              {createGrupo.isPending ? 'Criando...' : 'Criar Grupo'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
