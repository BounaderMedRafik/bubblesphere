import { useEffect, useState } from "react";
import supabase from "@/app/supabase/supaClient";
import { toast } from "sonner";
import { SupaPost } from "@/data/types";

const useFetchUserPosts = (userid: string | undefined) => {
  const [posts, setPosts] = useState<SupaPost[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userid) return;

    const fetchPosts = async () => {
      setIsLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("userid", userid)
        .order("created_at", { ascending: false }); // Fetch posts in descending order

      if (error) {
        console.error("Error fetching posts:", error);
        setError("Failed to load posts.");
        toast.error("Failed to load posts. Try again.");
      } else {
        setPosts(data || []);
      }

      setIsLoading(false);
    };

    fetchPosts();
  }, [userid]);

  return { posts, isLoading, error };
};

export default useFetchUserPosts;
