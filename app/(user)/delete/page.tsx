"use client";
import { Button } from "@/components/ui/button";
import prisma from "@/prisma";
import { useState } from "react";
const EMAIL = "trial.prashant@gmail.com";
import { deleteUserByEmail } from "./actions";

export default function Page() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const deleteUser = async (email: string) => {
    setLoading(true);
    try {
      await deleteUserByEmail(email);
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Delete user: {EMAIL}</h1>
      {loading && <p>Loading...</p>}
      {error && <p>Error</p>}
      <Button
        variant={"destructive"}
        size={"lg"}
        onClick={() => {
          deleteUser(EMAIL);
        }}
        disabled={loading}
      >
        Delete User
      </Button>
    </div>
  );
}
