"use client";
import React from "react";
import { RiHashtag } from "react-icons/ri";
import PostingThought from "./PostingThought";
import useFetchPostsByNeich from "@/functionalities/useFetchPostsByNeich";
import Post from "./Post";
import { Loader } from "lucide-react";

const SpecificTagPageContent = ({ id }: { id: string }) => {
  const { posts, isLoading } = useFetchPostsByNeich(id);
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  return (
    <div className=" wrapper">
      <div className="text-2xl font-bold opacity-50 flex items-center gap-2">
        <div>
          <RiHashtag size={24} />
        </div>
        <div>{id}</div>
      </div>

      <div className=" mt-4">
        <PostingThought SpecifiedNeich={id} />
      </div>

      <div className=" w-full h-px bg-foreground/10 my-7" />

      {isLoading ? (
        <div className=" flex items-center justify-center text-sm opacity-75 min-h-16 gap-2">
          <div>Loading Bubbles</div>
          <div>
            <Loader className=" animate-spin" size={13} />
          </div>
        </div>
      ) : (
        <div>
          {posts.length > 0 ? (
            <div>
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
          ) : (
            <div className=" flex items-center justify-center text-sm opacity-75 min-h-16">
              no Bubbles?, Create one!
            </div>
          )}
        </div>
      )}

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

export default SpecificTagPageContent;
