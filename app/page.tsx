// TODO This is a mess, need to clean up
"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import useTrackPage from "@/hooks/analytics/useTrackPage";
import SignIn from "@/components/auth/sign-in";
import { LandingPageEngines } from "./landing-engines";

const MainUrls = {
  localhost: "https://app.falconai.in/dragon/auth",
  "student.falconai.in": "https://app.falconai.in/dragon/auth/student",
  "teacher.falconai.in": "https://app.falconai.in/dragon/auth/teacher",
};

const testUrls = {
  localhost: "http://localhost:3000/dragon/auth",
  "student.falconai.in":
    "https://falcon-one-git-add-context-falconai.vercel.app/dragon/auth/student",
  "teacher.falconai.in":
    "https://falcon-one-git-add-context-falconai.vercel.app/dragon/auth/teacher",
};

const getHostNameOfCurrentURL = () => {
  if (typeof window !== "undefined") {
    return window.location.hostname;
  }

  return "";
};

const LandingPage = () => {
  const [hostName, setHostName] = useState("");
  useTrackPage("Landing Page");
  const { data: session, status: sessionStatus } = useSession();
  const router = useRouter();

  const enginesFlow = () => {
    router.prefetch("/preferences");
    if (session && sessionStatus === "authenticated") {
      router.prefetch("/preferences/topic");
      router.prefetch("/preferences/subtopic");
      router.prefetch("/merlin");
      router.prefetch("/magic/aid/lesson");
    }
  };

  // useEffect(() => {
  //   const hostName = getHostNameOfCurrentURL();
  //   if (hostName === "localhost") {
  //     router.push("/dragon/auth");
  //   } else if (hostName === "https://app.falconai.in") {
  //     enginesFlow();
  //   } else if (hostName === "student.falconai.in") {
  //     window.location.href = "https://app.falconai.in/dragon/auth/student";
  //   } else if (hostName === "teacher.falconai.in") {
  //     window.location.href = "https://app.falconai.in/dragon/auth/teacher";
  //   }
  // }, []);

  //Test UseEffect
  useEffect(() => {
    const hostName = getHostNameOfCurrentURL();
    setHostName(hostName);
    if (hostName === "localhost") {
      router.push("/dragon/auth");
    } else if (hostName === "https://app.falconai.in") {
      enginesFlow();
    } else if (hostName === "student.falconai.in") {
      window.location.href =
        "https://falcon-one-git-add-context-falconai.vercel.app/dragon/auth/student";
    } else if (hostName === "teacher.falconai.in") {
      window.location.href =
        "https://falcon-one-git-add-context-falconai.vercel.app/dragon/auth/teacher";
    }
  }, []);

  return (
    <div className="flex min-h-screen flex-col place-content-center">
      {hostName === "https://app.falconai.in" ? (
        <LandingPageEngines />
      ) : (
        <Image
          src="/chubbi.png"
          alt="Falcon AI Logo"
          width={200}
          height={200}
        />
      )}
    </div>
  );
};

export default LandingPage;
