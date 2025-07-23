import { useState, useEffect } from 'react';
import { useGrupos } from '@/hooks/useGrupos';
import { useUpdateProfile, ProfileCompleto } from '@/hooks/useProfiles';
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
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface EditarColaboradorDialogProps {
  colaborador: ProfileCompleto | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function EditarColaboradorDialog({ 
  colaborador, 
  open, 
  onOpenChange 
}: EditarColaboradorDialogProps) {
  const updateProfile = useUpdateProfile();
  const { data: grupos } = useGrupos();
  
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    cpf: '',
    telefone: '',
    role: '',
    grupo_id: '',
    data_admissao: '',
    situacao: '',
    observacao_licenca: ''
  });

  useEffect(() => {
    if (colaborador) {
      setFormData({
        nome: colaborador.nome || '',
        email: colaborador.email || '',
        cpf: colaborador.cpf || '',
        telefone: colaborador.telefone || '',
        role: colaborador.role || '',
        grupo_id: colaborador.grupo_id || '',
        data_admissao: colaborador.data_admissao || '',
        situacao: colaborador.situacao || '',
        observacao_licenca: ''
      });
    }
  }, [colaborador]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!colaborador) return;
    
    try {
      await updateProfile.mutateAsync({
        id: colaborador.id,
        nome: formData.nome,
        cpf: formData.cpf || undefined,
        telefone: formData.telefone || undefined,
        role: formData.role as any,
        grupo_id: formData.grupo_id || undefined,
        data_admissao: formData.data_admissao || undefined,
        situacao: formData.situacao || undefined
      });

      onOpenChange(false);
    } catch (error) {
      console.error('Erro ao atualizar colaborador:', error);
    }
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Colaborador</DialogTitle>
          <DialogDescription>
            Atualize as informações do colaborador.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome Completo *</Label>
              <Input
                id="nome"
                value={formData.nome}
                onChange={(e) => updateFormData('nome', e.target.value)}
                placeholder="Nome do colaborador"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                disabled
                className="bg-muted"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cpf">CPF</Label>
              <Input
                id="cpf"
                value={formData.cpf}
                onChange={(e) => updateFormData('cpf', e.target.value)}
                placeholder="000.000.000-00"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="telefone">Telefone</Label>
              <Input
                id="telefone"
                value={formData.telefone}
                onChange={(e) => updateFormData('telefone', e.target.value)}
                placeholder="(00) 00000-0000"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="role">Função *</Label>
              <Select value={formData.role} onValueChange={(value) => updateFormData('role', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a função" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="colaborador">Colaborador</SelectItem>
                  <SelectItem value="lider_grupo">Líder de Grupo</SelectItem>
                  <SelectItem value="inspetor">Inspetor</SelectItem>
                  <SelectItem value="encarregado">Encarregado</SelectItem>
                  <SelectItem value="financeiro">Financeiro</SelectItem>
                  <SelectItem value="ceo">CEO</SelectItem>
                  <SelectItem value="admin">Administrador</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="grupo_id">Grupo (Opcional)</Label>
              <Select value={formData.grupo_id} onValueChange={(value) => updateFormData('grupo_id', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um grupo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Nenhum grupo</SelectItem>
                  {grupos?.map((grupo) => (
                    <SelectItem key={grupo.id} value={grupo.id}>
                      {grupo.nome} - {grupo.setor}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
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
              <Label htmlFor="situacao">Situação *</Label>
              <Select value={formData.situacao} onValueChange={(value) => updateFormData('situacao', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a situação" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ativo">Ativo</SelectItem>
                  <SelectItem value="inativo">Inativo</SelectItem>
                  <SelectItem value="licenca">Em Licença</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {formData.situacao === 'licenca' && (
            <div className="space-y-2">
              <Label htmlFor="observacao_licenca">Observação da Licença</Label>
              <Textarea
                id="observacao_licenca"
                value={formData.observacao_licenca}
                onChange={(e) => updateFormData('observacao_licenca', e.target.value)}
                placeholder="Motivo ou observações sobre a licença"
                rows={3}
              />
            </div>
          )}

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={updateProfile.isPending}>
              {updateProfile.isPending ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}