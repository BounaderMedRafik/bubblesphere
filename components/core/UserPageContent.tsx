"use client";
import useFetchUserById from "@/functionalities/useFetchUserById";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import React from "react";
import { Skeleton } from "../ui/skeleton";
import { Brush, Check, Globe, Heart, Loader } from "lucide-react";
import { buttonIconSize } from "@/data/data";
import useFetchUserPosts from "@/functionalities/useFetchUserPosts";
import { Button } from "../ui/button";
import { useUser } from "@clerk/nextjs";
import useFollow from "@/functionalities/useFollow";
import Post from "./Post";
import { FollowersList, FollowingList } from "./ProflePageContent";

const UserPageContent = ({ id }: { id: string }) => {
  const { user, isLoading } = useFetchUserById(id);
  const { posts } = useFetchUserPosts(user.userid);
  return (
    <div className=" -mt-24">
      {isLoading ? (
        <Skeleton className="w-full h-64 max-w-5xl mx-auto rounded-b-3xl" />
      ) : (
        <motion.img
          className={cn(
            "w-full h-64 max-w-5xl mx-auto rounded-b-3xl  object-cover border-b border-b-foreground/10"
          )}
          src={user.banner}
          alt="User Banner"
        />
      )}

      <div className="wrapper -mt-14">
        {isLoading ? (
          <Skeleton className="size-32 shadow-lg rounded-full flex items-center justify-center">
            <Loader size={24} className="animate-spin" />
          </Skeleton>
        ) : (
          <div className="relative border-4 border-background hover:border-foreground/25 shadow-xl transition-all duration-300 cursor-pointer group rounded-full overflow-hidden w-fit">
            {" "}
            <motion.img
              initial={{ opacity: 0, filter: "blur(10px)" }}
              animate={{
                opacity: 1,
                filter: "blur(0px)",
                transition: { duration: 0.5, ease: [0.25, 1, 0.5, 1] },
              }}
              className="size-32 shadow-lg"
              src={user.pfp}
              alt="Profile"
            />
          </div>
        )}

        {/* ButtonsAndShit */}
        <FollowButton followeduserid={user.userid} />

        <div className="flex items-center justify-between mt-3 ">
          <div className=" text-sm opacity-75">
            {isLoading ? (
              <Skeleton className=" w-14 h-3 mb-3" />
            ) : (
              <div className="flex items-center gap-2">
                {`${user?.username == null ? "" : "@"}${
                  user?.username == null ? "set a username" : user.username
                }`}

                {user?.username == null ? <Brush size={12} /> : ""}
              </div>
            )}
          </div>

          <div className=" w-full flex items-center justify-end gap-4">
            <div className=" text-sm opacity-75 hover:opacity-100 transition-all flex items-center gap-1">
              <span className=" font-bold mt-0.5">687</span>{" "}
              <Heart className=" fill-foreground" size={buttonIconSize - 3} />
            </div>

            <div>•</div>
            <FollowersList userid={user.userid} />

            <FollowingList userid={user.userid} />

            {isLoading ? (
              <div>...</div>
            ) : (
              <div className=" text-sm opacity-75 hover:opacity-100 transition-all">
                <span className=" font-bold">{posts.length}</span> Bubble
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between mt-1">
          <div className="  text-xl  font-bold flex items-center gap-2">
            <div>
              {isLoading ? <Skeleton className=" w-24 h-6" /> : user.name}
            </div>
            <div className=" mt-0.5 flex flex-wrap items-center gap-0.5">
              {/* roles and shi */}
            </div>
          </div>
        </div>

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
          className=" flex items-center justify-between mt-2"
        >
          <div>
            <div className="flex items-center gap-1 text-sm group opacity-75">
              <div>{user?.bio ? user.bio : "No bio yet"}</div>
            </div>
          </div>

          <div className="flex items-center gap-3 text-sm opacity-75  transition-all">
            <div>
              <Globe className=" " size={buttonIconSize} />
            </div>
            <div className=" group flex items-center gap-1">
              <div>{user?.location || "Unknow location yet"}</div>
            </div>
          </div>
        </motion.div>
      </div>

      <div className=" w-full wrapper mx-auto h-px bg-foreground/10 my-7" />

      <div className=" wrapper">
        {posts.map((item, i) => (
          <div key={i}>
            <Post
              postid={item.postid}
              created_at={item.created_at}
              userid={item.userid}
              content={item.content}
              title={item.title}
              niech={item.niech}
              thumbnail={item.thumbnail}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export const FollowButton = ({
  followeduserid,
}: {
  followeduserid: string;
}) => {
  const { user, isLoaded } = useUser();
  const userid = user?.id; // Get logged-in user ID

  const { isFollowing, toggleFollow, loading } = useFollow(
    userid || "",
    followeduserid
  );

  return (
    <div className="w-full flex items-center justify-end">
      {isLoaded ? (
        <Button
          variant={isFollowing ? "outline" : "default"}
          size="sm"
          onClick={toggleFollow}
          disabled={loading}
        >
          {loading ? (
            <Loader className=" animate-spin" size={10} />
          ) : isFollowing ? (
            <div className="flex items-center gap-2">
              <div>Following</div>
              <div>
                <Check size={13} />
              </div>
            </div>
          ) : (
            "Follow"
          )}
        </Button>
      ) : null}
    </div>
  );
};

export default UserPageContent;
