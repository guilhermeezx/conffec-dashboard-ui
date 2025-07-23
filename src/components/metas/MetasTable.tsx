import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useMetas, useDeleteMeta, MetaCompleta, useProducaoRealizada } from '@/hooks/useMetas';
import EditarMetaDialog from './EditarMetaDialog';
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
import { Edit2, Trash2, Target, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface MetaRowProps {
  meta: MetaCompleta;
  onEdit: (meta: MetaCompleta) => void;
  onDelete: (id: string, nome: string) => void;
  canManage: boolean;
}

function MetaRow({ meta, onEdit, onDelete, canManage }: MetaRowProps) {
  const { data: producaoRealizada = 0 } = useProducaoRealizada(
    meta.grupo_id,
    meta.periodo_inicio,
    meta.periodo_fim
  );

  const percentual = meta.valor_meta > 0 ? (producaoRealizada / meta.valor_meta) * 100 : 0;

  const getStatusBadge = () => {
    if (percentual >= 100) {
      return <Badge className="bg-success/10 text-success border-success/20">Meta Atingida</Badge>;
    } else if (percentual >= 90) {
      return <Badge className="bg-warning/10 text-warning border-warning/20">Próximo da Meta</Badge>;
    } else {
      return <Badge className="bg-error/10 text-error border-error/20">Abaixo da Meta</Badge>;
    }
  };

  const getIndicadorVisual = () => {
    const color = percentual >= 100 ? '#00D084' : percentual >= 90 ? '#F59E0B' : '#EF4444';
    return (
      <div className="w-full bg-muted rounded-full h-2">
        <div 
          className="h-2 rounded-full transition-all duration-300" 
          style={{ 
            width: `${Math.min(percentual, 100)}%`,
            backgroundColor: color
          }}
        />
      </div>
    );
  };

  return (
    <TableRow>
      <TableCell>
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4 text-muted-foreground" />
          <span className="font-medium">
            {meta.grupos ? `${meta.grupos.nome} - ${meta.grupos.setor}` : 'Meta Geral'}
          </span>
        </div>
      </TableCell>
      <TableCell>
        <Badge variant="outline" className="capitalize">{meta.tipo}</Badge>
      </TableCell>
      <TableCell>{meta.valor_meta} peças</TableCell>
      <TableCell>
        <span className={`font-medium ${
          percentual >= 100 ? 'text-success' : 'text-foreground'
        }`}>
          {producaoRealizada} peças
        </span>
      </TableCell>
      <TableCell>
        <div className="space-y-1">
          <div className="flex justify-between text-sm">
            <span className="font-medium">{percentual.toFixed(1)}%</span>
          </div>
          {getIndicadorVisual()}
        </div>
      </TableCell>
      <TableCell>{getStatusBadge()}</TableCell>
      <TableCell className="text-sm text-muted-foreground">
        {format(new Date(meta.periodo_inicio), 'dd/MM/yyyy', { locale: ptBR })} - {' '}
        {format(new Date(meta.periodo_fim), 'dd/MM/yyyy', { locale: ptBR })}
      </TableCell>
      {canManage && (
        <TableCell>
          <div className="flex gap-1">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onEdit(meta)}
              className="h-8 w-8 p-0"
            >
              <Edit2 className="w-3 h-3" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onDelete(meta.id, meta.grupos?.nome || 'Meta Geral')}
              className="h-8 w-8 p-0 text-error border-error/20 hover:bg-error/10"
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
        </TableCell>
      )}
    </TableRow>
  );
}

export default function MetasTable() {
  const { canManageGroups } = useAuth();
  const { data: metas, isLoading } = useMetas();
  const deleteMeta = useDeleteMeta();
  
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    metaId: string;
    metaNome: string;
  }>({
    open: false,
    metaId: '',
    metaNome: ''
  });

  const [editingMeta, setEditingMeta] = useState<MetaCompleta | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const handleEdit = (meta: MetaCompleta) => {
    setEditingMeta(meta);
    setEditDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteDialog.metaId) return;
    
    try {
      await deleteMeta.mutateAsync(deleteDialog.metaId);
      setDeleteDialog({ open: false, metaId: '', metaNome: '' });
    } catch (error) {
      console.error('Erro ao deletar meta:', error);
    }
  };

  if (isLoading) {
    return <div className="p-4 text-center">Carregando metas...</div>;
  }

  if (!metas || metas.length === 0) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p>Nenhuma meta encontrada.</p>
      </div>
    );
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Grupo/Geral</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Meta</TableHead>
            <TableHead>Realizado</TableHead>
            <TableHead>Progresso</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Período</TableHead>
            {canManageGroups() && <TableHead>Ações</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {metas.map((meta) => (
            <MetaRow
              key={meta.id}
              meta={meta}
              onEdit={handleEdit}
              onDelete={(id, nome) => setDeleteDialog({ open: true, metaId: id, metaNome: nome })}
              canManage={canManageGroups()}
            />
          ))}
        </TableBody>
      </Table>

      <AlertDialog 
        open={deleteDialog.open} 
        onOpenChange={(open) => setDeleteDialog({ ...deleteDialog, open })}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Meta</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir a meta "{deleteDialog.metaNome}"? 
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-error hover:bg-error/90"
              disabled={deleteMeta.isPending}
            >
              {deleteMeta.isPending ? 'Excluindo...' : 'Excluir'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <EditarMetaDialog
        meta={editingMeta}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
      />
    </>
  );
}