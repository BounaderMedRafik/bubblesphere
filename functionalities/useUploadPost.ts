import { useState } from "react";
import supabase from "@/app/supabase/supaClient";
import { toast } from "sonner";

interface PostData {
  userid: string;
  title: string;
  content: string;
  thumbnail?: string;
  neich: string;
}

const useUploadPost = () => {
  const [isLoading, setIsLoading] = useState(false);

  const uploadPost = async ({
    userid,
    title,
    content,
    thumbnail,
    neich,
  }: PostData) => {
    if (!userid || !title.trim() || !content.trim()) {
      toast.error("Post must have a title and content!");
      return;
    }

    setIsLoading(true);

    const newPost = {
      userid,
      title,
      content,
      thumbnail: thumbnail || null, // Optional thumbnail
      niech: neich,
    };

    const { error } = await supabase.from("posts").insert([newPost]);

    if (error) {
      console.error("Error uploading post:", error);
      toast.error("Failed to publish post. Try again.");
    } else {
      toast.success("Post published successfully!");
    }

    setIsLoading(false);
  };

  return { uploadPost, isLoading };
};

export default useUploadPost;
