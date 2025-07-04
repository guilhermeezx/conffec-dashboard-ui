
import { NavLink, useLocation } from "react-router-dom";
import {
  BarChart3,
  Factory,
  Calculator,
  FileText,
  Upload,
  Wallet,
  TrendingUp,
  Bot,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";

const menuItems = [
  { title: "Dashboard", url: "/", icon: BarChart3 },
  { title: "Produção", url: "/producao", icon: Factory },
  { title: "Custo Minuto", url: "/custo-minuto", icon: Calculator },
  { title: "Fiscal", url: "/fiscal", icon: FileText },
  { title: "Documentos", url: "/documentos", icon: Upload },
  { title: "Financeiro", url: "/financeiro", icon: Wallet },
  { title: "Indicadores", url: "/indicadores", icon: TrendingUp },
  { title: "Balanceamento IA", url: "/balanceamento-ia", icon: Bot },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => {
    if (path === "/") {
      return currentPath === "/";
    }
    return currentPath.startsWith(path);
  };

  const getNavClass = (path: string) => {
    return isActive(path)
      ? "bg-accent text-accent-foreground font-medium border-r-2 border-r-primary"
      : "text-muted-foreground hover:bg-accent/50 hover:text-foreground";
  };

  return (
    <Sidebar className="border-r border-border bg-background">
      <SidebarHeader className="border-b border-border p-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Factory className="w-5 h-5 text-white" />
          </div>
          {state !== "collapsed" && (
            <div>
              <h1 className="text-xl font-bold text-foreground">Conffec</h1>
              <p className="text-xs text-muted-foreground">Sistema de Gestão</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-3 py-2">
            {state !== "collapsed" ? "Menu Principal" : ""}
          </SidebarGroupLabel>
          
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="w-full">
                    <NavLink
                      to={item.url}
                      end={item.url === "/"}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${getNavClass(item.url)}`}
                    >
                      <item.icon className="w-5 h-5 flex-shrink-0" />
                      {state !== "collapsed" && (
                        <span className="font-medium">{item.title}</span>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
