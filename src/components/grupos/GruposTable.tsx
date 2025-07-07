
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useGrupos, useDeleteGrupo, Grupo } from '@/hooks/useGrupos';
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Edit2, Trash2, Users, Target } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import EditarGrupoDialog from './EditarGrupoDialog';

export default function GruposTable() {
  const { canManageGroups } = useAuth();
  const { data: grupos, isLoading } = useGrupos();
  const deleteGrupo = useDeleteGrupo();
  
  const [editingGrupo, setEditingGrupo] = useState<Grupo | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    grupoId: string;
    grupoNome: string;
  }>({
    open: false,
    grupoId: '',
    grupoNome: ''
  });

  const handleEdit = (grupo: Grupo) => {
    setEditingGrupo(grupo);
    setEditDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteDialog.grupoId) return;
    
    try {
      await deleteGrupo.mutateAsync(deleteDialog.grupoId);
      setDeleteDialog({ open: false, grupoId: '', grupoNome: '' });
    } catch (error) {
      console.error('Erro ao deletar grupo:', error);
    }
  };

  if (isLoading) {
    return <div className="p-4 text-center">Carregando grupos...</div>;
  }

  if (!grupos || grupos.length === 0) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p>Nenhum grupo encontrado.</p>
      </div>
    );
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Setor</TableHead>
            <TableHead>Meta Diária</TableHead>
            <TableHead>Criado em</TableHead>
            {canManageGroups() && <TableHead>Ações</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {grupos.map((grupo) => (
            <TableRow key={grupo.id}>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">{grupo.nome}</span>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline">{grupo.setor}</Badge>
              </TableCell>
              <TableCell>
                {grupo.meta_diaria ? (
                  <div className="flex items-center gap-1">
                    <Target className="w-3 h-3 text-success" />
                    <span className="text-success font-medium">{grupo.meta_diaria}</span>
                  </div>
                ) : (
                  <span className="text-muted-foreground">Não definida</span>
                )}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {format(new Date(grupo.created_at), 'dd/MM/yyyy', { locale: ptBR })}
              </TableCell>
              {canManageGroups() && (
                <TableCell>
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(grupo)}
                      className="h-8 w-8 p-0"
                    >
                      <Edit2 className="w-3 h-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setDeleteDialog({ 
                        open: true, 
                        grupoId: grupo.id, 
                        grupoNome: grupo.nome 
                      })}
                      className="h-8 w-8 p-0 text-error border-error/20 hover:bg-error/10"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <EditarGrupoDialog
        grupo={editingGrupo}
        open={editDialogOpen}
        onOpenChange={(open) => {
          setEditDialogOpen(open);
          if (!open) setEditingGrupo(null);
        }}
      />

      <AlertDialog 
        open={deleteDialog.open} 
        onOpenChange={(open) => setDeleteDialog({ ...deleteDialog, open })}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Grupo</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o grupo "{deleteDialog.grupoNome}"? 
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-error hover:bg-error/90"
              disabled={deleteGrupo.isPending}
            >
              {deleteGrupo.isPending ? 'Excluindo...' : 'Excluir'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
