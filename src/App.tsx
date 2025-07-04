
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppLayout from "./components/layout/AppLayout";
import Dashboard from "./pages/Dashboard";
import Producao from "./pages/Producao";
import CustoMinuto from "./pages/CustoMinuto";
import Fiscal from "./pages/Fiscal";
import Documentos from "./pages/Documentos";
import Financeiro from "./pages/Financeiro";
import Indicadores from "./pages/Indicadores";
import BalanceamentoIA from "./pages/BalanceamentoIA";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <SidebarProvider>
          <div className="min-h-screen w-full bg-muted">
            <Routes>
              <Route path="/" element={<AppLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="producao" element={<Producao />} />
                <Route path="custo-minuto" element={<CustoMinuto />} />
                <Route path="fiscal" element={<Fiscal />} />
                <Route path="documentos" element={<Documentos />} />
                <Route path="financeiro" element={<Financeiro />} />
                <Route path="indicadores" element={<Indicadores />} />
                <Route path="balanceamento-ia" element={<BalanceamentoIA />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </SidebarProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
