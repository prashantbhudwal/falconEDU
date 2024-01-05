"use client";
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";

interface PWA {
  disableInAppInstallPrompt: () => void;
  showInstallDrawer: boolean;
  setInstallPrompt: (value: any) => void;
  installPrompt: any;
}

export const PWAContext = createContext<PWA | undefined>(undefined);

export const PWAProvider = ({ children }: PropsWithChildren) => {
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

  return (
    <PWAContext.Provider
      value={{
        disableInAppInstallPrompt,
        installPrompt,
        setInstallPrompt,
        showInstallDrawer,
      }}
    >
      {children}
    </PWAContext.Provider>
  );
};

export const usePWAAppStatus = (): PWA => {
  const context = useContext(PWAContext);

  if (context === undefined) {
    throw new Error("usePWAAppStatus must be used within a PWAProvider");
  }

  return context;
};
