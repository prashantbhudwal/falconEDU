import React from "react";
import AdminNavbar from "./_components/admin-navbar";
import { IoAdd } from "react-icons/io5";
import { Button, Flex, Text } from "@tremor/react";
import Link from "next/link";
import { getOrgByUserId } from "./queries";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { getServerSession } from "next-auth";
import OrgRegisterForm from "./_components/org-register-form";
import Dashboard from "./_components/dashboard";

const AdminPage = async () => {
  const session = await getServerSession(authOptions);
  const org = await getOrgByUserId(session?.user?.id || "");

  return (
    <>
      <AdminNavbar title="Home" />
      {!org && <OrgRegisterForm userId={session?.user?.id || ""} />}
      {org && org.teacher.length === 0 && (
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
              <Link href="/dragon/org-admin/add-teachers">
                <Flex>
                  <IoAdd /> Teacher
                </Flex>
              </Link>
            </Button>
          </>
        </Flex>
      )}

      {org && org.teacher.length > 0 && <Dashboard />}
    </>
  );
};

export default AdminPage;
