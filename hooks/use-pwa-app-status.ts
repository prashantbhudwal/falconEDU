"use client";
import { useEffect, useState } from "react";

const usePwaAppStatus = () => {
  const [installPrompt, setInstallPrompt] = useState<any | null>(null); //TODO: remove any
  const [showInstallDrawer, setShowInstallDrawer] = useState(false);

  const disableInAppInstallPrompt = () => {
    setInstallPrompt(null);
    setShowInstallDrawer(false);
  };

  useEffect(() => {
    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event);
      setShowInstallDrawer(true);
    };

    const handleAppInstalled = () => {
      disableInAppInstallPrompt();
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  return {
    disableInAppInstallPrompt: disableInAppInstallPrompt as () => void,
    showInstallDrawer: showInstallDrawer as boolean,
    setInstallPrompt: setInstallPrompt as (value: any) => void,
    installPrompt: installPrompt as any,
  };
};
export default usePwaAppStatus;
