export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import "./globals.css";
import localFont from "next/font/local";
import { ClerkProvider } from "@clerk/nextjs";
import { ClientSocketProvider } from "@/providers/ClientSocketProvider";

const korinna = localFont({
  src: "../public/fonts/korinna.otf",
  variable: "--font-korinna",
  weight: "400",
});

const montserrat = localFont({
  src: "../public/fonts/montserrat.otf",
  variable: "--font-montserrat",
  weight: "400",
});

const swiss911 = localFont({
  src: "../public/fonts/swiss911.otf",
  variable: "--font-swiss911",
  weight: "400",
});

export const metadata: Metadata = {
  title: "Host Jeopardy!",
  description:
    "Host Jeopardy games with your friends by hosting a game that has been played, or create your own!",
  icons: {
    icon: "/icons/j.png",
  },
};

// Determine backend URL based on environment
const resolvedBackendUrl =
  process.env.NODE_ENV === "production"
    ? "https://real-backend-url.com"
    : "http://localhost:5000";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY as string}
      appearance={{
        layout: {
          socialButtonsVariant: "iconButton",
          logoImageUrl: "/icons/j.png",
          animations: true,
        },
        variables: {
          colorBackground: "#f5f5f5",
          colorPrimary: "#060ce9",
          colorText: "black",
          colorInputBackground: "#eeeeee",
          colorInputText: "black",
        },
      }}
    >
      <html lang="en">
        <body
          className={`${korinna.variable} ${montserrat.variable} ${swiss911.variable} text-white`}
        >
          <ClientSocketProvider backendUrl={resolvedBackendUrl}>
            {children}
          </ClientSocketProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
