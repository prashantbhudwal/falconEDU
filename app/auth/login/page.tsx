"use client";
import { signIn, useSession } from "next-auth/react";
import { useState, FormEvent } from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

import TextInput from "@/app/preferences/TextInput";
type SignInResult =
  | {
      error?: string;
    }
  | undefined;

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { data: session, status: sessionStatus } = useSession();
  const router = useRouter();
  const handleSubmit = async (
    event: React.KeyboardEvent<HTMLInputElement> | FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    let result: SignInResult = undefined;
    try {
      result = await signIn("credentials", {
        redirect: false,
        callbackUrl: "/preferences",
        username: email,
        password,
      });
      if (result?.error) {
        setError("Invalid email or password");
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    router.prefetch("/preferences");
    router.prefetch("/preferences/topic");
    router.prefetch("/preferences/subtopic");
    router.prefetch("/merlin");
    router.prefetch("/magic/aid/lesson");
    if (session && sessionStatus === "authenticated") {
      router.push("/preferences");
    }
  }, [session, sessionStatus]);

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-8 rounded p-8 mt-4"
    >
      {error && <p className="text-red-500">{error}</p>}
      <TextInput
        id="email"
        type="email"
        placeholder="Email"
        required
        value={email}
        onChange={(event) => setEmail(event.target.value)}
      />
      <TextInput
        id="password"
        type="password"
        placeholder="Password"
        required
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>) => {
          if (event.key === "Enter") {
            handleSubmit(event);
          }
        }}
      />
      <button
        type="submit"
        className={`bg-emerald-500 text-slate-800 px-28 py-4 rounded-lg text-lg font-semibold hover:bg-emerald-600 transition duration-200 ease-in-out`}
      >
        Sign In
      </button>
    </form>
  );
}
