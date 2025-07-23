import { useState, useEffect } from 'react';
import { useGrupos } from '@/hooks/useGrupos';
import { useUpdateProfile, ProfileCompleto } from '@/hooks/useProfiles';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';
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
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Upload, 
  FileText, 
  Download, 
  Trash2, 
  User, 
  FolderOpen 
} from 'lucide-react';

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
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [documentos, setDocumentos] = useState<any[]>([]);
  const [isLoadingDocs, setIsLoadingDocs] = useState(false);
  const [uploadFiles, setUploadFiles] = useState<File[]>([]);
  
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
      loadDocumentos();
    }
  }, [colaborador]);

  const loadDocumentos = async () => {
    if (!colaborador) return;
    
    setIsLoadingDocs(true);
    try {
      const { data, error } = await supabase
        .from('documentos')
        .select('*')
        .eq('colaborador_id', colaborador.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDocumentos(data || []);
    } catch (error) {
      console.error('Erro ao carregar documentos:', error);
    } finally {
      setIsLoadingDocs(false);
    }
  };

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
        grupo_id: formData.grupo_id || null,
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

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || !colaborador) return;
    
    const fileArray = Array.from(files);
    setUploadFiles(fileArray);
    
    try {
      for (const file of fileArray) {
        const fileName = `${colaborador.id}/${Date.now()}-${file.name}`;
        
        const { error: uploadError } = await supabase.storage
          .from('documentos')
          .upload(fileName, file);

        if (!uploadError) {
          await supabase
            .from('documentos')
            .insert({
              colaborador_id: colaborador.id,
              tipo_documento: file.name.split('.').pop() || 'documento',
              nome_arquivo: file.name,
              url_arquivo: fileName
            });
        }
      }
      
      toast({
        title: "Documentos enviados!",
        description: "Os documentos foram adicionados com sucesso.",
      });
      
      loadDocumentos();
      setUploadFiles([]);
    } catch (error: any) {
      toast({
        title: "Erro ao enviar documentos",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDeleteDocument = async (docId: string, urlArquivo: string) => {
    try {
      // Deletar arquivo do storage
      await supabase.storage
        .from('documentos')
        .remove([urlArquivo]);
      
      // Deletar registro da tabela
      const { error } = await supabase
        .from('documentos')
        .delete()
        .eq('id', docId);

      if (error) throw error;
      
      toast({
        title: "Documento excluído",
        description: "O documento foi removido com sucesso.",
      });
      
      loadDocumentos();
    } catch (error: any) {
      toast({
        title: "Erro ao excluir documento",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const downloadDocument = async (urlArquivo: string, nomeArquivo: string) => {
    try {
      const { data, error } = await supabase.storage
        .from('documentos')
        .download(urlArquivo);

      if (error) throw error;

      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = nomeArquivo;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error: any) {
      toast({
        title: "Erro ao baixar documento",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Editar Colaborador - {colaborador?.nome}
          </DialogTitle>
          <DialogDescription>
            Atualize as informações e gerencie os documentos do colaborador.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="informacoes" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="informacoes" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Informações
            </TabsTrigger>
            <TabsTrigger value="documentos" className="flex items-center gap-2">
              <FolderOpen className="w-4 h-4" />
              Documentos
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="informacoes" className="space-y-4 mt-6">
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
                  <Select value={formData.grupo_id || undefined} onValueChange={(value) => updateFormData('grupo_id', value || '')}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um grupo ou deixe vazio" />
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
          </TabsContent>
          
          <TabsContent value="documentos" className="space-y-4 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="w-5 h-5" />
                  Enviar Novos Documentos
                </CardTitle>
                <CardDescription>
                  Adicione documentos para este colaborador
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Input
                    type="file"
                    multiple
                    onChange={(e) => handleFileUpload(e.target.files)}
                    className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                  />
                  
                  {uploadFiles.length > 0 && (
                    <div className="p-3 bg-muted rounded-lg">
                      <p className="text-sm text-muted-foreground">
                        {uploadFiles.length} arquivo(s) selecionado(s) para upload
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Documentos Existentes
                </CardTitle>
                <CardDescription>
                  {documentos.length} documento(s) encontrado(s)
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingDocs ? (
                  <div className="text-center py-4">
                    <p className="text-muted-foreground">Carregando documentos...</p>
                  </div>
                ) : documentos.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p className="text-muted-foreground">Nenhum documento encontrado</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {documentos.map((doc) => (
                      <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <FileText className="w-4 h-4 text-muted-foreground" />
                          <div>
                            <p className="font-medium">{doc.nome_arquivo}</p>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">
                                {doc.tipo_documento}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {new Date(doc.created_at).toLocaleDateString('pt-BR')}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => downloadDocument(doc.url_arquivo, doc.nome_arquivo)}
                            className="h-8 w-8 p-0"
                          >
                            <Download className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteDocument(doc.id, doc.url_arquivo)}
                            className="h-8 w-8 p-0 text-error border-error/20 hover:bg-error/10"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}