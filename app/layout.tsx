export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import "./globals.css";
import localFont from "next/font/local";
import ConvexClerkProvider from "@/providers/ConvexClerkProvider";
import CreateGameDataProvider from "@/components/CreateGameDataContext";

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ConvexClerkProvider>
      <CreateGameDataProvider>
        <html lang="en">
          <body
            className={`${korinna.variable} ${montserrat.variable} ${swiss911.variable} text-white`}
          >
            {children}
          </body>
        </html>
      </CreateGameDataProvider>
    </ConvexClerkProvider>
  );
}
