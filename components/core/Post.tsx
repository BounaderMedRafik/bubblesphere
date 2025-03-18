import { SupaPost } from "@/data/types";
import useFetchUserById from "@/functionalities/useFetchUserById";
import { useUser } from "@clerk/nextjs";
import moment from "moment";
import Link from "next/link";
import React from "react";
import { RiHashtag } from "react-icons/ri";
import { Skeleton } from "../ui/skeleton";

const Post: React.FC<SupaPost> = ({
  postid,
  title,
  content,
  userid,
  thumbnail,
  created_at,
  niech,
}) => {
  const { user, isLoading } = useFetchUserById(userid);
  const { user: ClerkUser } = useUser();

  return (
    <div>
      <div key={postid} className="border-b border-b-foreground/10 py-5 mt-2">
        <div className="mb-4 flex items-start gap-2">
          <div>
            {isLoading ? (
              <Skeleton className="size-10 rounded-full border border-foreground/10" />
            ) : (
              <Link
                href={
                  user.userid == ClerkUser?.id ? "/profile" : `/user/${userid}`
                }
              >
                <img
                  src={user.pfp}
                  className="size-10 rounded-full border border-foreground/10"
                  alt=""
                />
              </Link>
            )}
          </div>

          <div>
            {isLoading ? (
              <div>
                <Skeleton className=" h-4 w-24" />
              </div>
            ) : (
              <div className="font-bold opacity-75">{user.name}</div>
            )}
            <div className="text-xs opacity-75 -mt-0.5">
              {moment(created_at).format("MMMM Do YYYY, h:mm:ss a")}
            </div>
          </div>
        </div>
        {thumbnail && (
          <img
            src={thumbnail}
            alt="Thumbnail"
            className="w-full h-44 object-cover rounded-md"
          />
        )}

        {niech && (
          <div className="flex mt-2 items-center gap-1.5 text-sm w-fit bg-accent  px-2 py-1 rounded-md ">
            <div className=" -mt-0.5">
              <RiHashtag size={13} />
            </div>
            <div>{niech}</div>
          </div>
        )}

        <h2 className="font-bold mt-4 text-2xl">{title}</h2>
        <div
          className="text-sm opacity-80 mt-3"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    </div>
  );
};

export default Post;
