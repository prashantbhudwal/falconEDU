// TODO This is a mess, need to clean up
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
    if (hostName === "localhost") {
      router.push("/dragon/auth");
    } else if (hostName === "app.falconai.in") {
      enginesFlow();
    } else if (
      hostName === "student.falconai.in" ||
      hostName === "teacher.falconai.in"
    ) {
      window.location.href = Url[hostName];
    }
  }, []);

  return (
    <div className="flex min-h-screen flex-col place-content-center">
      {hostName === "app.falconai.in" ? (
        <LandingPageEngines />
      ) : (
        <div>
          <Image
            src="/chubbi.png"
            alt="Falcon AI Logo"
            width={200}
            height={200}
          />
          <div className="flex flex-col items-center justify-center gap-2">
            <Link href={"/dragon/auth/teacher"}>
              <Button variant="default" rel="noopener noreferrer" size={"lg"}>
                Teacher
              </Button>
            </Link>
            <Link href={"/dragon/auth/student"}>
              <Button variant="default" rel="noopener noreferrer" size={"lg"}>
                Student
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;
