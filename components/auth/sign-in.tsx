"use client";
import { useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { PropagateLoader } from "react-spinners";
import Beta from "@/components/beta";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { ButtonProps } from "../ui/button";

const signInConfig = [
  {
    type: "student",
    headline: "AI for Students",
    description:
      "Access your teacher's lesson plans, worksheets, activities and assessments with AI that is easy to use and strictly follows your syllabus.",
    buttonText: "Student Sign In",
    buttonVariant: "default",
    auth: "google-student",
    subtext: "Works on mobile phones and laptop.",
    image: "/chubbi.png",
    callbackUrl: "/dragon/student",
  },
  {
    type: "teacher",
    headline: "AI for Teachers",
    description:
      "Access your teacher's lesson plans, worksheets, activities and assessments with AI that is easy to use and strictly follows your syllabus.",
    buttonText: "Teacher Sign In",
    buttonVariant: "secondary",
    auth: "google",
    subtext: "Works on large screens only.",
    image: "/chubbi.png",
    callbackUrl: "/dragon/teacher",
  },
];

export default function SignIn() {
  const router = useRouter();
  const { data: session, status: sessionStatus } = useSession();

  useEffect(() => {
    if (session && sessionStatus === "authenticated") {
      if (session.user.userType === "TEACHER")
        router.push(signInConfig[1].callbackUrl);
      else if (session.user.userType === "STUDENT")
        router.push(signInConfig[0].callbackUrl);
    }
  }, [session, sessionStatus, router]);

  const handleSignIn = async (provider: string, callbackUrl: string) => {
    try {
      const data = await signIn(provider, { callbackUrl });
    } catch (error) {
      console.error("SignIn Error", error);
    }
  };

  return (
    <div className="custom-scrollbar flex h-screen min-h-screen w-screen flex-col items-center overflow-y-auto py-10">
      <Image src={"/chubbi.png"} height={100} width={100} alt="Falcon Logo" />

      <h1 className="mt-10 text-3xl font-bold text-white md:text-4xl">
        Welcome to FalconAI
      </h1>

      <p className="mt-4 max-w-xs text-center text-lg text-gray-300 md:max-w-lg md:text-lg">
        {`Access your teacher's lesson plans, worksheets, activities and
        assessments with AI that is easy to use and strictly follows your
        syllabus.`}
      </p>

      <div className="mt-12 flex flex-col space-y-4 md:flex-row md:space-x-8 md:space-y-0">
        {signInConfig.map((config) => (
          <div
            key={config.auth}
            className="flex flex-col items-center space-y-5 rounded-md bg-slate-200 p-8 shadow-lg md:min-w-[500px]"
          >
            <h2 className="text-xl font-semibold text-gray-700 md:text-4xl">
              {config.headline}
            </h2>

            <Button
              size="lg"
              variant={config.buttonVariant as ButtonProps["variant"]}
              onClick={() => handleSignIn(config.auth, config.callbackUrl)}
            >
              {sessionStatus === "loading"
                ? "Signing you in..."
                : sessionStatus === "authenticated"
                  ? "Taking you to the app..."
                  : config.buttonText}
            </Button>
            <p className="text-xs text-gray-600 md:text-base">
              {config.subtext}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
