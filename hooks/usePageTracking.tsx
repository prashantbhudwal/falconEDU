"use client"
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const usePageTracking = () => {
  const pathname = usePathname();
  const [currentPage, setCurrentPage] = useState("");

  useEffect(() => {
    setCurrentPage(pathname);
  }, [pathname]);

  return { currentPage };
};

export default usePageTracking;
