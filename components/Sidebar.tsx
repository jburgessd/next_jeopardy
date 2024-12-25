"use client";

import Image from "next/image";
import { SignedIn, SignedOut, useUser } from "@clerk/nextjs";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "./ui/sidebar";
import { useClientSocket } from "@/providers/ClientSocketProvider";
import { HoverBorderGradient } from "./ui/hover-border-gradient";
import Link from "next/link";
import Footer from "./Footer";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";

// Menu items.
const items = [
  {
    title: "Host Game",
    url: "/host-game",
    icon: "/icons/host.svg",
  },
  {
    title: "Join Game",
    url: "/join-game",
    icon: "/icons/join.svg",
  },
  {
    title: "Create a Game",
    url: "/create-game",
    icon: "/icons/create.svg",
  },
];

const SidebarMain = () => {
  const { open } = useSidebar();
  const { isLoaded, user } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const { sendMessage, isConnected } = useClientSocket();

  if (!isLoaded) return <></>;

  // Disable SidebarTrigger if on the root path
  const isRoot = pathname === "/";

  const cleanServer = () => {
    if (isConnected) {
      sendMessage("cleanServer", {});
    }
  };

  return (
    <>
      {!open && !isRoot ? (
        <div className="p-5 pt-7">
          <SidebarTrigger variant="default" />
        </div>
      ) : null}
      {!open && !isRoot && user ? (
        <div className="absolute bottom-0 p-5 pb-7">
          <Button variant="ghost" onClick={cleanServer}>
            CS
          </Button>
        </div>
      ) : null}
      <Sidebar className="bg-clue-gradient border-black-0 px-2">
        <SidebarHeader>
          <div className="flex items-center justify-between pt-5 pb-10">
            <div className="flex items-center space-x-4">
              <Image
                className="hover:cursor-pointer"
                onClick={() => router.push("/")}
                src="/icons/j.ico"
                alt="J"
                width={32}
                height={32}
              />
              <h1 className="text-2xl text-shadow-h">Host Jeopardy!</h1>
            </div>
            {!isRoot && <SidebarTrigger />}
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {items.map((item) => (
              <SidebarMenuItem
                className="p-2 hover:bg-jeopardy-blue-600 rounded"
                key={item.title}
              >
                <SidebarMenuButton className="p-2" asChild>
                  <Link href={item.url}>
                    <Image
                      src={item.icon}
                      alt={`${item.title} Icon`}
                      width={24}
                      height={24}
                      className="brightness-[3] invert-0"
                    />
                    <h3 className="sidebar-responsive-text text-shadow-h">
                      {item.title}
                    </h3>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <SignedIn>
            <Footer />
          </SignedIn>
          <SignedOut>
            <HoverBorderGradient
              containerClassName="rounded-full"
              as="button"
              className="flex bg-clue-gradient items-center text-white"
            >
              <Link href="/sign-up">Sign Up</Link>
            </HoverBorderGradient>
          </SignedOut>
        </SidebarFooter>
      </Sidebar>
    </>
  );
};

export default SidebarMain;
