"use client";
import * as Clerk from "@clerk/elements/common";
import * as SignIn from "@clerk/elements/sign-in";
import * as SignUp from "@clerk/elements/sign-up";
import { ArrowRight, Languages } from "lucide-react";
import { useState } from "react";
import { BsFacebook, BsGithub, BsGoogle } from "react-icons/bs";
import { RiNotionFill } from "react-icons/ri";

const SignComponent = () => {
  const [signUp, setSignUp] = useState(false);
  return (
    <>
      {signUp ? (
        <SignUp.Root>
          <div className="  flex  pt-20  justify-center">
            <div className=" max-w-sm w-full flex items-center flex-col  mx-auto  rounded-2xl p-5">
              <div className=" flex items-center gap-2 select-none cursor-default text-2xl font-bold px-4 py-2 bg-background shadow-xl  rounded-xl">
                <div>
                  Bubble<span className=" text-primary">Sphere</span>
                </div>
                <div>
                  <Languages size={19} />
                </div>
              </div>
              <SignUp.Step name="start">
                <div className=" w-full mt-10 ">
                  <div className=" text-sm text-center mt-4 opacity-75">
                    Create an account through the following options
                  </div>

                  <div className=" mt-5 space-y-0.5 ">
                    <Clerk.Connection name="google" asChild>
                      <div className=" cursor-pointer  p-2 px-4 border-transparent  border border-b-4 hover:border-foreground/25 hover:text-foreground  hover:scale-105 transition-all  duration-300 ease-in-out  hover:bg-accent/25 hover:shadow-lg   rounded-xl flex items-center text-foreground/75 justify-center gap-3">
                        <div>
                          <BsGoogle size={14} />
                        </div>
                        <div className=" mt-0.5">
                          Create account with Google
                        </div>
                      </div>
                    </Clerk.Connection>

                    <Clerk.Connection name="facebook" asChild>
                      <div className=" cursor-pointer  p-2 px-4 border-transparent  border border-b-4 hover:border-foreground/25 hover:text-foreground  hover:scale-105 transition-all  duration-300 ease-in-out  hover:bg-accent/25 hover:shadow-lg   rounded-xl flex items-center text-foreground/75 justify-center gap-3">
                        <div>
                          <BsFacebook size={14} />
                        </div>
                        <div className=" mt-0.5">
                          Create account with Facebook
                        </div>
                      </div>
                    </Clerk.Connection>

                    <Clerk.Connection name="github" asChild>
                      <div className=" cursor-pointer  p-2 px-4 border-transparent  border border-b-4 hover:border-foreground/25 hover:text-foreground  hover:scale-105 transition-all  duration-300 ease-in-out  hover:bg-accent/25 hover:shadow-lg   rounded-xl flex items-center text-foreground/75 justify-center gap-3">
                        <div>
                          <BsGithub size={14} />
                        </div>
                        <div className=" mt-0.5">
                          Create account with Github
                        </div>
                      </div>
                    </Clerk.Connection>

                    <Clerk.Connection name="notion" asChild>
                      <div className=" cursor-pointer  p-2 px-4 border-transparent  border border-b-4 hover:border-foreground/25 hover:text-foreground  hover:scale-105 transition-all  duration-300 ease-in-out  hover:bg-accent/25 hover:shadow-lg   rounded-xl flex items-center text-foreground/75 justify-center gap-3">
                        <div>
                          <RiNotionFill size={18} />
                        </div>
                        <div className=" mt-0.5">
                          Create account with Notion
                        </div>
                      </div>
                    </Clerk.Connection>
                  </div>

                  <SignUp.Captcha />
                </div>
              </SignUp.Step>
            </div>
          </div>
        </SignUp.Root>
      ) : (
        <SignIn.Root>
          <div className="  flex  pt-20  justify-center">
            <div className=" max-w-sm w-full flex items-center flex-col  mx-auto  rounded-2xl p-5">
              <div className=" flex items-center gap-2 select-none cursor-default text-2xl font-bold px-4 py-2 bg-background shadow-xl  rounded-xl">
                <div>
                  Bubble<span className=" text-primary">Sphere</span>
                </div>
                <div>
                  <Languages size={19} />
                </div>
              </div>
              <div className=" w-full mt-10 ">
                <div className=" text-sm text-center mt-4 opacity-75">
                  Please Consider The Following Log In Options
                </div>

                <div className=" mt-5 space-y-0.5 ">
                  <Clerk.Connection name="google" asChild>
                    <div className=" cursor-pointer  p-2 px-4 border-transparent  border border-b-4 hover:border-foreground/25 hover:text-foreground  hover:scale-105 transition-all  duration-300 ease-in-out  hover:bg-accent/25 hover:shadow-lg   rounded-xl flex items-center text-foreground/75 justify-center gap-3">
                      <div>
                        <BsGoogle size={14} />
                      </div>
                      <div className=" mt-0.5">Sign In With Google</div>
                    </div>
                  </Clerk.Connection>

                  <Clerk.Connection name="facebook" asChild>
                    <div className=" cursor-pointer  p-2 px-4 border-transparent  border border-b-4 hover:border-foreground/25 hover:text-foreground  hover:scale-105 transition-all  duration-300 ease-in-out  hover:bg-accent/25 hover:shadow-lg   rounded-xl flex items-center text-foreground/75 justify-center gap-3">
                      <div>
                        <BsFacebook size={14} />
                      </div>
                      <div className=" mt-0.5">Sign In With Facebook</div>
                    </div>
                  </Clerk.Connection>

                  <Clerk.Connection name="github" asChild>
                    <div className=" cursor-pointer  p-2 px-4 border-transparent  border border-b-4 hover:border-foreground/25 hover:text-foreground  hover:scale-105 transition-all  duration-300 ease-in-out  hover:bg-accent/25 hover:shadow-lg   rounded-xl flex items-center text-foreground/75 justify-center gap-3">
                      <div>
                        <BsGithub size={14} />
                      </div>
                      <div className=" mt-0.5">Sign In With Github</div>
                    </div>
                  </Clerk.Connection>

                  <Clerk.Connection name="notion" asChild>
                    <div className=" cursor-pointer  p-2 px-4 border-transparent  border border-b-4 hover:border-foreground/25 hover:text-foreground  hover:scale-105 transition-all  duration-300 ease-in-out  hover:bg-accent/25 hover:shadow-lg   rounded-xl flex items-center text-foreground/75 justify-center gap-3">
                      <div>
                        <RiNotionFill size={18} />
                      </div>
                      <div className=" mt-0.5">Sign In With Notion</div>
                    </div>
                  </Clerk.Connection>
                </div>
              </div>
            </div>
          </div>
        </SignIn.Root>
      )}

      <div className="flex items-center justify-center">
        <div
          onClick={() => {
            setSignUp(!signUp);
          }}
          className="flex items-center gap-2 hover:underline  cursor-pointer "
        >
          <div className=" text-sm opacity-75">
            {signUp
              ? "Already Have An Account ?"
              : "You Don't have An Account ?"}
          </div>
          <div>
            <ArrowRight size={13} />
          </div>
        </div>
      </div>
    </>
  );
};

export default SignComponent;
