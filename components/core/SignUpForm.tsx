"use client";
import { login, signup } from "@/lib/auth-actions";
import { createClient } from "@/utils/supabase/client";
import { ArrowRight, Languages, Loader } from "lucide-react";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

const SignUpForm = () => {
  const [clicked, setClicked] = useState(false);
  const [signUp, setSignUp] = useState(false);
  const [user, setUser] = useState<any>(null);
  const supabase = createClient();
  console.log(user);
  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };
    fetchUser();
  }, []);

  user !== null && redirect("/feed");

  if (user !== null) {
    return (
      <>
        <div className=" h-[30vh] w-full flex items-center justify-center">
          <Loader className=" animate-spin" size={17} />
        </div>
      </>
    );
  } else {
    return (
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
            <div>
              <div className=" text-lg font-bold mb-3">
                {signUp ? "Sign Up" : "Sign In"}
              </div>
            </div>

            <form>
              {signUp ? (
                <>
                  <div id="forms">
                    <div className="flex items-center justify-center gap-1.5">
                      <div>
                        <Input
                          id="last-name"
                          name="last-name"
                          className=" mt-0.5"
                          type="text"
                          placeholder="Full Name"
                        />
                      </div>

                      <div>
                        <Input
                          id="first-name"
                          name="first-name"
                          className=" mt-0.5"
                          type="text"
                          placeholder="Last Name"
                        />
                      </div>
                    </div>

                    <div className=" mt-1.5">
                      <Input
                        className=" mt-0.5"
                        id="email"
                        type="email"
                        name="email"
                        placeholder="Email"
                      />
                    </div>

                    <div className=" mt-1.5">
                      <Input
                        className=" mt-0.5"
                        id="password"
                        type="password"
                        name="password"
                        placeholder="Password"
                      />
                    </div>

                    <div className=" mt-1.5">
                      <Input
                        className=" mt-0.5"
                        type="password"
                        placeholder="Confirm Password"
                      />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div id="forms">
                    <div>
                      <Input
                        name="email"
                        className=" mt-0.5 "
                        type="text"
                        placeholder="Email • Username"
                      />
                    </div>
                    <div className=" mt-1.5">
                      <Input
                        className=" mt-0.5 "
                        type="password"
                        name="password"
                        placeholder="Password"
                        required
                      />
                    </div>
                  </div>
                </>
              )}

              <div className=" mt-3 flex items-center justify-between">
                <div
                  onClick={() => {
                    setSignUp(!signUp);
                  }}
                  className=" text-xs opacity-75 select-none hover:underline cursor-pointer"
                >
                  {signUp ? "Already Have an Account" : "Create New Account"}
                </div>
                <Button
                  onClick={() => {
                    setClicked(true);
                    signUp ? redirect("/questionnaire") : null;
                  }}
                  formAction={signUp ? signup : login}
                  variant={"secondary"}
                  size={clicked ? "icon" : "sm"}
                >
                  <div className="flex items-center gap-2">
                    {clicked ? (
                      <>
                        <div>
                          <Loader className=" animate-spin" size={13} />
                        </div>
                      </>
                    ) : (
                      <>
                        <div>{signUp ? "Sign Up" : "Sign In"}</div>
                        <div>
                          <ArrowRight size={10} />
                        </div>
                      </>
                    )}
                  </div>
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
};

export default SignUpForm;
