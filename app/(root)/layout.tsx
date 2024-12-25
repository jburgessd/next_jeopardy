"use client";

import SidebarMain from "@/components/Sidebar";
import CreateGameDataProvider from "@/components/CreateGameDataContext";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useUser } from "@clerk/nextjs";
import { isMobile } from "react-device-detect";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();

  const { user, isLoaded } = useUser();

  // Redirect mobile users to the mobile version of the site
  useEffect(() => {
    if (isMobile) {
      router.replace("/mobile");
    }
  }, [isMobile]);

  if (!isLoaded) return <></>;

  return (
    <main className="flex h-screen w-full bg-jeopardy bg-cover bg-center font-korinna">
      <div className="flex w-[--sidebar-width]">
        <SidebarProvider>
          <SidebarMain />
        </SidebarProvider>
      </div>

      <CreateGameDataProvider>
        {children}
        <Toaster />
      </CreateGameDataProvider>
    </main>
  );
}
