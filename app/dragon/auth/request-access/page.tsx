"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { db } from "@/lib/routers";

const GOOGLE_FORM_URL = "https://forms.gle/ZBQAs2XoZoze7aDc6";

const giveOrgModeAccess = async ({ userId }: { userId: string }) => {
  await db.org.setTeacherOrgModeToTrue(userId);
};

const AccessRequestForm = () => {
  const [showAccessButton, setShowAccessButton] = useState(false);

  const { data: session, status: sessionStatus } = useSession();
  const router = useRouter();
  const userId = session?.user?.id;

  useEffect(() => {
    if (sessionStatus === "unauthenticated") {
      router.push("/dragon/auth/");
    }

    // Show access button only when userId is available
    if (userId) {
      setShowAccessButton(true);
    }
  }, [sessionStatus, userId, router]);

  if (sessionStatus === "loading") {
    return <div>Loading...</div>;
  }

  if (!userId) return;

  return (
    <div className=" flex h-screen flex-col items-center justify-center bg-background p-4">
      <div className="mb-4 w-full max-w-lg rounded bg-foreground px-8 pb-8 pt-6 shadow-md">
        {/* Hero Image */}
        <h1 className="mb-4 block text-2xl font-bold text-card">
          Request Access & Clone Yourself
        </h1>
        <div className="mb-4">
          <Image
            src="/clone.png"
            alt="Hero Image"
            width={200}
            height={200}
            layout="responsive"
            className="rounded-lg"
          />
        </div>

        <p className="mb-4 text-base font-semibold">
          You do not have access to this FalconAI Teacher Cloner. Please request
          access by clicking the button below.
        </p>
        <div className="flex items-center justify-between">
          <Link href={GOOGLE_FORM_URL} passHref>
            <Button variant="default" rel="noopener noreferrer" size={"lg"}>
              Request Access
            </Button>
          </Link>
          {/* {showAccessButton && (
            <Button
              variant="default"
              rel="noopener noreferrer"
              size={"lg"}
              onClick={() => giveOrgModeAccess({ userId })}
            >
              Testing: Click to get access
            </Button>
          )} */}
        </div>
      </div>
    </div>
  );
};

export default AccessRequestForm;
