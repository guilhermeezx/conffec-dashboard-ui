
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRegistrosProducao, useAprovarRegistro, useReprovarRegistro } from '@/hooks/useRegistrosProducao';
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Eye, 
  AlertTriangle 
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface RegistrosProducaoTableProps {
  opId?: string;
  grupoId?: string;
  status?: string;
}

export default function RegistrosProducaoTable({ opId, grupoId, status }: RegistrosProducaoTableProps) {
  const { user, canApproveProduction } = useAuth();
  const { data: registros, isLoading } = useRegistrosProducao(opId, grupoId, status);
  const aprovarRegistro = useAprovarRegistro();
  const reprovarRegistro = useReprovarRegistro();
  
  const [reprovarDialog, setReprovarDialog] = useState<{
    open: boolean;
    registroId: string;
    motivo: string;
  }>({
    open: false,
    registroId: '',
    motivo: ''
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'aprovado':
        return (
          <Badge className="bg-success/10 text-success border-success/20">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Aprovado
          </Badge>
        );
      case 'reprovado':
        return (
          <Badge className="bg-error/10 text-error border-error/20">
            <XCircle className="w-3 h-3 mr-1" />
            Reprovado
          </Badge>
        );
      case 'pendente':
      default:
        return (
          <Badge className="bg-warning/10 text-warning border-warning/20">
            <Clock className="w-3 h-3 mr-1" />
            Pendente
          </Badge>
        );
    }
  };

  const handleAprovar = async (registroId: string) => {
    if (!user) return;
    
    try {
      await aprovarRegistro.mutateAsync({
        id: registroId,
        aprovado_por: user.id
      });
    } catch (error) {
      console.error('Erro ao aprovar:', error);
    }
  };

  const handleReprovar = async () => {
    if (!user || !reprovarDialog.motivo.trim()) return;
    
    try {
      await reprovarRegistro.mutateAsync({
        id: reprovarDialog.registroId,
        aprovado_por: user.id,
        motivo_reprovacao: reprovarDialog.motivo
      });
      
      setReprovarDialog({ open: false, registroId: '', motivo: '' });
    } catch (error) {
      console.error('Erro ao reprovar:', error);
    }
  };

  if (isLoading) {
    return <div className="p-4 text-center">Carregando registros...</div>;
  }

  if (!registros || registros.length === 0) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        <Eye className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p>Nenhum registro de produção encontrado.</p>
      </div>
    );
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Data/Hora</TableHead>
            <TableHead>Grupo</TableHead>
            <TableHead>Responsável</TableHead>
            <TableHead>Qtd. Produzida</TableHead>
            <TableHead>Qtd. Reprovada</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Observações</TableHead>
            {canApproveProduction() && <TableHead>Ações</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {registros.map((registro) => (
            <TableRow key={registro.id}>
              <TableCell>
                {format(new Date(registro.data_registro), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
              </TableCell>
              <TableCell>
                <Badge variant="outline">
                  {registro.grupos?.nome} ({registro.grupos?.setor})
                </Badge>
              </TableCell>
              <TableCell>{registro.responsavel?.nome}</TableCell>
              <TableCell>
                <span className="font-medium text-success">{registro.qtde_produzida}</span>
              </TableCell>
              <TableCell>
                <span className={`font-medium ${registro.qtde_reprovada && registro.qtde_reprovada > 0 ? 'text-error' : 'text-muted-foreground'}`}>
                  {registro.qtde_reprovada || 0}
                </span>
              </TableCell>
              <TableCell>{getStatusBadge(registro.status_inspecao || 'pendente')}</TableCell>
              <TableCell>
                {registro.observacoes && (
                  <span className="text-sm text-muted-foreground max-w-[200px] truncate block">
                    {registro.observacoes}
                  </span>
                )}
                {registro.motivo_reprovacao && (
                  <div className="flex items-center gap-1 text-error text-sm">
                    <AlertTriangle className="w-3 h-3" />
                    {registro.motivo_reprovacao}
                  </div>
                )}
              </TableCell>
              {canApproveProduction() && (
                <TableCell>
                  {registro.status_inspecao === 'pendente' && (
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleAprovar(registro.id)}
                        disabled={aprovarRegistro.isPending}
                        className="text-success border-success/20 hover:bg-success/10"
                      >
                        <CheckCircle2 className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setReprovarDialog({ 
                          open: true, 
                          registroId: registro.id, 
                          motivo: '' 
                        })}
                        className="text-error border-error/20 hover:bg-error/10"
                      >
                        <XCircle className="w-3 h-3" />
                      </Button>
                    </div>
                  )}
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog 
        open={reprovarDialog.open} 
        onOpenChange={(open) => setReprovarDialog({ ...reprovarDialog, open })}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reprovar Registro</DialogTitle>
            <DialogDescription>
              Informe o motivo da reprovação. Este registro ficará disponível para reprocessamento.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="motivo">Motivo da reprovação *</Label>
              <Textarea
                id="motivo"
                value={reprovarDialog.motivo}
                onChange={(e) => setReprovarDialog({ 
                  ...reprovarDialog, 
                  motivo: e.target.value 
                })}
                placeholder="Descreva o motivo da reprovação..."
                rows={3}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setReprovarDialog({ open: false, registroId: '', motivo: '' })}
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleReprovar}
              disabled={!reprovarDialog.motivo.trim() || reprovarRegistro.isPending}
              variant="destructive"
            >
              {reprovarRegistro.isPending ? 'Reprovando...' : 'Reprovar'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
