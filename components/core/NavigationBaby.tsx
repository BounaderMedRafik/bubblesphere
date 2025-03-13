import Link from "next/link";
import React from "react";

const NavigationBaby = () => {
  return (
    <div className=" w-full fixed top-0 left-0  z-50 pointer-events-none ">
      <div className=" wrapper py-8 flex items-center justify-center">
        <div>
          <Link
            className=" opacity-100  hover:opacity-75 transition-all duration-300 ease-in-out"
            href="/"
          >
            <img className=" w-10 h-10 " src="/logo.svg" alt="" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NavigationBaby;
