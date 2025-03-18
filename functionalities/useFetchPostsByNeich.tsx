import { useEffect, useState } from "react";
import supabase from "@/app/supabase/supaClient";
import { SupaPost } from "@/data/types";

const useFetchPostsByNeich = (neich?: string | null) => {
  const [posts, setPosts] = useState<SupaPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!neich) {
      setIsLoading(false);
      return;
    }

    const fetchPosts = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const { data, error } = await supabase
          .from("posts")
          .select("*")
          .eq("niech", neich) // Filter posts by niche
          .order("created_at", { ascending: false }); // Newest first

        if (error) throw error;

        setPosts(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, [neich]);

  return { posts, isLoading, error };
};

export default useFetchPostsByNeich;
