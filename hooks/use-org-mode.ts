import { useEffect, useState } from "react";
import useUserData from "./useUserData";
import { db } from "@/lib/routers";

export function useOrgMode() {
  const [orgMode, setOrgMode] = useState(false);
  const { user } = useUserData();
  const userId = user?.id;

  useEffect(() => {
    async function getTeacherOrgMode() {
      const orgMode = await db.teacher.teacherHasOrgMode({ userId });
      if (orgMode) {
        setOrgMode(true);
      }
    }
    if (userId) {
      getTeacherOrgMode();
    }
  }, [userId]);

  return { orgMode };
}
