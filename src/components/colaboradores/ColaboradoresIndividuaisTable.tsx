import { useState } from 'react';
import { useColaboradoresIndividuais, useDeleteColaboradorIndividual } from '@/hooks/useColaboradoresIndividuais';
import { useAuth } from '@/hooks/useAuth';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
import { MoreHorizontal, Trash2, Edit } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function ColaboradoresIndividuaisTable() {
  const { canManageGroups } = useAuth();
  const { data: colaboradores, isLoading } = useColaboradoresIndividuais();
  const deleteColaborador = useDeleteColaboradorIndividual();
  const [colaboradorToDelete, setColaboradorToDelete] = useState<string | null>(null);

  const handleDelete = async () => {
    if (colaboradorToDelete) {
      await deleteColaborador.mutateAsync(colaboradorToDelete);
      setColaboradorToDelete(null);
    }
  };

  const getSituacaoBadge = (situacao: string) => {
    switch (situacao) {
      case 'ativo':
        return <Badge className="bg-success/10 text-success border-success/20">Ativo</Badge>;
      case 'inativo':
        return <Badge variant="secondary">Inativo</Badge>;
      case 'licenca':
        return <Badge className="bg-warning/10 text-warning border-warning/20">Licença</Badge>;
      default:
        return <Badge variant="outline">{situacao}</Badge>;
    }
  };

  const getTipoRemuneracaoBadge = (tipo: string, valor?: number) => {
    if (tipo === 'por_peca') {
      return (
        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
          R$ {valor?.toFixed(2)} / peça
        </Badge>
      );
    }
    return <Badge variant="outline">Salário Fixo</Badge>;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando colaboradores...</p>
        </div>
      </div>
    );
  }

  if (!colaboradores || colaboradores.length === 0) {
    return (
      <div className="text-center p-8">
        <p className="text-muted-foreground mb-4">Nenhum colaborador individual encontrado</p>
        <p className="text-sm text-muted-foreground">
          Use o botão "Novo Colaborador Individual" para adicionar colaboradores que não fazem parte de grupos.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Função</TableHead>
              <TableHead>Remuneração</TableHead>
              <TableHead>Situação</TableHead>
              <TableHead>Admissão</TableHead>
              {canManageGroups() && <TableHead className="w-[50px]"></TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {colaboradores.map((colaborador) => (
              <TableRow key={colaborador.id}>
                <TableCell className="font-medium">{colaborador.nome}</TableCell>
                <TableCell>{colaborador.email}</TableCell>
                <TableCell className="capitalize">{colaborador.funcao}</TableCell>
                <TableCell>
                  {getTipoRemuneracaoBadge(colaborador.tipo_remuneracao, colaborador.valor_por_peca)}
                </TableCell>
                <TableCell>{getSituacaoBadge(colaborador.situacao)}</TableCell>
                <TableCell>
                  {colaborador.data_admissao ? 
                    format(new Date(colaborador.data_admissao), 'dd/MM/yyyy', { locale: ptBR }) : 
                    '-'
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
                          <Edit className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => setColaboradorToDelete(colaborador.id)}
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
      </div>

      <AlertDialog open={!!colaboradorToDelete} onOpenChange={() => setColaboradorToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Colaborador</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este colaborador? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}