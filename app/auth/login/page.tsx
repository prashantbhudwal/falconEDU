"use client";
import { signIn, useSession } from "next-auth/react";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
type SignInResult =
  | {
      error?: string;
    }
  | undefined;

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { data: session, status: sessionStatus } = useSession();
  const router = useRouter();
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    let result: SignInResult = undefined;
    try {
      result = await signIn("credentials", {
        redirect: true,
        callbackUrl: "/NextAuth/Protected",
        username: email,
        password,
      });
      if (result?.error) {
        alert(result.error);
      } else {
        window.location.href = "/NextAuth/Protected";
      }
    } catch (e) {
      console.error(e);
    }
  };
  if (session && sessionStatus === "authenticated") {
    router.push("/NextAuth/Protected");
    return null;
  }
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="rounded bg-white p-8 shadow-md">
        <h1 className="mb-4 text-2xl font-bold">Sign In</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              className="mb-2 block font-bold text-gray-700"
              htmlFor="email"
            >
              Email
            </label>
            <input
              className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
              id="email"
              type="email"
              placeholder="Email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>
          <div className="mb-4">
            <label
              className="mb-2 block font-bold text-gray-700"
              htmlFor="password"
            >
              Password
            </label>
            <input
              className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
              id="password"
              type="password"
              placeholder="Password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>
          <button
            className="focus:shadow-outline rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700 focus:outline-none"
            type="submit"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
