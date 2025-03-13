import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { FaBookBookmark, FaHeart, FaPen, FaUser } from "react-icons/fa6";
import { buttonVariants } from "../ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { cn } from "@/lib/utils";
import { InputStyle } from "../ui/input";

const links = [
  {
    Title: "Saved Thoughts",
    link: "/save",
    icon: <FaBookBookmark size={17} />,
  },
  {
    Title: "Liked Thoughts",
    link: "/likes",
    icon: <FaHeart size={17} />,
  },
  {
    Title: "Profile",
    link: "/profile",
    icon: <FaUser size={17} />,
  },
];

const UserNavigation = () => {
  return (
    <div className=" fixed top-0 left-0  z-50 w-full flex  items-center justify-center">
      <div className=" wrapper w-full flex items-center border-b bg-background/50 backdrop-blur border-x border-foreground/10 rounded-b-xl px-4 justify-between py-3 ">
        {/* logo */}
        <div className="flex items-center gap-2">
          <Link href={"/"} className=" hover:opacity-75 transition-all ">
            <div className=" flex items-center gap-1">
              <img src="/logo.svg" className=" size-6 md:size-9" alt="" />
              <div className=" text-base md:text-xl font-bold mt-1">
                {" "}
                <div>
                  Bubble<span className=" text-primary">Sphere</span>
                </div>
              </div>
            </div>
          </Link>

          <div>
            <SearchingBar />
          </div>
        </div>

        {/* user actions */}
        <div className="flex items-center text-foreground/75 ">
          <div>
            <MakePostButton />
          </div>
          {links.map((item, i) => {
            return (
              <div key={i}>
                <TooltipProvider delayDuration={10}>
                  <Tooltip>
                    <TooltipTrigger>
                      <Link
                        href={item.link}
                        className={buttonVariants({
                          variant: "ghost",
                          size: "icon",
                          className: "hover:text-primary",
                        })}
                      >
                        {item.icon}
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent>{item.Title}</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            );
          })}
          <div className=" pl-1.5  mt-2">
            <UserButton />
          </div>
        </div>
      </div>
    </div>
  );
};

const MakePostButton = () => {
  return (
    <div>
      <TooltipProvider delayDuration={10}>
        <Tooltip>
          <TooltipTrigger>
            <div
              className={buttonVariants({
                variant: "ghost",
                size: "icon",
                className: "hover:text-primary",
              })}
            >
              <FaPen size={17} />
            </div>
          </TooltipTrigger>
          <TooltipContent>Make A Post</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

const SearchingBar = () => {
  return (
    <div>
      <div className=" hidden md:block">
        <input
          type="text"
          className={cn(
            InputStyle,
            " p-0 h-auto px-4 py-2 rounded-full bg-transparent"
          )}
          placeholder="Search..."
        />
      </div>
    </div>
  );
};

export default UserNavigation;
