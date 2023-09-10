"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import useTrackPage from "@/hooks/analytics/useTrackPage";
import SignIn from "@/components/auth/sign-in";
const LandingPage = () => {
  useTrackPage("Landing Page");
  const { data: session, status: sessionStatus } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session && sessionStatus === "authenticated") {
      router.push("/preferences");
    }
  }, [session, sessionStatus]);

  useEffect(() => {
    router.prefetch("/auth/login");
    router.prefetch("/preferences");
    if (session && sessionStatus === "authenticated") {
      router.prefetch("/preferences/topic");
      router.prefetch("/preferences/subtopic");
      router.prefetch("/merlin");
      router.prefetch("/magic/aid/lesson");
    }
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center">
      <SignIn />
    </div>
  );
};

export default LandingPage;
