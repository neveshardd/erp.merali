"use client";

import { Bell } from "lucide-react";
import * as React from "react";
import { Toaster } from "sonner";
import { AppSidebar } from "@/components/app-sidebar";
import { DynamicBreadcrumb } from "@/components/dynamic-breadcrumb";
import { NotificationModal } from "@/components/notification-modal";
import { QueryProvider } from "@/components/providers/query-provider";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useNotifications } from "@/hooks/use-notifications";

// This inner component lives INSIDE QueryProvider, so useQuery works correctly
function AppHeader() {
  const [isNotifOpen, setIsNotifOpen] = React.useState(false);
  const { unreadCount } = useNotifications();

  return (
    <>
      <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center justify-between gap-2 border-b border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-md transition-all">
        <div className="flex items-center gap-2 px-4 flex-1">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <DynamicBreadcrumb />
        </div>

        <div className="px-6 flex items-center gap-2">
          <ThemeSwitcher />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsNotifOpen(true)}
            className="relative w-10 h-10 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all active:scale-90"
          >
            <Bell className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-blue-600 px-1 text-[8px] font-black leading-none text-white ring-2 ring-white dark:ring-neutral-950">
                {unreadCount > 9 ? "+9" : unreadCount}
              </span>
            )}
          </Button>
        </div>
      </header>

      <NotificationModal open={isNotifOpen} onOpenChange={setIsNotifOpen} />
    </>
  );
}

export function PrivateLayoutClient({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <QueryProvider>
      <SidebarProvider>
        <Toaster position="top-right" expand={false} richColors />
        <AppSidebar />
        <SidebarInset className="bg-neutral-50/50 dark:bg-neutral-950/50">
          <AppHeader />

          <div className="flex flex-1 flex-col gap-4 p-6 pt-6">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </QueryProvider>
  );
}
