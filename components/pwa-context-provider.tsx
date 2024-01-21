"use client";
import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import jwt, { JwtPayload } from "jsonwebtoken";
import localForage from "localforage";

interface PWAContext {
  disableInAppInstallPrompt: () => void;
  showInstallDrawer: boolean;
  setInstallPrompt: (value: any) => void;
  installPrompt: any;
}

interface PWAProviderProps extends PWAContext {
  closeInstallDrawer: () => void;
  handleInstallButtonClick: () => void;
  drawerOpen: boolean;
}

export const PWAContext = createContext<PWAContext | undefined>(undefined);

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
        handleBeforeInstallPrompt,
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

export const usePWAAppStatus = (): PWAProviderProps => {
  const context = useContext(PWAContext);
  const [drawerOpen, setDrawerOpen] = useState(false);

  if (context === undefined) {
    throw new Error("usePWAAppStatus must be used within a PWAProvider");
  }

  const secretKey =
    process.env.JWT_SECRET_KEY_FOR_PWA_INSTALL_POP_UP || "some_random_key";

  const setNewToken = useCallback(
    async (value: boolean) => {
      const payload = { showInstallPopUp: value };
      const createdToken = jwt.sign(payload, secretKey, {
        expiresIn: "1d",
      });
      await localForage.setItem("pwa-install", createdToken);
    },
    [secretKey],
  );

  useEffect(() => {
    if (!context.showInstallDrawer) return;
    (async () => {
      try {
        //check if the jwt token exist
        const tokenValue: string | null =
          await localForage.getItem("pwa-install");

        //if the jwt token exist or is not expired then check for the showInstallPopUp and if it is true, then show the drawer
        if (tokenValue) {
          try {
            const response = jwt.verify(tokenValue, secretKey);

            if (response && (response as JwtPayload).showInstallPopUp) {
              setDrawerOpen(true);
            }
          } catch (err: any) {
            if (err.message === "jwt expired") {
              setNewToken(true);
              setDrawerOpen(true);
            }
          }
        }
        //if the jwt token dont exist, then create one and show the drawer
        if (tokenValue === null) {
          setNewToken(true);
          setDrawerOpen(true);
        }
      } catch (e) {
        console.log(e);
      }
    })();
  }, [context.showInstallDrawer, secretKey, setNewToken]);

  const closeInstallDrawer = async () => {
    try {
      setNewToken(false);
    } catch (err: any) {
      console.log(err);
    }
    setDrawerOpen(false);
  };

  const handleInstallButtonClick = () => {
    if (!context.installPrompt) {
      return;
    }
    context.installPrompt.prompt();
    context.installPrompt.userChoice.then(
      (choiceResult: { outcome: string }) => {
        if (choiceResult.outcome === "accepted") {
          context.disableInAppInstallPrompt();
        } else {
          console.log("User dismissed the Install prompt");
        }
        context.setInstallPrompt(null);
        setDrawerOpen(false);
      },
    );
  };

  return {
    ...context,
    drawerOpen,
    closeInstallDrawer,
    handleInstallButtonClick,
  };
};
