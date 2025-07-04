
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  Upload, 
  Plus, 
  Download, 
  Eye, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Search,
  Filter
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Dados simulados dos documentos
const documentos = [
  {
    id: 1,
    nome: "Alvará de Funcionamento",
    tipo: "Alvará",
    validade: "15/06/2025",
    status: "Válido",
    upload: "10/01/2024",
    arquivo: "alvara_funcionamento.pdf"
  },
  {
    id: 2,
    nome: "Certificado Digital A1",
    tipo: "Certificado",
    validade: "22/12/2024",
    status: "Vencendo",
    upload: "22/12/2023",
    arquivo: "cert_digital_a1.p12"
  },
  {
    id: 3,
    nome: "CNPJ - Cartão",
    tipo: "CNPJ",
    validade: "-",
    status: "Válido",
    upload: "05/03/2024",
    arquivo: "cnpj_cartao.pdf"
  },
  {
    id: 4,
    nome: "Licença Ambiental",
    tipo: "Licença",
    validade: "30/09/2024",
    status: "Vencido",
    upload: "15/09/2023",
    arquivo: "licenca_ambiental.pdf"
  },
  {
    id: 5,
    nome: "Registro ABVTEX",
    tipo: "Certificado",
    validade: "10/03/2025",
    status: "Válido",
    upload: "08/03/2024",
    arquivo: "registro_abvtex.pdf"
  },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case "Válido":
      return <Badge className="bg-success/10 text-success border-success/20">Válido</Badge>;
    case "Vencendo":
      return <Badge className="bg-warning/10 text-warning border-warning/20">Vencendo</Badge>;
    case "Vencido":
      return <Badge className="bg-error/10 text-error border-error/20">Vencido</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "Válido":
      return <CheckCircle className="w-4 h-4 text-success" />;
    case "Vencendo":
      return <Clock className="w-4 h-4 text-warning" />;
    case "Vencido":
      return <AlertTriangle className="w-4 h-4 text-error" />;
    default:
      return null;
  }
};

const Documentos = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [filtroStatus, setFiltroStatus] = useState("all");
  const [filtroTipo, setFiltroTipo] = useState("all");

  const documentosFiltrados = documentos.filter(doc => {
    const matchStatus = filtroStatus === "all" || doc.status === filtroStatus;
    const matchTipo = filtroTipo === "all" || doc.tipo === filtroTipo;
    return matchStatus && matchTipo;
  });

  const contadores = {
    validos: documentos.filter(d => d.status === "Válido").length,
    vencendo: documentos.filter(d => d.status === "Vencendo").length,
    vencidos: documentos.filter(d => d.status === "Vencido").length,
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Documentos ABVTEX</h1>
          <p className="text-muted-foreground">Gerencie e monitore seus documentos e certificações</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="conffec-button-primary gap-2">
              <Plus className="w-4 h-4" />
              Novo Documento
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Adicionar Documento</DialogTitle>
              <DialogDescription>
                Faça upload de um novo documento para o sistema
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome do Documento</Label>
                <Input id="nome" placeholder="Ex: Alvará de Funcionamento" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="tipo">Tipo</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="alvara">Alvará</SelectItem>
                    <SelectItem value="certificado">Certificado</SelectItem>
                    <SelectItem value="cnpj">CNPJ</SelectItem>
                    <SelectItem value="licenca">Licença</SelectItem>
                    <SelectItem value="outros">Outros</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="validade">Data de Validade</Label>
                <Input id="validade" type="date" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="arquivo">Arquivo</Label>
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                  <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground mb-2">
                    Clique para selecionar ou arraste o arquivo aqui
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Formatos aceitos: PDF, JPG, PNG (máx. 10MB)
                  </p>
                  <Input type="file" className="hidden" id="arquivo" />
                  <Button variant="outline" className="mt-2" asChild>
                    <label htmlFor="arquivo" className="cursor-pointer">
                      Selecionar Arquivo
                    </label>
                  </Button>
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button className="conffec-button-primary" onClick={() => setIsDialogOpen(false)}>
                Salvar Documento
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="conffec-card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Documentos Válidos</p>
              <p className="text-xl font-bold">{contadores.validos}</p>
            </div>
          </div>
        </div>

        <div className="conffec-card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-warning" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Vencendo</p>
              <p className="text-xl font-bold">{contadores.vencendo}</p>
            </div>
          </div>
        </div>

        <div className="conffec-card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-error/10 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-error" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Vencidos</p>
              <p className="text-xl font-bold">{contadores.vencidos}</p>
            </div>
          </div>
        </div>

        <div className="conffec-card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Upload className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total</p>
              <p className="text-xl font-bold">{documentos.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="conffec-card p-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar documento..."
                className="pl-9 conffec-input"
              />
            </div>

            <Select value={filtroStatus} onValueChange={setFiltroStatus}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="Válido">Válidos</SelectItem>
                <SelectItem value="Vencendo">Vencendo</SelectItem>
                <SelectItem value="Vencido">Vencidos</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filtroTipo} onValueChange={setFiltroTipo}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="Alvará">Alvará</SelectItem>
                <SelectItem value="Certificado">Certificado</SelectItem>
                <SelectItem value="CNPJ">CNPJ</SelectItem>
                <SelectItem value="Licença">Licença</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button variant="outline" className="gap-2">
            <Filter className="w-4 h-4" />
            Filtros Avançados
          </Button>
        </div>
      </div>

      {/* Tabela de Documentos */}
      <div className="conffec-card">
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Lista de Documentos</h3>
              <p className="text-sm text-muted-foreground">
                {documentosFiltrados.length} de {documentos.length} documentos
              </p>
            </div>
            
            <Button variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              Exportar Lista
            </Button>
          </div>
        </div>
        
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Validade</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Upload</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {documentosFiltrados.map((doc) => (
              <TableRow key={doc.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(doc.status)}
                    <span className="font-medium">{doc.nome}</span>
                  </div>
                </TableCell>
                <TableCell>{doc.tipo}</TableCell>
                <TableCell>{doc.validade}</TableCell>
                <TableCell>{getStatusBadge(doc.status)}</TableCell>
                <TableCell className="text-muted-foreground">{doc.upload}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button size="sm" variant="outline">
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <Download className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Alertas importantes */}
      {(contadores.vencendo > 0 || contadores.vencidos > 0) && (
        <div className="space-y-4">
          {contadores.vencidos > 0 && (
            <div className="conffec-card p-4 border-l-4 border-l-error bg-error/5">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-error mt-0.5" />
                <div>
                  <h4 className="font-semibold text-error">Atenção: Documentos Vencidos</h4>
                  <p className="text-sm text-muted-foreground">
                    Você possui {contadores.vencidos} documento(s) vencido(s). Regularize o quanto antes.
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {contadores.vencendo > 0 && (
            <div className="conffec-card p-4 border-l-4 border-l-warning bg-warning/5">
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-warning mt-0.5" />
                <div>
                  <h4 className="font-semibold text-warning">Documentos Próximos ao Vencimento</h4>
                  <p className="text-sm text-muted-foreground">
                    {contadores.vencendo} documento(s) vencendo em breve. Planeje a renovação.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Documentos;
