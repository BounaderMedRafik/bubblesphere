import supabase from "@/app/supabase/supaClient";
import { useState } from "react";
import { toast } from "sonner";

const useChangeUserLocation = (clerkUserId: string | undefined) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const updateLocation = async (newLocation: string) => {
    if (!clerkUserId) {
      setError("User not authenticated");
      return;
    }

    setIsLoading(true);
    setError(null);

    const { error } = await supabase
      .from("users")
      .update({ location: newLocation })
      .eq("userid", clerkUserId);

    if (error) {
      setError(error.message);
    } else {
      toast.success("Your location been added succefuly!");
    }

    setIsLoading(false);
  };

  return { updateLocation, isLoading, error };
};

export default useChangeUserLocation;
