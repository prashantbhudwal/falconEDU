"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import useTrackPage from "@/hooks/analytics/useTrackPage";
import { LandingPageEngines } from "./landing-engines";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const Url = {
  localhost: "http://localhost:3000/dragon/auth",
  "student.falconai.in": "https://app.falconai.in/dragon/auth/student",
  "teacher.falconai.in": "https://app.falconai.in/dragon/auth/teacher",
  "app.falconai.in": "https://app.falconai.in/preferences",
};

const getHostNameOfCurrentURL = () =>
  typeof window !== "undefined" ? window.location.hostname : "";

type HostName = keyof typeof Url;

const LandingPage = () => {
  const [hostName, setHostName] = useState<HostName>();
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

  useEffect(() => {
    const hostName = getHostNameOfCurrentURL() as HostName;
    setHostName(hostName);
    if (
      hostName === "student.falconai.in" ||
      hostName === "teacher.falconai.in"
    ) {
      window.location.href = Url[hostName];
    }
  }, []);

  return (
    <div className="flex h-screen flex-col">
      <div className="flex flex-grow flex-col items-center justify-center gap-4">
        <Image
          src="/chubbi.png"
          alt="Falcon AI Logo"
          width={200}
          height={200}
          className="mx-auto"
        />
        <div className="flex items-center justify-center gap-6 bg-base-300 p-4">
          <Link href={"/dragon/auth/teacher"}>
            <Button variant="default" rel="noopener noreferrer">
              Teacher
            </Button>
          </Link>
          <Link href={"/dragon/auth/student"}>
            <Button variant="default" rel="noopener noreferrer">
              Student
            </Button>
          </Link>
        </div>
      </div>
      <div className="p-4 text-right">
        <Link
          href={"https://falconai.in/#terms-and-policies"}
          className="text-sm text-slate-500 underline"
        >
          Terms of Service & Privacy Policy
        </Link>
      </div>
    </div>
  );
};

export default LandingPage;
