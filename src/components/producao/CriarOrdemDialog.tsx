
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useGrupos } from '@/hooks/useGrupos';
import { useCreateOrdem } from '@/hooks/useOrdens';
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

export default function CriarOrdemDialog() {
  const { user } = useAuth();
  const { data: grupos } = useGrupos();
  const createOrdem = useCreateOrdem();
  const [open, setOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    numero_op: '',
    produto: '',
    tipo_peca: '',
    grupo_id: '',
    meta_producao: '',
    prazo_entrega: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;

    try {
      await createOrdem.mutateAsync({
        numero_op: formData.numero_op,
        produto: formData.produto,
        tipo_peca: formData.tipo_peca || null,
        grupo_id: formData.grupo_id || null,
        meta_producao: formData.meta_producao ? parseInt(formData.meta_producao) : 0,
        prazo_entrega: formData.prazo_entrega || null,
        status: 'em_andamento'
      });

      setFormData({
        numero_op: '',
        produto: '',
        tipo_peca: '',
        grupo_id: '',
        meta_producao: '',
        prazo_entrega: ''
      });
      setOpen(false);
    } catch (error) {
      console.error('Erro ao criar ordem:', error);
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
          Nova Ordem
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Nova Ordem de Produção</DialogTitle>
          <DialogDescription>
            Crie uma nova ordem de produção para ser executada pelos grupos.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="numero_op">Número da OP *</Label>
              <Input
                id="numero_op"
                value={formData.numero_op}
                onChange={(e) => updateFormData('numero_op', e.target.value)}
                placeholder="OP-001"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="meta_producao">Meta de Produção</Label>
              <Input
                id="meta_producao"
                type="number"
                value={formData.meta_producao}
                onChange={(e) => updateFormData('meta_producao', e.target.value)}
                placeholder="200"
                min="0"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="produto">Produto *</Label>
            <Input
              id="produto"
              value={formData.produto}
              onChange={(e) => updateFormData('produto', e.target.value)}
              placeholder="Camiseta Básica Branca"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tipo_peca">Tipo de Peça</Label>
              <Select value={formData.tipo_peca} onValueChange={(value) => updateFormData('tipo_peca', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Superior">Superior</SelectItem>
                  <SelectItem value="Inferior">Inferior</SelectItem>
                  <SelectItem value="Vestido">Vestido</SelectItem>
                  <SelectItem value="Acessório">Acessório</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="grupo_id">Grupo Responsável</Label>
              <Select value={formData.grupo_id} onValueChange={(value) => updateFormData('grupo_id', value)}>
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
          </div>

          <div className="space-y-2">
            <Label htmlFor="prazo_entrega">Prazo de Entrega</Label>
            <Input
              id="prazo_entrega"
              type="date"
              value={formData.prazo_entrega}
              onChange={(e) => updateFormData('prazo_entrega', e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={createOrdem.isPending}>
              {createOrdem.isPending ? 'Criando...' : 'Criar Ordem'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
