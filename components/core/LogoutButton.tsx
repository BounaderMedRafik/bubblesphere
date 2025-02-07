"use client";
import React from "react";
import { Button } from "../ui/button";
import { signout } from "@/lib/auth-actions";
import { useRouter } from "next/navigation";

const LogoutButton = () => {
  const router = useRouter();
  return (
    <div>
      <Button
        onClick={() => {
          signout();
          router.push("/");
        }}
      >
        Logout NIgga
      </Button>
    </div>
  );
};

export default LogoutButton;
