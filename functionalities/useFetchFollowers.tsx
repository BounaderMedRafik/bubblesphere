import { useEffect, useState } from "react";
import supabase from "@/app/supabase/supaClient";

const useFetchFollowers = (userid: string | undefined) => {
  const [followers, setFollowers] = useState<{ userid: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userid) {
      setLoading(false);
      return;
    }

    const fetchFollowers = async () => {
      setLoading(true);
      setError(null);

      try {
        const { data, error } = await supabase
          .from("follows")
          .select("userid")
          .eq("followeduserid", userid);

        if (error) throw error;
        setFollowers(data || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFollowers();
  }, [userid]);

  return { followers, loading, error };
};

export default useFetchFollowers;
