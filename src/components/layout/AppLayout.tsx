
import { Outlet } from "react-router-dom";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import AppHeader from "./AppHeader";

const AppLayout = () => {
  return (
    <div className="flex min-h-screen w-full">
      <AppSidebar />
      
      <div className="flex-1 flex flex-col">
        <AppHeader />
        
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
