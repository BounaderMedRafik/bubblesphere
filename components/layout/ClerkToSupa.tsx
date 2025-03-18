"use client";
import supabase from "@/app/supabase/supaClient";
import { useUser } from "@clerk/nextjs";
import React, { useEffect } from "react";

const ClerkToSupa = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoaded } = useUser();

  useEffect(() => {
    const insertUser = async () => {
      if (!isLoaded || !user) return;

      await supabase.from("users").insert({
        userid: user.id,
        created_at: user.createdAt,
        name: user.fullName,
        username: user.username,
        pfp: user.imageUrl,
        bio: "",
        location: "",
        banner:
          "https://t3.ftcdn.net/jpg/02/77/66/26/360_F_277662606_r7PK2PXJqLnzDOri6L8aYtKUUxXNUH6B.jpg",
        englishLevel: "",
      });
    };

    insertUser();
  }, [isLoaded, user]);

  return <>{children}</>;
};

export default ClerkToSupa;
