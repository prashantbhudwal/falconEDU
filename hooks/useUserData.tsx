import { useSession } from "next-auth/react";
import useSWR from "swr";
import axios from "axios";

async function fetchUserData(url: any) {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch user data");
  }
}

export default function useUserData() {
  const { data: session, status: sessionStatus } = useSession();
  const email = session?.user?.email;
  const {
    data: user,
    error,
    isLoading: isUserLoading,
  } = useSWR(email ? `/api/db/user/${email}` : null, fetchUserData);

  const isLoading = sessionStatus === "loading" || isUserLoading;

  return { user, error, isLoading };
}
