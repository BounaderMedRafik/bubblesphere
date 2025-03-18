import { useState } from "react";
import supabase from "@/app/supabase/supaClient";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const useChangeUserBio = (clerkUserId: string | undefined) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const updateBio = async (newBio: string) => {
    if (!clerkUserId) {
      setError("User not authenticated");
      return;
    }

    setIsLoading(true);
    setError(null);

    const { error } = await supabase
      .from("users")
      .update({ bio: newBio })
      .eq("userid", clerkUserId);

    if (error) {
      setError(error.message);
    } else {
      toast.success("Your bio been added succefuly!");
      router.push("/profile");
    }

    setIsLoading(false);
  };

  return { updateBio, isLoading, error };
};

export default useChangeUserBio;
