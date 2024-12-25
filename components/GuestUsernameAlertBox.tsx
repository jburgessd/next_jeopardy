"use client";

import React, { useState } from "react";
import {
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

interface GuestUsernameAlertDialogProps {
  onSetUsername: (username: string) => void;
}

const GuestUsernameAlertDialog: React.FC<GuestUsernameAlertDialogProps> = ({
  onSetUsername,
}) => {
  const [username, setUsername] = useState("");

  const handleSetUsername = () => {
    if (username.trim() === "") {
      alert("Username cannot be empty");
      return;
    }
    onSetUsername(username);
  };

  return (
    <AlertDialogContent className="bg-blue-heather border-black-0 font-korinna text-shadow-h">
      <AlertDialogHeader>
        <AlertDialogTitle>Enter Your Username</AlertDialogTitle>
        <AlertDialogDescription>
          Provide a username to continue as a guest or sign in to your account.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <div className="space-y-4">
        <Input
          className="text-black-0"
          type="text"
          placeholder="Enter your username (12 chars)"
          value={username}
          onChange={(e) => {
            e.target.value.length <= 12 ? setUsername(e.target.value) : null;
          }}
        />
      </div>
      <AlertDialogFooter className="items-end">
        <Button
          className="bg-clue-gradient hover:text-shadow-h"
          variant="outline"
          onClick={handleSetUsername}
        >
          Continue as Guest
        </Button>
        <p className="text-sm">
          or{" "}
          <Link
            className="hover:text-jeopardy-blue-500 hover:underline underline-offset-4"
            href="/sign-in"
          >
            Sign In
          </Link>
        </p>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
};

export default GuestUsernameAlertDialog;
