import { useRouter } from "next/navigation";
import Image from "next/image";
import React from "react";
import { UserButton, useClerk, useUser } from "@clerk/nextjs";

const Footer = ({ type = "desktop" }: FooterProps) => {
  const router = useRouter();
  const { signOut } = useClerk();
  const { user } = useUser();

  const handleLogout = () => {
    signOut();
    router.push("/");
  };

  return (
    <footer className="footer">
      <div className={type === "mobile" ? "footer_name_mobile" : "footer_name"}>
        <UserButton />
      </div>

      <div
        className={type === "mobile" ? "footer_email_mobile" : "footer_email"}
      >
        <h1 className="text-14 truncate font-semibold ">{user?.username}</h1>
        <p className="text-14 truncate">
          {user?.primaryEmailAddress?.emailAddress}
        </p>
      </div>

      <div className="footer_image" onClick={handleLogout}>
        <Image src="/icons/logout.svg" fill alt="logout icon" />
      </div>
    </footer>
  );
};

export default Footer;
