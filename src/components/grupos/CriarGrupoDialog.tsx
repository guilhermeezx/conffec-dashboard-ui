
import { useState } from 'react';
import { useCreateGrupo } from '@/hooks/useGrupos';
import { useMetas } from '@/hooks/useMetas';
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

export default function CriarGrupoDialog() {
  const createGrupo = useCreateGrupo();
  const { data: metas } = useMetas();
  const [open, setOpen] = useState(false);
  
  const setores = [
    'Produção',
    'Qualidade',
    'Expedição',
    'Embalagem',
    'Montagem',
    'Acabamento',
    'Soldagem',
    'Usinagem'
  ];
  
  const [formData, setFormData] = useState({
    nome: '',
    setor: '',
    meta_diaria: ''
  });

  // Calcular meta diária baseada nas metas existentes
  const calcularMetaDiaria = (setor: string) => {
    if (!metas || !setor) return 0;
    
    const metasSetor = metas.filter(meta => 
      meta.grupos?.setor === setor && meta.tipo === 'diaria'
    );
    
    if (metasSetor.length === 0) return 0;
    
    const mediaMetasDiarias = metasSetor.reduce((acc, meta) => acc + meta.valor_meta, 0) / metasSetor.length;
    return Math.round(mediaMetasDiarias);
  };

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
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      
      // Se o setor mudou, calcular nova meta diária automaticamente
      if (field === 'setor' && value) {
        const metaCalculada = calcularMetaDiaria(value);
        newData.meta_diaria = metaCalculada > 0 ? metaCalculada.toString() : '';
      }
      
      return newData;
    });
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
            <Select value={formData.setor} onValueChange={(value) => updateFormData('setor', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o setor" />
              </SelectTrigger>
              <SelectContent>
                {setores.map((setor) => (
                  <SelectItem key={setor} value={setor}>
                    {setor}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="meta_diaria">Meta Diária</Label>
            <Input
              id="meta_diaria"
              type="number"
              value={formData.meta_diaria}
              onChange={(e) => updateFormData('meta_diaria', e.target.value)}
              placeholder="Meta calculada automaticamente"
              min="0"
            />
            {formData.setor && formData.meta_diaria && (
              <p className="text-sm text-muted-foreground">
                Meta calculada baseada nas metas do setor {formData.setor}
              </p>
            )}
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
