import { englishNiches } from "@/data/data";
import React from "react";
import { RiHashtag } from "react-icons/ri";
import { buttonVariants } from "../ui/button";
import Link from "next/link";

const categorizedNiches: Record<string, string[]> = englishNiches.reduce(
  (acc: Record<string, string[]>, niche: string) => {
    const firstLetter = niche[0].toUpperCase();
    if (!acc[firstLetter]) {
      acc[firstLetter] = [];
    }
    acc[firstLetter].push(niche);
    return acc;
  },
  {}
);

const ExplorePageContent: React.FC = () => {
  return (
    <div className="wrapper mb-64">
      <div className="text-2xl font-bold opacity-75">Tags</div>

      {Object.keys(categorizedNiches)
        .sort()
        .map((letter) => (
          <div key={letter} className="mt-4">
            <div className="text-xl font-semibold opacity-75 mb-2">
              {letter}
            </div>
            <div className="flex flex-wrap gap-2">
              {categorizedNiches[letter].map((niche, index) => (
                <Link
                  key={index}
                  href={`/tags/${niche}`}
                  className={buttonVariants({
                    variant: "secondary",
                    size: "sm",
                    className: "border border-primary/10 text-xs py-1 px-2",
                  })}
                >
                  <div>
                    <div className="flex items-center gap-1">
                      <div>
                        <RiHashtag className=" opacity-75" size={8} />
                      </div>
                      <div>{niche}</div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
    </div>
  );
};

export default ExplorePageContent;
