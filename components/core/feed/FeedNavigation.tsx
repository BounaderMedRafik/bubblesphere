import React from "react";

const FeedNavigation = () => {
  return (
    <div className=" wrapper py-4 ">
      <div>
        <div className="flex items-center gap-2">
          <img className=" size-8" src="/logo.svg" alt="logo" />
          <div>
            {" "}
            <div className=" flex pt-1 items-center  select-none cursor-default text-base font-bold ">
              <div>
                Bubble<span className=" text-primary">Sphere</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedNavigation;
