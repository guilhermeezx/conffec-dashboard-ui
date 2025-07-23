import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useProfile, useUpdateProfile } from '@/hooks/useProfiles';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  Building, 
  Settings, 
  Shield,
  Edit3,
  Save,
  X
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const Perfil = () => {
  const { user } = useAuth();
  const { data: profile } = useProfile(user?.id || '');
  const updateProfile = useUpdateProfile();
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    cpf: '',
    telefone: ''
  });

  const handleEdit = () => {
    if (profile) {
      setFormData({
        nome: profile.nome || '',
        cpf: profile.cpf || '',
        telefone: profile.telefone || ''
      });
      setIsEditing(true);
    }
  };

  const handleSave = async () => {
    if (!profile) return;
    
    try {
      await updateProfile.mutateAsync({
        id: profile.id,
        nome: formData.nome,
        cpf: formData.cpf || undefined,
        telefone: formData.telefone || undefined
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      nome: '',
      cpf: '',
      telefone: ''
    });
  };

  const getRoleBadge = (role: string) => {
    const roleLabels = {
      'admin': { label: 'Administrador', variant: 'destructive' as const },
      'ceo': { label: 'CEO', variant: 'default' as const },
      'encarregado': { label: 'Encarregado', variant: 'secondary' as const },
      'lider_grupo': { label: 'Líder de Grupo', variant: 'outline' as const },
      'inspetor': { label: 'Inspetor', variant: 'outline' as const },
      'financeiro': { label: 'Financeiro', variant: 'outline' as const },
      'colaborador': { label: 'Colaborador', variant: 'outline' as const }
    };

    const roleInfo = roleLabels[role as keyof typeof roleLabels] || { label: role, variant: 'outline' as const };
    return <Badge variant={roleInfo.variant}>{roleInfo.label}</Badge>;
  };

  const getSituacaoBadge = (situacao?: string) => {
    switch (situacao) {
      case 'ativo':
        return <Badge className="bg-success/10 text-success border-success/20">Ativo</Badge>;
      case 'inativo':
        return <Badge className="bg-error/10 text-error border-error/20">Inativo</Badge>;
      case 'licenca':
        return <Badge className="bg-warning/10 text-warning border-warning/20">Em Licença</Badge>;
      default:
        return <Badge variant="outline">Indefinido</Badge>;
    }
  };

  if (!profile) {
    return (
      <div className="p-8 text-center">
        <div className="animate-pulse">Carregando perfil...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Meu Perfil</h1>
          <p className="text-muted-foreground">Gerencie suas informações pessoais e configurações</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Card Principal do Perfil */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                    <User className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">{profile.nome}</CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-1">
                      <Mail className="w-4 h-4" />
                      {profile.email}
                    </CardDescription>
                  </div>
                </div>
                
                {!isEditing ? (
                  <Button onClick={handleEdit} variant="outline" size="sm" className="gap-2">
                    <Edit3 className="w-4 h-4" />
                    Editar
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button onClick={handleSave} size="sm" className="gap-2" disabled={updateProfile.isPending}>
                      <Save className="w-4 h-4" />
                      {updateProfile.isPending ? 'Salvando...' : 'Salvar'}
                    </Button>
                    <Button onClick={handleCancel} variant="outline" size="sm" className="gap-2">
                      <X className="w-4 h-4" />
                      Cancelar
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome Completo</Label>
                  {isEditing ? (
                    <Input
                      id="nome"
                      value={formData.nome}
                      onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                    />
                  ) : (
                    <p className="text-foreground">{profile.nome}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Email</Label>
                  <p className="text-muted-foreground">{profile.email}</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cpf">CPF</Label>
                  {isEditing ? (
                    <Input
                      id="cpf"
                      value={formData.cpf}
                      onChange={(e) => setFormData(prev => ({ ...prev, cpf: e.target.value }))}
                      placeholder="000.000.000-00"
                    />
                  ) : (
                    <p className="text-foreground">{profile.cpf || 'Não informado'}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="telefone">Telefone</Label>
                  {isEditing ? (
                    <Input
                      id="telefone"
                      value={formData.telefone}
                      onChange={(e) => setFormData(prev => ({ ...prev, telefone: e.target.value }))}
                      placeholder="(00) 00000-0000"
                    />
                  ) : (
                    <p className="text-foreground">{profile.telefone || 'Não informado'}</p>
                  )}
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Função</Label>
                  {getRoleBadge(profile.role)}
                </div>

                <div className="space-y-2">
                  <Label>Situação</Label>
                  {getSituacaoBadge(profile.situacao)}
                </div>

                <div className="space-y-2">
                  <Label>Grupo</Label>
                  {profile.grupos ? (
                    <div className="flex items-center gap-2">
                      <Building className="w-4 h-4 text-muted-foreground" />
                      <span>{profile.grupos.nome} - {profile.grupos.setor}</span>
                    </div>
                  ) : (
                    <p className="text-muted-foreground">Não vinculado a nenhum grupo</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Data de Admissão</Label>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span>
                      {profile.data_admissao ? 
                        format(new Date(profile.data_admissao), 'dd/MM/yyyy', { locale: ptBR }) 
                        : 'Não informado'
                      }
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Configurações Rápidas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Configurações
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">Segurança</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Para alterar sua senha, entre em contato com o administrador do sistema.
                </p>
              </div>
              
              <div className="p-3 bg-primary/5 rounded-lg border border-primary/20">
                <div className="flex items-center gap-2 mb-2">
                  <User className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-primary">Perfil Completo</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Seu perfil está {profile.cpf && profile.telefone ? 'completo' : 'incompleto'}. 
                  {!profile.cpf || !profile.telefone ? ' Complete suas informações.' : ''}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Estatísticas Pessoais */}
          <Card>
            <CardHeader>
              <CardTitle>Estatísticas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center p-4 bg-success/10 rounded-lg">
                <p className="text-2xl font-bold text-success">
                  {format(new Date(profile.created_at), 'dd')}
                </p>
                <p className="text-sm text-success">
                  Dias no sistema
                </p>
              </div>
              
              <div className="text-center p-4 bg-primary/10 rounded-lg">
                <p className="text-lg font-bold text-primary">Ativo</p>
                <p className="text-sm text-muted-foreground">Status atual</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Perfil;