import React from "react";
import { AdminNavbar } from "./_components/navbar";
import { IoAdd } from "react-icons/io5";
import { Button, Flex, Text } from "@tremor/react";
import Link from "next/link";
import { getOrgByUserId } from "./queries";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { getServerSession } from "next-auth";
import { RegisterOrgForm } from "./_components/org-form";
import Dashboard from "./_components/dashboard";
import { getManageTeachersURL } from "@/lib/urls";

export default async function AdminHome() {
  const session = await getServerSession(authOptions);
  const org = await getOrgByUserId(session?.user?.id || "");
  const userId = session?.user?.id || "";
  const hasTeachers = org && org?.teacher?.length > 0;
  const orgId = org?.id || "";

  return (
    <div className="flex h-screen min-w-full flex-col">
      <AdminNavbar title="Home" />
      <div className="custom-scrollbar overflow-y-auto">
        {!org && <RegisterOrg userId={userId} />}
        {hasTeachers ? <Dashboard /> : <AddTeachers orgId={orgId} />}
      </div>
    </div>
  );
}

const RegisterOrg = ({ userId }: { userId: string }) => {
  return (
    <div className="flex min-w-full flex-col space-y-2 px-4 py-3">
      <div className="font-semibold text-accent"> Register your Org </div>
      <RegisterOrgForm userId={userId} />
    </div>
  );
};

const AddTeachers = ({ orgId }: { orgId: string }) => {
  return (
    <Flex
      className="h-full w-full"
      alignItems="center"
      justifyContent="center"
      flexDirection="col"
    >
      <>
        <Text className="text-center">
          You have no Teacher in your Organization add one{" "}
        </Text>
        <Button size="sm" className="mt-5 rounded-xl">
          <Link href={getManageTeachersURL(orgId)}>
            <Flex>
              <IoAdd /> Teacher
            </Flex>
          </Link>
        </Button>
      </>
    </Flex>
  );
};
