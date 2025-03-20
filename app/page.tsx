import FeedContent from "@/components/core/FeedContent";
import PostingThought from "@/components/core/PostingThought";

export default function Home() {
  return (
    <div className=" wrapper">
      <div>
        <PostingThought />
      </div>
      <div className=" w-full h-px bg-foreground/10 my-7" />
      <div>
        <FeedContent />
      </div>
    </div>
  );
}
