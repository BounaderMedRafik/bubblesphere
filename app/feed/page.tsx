import FeedNavigation from "@/components/core/feed/FeedNavigation";
import UserGreetText from "@/components/core/GreetText";
import Navigation from "@/components/core/Navigation";

export default function FeedPage() {
  return (
    <div>
      <div>
        <FeedNavigation />
      </div>
      <div className=" pt-24">
        <UserGreetText />
      </div>
      <div className=" h-svh" />
    </div>
  );
}
