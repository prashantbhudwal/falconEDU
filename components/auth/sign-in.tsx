"use client";
import { useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { PropagateLoader } from "react-spinners";
import Beta from "@/components/beta";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
export default function SignIn() {
  const router = useRouter();
  const { data: session, status: sessionStatus } = useSession();

  useEffect(() => {
    console.log(session);
    if (session && sessionStatus === "authenticated") {
      if (session.user.userType === "TEACHER") router.push("/preferences");
      else if (session.user.userType === "STUDENT") router.push("/dragon/bots");
    }
  }, [session, sessionStatus, router]);

  const handleSignIn = async (provider: string, callbackUrl: string) => {
    try {
      const data = await signIn(provider, { callbackUrl });
      console.log(data);
    } catch (error) {
      console.log("SignIn Error", error);
    }
  };

  return (
    <div className="flex flex-col items-center pt-8 text-center">
      <Image src={"/chubbi.png"} height={200} width={200} alt="Falcon Logo" />
      <Beta>
        <h1 className="my-6 max-w-xl text-2xl leading-10 text-slate-300 md:text-5xl lg:text-5xl">
          Welcome to FalconAI
        </h1>
      </Beta>
      <div className={"mb-12 mt-6 max-w-xl text-lg text-gray-500 md:text-xl"}>
        Create Lesson Plans, Worksheets, Activities and Assessments with AI that
        is easy to use and strictly follows your syllabus.
      </div>
      <button
        onClick={() => handleSignIn("google", "/preferences")}
        className={`rounded-lg bg-emerald-500 px-28 py-4 text-lg font-semibold text-slate-800 transition duration-200 ease-in-out hover:bg-emerald-600`}
      >
        {sessionStatus === "loading"
          ? "Signing you in..."
          : sessionStatus === "authenticated"
          ? "Taking you to the app..."
          : "Sign In"}
      </button>
      <div className="mt-4 text-xs">
        Works on large screens only. Use chrome, edge or any major browser for
        access.
      </div>
      <button
        onClick={() => handleSignIn("google-student", "/preferences")}
        className={`rounded-lg bg-emerald-500 px-28 py-4 text-lg font-semibold text-slate-800 transition duration-200 ease-in-out hover:bg-emerald-600`}
      >
        {sessionStatus === "loading"
          ? "Signing you in..."
          : sessionStatus === "authenticated"
          ? "Taking you to the app..."
          : "Sign In as Student"}
      </button>
      {(sessionStatus === "loading" || sessionStatus === "authenticated") && (
        <div className="flex h-12 flex-col items-center justify-center gap-2">
          <PropagateLoader color={"#10B981"} />
        </div>
      )}
    </div>
  );
}
