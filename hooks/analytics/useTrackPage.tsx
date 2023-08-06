import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { trackPage } from "@/mixpanel/actions";

const useTrackPage = (pageName: string) => {
  const { data: session } = useSession();
  console.log(session?.user?.email);
  useEffect(() => {
    if (session) {
      trackPage(pageName, session?.user?.email ?? "");
    }
  }, [pageName, session]);
};

export default useTrackPage;
