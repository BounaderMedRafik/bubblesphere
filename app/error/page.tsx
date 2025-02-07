import Navigation from "@/components/core/Navigation";
import { ArrowLeft, TriangleAlert } from "lucide-react";

export default function ErrorPage() {
  return (
    <>
      <div>
        <Navigation />
      </div>
      <div className=" flex flex-col items-center justify-center h-svh relative">
        <div>
          <TriangleAlert className=" text-primary" size={55} />
        </div>
        <div className=" mt-4  text-xl ">
          Please An Error Occured While Logging In
        </div>
        <div className=" opacity-75 text-sm mt-0.5">
          Check If you logged with correct information
        </div>
        <div>
          <div className=" opacity-75 hover:underline mt-5 flex items-center justify-center gap-2">
            <div>
              <ArrowLeft size={13} />
            </div>
            <div className=" text-sm">Go Back To Login Page</div>
          </div>
        </div>
      </div>
    </>
  );
}
