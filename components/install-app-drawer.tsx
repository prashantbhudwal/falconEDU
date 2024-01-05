"use client";
import React, { useEffect, useState } from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "./ui/button";
import usePwaAppStatus from "@/hooks/use-pwa-app-status";
import localForage from "localforage";
import jwt, { JwtPayload } from "jsonwebtoken";
import Image from "next/image";
import { MdInstallDesktop, MdInstallMobile } from "react-icons/md";

export const InstallAppDrawer = () => {
  const {
    showInstallDrawer,
    disableInAppInstallPrompt,
    installPrompt,
    setInstallPrompt,
  } = usePwaAppStatus();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const secretKey =
    process.env.JWT_SECRET_KEY_FOR_PWA_INSTALL_POP_UP || "some_random_key";

  useEffect(() => {
    if (!showInstallDrawer) return;
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
              await localForage.removeItem("pwa-install");
              const payload = { showInstallPopUp: true };
              const createdToken = jwt.sign(payload, secretKey, {
                expiresIn: "1m",
              });
              await localForage.setItem("pwa-install", createdToken);
              setDrawerOpen(true);
            }
          }
        }
        //if the jwt token dont exist, then create one and show the drawer
        if (tokenValue === null) {
          const payload = { showInstallPopUp: true };
          const createdToken = jwt.sign(payload, secretKey, {
            expiresIn: "1m",
          });
          await localForage.setItem("pwa-install", createdToken);
          setDrawerOpen(true);
        }
      } catch (e) {
        console.log(e);
      }
    })();
  }, [showInstallDrawer]);

  const closeDrawer = async () => {
    try {
      await localForage.removeItem("pwa-install");
      const payload = { showInstallPopUp: false };
      const createdToken = jwt.sign(payload, secretKey, {
        expiresIn: "1m",
      });
      await localForage.setItem("pwa-install", createdToken);
    } catch (err: any) {
      console.log(err);
    }

    setDrawerOpen(false);
  };

  const handleInstallButtonClick = () => {
    if (!installPrompt) {
      return;
    }
    installPrompt.prompt();
    installPrompt.userChoice.then((choiceResult: any) => {
      if (choiceResult.outcome === "accepted") {
        disableInAppInstallPrompt();
      } else {
        console.log("User dismissed the Install prompt");
      }
      setInstallPrompt(null);
      setDrawerOpen(false);
    });
  };

  return (
    <>
      {showInstallDrawer && (
        <Drawer open={drawerOpen} onClose={closeDrawer}>
          <DrawerContent className="outline-none">
            <DrawerHeader>
              <DrawerTitle className="flex justify-center gap-2 items-center">
                <Image
                  src={"/chubbi.png"}
                  height={30}
                  width={30}
                  alt="Falcon Logo"
                />{" "}
                Install FalconAI on your device
              </DrawerTitle>
              <div className="flex gap-2 py-4 items-center justify-center px-5">
                <Image
                  src={"/mobileScreenShot1.png"}
                  height={200}
                  width={80}
                  alt="screenshot"
                />
                <Image
                  src={"/mobileScreenShot2.png"}
                  height={200}
                  width={80}
                  alt="screenshot"
                />
                <Image
                  src={"/mobileScreenShot3.png"}
                  height={200}
                  width={80}
                  alt="screenshot"
                />
              </div>
            </DrawerHeader>
            <div className="flex justify-center gap-5">
              <Button onClick={handleInstallButtonClick}>
                <div className="flex h-full w-full items-center gap-2 justify-center">
                  <MdInstallDesktop className="hidden sm:block" />
                  <MdInstallMobile className="block sm:hidden" />
                  Install
                </div>
              </Button>
              <DrawerClose>
                <Button variant="outline" onClick={closeDrawer}>
                  Cancel
                </Button>
              </DrawerClose>
            </div>
            <DrawerFooter></DrawerFooter>
          </DrawerContent>
        </Drawer>
      )}
    </>
  );
};
