"use client";
import { useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { authConfig } from "./config";
import { cn } from "@/lib/utils";
import { FcGoogle } from "react-icons/fc";
import { Separator } from "@/components/ui/separator";
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

  const getLoginDescription = (status: string) => {
    switch (status) {
      case "loading":
        return "Signing you in...";
      case "authenticated":
        return "Taking you to the app...";
      default:
        return config.subtext;
    }
  };

  const loginDescription = getLoginDescription(sessionStatus);

  return (
    <div
      className={cn(
        "custom-scrollbar flex h-screen min-h-screen w-screen flex-col items-center overflow-y-auto bg-gradient-to-b",
        config.gradient,
      )}
    >
      <div className="flex w-full max-w-4xl flex-row justify-between px-6 py-4">
        <div className="flex flex-row items-center space-x-3 rounded brightness-90">
          <Image src={"/chubbi.png"} height={30} width={30} alt="Falcon Logo" />
          <h1 className="text-lg font-bold">FalconAI</h1>
        </div>
        <Separator orientation="vertical" />
        <h2 className={cn("text-lg font-semibold")}>{config.headline}</h2>
      </div>
      <div className="mt-16 flex flex-col items-center space-y-3">
        <div className="flex flex-col items-center space-y-8 rounded-md md:min-w-[500px]">
          <Image
            src={config.imgPath}
            height={300}
            width={300}
            alt="Falcon Logo"
            className="rounded-2xl"
          />

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
          <div className="text-sm">{loginDescription}</div>
        </div>
      </div>
    </div>
  );
}
