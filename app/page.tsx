"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { PropagateLoader } from "react-spinners";
import Header from "@/app/Header";
import Footer from "@/app/Footer";

const LandingPage = () => {
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
    <div>
      <Header />
      <div className="flex flex-col items-center text-center pt-8 min-h-screen">
        <h1 className="my-6 text-2xl md:text-5xl text-slate-300 max-w-xl leading-10 lg:text-5xl">
          <div className="inline-flex items-start">
            <p className="">Welcome to FalconAI</p>
            <span className="text-sm font-semibold bg-yellow-300 text-yellow-800 px-2 py-1 rounded -mt-1 ml-2">
              beta
            </span>
          </div>
        </h1>
        <p className={"mb-12 text-lg text-gray-500 md:text-xl max-w-xl mt-6"}>
          For any help or suggestions, call us or drop a WhatsApp message at +91
          9833045490.
        </p>
        <button
          onClick={() => signIn("google", { callbackUrl: "/preferences" })}
          className={`bg-emerald-500 text-slate-800 px-28 py-4 rounded-lg text-lg font-semibold hover:bg-emerald-600 transition duration-200 ease-in-out`}
        >
          {sessionStatus === "loading"
            ? "Signing you in..."
            : sessionStatus === "authenticated"
            ? "Taking you to the app..."
            : "Sign In"}
        </button>
        {(sessionStatus === "loading" || sessionStatus === "authenticated") && (
          <div className="flex flex-col items-center justify-center gap-2 h-12">
            <PropagateLoader color={"#10B981"} />
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default LandingPage;
