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
import { Button } from "../ui/button";
import { ButtonProps } from "../ui/button";

const signInConfig = [
  {
    type: "student",
    headline: "AI for Students",
    description:
      "Access your teacher's lesson plans, worksheets, activities and assessments with AI that is easy to use and strictly follows your syllabus.",
    buttonText: "Student SignIn",
    buttonVariant: "default",
    auth: "google-student",
    subtext:
      "Works on large screens only. Use chrome, edge or any major browser for access.",
    image: "/chubbi.png",
    callbackUrl: "/dragon/student",
  },
  {
    type: "teacher",
    headline: "AI for Teachers",
    description:
      "Access your teacher's lesson plans, worksheets, activities and assessments with AI that is easy to use and strictly follows your syllabus.",
    buttonText: "Teacher SignIn",
    buttonVariant: "secondary",
    auth: "google",
    subtext:
      "Works on large screens only. Use chrome, edge or any major browser for access.",
    image: "/chubbi.png",
    callbackUrl: "/preferences",
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
      console.log(data);
    } catch (error) {
      console.log("SignIn Error", error);
    }
  };

  return (
    <div className="flex flex-col items-center mt-4 gap-6 px-2">
      <div className="flex flex-col items-center mt-12 gap-4">
        <Image src={"/chubbi.png"} height={150} width={150} alt="Falcon Logo" />
        <h1 className="max-w-xl text-4xl leading-10 text-slate-300">
          Welcome to FalconAI
        </h1>
        <div
          className={
            "mb-12 mt-6 text-lg text-gray-500 md:text-xl max-w-lg text-center"
          }
        >
          {` Access your teacher's lesson plans, worksheets, activities and
          assessments with AI that is easy to use and strictly follows your
          syllabus.`}
        </div>
      </div>
      <div className="flex px-4 text-center">
        {signInConfig.map((config) => (
          <Card
            className="w-1/2 bg-base-200 flex flex-col gap-4 border-none "
            key={config.auth}
          >
            <CardHeader>
              <CardTitle className="my-6 max-w-2xl text-3xl leading-10 text-slate-400">
                {config.headline}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <Button
                size={"lg"}
                variant={config.buttonVariant as ButtonProps["variant"]}
                onClick={() => handleSignIn(config.auth, config.callbackUrl)}
              >
                {sessionStatus === "loading"
                  ? "Signing you in..."
                  : sessionStatus === "authenticated"
                  ? "Taking you to the app..."
                  : config.buttonText}
              </Button>
            </CardContent>
            <CardFooter className="flex flex-col items-center"></CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
