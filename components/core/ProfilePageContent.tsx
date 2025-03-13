"use client";
import supabase from "@/app/supabase/supaClient";
import { useUser } from "@clerk/nextjs";
import { Loader, Edit } from "lucide-react";
import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { buttonVariants } from "../ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

const EnglishLevels = [
  {
    level: "A1",
    description:
      "Beginner - Can understand and use basic phrases and expressions.",
  },
  {
    level: "A2",
    description:
      "Elementary - Can communicate in simple, routine tasks and describe immediate needs.",
  },
  {
    level: "B1",
    description:
      "Intermediate - Can handle most situations while traveling and produce simple connected text.",
  },
  {
    level: "B2",
    description:
      "Upper-Intermediate - Can interact with fluency and spontaneity, and understand complex texts.",
  },
  {
    level: "C1",
    description:
      "Advanced - Can express ideas fluently and understand demanding, longer texts.",
  },
  {
    level: "C2",
    description:
      "Proficient - Can understand virtually everything and express themselves spontaneously and precisely.",
  },
];

const ProfilePageContent = () => {
  const { user } = useUser();
  const [description, setDescription] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingEL, setIsEditingEL] = useState(false);
  const [tempDescription, setTempDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [tempEnglishLevel, setTempEnglishLevel] = useState("");
  const [englishLevel, setEnglishLevel] = useState("");

  useEffect(() => {
    if (user) {
      fetchDescription();
      fetchEnglishLevel();
    }
  }, [user]);

  const fetchDescription = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("profiledescs")
      .select("description")
      .eq("user_id", user.id)
      .single();

    if (data) {
      setDescription(data.description);
    }
    setLoading(false);
  };

  const handleEditClick = () => {
    setTempDescription(description);
    setIsEditing(true);
  };

  const handleSubmit = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("profiledescs")
      .upsert([
        {
          user_id: user.id,
          description: tempDescription,
        },
      ])
      .eq("user_id", user.id);

    if (!error) {
      setDescription(tempDescription);
      setIsEditing(false);
    }
    setLoading(false);
  };

  // Fetch the current English level from Supabase
  const fetchEnglishLevel = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("englishlevel")
      .select("englishlevel")
      .eq("user_id", user.id)
      .single();

    if (data) {
      setEnglishLevel(data.englishlevel);
    } else {
      setEnglishLevel("?"); // Default to "?" if no level is set
    }
    setLoading(false);
  };

  // Handle click to edit the English level
  const handleEditClickEL = () => {
    setTempEnglishLevel(englishLevel);
    setIsEditingEL(true);
  };

  // Save the new English level to Supabase
  const handleSubmitEL = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("englishlevel")
      .upsert([
        {
          user_id: user.id,
          englishlevel: tempEnglishLevel,
        },
      ])
      .eq("user_id", user.id);

    if (!error) {
      setEnglishLevel(tempEnglishLevel);
      setIsEditing(false);
    }
    setLoading(false);
    setIsEditingEL(false);
  };

  return (
    <div>
      <div className="wrapper">
        <div className="relative">
          <div className="group relative">
            <img
              className="h-44 w-full object-cover rounded-2xl"
              src={"https://placedog.net/1920/1080?random"}
              alt="Cover"
            />
          </div>
          <div>
            <AnimatePresence mode="wait">
              {!user?.imageUrl ? (
                <motion.div
                  key={!user?.imageUrl ? "something" : "else"}
                  initial={{
                    opacity: 0,
                    y: 0,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  exit={{
                    opacity: 0,
                    y: -50,
                  }}
                  className=" size-44 absolute z-30 top-1/2 bg-background border-2 shadow-lg border-accent left-6 rounded-full overflow-hidden flex items-center justify-center"
                >
                  <Loader size={17} className=" animate-spin" />
                </motion.div>
              ) : (
                <motion.div
                  initial={{
                    opacity: 0,
                    y: 50,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    duration: 0.5,
                    ease: [0.25, 1, 0.5, 1],
                  }}
                  className="size-44 absolute z-30 top-1/2 border-2 shadow-lg border-accent left-6 rounded-full overflow-hidden"
                >
                  <img
                    className="absolute top-0 left-0 h-full w-full"
                    src={user?.imageUrl}
                    alt="Profile"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="mt-24 p-6">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">{user?.fullName}</h1>

            <div>
              <div>
                <TooltipProvider delayDuration={50}>
                  <Tooltip>
                    <TooltipTrigger>
                      <div
                        className={buttonVariants({
                          variant: "ghost",
                          size: "icon",
                          className:
                            "bg-foreground/10 border border-b-4 font-bold",
                        })}
                        onClick={handleEditClickEL}
                      >
                        <div className="opacity-75 font-black">
                          {loading ? (
                            <Loader className="animate-spin" size={16} />
                          ) : (
                            englishLevel
                          )}
                        </div>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-sm">
                      {englishLevel === "?"
                        ? "Choose an English level"
                        : EnglishLevels.find(
                            (lvl) => lvl.level === englishLevel
                          )?.description}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                {/* Edit Modal */}
                {isEditingEL && (
                  <div className="fixed inset-0 bg-black/50 backdrop-blur flex items-center justify-center z-50">
                    <div className="bg-background p-6 rounded-lg shadow-lg">
                      <h2 className="text-lg font-bold mb-4">
                        Select English Level
                      </h2>
                      <select
                        className="w-full p-2 border-b border-foreground/25 focus-visible:outline-none bg-transparent"
                        value={tempEnglishLevel}
                        onChange={(e) => setTempEnglishLevel(e.target.value)}
                      >
                        <option value="">Select English Level</option>
                        {EnglishLevels.map(({ level, description }) => (
                          <option key={level} value={level}>
                            {level} - {description}
                          </option>
                        ))}
                      </select>
                      <div className="mt-4 flex gap-2">
                        <button
                          className={buttonVariants({ variant: "ghost" })}
                          onClick={() => setIsEditingEL(false)}
                        >
                          Cancel
                        </button>
                        <button
                          className={buttonVariants({ variant: "default" })}
                          onClick={handleSubmitEL}
                          disabled={loading}
                        >
                          {loading ? "Saving..." : "Save"}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <p className=" opacity-75">
            {user?.primaryEmailAddress?.emailAddress}
          </p>

          <div className="mt-3">
            {isEditing ? (
              <div>
                <input
                  className="w-full p-2 border-b border-foreground/25 focus-visible:outline-none bg-transparent"
                  value={tempDescription}
                  onChange={(e) => setTempDescription(e.target.value)}
                  placeholder="Add description about yourself"
                />
                <button
                  className={buttonVariants({
                    variant: "ghost",
                    size: "sm",
                    className: "mt-1",
                  })}
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {loading ? "Submitting..." : "Submit"}
                </button>
              </div>
            ) : (
              <div className="flex items-center">
                <p className="opacity-75 ">
                  {description || "Add description about yourself"}
                </p>
                <Edit
                  size={16}
                  className="ml-2 cursor-pointer text-gray-500"
                  onClick={handleEditClick}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePageContent;
