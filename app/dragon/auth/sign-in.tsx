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
      } else if (session.user.userType === "PARENT")
        router.push(authConfig[2].callbackUrl);
      else if (session.user.userType === "ORG_ADMIN")
        router.push(authConfig[3].callbackUrl);
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
    <div className="custom-scrollbar flex h-screen min-h-screen w-screen flex-col items-center overflow-y-auto py-10">
      <Image src={"/chubbi.png"} height={100} width={100} alt="Falcon Logo" />

      <h1 className="mt-10 text-3xl font-bold text-white md:text-4xl">
        Welcome to FalconAI
      </h1>

      <p className="mt-4 max-w-xs text-center text-lg text-gray-300 md:max-w-lg md:text-lg">
        {config.description}
      </p>

      <div className="mt-12 flex flex-col items-center space-y-4">
        <div className="flex flex-col items-center space-y-5 rounded-md bg-slate-200 p-8 shadow-lg md:min-w-[500px]">
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
          <p className="text-xs text-gray-600 md:text-base">{config.subtext}</p>
        </div>
      </div>
    </div>
  );
}
