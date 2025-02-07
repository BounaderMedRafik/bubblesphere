import SignUpForm from "@/components/core/SignUpForm";
import { Navigation } from "lucide-react";

export default function Home() {
  return (
    <div>
      <div>
        <Navigation />
      </div>
      <div className=" relative min-h-screen">
        <div className=" absolute top-0 left-0 w-full h-full backdrop-blur-[2px] z-10 bg-background/10"></div>
        <div className=" absolute overflow-hidden   top-0 left-0  h-full w-full z-0 ">
          <div className=" bg-gradient-to-t from-transparent to-background w-full h-1/3 top-0 left-0 absolute " />
          <img src="artboard.svg" alt="" />
        </div>
        <div className=" relative z-20 pt-24">
          <SignUpForm />
        </div>
      </div>
    </div>
  );
}
