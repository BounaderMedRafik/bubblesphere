import { useEffect, useState } from "react";
import supabase from "@/app/supabase/supaClient";
import { SupaUser } from "@/data/types";

const useFetchUserById = (userId: string | null) => {
  const [user, setUser] = useState<SupaUser>({
    userid: "",
    created_at: "",
    name: "",
    username: "",
    pfp: "",
    bio: "",
    location: "",
    banner: "",
    englishLevel: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    const fetchUser = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const { data, error } = await supabase
          .from("users")
          .select("*")
          .eq("userid", userId)
          .single();

        if (error) throw error;

        setUser(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  return { user, isLoading, error };
};

export default useFetchUserById;
