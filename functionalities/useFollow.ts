import { useState, useEffect } from "react";
import supabase from "@/app/supabase/supaClient";

const useFollow = (userid: string, followeduserid: string) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkFollowStatus = async () => {
      if (!userid || !followeduserid) return;
      const { data, error } = await supabase
        .from("follows")
        .select("followid")
        .eq("userid", userid)
        .eq("followeduserid", followeduserid)
        .single();

      if (error && error.code !== "PGRST116") {
        console.error("Error checking follow status:", error.message);
      }
      setIsFollowing(!!data);
    };

    checkFollowStatus();
  }, [userid, followeduserid]);

  const toggleFollow = async () => {
    if (!userid || !followeduserid) return;
    setLoading(true);

    if (isFollowing) {
      // Unfollow (delete)
      const { error } = await supabase
        .from("follows")
        .delete()
        .eq("userid", userid)
        .eq("followeduserid", followeduserid);

      if (error) {
        console.error("Error unfollowing user:", error.message);
      } else {
        setIsFollowing(false);
      }
    } else {
      // Follow (insert)
      const { error } = await supabase.from("follows").insert([
        {
          userid,
          followeduserid,
        },
      ]);

      if (error) {
        console.error("Error following user:", error.message);
      } else {
        setIsFollowing(true);
      }
    }

    setLoading(false);
  };

  return { isFollowing, toggleFollow, loading };
};

export default useFollow;
