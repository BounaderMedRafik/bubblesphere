"use client";
import { buttonIconSize, englishNiches } from "@/data/data";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { buttonVariants } from "../ui/button";
import { Newspaper } from "lucide-react";
import { RiHashtag } from "react-icons/ri";
import useFetchPostsByNeich from "@/functionalities/useFetchPostsByNeich";
import Post from "./Post";

const FeedContent = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  return (
    <div>
      <div className=" text-2xl font-bold opacity-50 flex items-center justify-center gap-3">
        <div>Feed</div>
        <div>
          <Newspaper size={buttonIconSize} />
        </div>
      </div>
      <Tags />

      <div>
        <TagPosts />
      </div>

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

const Tags = () => {
  const [shuffledNiches, setShuffledNiches] = useState<string[]>([]);

  useEffect(() => {
    setShuffledNiches(
      [...englishNiches].sort(() => 0.5 - Math.random()).slice(0, 15)
    );
  }, []);

  return (
    <>
      <div className=" text-lg mb-2 mt-5 opacity-75">Tags</div>
      <div className="flex flex-wrap gap-1">
        {shuffledNiches.map((item, i) => (
          <div key={i}>
            <Link
              href={`/tags/${item}`}
              className={buttonVariants({
                variant: "secondary",
                size: "sm",
                className: "border border-primary/10 text-xs py-1 px-2",
              })}
            >
              <div>
                <div className="flex items-center gap-1">
                  <div>
                    <RiHashtag className=" opacity-75" size={8} />
                  </div>
                  <div>{item}</div>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </>
  );
};

const TagPosts = () => {
  const { posts } = useFetchPostsByNeich("General");
  return (
    <div>
      {posts.map((post) => (
        <div key={post.postid}>
          <Post
            postid={post.postid}
            created_at={post.created_at}
            userid={post.userid}
            content={post.content}
            title={post.title}
            niech={post.niech}
            thumbnail={post.thumbnail}
          />
        </div>
      ))}
    </div>
  );
};

export default FeedContent;
