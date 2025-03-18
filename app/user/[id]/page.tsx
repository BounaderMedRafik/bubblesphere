import UserPageContent from "@/components/core/UserPageContent";
import React from "react";

type tParams = Promise<{ id: string }>;

export default async function UserPage(props: { params: tParams }) {
  const { id } = await props.params;

  return (
    <div>
      <UserPageContent id={id} />
    </div>
  );
}
