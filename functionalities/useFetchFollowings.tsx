import { useState, useEffect } from "react";
import supabase from "@/app/supabase/supaClient";
import { SupaFollow } from "@/data/types";

const useFetchFollowings = (userid: string | undefined) => {
  const [followedUsers, setFollowedUsers] = useState<SupaFollow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userid) return;

    const fetchFollowedUsers = async () => {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("follows")
        .select("*")
        .eq("userid", userid)
        .order("created_at", { ascending: false });

      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }

      if (data) {
        setFollowedUsers(data);
      }

      setLoading(false);
    };

    fetchFollowedUsers();
  }, [userid]);

  return { followedUsers, loading, error };
};

export default useFetchFollowings;
