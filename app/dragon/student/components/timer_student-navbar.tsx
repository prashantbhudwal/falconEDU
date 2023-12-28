"use client";
import { Cog8ToothIcon } from "@heroicons/react/24/solid";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Avvvatars from "avvvatars-react";
import { ReactNode, RefObject, useEffect, useRef, useState } from "react";
import SignOutButton from "@/components/auth/sign-out-btn";
import Image from "next/image";
import Link from "next/link";
import {
  getStudentPreferencesURL,
  studentHomeURL,
  studentProfileURL,
} from "@/lib/urls";
import { Button } from "@/components/ui/button";
import loadingBall from "@/public/animations/loading-ball.json";
import Lottie from "lottie-react";
import { FaClockRotateLeft } from "react-icons/fa6";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { checkTest } from "../../ai/test-checker";
import {
  saveTestResultsByBotId,
  submitTestBot,
} from "../bot/[botId]/chat/[id]/mutations";
import { useRouter } from "next/navigation";

const SettingsIcon: React.FC = () => (
  <div className="dropdown-end dropdown">
    <label tabIndex={0}>
      <Cog8ToothIcon className="h-6 w-6 text-text-500" />
    </label>
    <ul
      tabIndex={0}
      className="menu dropdown-content rounded-box menu-sm z-[1] mt-3 w-32 bg-base-100 p-2 shadow"
    >
      <li>
        <Link href={studentProfileURL}>My Profile</Link>
        <SignOutButton />
      </li>
    </ul>
  </div>
);

type StudentNavbarProps = {
  children: ReactNode;
};

const StudentNavbar: React.FC<StudentNavbarProps> = ({ children }) => (
  <div className="bg-base-200 shadow-sm shadow-base-100 navbar">{children}</div>
);

export const StudentHomeNavbar: React.FC = () => (
  <StudentNavbar>
    <div className="flex gap-3 navbar-start">
      <Image src={"/chubbi.png"} height={30} width={30} alt="Falcon Logo" />
      <p className="text-xl">FalconAI</p>
    </div>
    <div className="navbar-end flex items-center gap-2">
      <Link href={getStudentPreferencesURL()}>
        <Button variant="ghost" size={"sm"}>
          My Profile
        </Button>
      </Link>
      <SettingsIcon />
    </div>
  </StudentNavbar>
);

type AvatarNavbarProps = {
  title: string;
  subtitle?: string;
  avatarUrl?: string;
  button?: ReactNode;
  timeLimit?: number;
  testBotId?: string;
  redirectUrl?: string;
  isSubmitted?: boolean;
  botChatId?: string;
  isMultipleChats?: boolean;
};

const formatTime = (time: number): string => {
  const hours = Math.floor(time / 3600);
  const minutes = Math.floor((time % 3600) / 60);
  const seconds = time % 60;

  const fixedDigits = (digit: number) => {
    return digit < 10 ? `0${digit}` : digit;
  };

  if (hours > 0) {
    return `${hours}h:${fixedDigits(minutes)}m:${fixedDigits(seconds)}s`;
  } else {
    return `${fixedDigits(minutes)}m:${fixedDigits(seconds)}s`;
  }
};

export const AvatarNavbar: React.FC<AvatarNavbarProps> = ({
  title,
  subtitle,
  avatarUrl,
  button,
  timeLimit,
  testBotId,
  redirectUrl,
  isSubmitted,
  isMultipleChats,
  botChatId,
}) => {
  // const timeInSeconds = timeLimit && !isSubmitted ? timeLimit * 60 : undefined;
  // const [time, setTime] = useState<undefined | number>(timeInSeconds);
  // const intervalRef = useRef<NodeJS.Timeout | null>(null);
  // const [openAlertDialog, setOpenAlertDialog] = useState(false);
  // const [error, setError] = useState("");
  // const router = useRouter();
  // const submitTriggerRef = useRef(false);

  // useEffect(() => {
  //   intervalRef.current = setInterval(() => {
  //     setTime((prevTime) => {
  //       if (prevTime === 0) {
  //         clearInterval(intervalRef.current!);
  //         return prevTime;
  //       }
  //       return prevTime ? prevTime - 1 : prevTime;
  //     });
  //   }, 1000);

  //   return () => clearInterval(intervalRef.current!);
  // }, []);

  // const submitTestHandler = async () => {
  //   setOpenAlertDialog(true);
  //   try {
  //     const testResults = await checkTest(testBotId as string);
  //     if (testResults) {
  //       await saveTestResultsByBotId(testBotId as string, testResults as any); //TODO: remove any
  //       await submitTestBot(
  //         testBotId as string,
  //         botChatId as string,
  //         isMultipleChats
  //       );
  //       router.push(redirectUrl as string);
  //       setOpenAlertDialog(false);
  //       return;
  //     }
  //     setError("Can't check the test. Please try again later.");
  //     setOpenAlertDialog(false);
  //   } catch (err) {
  //     console.log(err);
  //     setOpenAlertDialog(false);
  //     setError("Can't submit test. Please try again later.");
  //   }
  // };

  // useEffect(() => {
  //   if (submitTriggerRef.current) {
  //     submitTestHandler();
  //   }
  // }, [submitTriggerRef.current]);

  // if (typeof time === "number" && time === 0) {
  //   submitTriggerRef.current = true;
  // }

  return (
    <StudentNavbar>
      <Link href={studentHomeURL} className="flex gap-3 navbar-start">
        <Avatar>
          <AvatarImage src={avatarUrl} />
          <AvatarFallback className="bg-base-300">
            <Avvvatars value={title} style="shape" />
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="truncate">{title}</p>
          <p className="text-sm text-text-500 truncate">{subtitle}</p>
        </div>
      </Link>
      <div className="navbar-end flex gap-4">
        {button}
        <SettingsIcon />
      </div>
      {/* {!isSubmitted && (
        <div className="flex flex-col items-center gap-1">
          {typeof time === "number" && (
            <p className="text-sm text-text-300 whitespace-nowrap flex tracking-widest items-center gap-1">
              <FaClockRotateLeft className="text-xs" />{" "}
              {time === 0 ? "00:00" : formatTime(time)}
            </p>
          )}
          {error && (
            <p className="text-sm text-error whitespace-nowrap">{error}</p>
          )}
        </div>
      )} 
      
      <AlertDialog open={openAlertDialog}>
        <AlertDialogContent className="w-11/12 mx-auto flex-col p-0 justify-center h-[520px] items-center">
          <AlertDialogHeader className="rounded-t-lg">
            <AlertDialogTitle className="text-2xl text-center w-full translate-y-16">
              Time is up for the test.
            </AlertDialogTitle>
            <Lottie className="h-[450px]" animationData={loadingBall} />
            <AlertDialogDescription className="text-center text-lg -translate-y-20 font-semibold text-text-300">
              Submitting the Test <br /> and taking you to Home screen
            </AlertDialogDescription>
          </AlertDialogHeader>
        </AlertDialogContent>
      </AlertDialog> */}
    </StudentNavbar>
  );
};
