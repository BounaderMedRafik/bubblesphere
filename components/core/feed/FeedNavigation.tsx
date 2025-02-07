"use client";
import { buttonVariants } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import { BookMarked, Menu } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { TbHeartCheck } from "react-icons/tb";

const FeedNavigation = () => {
  return (
    <div className=" wrapper py-4 flex items-center justify-between ">
      <div className=" flex items-center  gap-2">
        <div className="flex items-center gap-2">
          <img className=" size-8" src="/logo.svg" alt="logo" />
          <div>
            {" "}
            <div className=" flex pt-1 items-center  select-none cursor-default text-base font-bold ">
              <div>
                Bubble<span className=" text-primary">Sphere</span>
              </div>
            </div>
          </div>
        </div>
        <div>
          <SearchBox />
        </div>
      </div>
      <div>
        <UserTools />
      </div>
    </div>
  );
};

const SearchBox = () => {
  return <>Search Box</>;
};

const UserTools = () => {
  // user pfp
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

  return (
    <>
      <div className="flex items-center">
        <div>
          <Link
            className={buttonVariants({
              variant: "ghost",
              size: "icon",
            })}
            href={"/feed/bookmark"}
          >
            <BookMarked size={14} />
          </Link>
        </div>
        <div>
          <Link
            className={buttonVariants({
              variant: "ghost",
              size: "icon",
            })}
            href={"/feed/likes"}
          >
            <TbHeartCheck size={14} />
          </Link>
        </div>
        <div>
          <Link
            className={buttonVariants({
              variant: "ghost",
              size: "icon",
            })}
            href={"/feed/likes"}
          >
            <Menu size={14} />
          </Link>
        </div>
        <div>
          <img className=" size-9" src={user == null ? " " : user.user_metadata.
} alt="" />
        </div>
      </div>
    </>
  );
};

export default FeedNavigation;
