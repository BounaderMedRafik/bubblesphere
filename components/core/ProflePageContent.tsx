"use client";
import supabase from "@/app/supabase/supaClient";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { buttonIconSize } from "@/data/data";
import { SupaUser } from "@/data/types";
import useChangeUserBanner from "@/functionalities/useChangeUserBanner";
import useChangeUserBio from "@/functionalities/useChangeUserBio";
import useChangeUserLocation from "@/functionalities/useChangeUserLocation";
import useFetchFollowings from "@/functionalities/useFetchFollowings";
import useFetchUserPosts from "@/functionalities/useFetchUserPosts";
import useGetSupaUser from "@/functionalities/useGetSupaUser";
import { cn } from "@/lib/utils";
import { CONTINENTS, fetchCountries } from "@/utils/locationService";
import { useUser } from "@clerk/nextjs";
import { Brush, Camera, Globe, Heart, Loader } from "lucide-react";
import moment from "moment";
import { motion } from "motion/react";
import { ChangeEvent, useEffect, useState } from "react";
import { RiBubbleChartFill, RiHashtag } from "react-icons/ri";
import { toast } from "sonner";
import { ScrollArea } from "../ui/scroll-area";
import { FollowButton } from "./UserPageContent";
import useFetchFollowers from "@/functionalities/useFetchFollowers";
import Link from "next/link";

