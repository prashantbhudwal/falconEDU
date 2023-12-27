"use client";
import { useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ButtonProps } from "@/components/ui/button";
import { authConfig } from "./config";

interface SignInProps {
  type: "student" | "teacher" | "parent" | "org-admin";
  inviteId?: string | null;
}

export default function SignIn({ type, inviteId }: SignInProps) {
  const router = useRouter();
  const { data: session, status: sessionStatus } = useSession();

  useEffect(() => {
    if (session && sessionStatus === "authenticated") {
      if (session.user.userType === "TEACHER")
        router.push(authConfig[1].callbackUrl);
      else if (session.user.userType === "STUDENT") {
        if (!inviteId) {
          router.push(authConfig[0].callbackUrl);
          return;
        }
        router.push(`/dragon/student/invite/${inviteId}`);
      }
    }
  }, [session, sessionStatus, router, inviteId]);

  const handleSignIn = async (provider: string, callbackUrl: string) => {
    try {
      let updatedCallbackUrl = null;
      if (type === "student" && inviteId) {
        updatedCallbackUrl = `/dragon/student/invite/${inviteId}`;
      }
      const data = await signIn(provider, {
        callbackUrl: updatedCallbackUrl || callbackUrl,
      });
    } catch (error) {
      console.error("SignIn Error", error);
    }
  };

  const config = authConfig.find((cfg) => cfg.type === type);
  if (!config) return null;

  return (
    <div className="flex flex-col items-center min-h-screen py-10 overflow-y-auto custom-scrollbar h-screen w-screen">
      <Image src={"/chubbi.png"} height={100} width={100} alt="Falcon Logo" />

      <h1 className="mt-10 text-3xl md:text-4xl font-bold text-white">
        Welcome to FalconAI
      </h1>

      <p className="mt-4 text-lg md:text-lg text-gray-300 max-w-xs md:max-w-lg text-center">
        {config.description}
      </p>

      <div className="flex flex-col items-center mt-12 space-y-4">
        <div className="flex flex-col items-center space-y-5 bg-slate-200 p-8 rounded-md shadow-lg md:min-w-[500px]">
          <h2 className="text-xl md:text-4xl font-semibold text-gray-700">
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
          <p className="text-xs md:text-base text-gray-600">{config.subtext}</p>
        </div>
      </div>
    </div>
  );
}
