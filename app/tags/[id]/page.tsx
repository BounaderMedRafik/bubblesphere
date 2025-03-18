import { use } from "react";
import SpecificTagPageContent from "@/components/core/SpecificTagPageContent";
import { notFound } from "next/navigation";
import React from "react";
import { englishNiches } from "@/data/data";

// Define the correct type
type tParams = Promise<{ id: string }>;

interface SpecificTagPageProps {
  params: tParams;
}

export default function SpecificTagPage({ params }: SpecificTagPageProps) {
  // Resolve the promise with React's `use`
  const { id } = use(params);

  // Check if the niche exists, if not, show 404 page
  if (!englishNiches.includes(id)) {
    notFound();
  }

  return (
    <div>
      <SpecificTagPageContent id={id} />
    </div>
  );
}
