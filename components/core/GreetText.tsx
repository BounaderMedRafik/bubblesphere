"use client";
import { createClient } from "@/utils/supabase/client";
import React, { useEffect, useState } from "react";
import LogoutButton from "./LogoutButton";

const UserGreetText = () => {
  const [user, setUser] = useState<any>(null);
  const supabase = createClient();
  console.log(user);
  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };
    fetchUser();
  }, []);
  if (user !== null) {
    return (
      <>
        <div className=" ">
          <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
            hello&nbsp;
            <code className="font-mono font-bold">{user.email ?? "user"}!</code>
          </p>
          <LogoutButton />
        </div>
      </>
    );
  }
  return (
    <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
      Get started editing&nbsp;
      <code className="font-mono font-bold">app/page.tsx</code>
    </p>
  );
};

export default UserGreetText;
