import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import React from "react";

const Page = () => {
  return (
    <Card>
      <h1>Hello, Next.js!</h1>
      <p>Welcome to your new page.</p>
      <Button variant={"secondary"}>Click me</Button>
    </Card>
  );
};

export default Page;
