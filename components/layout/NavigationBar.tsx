"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { buttonIconSize, navItems } from "@/data/data";
import { cn } from "@/lib/utils";
import { SignOutButton, useUser } from "@clerk/nextjs";
import { Loader, LogOut, Moon, Search, Sun, User } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NavigationBar = () => {
  const pathname = usePathname();
  return (
    <div className=" w-full fixed z-50 top-0 left-0 flex justify-center   items-center">
      <div className=" wrapper w-full">
        <div className=" px-3 shadow-md border border-foreground/10 bg-background rounded-b-xl py-2.5 flex items-center justify-between max-w-2xl mx-auto ">
          <div className="flex items-center gap-2">
            <Link href={"/"}>
              <img
                className=" p-0.5  size-7 opacity-75 hover:opacity-100 transition-all"
                src={"/brand/logo.svg"}
                alt=""
              />
            </Link>
            <SearchComponent />
          </div>
          <div className="flex items-center gap-1 ">
            {navItems.map((item, i) => (
              <div key={i}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link href={item.link}>
                      <div
                        className={cn(
                          " opacity-50 p-1 rounded-sm hover:opacity-100 transition-all",
                          item.link == pathname
                            ? "opacity-100 bg-foreground/5 border border-foreground/5"
                            : ""
                        )}
                      >
                        {item.icon}
                      </div>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>{item.text}</TooltipContent>
                </Tooltip>
              </div>
            ))}

            <div className=" ml-1  -mb-1.5">
              <Profile />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SearchComponent = () => {
  return (
    <div>
      <div className=" flex  cursor-pointer hover:bg-foreground/5 transition-all items-center gap-0.5 px-2 py-1 border   border-foreground/10 rounded-full">
        <div>
          <Search size={12} />
        </div>
        <div className=" text-xs opacity-75">Search</div>
      </div>
    </div>
  );
};

const Profile = () => {
  const { user, isLoaded } = useUser();
  const { setTheme } = useTheme();
  const pathname = usePathname();

  return (
    <div>
      {isLoaded ? (
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <img
                className={cn(
                  " size-6 cursor-pointer border border-accent hover:border-primary/60 transition-all rounded-full",
                  pathname === "/profile" ? "border-primary" : ""
                )}
                src={user?.imageUrl}
                alt=""
              />
            </DropdownMenuTrigger>

            <DropdownMenuContent className=" mt-0.5 ">
              <Link className=" cursor-pointer" href={"/profile"}>
                <DropdownMenuItem>
                  Profile
                  <DropdownMenuShortcut>
                    <User size={buttonIconSize} />
                  </DropdownMenuShortcut>
                </DropdownMenuItem>
              </Link>

              <DropdownMenuItem
                className=" hidden dark:flex"
                onClick={() => setTheme("light")}
              >
                Light Mode
                <DropdownMenuShortcut>
                  <Sun size={buttonIconSize} />
                </DropdownMenuShortcut>
              </DropdownMenuItem>

              <DropdownMenuItem
                className="  dark:hidden"
                onClick={() => setTheme("dark")}
              >
                Dark Mode
                <DropdownMenuShortcut>
                  <Moon size={buttonIconSize} />
                </DropdownMenuShortcut>
              </DropdownMenuItem>

              <SignOutButton>
                <DropdownMenuItem>
                  Log out
                  <DropdownMenuShortcut>
                    <LogOut size={buttonIconSize} />
                  </DropdownMenuShortcut>
                </DropdownMenuItem>
              </SignOutButton>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ) : (
        <div>
          <Loader
            className=" animate-spin text-foreground"
            size={buttonIconSize - 4}
          />
        </div>
      )}
    </div>
  );
};

export default NavigationBar;