const ProfilePageContent = () => {
  const { user, isLoaded } = useUser();
  const { supaUser, isLoadingSupaUser } = useGetSupaUser(user?.id);
  const { posts, isLoading } = useFetchUserPosts(user?.id);

  return (
    <div className=" -mt-24 ">
      <div className=" w-full ">
        <ProfileBannerAndInfos clerkuser={supaUser} />
      </div>

      <div className=" wrapper mt-5">
        <div className="flex items-center justify-between">
          <div className=" text-sm opacity-75">
            {isLoaded ? (
              <div className="flex items-center gap-2">
                {`${user?.username == null ? "" : "@"}${
                  user?.username == null ? "set a username" : user.username
                }`}

                {user?.username == null ? <Brush size={12} /> : ""}
              </div>
            ) : (
              <Skeleton className=" w-14 h-3 mb-3" />
            )}
          </div>

          <div className=" w-full flex items-center justify-end gap-4">
            <div className=" text-sm opacity-75 hover:opacity-100 transition-all flex items-center gap-1">
              <span className=" font-bold mt-0.5">687</span>{" "}
              <Heart className=" fill-foreground" size={buttonIconSize - 3} />
            </div>

            <div>•</div>

            <FollowersList userid={user?.id || undefined} />

            <FollowingList userid={user?.id || undefined} />

            {isLoading ? (
              <div>...</div>
            ) : (
              <div className=" text-sm opacity-75 hover:opacity-100 transition-all">
                <span className=" font-bold">{posts.length}</span> Bubble
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="  text-xl  font-bold flex items-center gap-2">
            <div>
              {isLoaded ? user?.fullName : <Skeleton className=" w-24 h-6" />}
            </div>
            <div className=" mt-0.5 flex flex-wrap items-center gap-0.5">
              {/* roles and shi */}
            </div>
          </div>
        </div>

        <div className=" mt-3">
          {isLoadingSupaUser ? (
            <>
              <div className="flex items-center justify-between">
                <Skeleton className=" h-3 w-44" />
                <Skeleton className=" h-3 w-44 " />
              </div>
            </>
          ) : (
            <motion.div
              initial={{
                opacity: 0,
                filter: "blur(10px)",
              }}
              animate={{
                opacity: 1,
                filter: "blur(0px)",
                transition: {
                  ease: [0.33, 1, 0.68, 1],
                },
              }}
              className=" flex items-center justify-between"
            >
              <Bio user={supaUser} />
              <Location user={supaUser} />
            </motion.div>
          )}
        </div>

        <div className=" h-px w-1/3 mx-auto my-6 bg-foreground/25" />

        <div>
          <div className=" text-xl flex items-center gap-2">
            <div>
              <RiBubbleChartFill size={15} />
            </div>
            <div>Your Bubbles</div>
          </div>

          <YourBubbles />
        </div>
      </div>
    </div>
  );
};

const ProfileBannerAndInfos = ({
  clerkuser,
}: {
  clerkuser: SupaUser | null;
}) => {
  const { user, isLoaded } = useUser();
  const { updateBanner, error } = useChangeUserBanner(user?.id || "");

  console.log("this error from yo mama", error);
  console.log("nigga here is yo banner", clerkuser?.banner);

  const handleBannerUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    if (!file) return;

    try {
      const newBannerUrl = await updateBanner(file, clerkuser?.banner);
      if (newBannerUrl) {
        toast.success("Banner updated successfully!");
      }
    } catch (error) {
      console.error("Error uploading banner:", error);
      toast.error("Failed to upload banner. Try again.");
    }
  };

  const handleImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return; // Ensure files exist

    const file = files[0];
    if (!file || !user?.setProfileImage || !user?.id) return;

    const img = new Image();
    img.src = URL.createObjectURL(file);

    img.onload = async () => {
      if (img.width !== img.height) {
        toast.error("Only 1:1 aspect ratio images are allowed!");
        return;
      }

      try {
        // Upload new image to Clerk
        await user.setProfileImage({ file });

        // Wait a moment for Clerk to update the profile image URL
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // Fetch the updated user data from Clerk
        const updatedUser = await user?.reload(); // Ensure Clerk refreshes user data
        const newProfileImageUrl = updatedUser?.imageUrl;

        if (!newProfileImageUrl)
          throw new Error("Failed to get new profile image URL");

        // Update the profile image URL in Supabase database
        const { error } = await supabase
          .from("users")
          .update({ pfp: newProfileImageUrl })
          .eq("userid", user.id);

        if (error) throw error;

        toast.success("Profile picture updated successfully!");
      } catch (error) {
        console.error("Error updating profile picture:", error);
        toast.error("Failed to update profile picture. Try again.");
      }
    };
  };

  return (
    <div className="relative ">
      {/* Banner Section */}
      <div className="relative group overflow-hidden">
        {!clerkuser?.banner ? (
          <>
            <Skeleton className="w-full h-64 max-w-5xl mx-auto rounded-b-3xl  " />
          </>
        ) : (
          <>
            <motion.img
              className={cn(
                "w-full h-64 max-w-5xl mx-auto rounded-b-3xl  object-cover border-b border-b-foreground/10",
                clerkuser.banner ==
                  "https://hgrncbiqksbbxlrjxfoj.supabase.co/storage/v1/object/public/banners/dev/bannerplaceholder.png"
                  ? " dark:invert"
                  : ""
              )}
              src={clerkuser?.banner}
              alt="User Banner"
            />
          </>
        )}

        {/* Buttons */}
        <div className="absolute -bottom-9 group-hover:bottom-2 transition-all left-1/2 -translate-x-1/2">
          <div>
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="secondary"
                  size="sm"
                  className=" rounded-l-full "
                >
                  Show image
                </Button>
              </DialogTrigger>
              <DialogContent className="p-0.5">
                <DialogTitle className=" sr-only" />
                <img
                  className="h-64 w-full object-cover rounded-md"
                  src={
                    clerkuser?.banner
                      ? clerkuser.banner
                      : "https://images.pexels.com/photos/1133957/pexels-photo-1133957.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                  }
                  alt=""
                />
              </DialogContent>
            </Dialog>
            <label className="inline-block relative">
              <input
                type="file"
                className="hidden"
                onChange={handleBannerUpload}
                accept="image/*"
                id="bannerUpload"
              />
              <Button
                size="sm"
                className=" rounded-r-full"
                onClick={() => document.getElementById("bannerUpload")?.click()}
              >
                Change cover
              </Button>
            </label>
          </div>
        </div>
      </div>

      {/* Profile Image Section */}
      <div className="wrapper -mt-14">
        {isLoaded ? (
          <div className="relative border-4 border-background hover:border-foreground/25 shadow-xl transition-all duration-300 cursor-pointer group rounded-full overflow-hidden w-fit">
            <motion.img
              initial={{ opacity: 0, filter: "blur(10px)" }}
              animate={{
                opacity: 1,
                filter: "blur(0px)",
                transition: { duration: 0.5, ease: [0.25, 1, 0.5, 1] },
              }}
              className="size-32 shadow-lg"
              src={user?.imageUrl}
              alt="Profile"
            />
            <label className="h-1/2 text-center group-hover:bottom-0 flex-col gap-1 opacity-0 group-hover:opacity-100 w-full absolute -bottom-full transition-all ease-[0.25, 1, 0.5, 1] duration-300 left-0 bg-background/75 backdrop-blur-sm z-20 flex items-center object-cover justify-center cursor-pointer">
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
              />
              <Camera size={16} className="opacity-75" />
              <div className="text-xs w-1/2">Recommend size 1:1</div>
            </label>
          </div>
        ) : (
          <Skeleton className="size-32 shadow-lg rounded-full flex items-center justify-center">
            <Loader size={24} className="animate-spin" />
          </Skeleton>
        )}
      </div>
    </div>
  );
};

const Bio = ({ user }: { user: SupaUser | null }) => {
  const MAX_BIO_LENGTH = 40;
  const { user: clerkUser } = useUser();
  const { updateBio, isLoading } = useChangeUserBio(clerkUser?.id);

  const [editing, setEditing] = useState(false);
  const [newBio, setNewBio] = useState(user?.bio || "");
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    if (newBio.length > MAX_BIO_LENGTH) return;
    await updateBio(newBio);
    setEditing(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewBio(value);

    if (value.length > MAX_BIO_LENGTH) {
      setError(`Bio must be ${MAX_BIO_LENGTH} characters max.`);
    } else {
      setError(null);
    }
  };

  return (
    <div
      className={cn(
        "text-base  opacity-75 flex flex-col gap-1 transition-all w-fit cursor-pointer hover:opacity-100",
        editing ? "opacity-100" : ""
      )}
    >
      {editing ? (
        <motion.div
          initial={{
            opacity: 0,
            filter: "blur(10px)",
          }}
          animate={{
            opacity: 1,
            filter: "blur(0)",
            transition: {
              ease: [0.33, 1, 0.68, 1],
            },
          }}
          className="flex flex-col gap-1"
        >
          <div className="flex gap-1 items-center">
            <Input
              type="text"
              value={newBio}
              onChange={handleChange}
              max={41}
              maxLength={41}
              className="border h-8 rounded text-sm"
              disabled={isLoading}
            />
            <div className="flex items-center gap-0.5">
              <Button
                size="sm"
                onClick={handleSave}
                disabled={isLoading || !!error}
              >
                {isLoading ? "Saving..." : "Save"}
              </Button>
              <Button
                onClick={() => setEditing(false)}
                size="sm"
                variant="outline"
              >
                Cancel
              </Button>
            </div>
          </div>
          {error && <p className="text-destructive text-xs">{error}</p>}
        </motion.div>
      ) : (
        <div
          onClick={() => setEditing(true)}
          className="flex items-center gap-1 text-sm group"
        >
          <div>{user?.bio ? user.bio : "No bio yet, Create one!"}</div>
          <div className="group-hover:opacity-100 opacity-0 transition-all text-xs">
            (Edit Bio)
          </div>
        </div>
      )}
    </div>
  );
};

const Location = ({ user }: { user: SupaUser | null }) => {
  const { user: clerkUser } = useUser();
  const { updateLocation, isLoading } = useChangeUserLocation(clerkUser?.id);

  const [continent, setContinent] = useState<string | null>(null);
  const [country, setCountry] = useState<string | null>(null);
  const [countries, setCountries] = useState<string[]>([]);

  useEffect(() => {
    if (continent) {
      fetchCountries(continent).then(setCountries);
      setCountry(null);
    }
  }, [continent]);

  const handleSave = async () => {
    if (country) {
      const fullLocation = `${country}, ${continent}`;
      await updateLocation(fullLocation);
    }
  };

  return (
    <div className="">
      <Dialog>
        <DialogTrigger>
          <div className="cursor-pointer flex items-center gap-3 text-sm opacity-75 hover:opacity-100 transition-all">
            <div>
              <Globe className=" " size={buttonIconSize} />
            </div>
            <div className=" group flex items-center gap-1">
              <div>{user?.location || "Set your location"}</div>
            </div>
          </div>
        </DialogTrigger>
        <DialogContent className="w-64 ">
          <DialogHeader>
            <DialogTitle className="font-bold opacity-75">Location</DialogTitle>
            <DialogDescription className="text-xs">
              Update your location, And show from where you are.
            </DialogDescription>
          </DialogHeader>
          <div className=" w-full flex flex-col gap-1">
            {/* Continent Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="truncate max-w-full">
                  {continent || "Select Continent"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {CONTINENTS.map((cont: string) => (
                  <DropdownMenuItem
                    key={cont}
                    onClick={() => setContinent(cont)}
                    className=""
                  >
                    {cont}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Country Dropdown */}
            {continent && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="truncate max-w-60">
                    {country || "Select Country"}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {countries.map((c) => (
                    <DropdownMenuItem key={c} onClick={() => setCountry(c)}>
                      {c}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Save Button */}
            <div className=" mt-1  grid grid-cols-2 gap-1">
              <DialogClose asChild>
                <Button variant={"secondary"} size={"sm"} onClick={handleSave}>
                  Cancel
                </Button>
              </DialogClose>
              <Button
                size={"sm"}
                onClick={handleSave}
                disabled={!country || isLoading}
              >
                {isLoading ? "Saving..." : "Save Location"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const YourBubbles = () => {
  const { user } = useUser();
  const { posts, isLoading, error } = useFetchUserPosts(user?.id);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (isLoading)
    return (
      <div className="w-full min-h-44 flex items-center justify-center">
        <div className="flex items-center gap-2 opacity-75 animate-pulse">
          <div>Loading Bubbles</div>
          <div>
            <Loader className="animate-spin" size={14} />
          </div>
        </div>
      </div>
    );

  if (error) return <p>Error: {error}</p>;
  if (posts.length === 0)
    return (
      <div className=" w-full flex items-center justify-center min-h-44 text-sm opacity-75">
        No Bubbles yet,{"  "}
        <Link href="/" className=" text-primary hover:underline">
          Create One!
        </Link>
      </div>
    );

  return (
    <div>
      {posts.map((post) => (
        <div
          key={post.postid}
          className="border-b border-b-foreground/10 py-5 mt-2"
        >
          <div className="mb-4 flex items-start gap-2">
            <div>
              <img
                src={user?.imageUrl}
                className="size-10 rounded-full border border-foreground/10"
                alt=""
              />
            </div>

            <div>
              <div className="font-bold opacity-75">{user?.firstName}</div>
              <div className="text-xs opacity-75 -mt-0.5">
                {moment(post.created_at).format("MMMM Do YYYY, h:mm:ss a")}
              </div>
            </div>
          </div>
          {post.thumbnail && (
            <img
              src={post.thumbnail}
              alt="Thumbnail"
              className="w-full h-44 object-cover rounded-md"
            />
          )}

          {post.niech && (
            <div className="flex mt-2 items-center gap-1.5 text-sm w-fit bg-accent  px-2 py-1 rounded-md ">
              <div className=" -mt-0.5">
                <RiHashtag size={13} />
              </div>
              <div>{post.niech}</div>
            </div>
          )}

          <h2 className="font-bold mt-4 text-2xl">{post.title}</h2>
          <div
            className="text-sm opacity-80 mt-3"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>
      ))}

      <div className="min-h-44 text-sm gap-1 w-full flex items-center justify-center opacity-75">
        <div>End of posts</div>
        <button
          onClick={scrollToTop}
          className="text-primary hover:underline cursor-pointer ml-1"
        >
          Go Top
        </button>
      </div>
    </div>
  );
};

export const FollowingList = ({ userid }: { userid: string | undefined }) => {
  const { followedUsers, loading } = useFetchFollowings(userid);
  const [followedUserData, setFollowedUserData] = useState<SupaUser[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const { user: ClerkUser } = useUser();

  useEffect(() => {
    if (!followedUsers.length) {
      setFollowedUserData([]);
      setLoadingUsers(false);
      return;
    }

    const fetchUsers = async () => {
      setLoadingUsers(true);
      try {
        const userIds = followedUsers.map((user) => user.followeduserid);

        const { data, error } = await supabase
          .from("users")
          .select("*")
          .eq("userid", userIds);

        if (error) throw new Error(error.message);

        setFollowedUserData(data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          console.error("Error fetching followed users:", err.message);
        } else {
          console.error(
            "An unknown error occurred while fetching followed users."
          );
        }
      } finally {
        setLoadingUsers(false);
      }
    };

    fetchUsers();
  }, [followedUsers]);

  console.log(followedUserData);

  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <div className="text-sm cursor-pointer opacity-75 hover:opacity-100 transition-all">
            <span className="font-bold">
              {loading ? "...  " : followedUsers.length}
            </span>{" "}
            Followings
          </div>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader className=" px-3 pt-2">
            <DialogTitle className=" font-bold opacity-75">
              Following Accounts
            </DialogTitle>
            <div className=" text-xs opacity-60 max-w-xs">
              Here are the accounts you&apos;re currently following. Stay
              updated with their latest posts and interactions!
            </div>
          </DialogHeader>

          <ScrollArea className=" scrollbar max-h-64">
            <div className="space-y-1">
              {loadingUsers ? (
                <p>Loading...</p>
              ) : followedUserData.length > 0 ? (
                followedUserData.map((user) => (
                  <div key={user.userid}>
                    <div className="flex relative items-center justify-between space-x-3 p-2 rounded-md">
                      <div className=" flex items-center gap-2">
                        {" "}
                        <img
                          src={user.pfp}
                          alt={user.username}
                          className="w-10 h-10 rounded-full border-2 border-foreground/10"
                        />
                        <span className="font-semibold opacity-75">
                          @{user.username}
                        </span>
                      </div>

                      {user.userid == ClerkUser?.id ? (
                        <div className="absolute top-1/2 -translate-y-1/2 right-2 z-20">
                          <Link
                            href={"/profile"}
                            className=" text-sm opacity-75 hover:opacity-100 hover:underline"
                          >
                            You
                          </Link>
                        </div>
                      ) : (
                        <div className="absolute top-1/2 -translate-y-1/2 right-2 z-20">
                          <FollowButton followeduserid={user.userid} />
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className=" min-h-12 flex items-center justify-center text-xs opacity-75">
                  No followings yet.
                </div>
              )}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export const FollowersList = ({ userid }: { userid: string | undefined }) => {
  const { followers, loading } = useFetchFollowers(userid);
  const [followerUserData, setFollowerUserData] = useState<SupaUser[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const { user: ClerkUser } = useUser();

  useEffect(() => {
    if (!followers.length) {
      setFollowerUserData([]);
      setLoadingUsers(false);
      return;
    }

    const fetchUsers = async () => {
      setLoadingUsers(true);

      try {
        if (!followers || followers.length === 0) {
          setFollowerUserData([]);
          setLoadingUsers(false);
          return;
        }

        const userIds = followers.map((user) => user.userid);

        const { data, error } = await supabase
          .from("users")
          .select("*")
          .in("userid", userIds);

        if (error) throw new Error(error.message);

        setFollowerUserData(data ?? []);
      } catch (err: unknown) {
        if (err instanceof Error) {
          console.error("Error fetching follower users:", err.message);
        } else {
          console.error(
            "An unknown error occurred while fetching followers:",
            err
          );
        }
      } finally {
        setLoadingUsers(false);
      }
    };

    fetchUsers();
  }, [followers]);

  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <div className="text-sm cursor-pointer opacity-75 hover:opacity-100 transition-all">
            <span className="font-bold">
              {loading ? "...  " : followers.length}
            </span>{" "}
            Followers
          </div>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader className="px-3 pt-2">
            <DialogTitle className="font-bold opacity-75">
              Followers
            </DialogTitle>
            <div className="text-xs opacity-60 max-w-xs">
              Here are the people who follow you. Engage with them and build
              your community!
            </div>
          </DialogHeader>

          <ScrollArea className="scrollbar max-h-64">
            <div className="space-y-1">
              {loadingUsers ? (
                <p>Loading...</p>
              ) : followerUserData.length > 0 ? (
                followerUserData.map((user) => (
                  <div
                    key={user.userid}
                    className="flex relative items-center justify-between space-x-3 p-2 rounded-md"
                  >
                    <div className="flex items-center gap-2">
                      <img
                        src={user.pfp}
                        alt={user.username}
                        className="w-10 h-10 rounded-full border-2 border-foreground/10"
                      />
                      <span className="font-semibold opacity-75">
                        @{user.username}
                      </span>
                    </div>
                    {user.userid == ClerkUser?.id ? (
                      <div className="absolute top-1/2 -translate-y-1/2 right-2 z-20">
                        <Link
                          href={"/profile"}
                          className=" text-sm opacity-75 hover:opacity-100 hover:underline"
                        >
                          You
                        </Link>
                      </div>
                    ) : (
                      <div className="absolute top-1/2 -translate-y-1/2 right-2 z-20">
                        <FollowButton followeduserid={user.userid} />
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="min-h-12 flex items-center justify-center text-xs opacity-75">
                  No followers yet.
                </div>
              )}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProfilePageContent;
