import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { createFileRoute, Outlet } from "@tanstack/react-router";

import AppSidebar from "@/components/app-sidebar";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: () => {
    //
  },
  component: RootComponent,
});

function RootComponent() {
  return (
    <>
      <SidebarProvider>
        <AppSidebar />
        <main className="flex flex-row gap-x-3 mt-3 w-full">
          <SidebarTrigger />
          <div className="flex flex-col w-full mt-3 px-4 py-6">
            <Outlet />
          </div>
        </main>
      </SidebarProvider>
    </>
  );
}
