"use client";
import { useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ButtonProps } from "@/components/ui/button";
import { authConfig } from "./config";
import { cn } from "@/lib/utils";
import { FcGoogle } from "react-icons/fc";
interface SignInProps {
  type: "student" | "teacher" | "parent" | "org-admin";
  inviteId?: string | null;
}

export default function SignIn({ type, inviteId }: SignInProps) {
  const studentInviteUrl = inviteId ? `/dragon/student/invite/${inviteId}` : "";
  const router = useRouter();
  const { data: session, status: sessionStatus } = useSession();

  useEffect(() => {
    if (session?.user && sessionStatus === "authenticated") {
      const userType = session.user.userType;
      const isInvitedStudent = inviteId && userType === "STUDENT";
      const callbackUrl = isInvitedStudent
        ? studentInviteUrl
        : authConfig.find((cfg) => cfg.userType === userType)?.callbackUrl ??
          "/dragon/auth";
      router.push(callbackUrl);
    }
  }, [session, sessionStatus, router, inviteId]);

  const handleSignIn = async (provider: string, callbackUrl: string) => {
    try {
      let signInCallback = callbackUrl;
      if (type === "student" && inviteId) {
        signInCallback = studentInviteUrl;
      }
      await signIn(provider, {
        callbackUrl: signInCallback,
      });
    } catch (error) {
      console.error("SignIn Error", error);
    }
  };

  const config = authConfig.find((cfg) => cfg.type === type);
  if (!config) return null;

  return (
    <div className="custom-scrollbar flex h-screen min-h-screen w-screen flex-col items-center overflow-y-auto py-16 ">
      <div className="flex flex-row items-center space-x-3 rounded">
        <Image src={"/chubbi.png"} height={35} width={35} alt="Falcon Logo" />
        <h1 className="text-2xl font-bold">FalconAI</h1>
      </div>

      <div className="mt-12 flex flex-col items-center space-y-4 ">
        <div className="flex flex-col items-center space-y-10 rounded-md md:min-w-[500px]">
          <h2
            className={cn(
              "text-xl font-semibold  underline decoration-1 underline-offset-8 md:text-4xl",
              config.decorationColor,
            )}
          >
            {config.headline}
          </h2>
          <Button
            size="lg"
            variant={"outline"}
            onClick={() => handleSignIn(config.auth, config.callbackUrl)}
            disabled={sessionStatus === "loading"}
            className="rounded-2xl border-accent py-6 text-slate-200"
          >
            <div className="flex items-center space-x-3">
              <FcGoogle className="h-6 w-6" />
              <div>{config.buttonText}</div>
            </div>
          </Button>
          <div className="text-sm">
            {sessionStatus === "loading"
              ? "Signing you in..."
              : sessionStatus === "authenticated"
                ? "Taking you to the app..."
                : config.subtext}
          </div>
        </div>
      </div>
    </div>
  );
}
