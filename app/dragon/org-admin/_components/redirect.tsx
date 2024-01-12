"use client";
import { useRouter } from "next/navigation";
import React from "react";

const RedirectComponent = ({ redirectUrl }: { redirectUrl: string }) => {
  const router = useRouter();
  router.replace(redirectUrl);

  return <></>;
};

export default RedirectComponent;
