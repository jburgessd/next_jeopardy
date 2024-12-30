import { useRouter } from "next/navigation";
import Image from "next/image";
import React, { useEffect } from "react";
import { UserButton, useClerk, useUser } from "@clerk/nextjs";

const Footer = () => {
  const router = useRouter();
  const { signOut } = useClerk();
  const { user, isLoaded } = useUser();

  const handleLogout = () => {
    signOut();
    router.push("/");
  };

  if (!isLoaded || !user) return null;

  return (
    <footer className="footer text-white w-full">
      <div className="footer_name">
        <UserButton />
      </div>

      <div className="footer_email">
        <h1 className="text-sm">{user.username}</h1>
        <p className="text-sm">{user.primaryEmailAddress!.emailAddress}</p>
      </div>

      <div className="footer_image" onClick={handleLogout}>
        <Image src="/icons/logout.svg" fill alt="logout icon" />
      </div>
    </footer>
  );
};

export default Footer;
