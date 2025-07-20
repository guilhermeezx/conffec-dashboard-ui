import { useState } from 'react';
import { useCreateColaboradorIndividual } from '@/hooks/useColaboradoresIndividuais';
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
import { Textarea } from '@/components/ui/textarea';
import { Plus } from 'lucide-react';

export default function CriarColaboradorDialog() {
  const createColaborador = useCreateColaboradorIndividual();
  const [open, setOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    funcao: '',
    tipo_remuneracao: 'fixo',
    valor_por_peca: '',
    data_admissao: '',
    observacoes: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await createColaborador.mutateAsync({
        user_id: crypto.randomUUID(), // Gerar UUID temporário para colaboradores que não são usuários do sistema
        nome: formData.nome,
        email: formData.email,
        funcao: formData.funcao,
        tipo_remuneracao: formData.tipo_remuneracao,
        valor_por_peca: formData.valor_por_peca ? parseFloat(formData.valor_por_peca) : undefined,
        data_admissao: formData.data_admissao || undefined,
        observacoes: formData.observacoes || undefined
      });

      setFormData({
        nome: '',
        email: '',
        funcao: '',
        tipo_remuneracao: 'fixo',
        valor_por_peca: '',
        data_admissao: '',
        observacoes: ''
      });
      setOpen(false);
    } catch (error) {
      console.error('Erro ao criar colaborador:', error);
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
          Novo Colaborador Individual
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Novo Colaborador Individual</DialogTitle>
          <DialogDescription>
            Adicione um colaborador que não faz parte dos grupos de produção (revisor, acabamento, etc.).
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome *</Label>
              <Input
                id="nome"
                value={formData.nome}
                onChange={(e) => updateFormData('nome', e.target.value)}
                placeholder="Nome completo"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => updateFormData('email', e.target.value)}
                placeholder="email@exemplo.com"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="funcao">Função *</Label>
            <Select value={formData.funcao} onValueChange={(value) => updateFormData('funcao', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione a função" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="revisor">Revisor</SelectItem>
                <SelectItem value="acabamento">Acabamento</SelectItem>
                <SelectItem value="inspetor">Inspetor</SelectItem>
                <SelectItem value="passadeira">Passadeira</SelectItem>
                <SelectItem value="cortador">Cortador</SelectItem>
                <SelectItem value="estamparia">Estamparia</SelectItem>
                <SelectItem value="bordado">Bordado</SelectItem>
                <SelectItem value="outro">Outro</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tipo_remuneracao">Tipo de Remuneração</Label>
              <Select 
                value={formData.tipo_remuneracao} 
                onValueChange={(value) => updateFormData('tipo_remuneracao', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fixo">Salário Fixo</SelectItem>
                  <SelectItem value="por_peca">Por Peça</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.tipo_remuneracao === 'por_peca' && (
              <div className="space-y-2">
                <Label htmlFor="valor_por_peca">Valor por Peça (R$)</Label>
                <Input
                  id="valor_por_peca"
                  type="number"
                  step="0.01"
                  value={formData.valor_por_peca}
                  onChange={(e) => updateFormData('valor_por_peca', e.target.value)}
                  placeholder="0.50"
                />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="data_admissao">Data de Admissão</Label>
            <Input
              id="data_admissao"
              type="date"
              value={formData.data_admissao}
              onChange={(e) => updateFormData('data_admissao', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="observacoes">Observações</Label>
            <Textarea
              id="observacoes"
              value={formData.observacoes}
              onChange={(e) => updateFormData('observacoes', e.target.value)}
              placeholder="Informações adicionais sobre o colaborador..."
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={createColaborador.isPending}>
              {createColaborador.isPending ? 'Criando...' : 'Criar Colaborador'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}