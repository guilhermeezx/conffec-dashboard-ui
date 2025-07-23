import { useAuth } from '@/hooks/useAuth';
import { FileText, Download } from 'lucide-react';
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

// Dados mockados para documentos - posteriormente será conectado ao Supabase
const documentosMock = [
  {
    id: '1',
    colaborador_nome: 'João Silva',
    tipo_documento: 'RG',
    nome_arquivo: 'rg_joao_silva.pdf',
    created_at: '2024-01-15',
  },
  {
    id: '2',
    colaborador_nome: 'Maria Santos',
    tipo_documento: 'CPF',
    nome_arquivo: 'cpf_maria_santos.pdf',
    created_at: '2024-01-20',
  },
  {
    id: '3',
    colaborador_nome: 'Pedro Costa',
    tipo_documento: 'Carteira de Trabalho',
    nome_arquivo: 'ctps_pedro_costa.pdf',
    created_at: '2024-02-01',
  }
];

export default function DocumentosTable() {
  const { canManageGroups } = useAuth();

  const getTipoDocumentoBadge = (tipo: string) => {
    const colors = {
      'RG': 'bg-blue-50 text-blue-700 border-blue-200',
      'CPF': 'bg-green-50 text-green-700 border-green-200', 
      'Carteira de Trabalho': 'bg-purple-50 text-purple-700 border-purple-200',
      'Comprovante de Residência': 'bg-orange-50 text-orange-700 border-orange-200',
    };

    return (
      <Badge className={colors[tipo as keyof typeof colors] || 'bg-gray-50 text-gray-700 border-gray-200'}>
        {tipo}
      </Badge>
    );
  };

  const handleDownload = (documento: any) => {
    // TODO: Implementar download real do arquivo
    console.log('Download do documento:', documento);
  };

  if (!canManageGroups()) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p>Você não tem permissão para visualizar documentos.</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Colaborador</TableHead>
          <TableHead>Tipo de Documento</TableHead>
          <TableHead>Nome do Arquivo</TableHead>
          <TableHead>Data de Upload</TableHead>
          <TableHead>Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {documentosMock.map((documento) => (
          <TableRow key={documento.id}>
            <TableCell>
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-muted-foreground" />
                <span className="font-medium">{documento.colaborador_nome}</span>
              </div>
            </TableCell>
            <TableCell>{getTipoDocumentoBadge(documento.tipo_documento)}</TableCell>
            <TableCell className="font-mono text-sm">{documento.nome_arquivo}</TableCell>
            <TableCell className="text-muted-foreground">
              {new Date(documento.created_at).toLocaleDateString('pt-BR')}
            </TableCell>
            <TableCell>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleDownload(documento)}
                className="gap-1"
              >
                <Download className="w-3 h-3" />
                Download
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}