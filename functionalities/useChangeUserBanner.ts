import supabase from "@/app/supabase/supaClient";
import { useState } from "react";

const BUCKET_NAME = "banners";

const useChangeUserBanner = (clerkUserId: string | undefined) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateBanner = async (file: File, oldBannerUrl?: string) => {
    if (!clerkUserId) return;

    setIsLoading(true);
    setError(null);

    try {
      const fileExt = file.name.split(".").pop();
      const filePath = `banners/${clerkUserId}-${Date.now()}.${fileExt}`;

      // Upload new banner
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(filePath, file, { cacheControl: "3600", upsert: false });

      if (uploadError) throw uploadError;

      const newBannerUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${BUCKET_NAME}/${uploadData.path}`;

      // Update user's profile in Supabase
      const { error: updateError } = await supabase
        .from("users")
        .update({ banner: newBannerUrl })
        .eq("userid", clerkUserId);

      if (updateError) throw updateError;

      // Delete old banner if exists
      if (oldBannerUrl) {
        const oldFilePath = oldBannerUrl.split(`${BUCKET_NAME}/`)[1]; // Extract filename
        if (oldFilePath) {
          await supabase.storage.from(BUCKET_NAME).remove([oldFilePath]);
        }
      }

      return newBannerUrl;
    } catch (err: any) {
      setError(err.message || "Failed to update banner");
    } finally {
      setIsLoading(false);
    }
  };

  return { updateBanner, isLoading, error };
};

export default useChangeUserBanner;
