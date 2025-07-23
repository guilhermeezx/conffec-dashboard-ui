import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useProfiles, useDeleteProfile, ProfileCompleto } from '@/hooks/useProfiles';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { MoreHorizontal, Edit2, Trash2, Users, User } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function ColaboradoresTable() {
  const { canManageGroups } = useAuth();
  const { data: colaboradores, isLoading } = useProfiles();
  const deleteProfile = useDeleteProfile();
  
  const [colaboradorToDelete, setColaboradorToDelete] = useState<ProfileCompleto | null>(null);

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

  const getRoleBadge = (role: string) => {
    const roleLabels = {
      'admin': 'Administrador',
      'ceo': 'CEO',
      'encarregado': 'Encarregado',
      'lider_grupo': 'Líder de Grupo',
      'inspetor': 'Inspetor',
      'colaborador': 'Colaborador'
    };

    return <Badge variant="outline">{roleLabels[role as keyof typeof roleLabels] || role}</Badge>;
  };

  const handleDelete = async () => {
    if (!colaboradorToDelete) return;
    
    try {
      await deleteProfile.mutateAsync(colaboradorToDelete.id);
      setColaboradorToDelete(null);
    } catch (error) {
      console.error('Erro ao deletar colaborador:', error);
    }
  };

  if (isLoading) {
    return <div className="p-4 text-center">Carregando colaboradores...</div>;
  }

  if (!colaboradores || colaboradores.length === 0) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        <User className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p>Nenhum colaborador encontrado.</p>
      </div>
    );
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>CPF</TableHead>
            <TableHead>Telefone</TableHead>
            <TableHead>Função</TableHead>
            <TableHead>Grupo</TableHead>
            <TableHead>Situação</TableHead>
            <TableHead>Admissão</TableHead>
            {canManageGroups() && <TableHead>Ações</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {colaboradores.map((colaborador) => (
            <TableRow key={colaborador.id}>
              <TableCell>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">{colaborador.nome}</span>
                </div>
              </TableCell>
              <TableCell className="text-muted-foreground">{colaborador.email}</TableCell>
              <TableCell className="text-muted-foreground">{colaborador.cpf || '-'}</TableCell>
              <TableCell className="text-muted-foreground">{colaborador.telefone || '-'}</TableCell>
              <TableCell>{getRoleBadge(colaborador.role)}</TableCell>
              <TableCell>
                {colaborador.grupos ? (
                  <div className="flex items-center gap-1">
                    <Users className="w-3 h-3 text-muted-foreground" />
                    <span className="text-sm">{colaborador.grupos.nome}</span>
                  </div>
                ) : (
                  <span className="text-muted-foreground">-</span>
                )}
              </TableCell>
              <TableCell>{getSituacaoBadge(colaborador.situacao)}</TableCell>
              <TableCell className="text-muted-foreground">
                {colaborador.data_admissao ? 
                  format(new Date(colaborador.data_admissao), 'dd/MM/yyyy', { locale: ptBR }) 
                  : '-'
                }
              </TableCell>
              {canManageGroups() && (
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Edit2 className="mr-2 h-4 w-4" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-error focus:text-error"
                        onClick={() => setColaboradorToDelete(colaborador)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <AlertDialog 
        open={!!colaboradorToDelete} 
        onOpenChange={() => setColaboradorToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Colaborador</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o colaborador "{colaboradorToDelete?.nome}"? 
              Esta ação não pode ser desfeita e removerá todos os dados relacionados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-error hover:bg-error/90"
              disabled={deleteProfile.isPending}
            >
              {deleteProfile.isPending ? 'Excluindo...' : 'Excluir'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}