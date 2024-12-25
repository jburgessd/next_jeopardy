"use client";

import { useUser } from "@clerk/nextjs";
import { isMobile } from "react-device-detect";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();

  const { user, isLoaded } = useUser();

  // Redirect mobile users to the mobile version of the site
  useEffect(() => {
    if (!isMobile) {
      router.replace("/");
    }
  }, [isMobile]);

  if (!isLoaded) return <></>;

  return (
    <main className="flex h-screen w-full bg-jeopardy bg-cover bg-center font-korinna">
      {children}
    </main>
  );
}
