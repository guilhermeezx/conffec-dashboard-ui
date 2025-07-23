import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useGrupos } from '@/hooks/useGrupos';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';
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
import { Plus, Upload } from 'lucide-react';

export default function CriarColaboradorCompletoDialog() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: grupos } = useGrupos();
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    cpf: '',
    telefone: '',
    role: 'colaborador',
    grupo_id: '',
    data_admissao: '',
    situacao: 'ativo',
    observacao_licenca: '',
    salario_fixo: '',
    documentos: [] as File[]
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Criar usuário via auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: 'temp123456', // Senha temporária
        options: {
          data: {
            nome: formData.nome
          }
        }
      });

      if (authError) throw authError;

      if (authData.user) {
        // Atualizar perfil com dados completos
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            nome: formData.nome,
            cpf: formData.cpf || null,
            telefone: formData.telefone || null,
            role: formData.role as any,
            grupo_id: formData.grupo_id || null,
            data_admissao: formData.data_admissao || null,
            situacao: formData.situacao
          })
          .eq('id', authData.user.id);

        if (profileError) throw profileError;

        // Upload documentos se houver
        if (formData.documentos.length > 0) {
          for (const doc of formData.documentos) {
            const fileName = `${authData.user.id}/${Date.now()}-${doc.name}`;
            
            const { error: uploadError } = await supabase.storage
              .from('documentos')
              .upload(fileName, doc);

            if (!uploadError) {
              // Registrar documento na tabela
              await supabase
                .from('documentos')
                .insert({
                  colaborador_id: authData.user.id,
                  tipo_documento: doc.name.split('.').pop() || 'documento',
                  nome_arquivo: doc.name,
                  url_arquivo: fileName
                });
            }
          }
        }

        // Criar colaborador individual se salário for fixo
        if (formData.role === 'colaborador' && formData.salario_fixo) {
          await supabase
            .from('colaboradores_individuais')
            .insert({
              user_id: authData.user.id,
              nome: formData.nome,
              email: formData.email,
              funcao: 'colaborador',
              tipo_remuneracao: 'fixo',
              data_admissao: formData.data_admissao || null,
              situacao: formData.situacao,
              observacoes: formData.situacao === 'licenca' ? formData.observacao_licenca : null
            });
        }
      }

      queryClient.invalidateQueries({ queryKey: ['profiles'] });
      
      toast({
        title: "Colaborador criado!",
        description: "O novo colaborador foi adicionado ao sistema.",
      });

      setFormData({
        nome: '',
        email: '',
        cpf: '',
        telefone: '',
        role: 'colaborador',
        grupo_id: '',
        data_admissao: '',
        situacao: 'ativo',
        observacao_licenca: '',
        salario_fixo: '',
        documentos: []
      });
      setOpen(false);
    } catch (error: any) {
      console.error('Erro ao criar colaborador:', error);
      toast({
        title: "Erro ao criar colaborador",
        description: error.message || "Verifique os dados e tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateFormData = (field: string, value: string | File[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      updateFormData('documentos', Array.from(e.target.files));
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Novo Colaborador
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Criar Novo Colaborador</DialogTitle>
          <DialogDescription>
            Adicione um novo colaborador ao sistema com informações completas.
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
                onChange={(e) => updateFormData('email', e.target.value)}
                placeholder="email@exemplo.com"
                required
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

          {formData.role === 'colaborador' && (
            <div className="space-y-2">
              <Label htmlFor="salario_fixo">Salário Fixo (R$)</Label>
              <Input
                id="salario_fixo"
                type="number"
                step="0.01"
                value={formData.salario_fixo}
                onChange={(e) => updateFormData('salario_fixo', e.target.value)}
                placeholder="0,00"
              />
            </div>
          )}

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

          <div className="space-y-2">
            <Label htmlFor="documentos">Documentos</Label>
            <div className="flex items-center gap-2">
              <Input
                id="documentos"
                type="file"
                multiple
                onChange={handleFileChange}
                className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
              />
              <Upload className="w-4 h-4 text-muted-foreground" />
            </div>
            {formData.documentos.length > 0 && (
              <p className="text-sm text-muted-foreground">
                {formData.documentos.length} arquivo(s) selecionado(s)
              </p>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Criando...' : 'Criar Colaborador'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}