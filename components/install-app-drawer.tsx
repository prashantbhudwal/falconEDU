"use client";
import React, { useCallback, useEffect, useState } from "react";
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
import localForage from "localforage";
import jwt, { JwtPayload } from "jsonwebtoken";
import Image from "next/image";
import { MdInstallDesktop, MdInstallMobile } from "react-icons/md";
import { usePWAAppStatus } from "./pwa-context-provider";

export const InstallAppDrawer = () => {
  const {
    showInstallDrawer,
    drawerOpen,
    closeInstallDrawer,
    handleInstallButtonClick,
  } = usePWAAppStatus();

  return (
    <>
      {showInstallDrawer && (
        <Drawer open={drawerOpen} onClose={closeInstallDrawer}>
          <DrawerContent className="outline-none">
            <DrawerHeader>
              <DrawerTitle className="flex items-center justify-center gap-2">
                <Image
                  src={"/chubbi.png"}
                  height={30}
                  width={30}
                  alt="Falcon Logo"
                />{" "}
                Install FalconAI on your device
              </DrawerTitle>
              <div className="flex items-center justify-center gap-2 px-5 py-4">
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
                <div className="flex h-full w-full items-center justify-center gap-2">
                  <MdInstallDesktop className="hidden sm:block" />
                  <MdInstallMobile className="block sm:hidden" />
                  Install
                </div>
              </Button>
              <DrawerClose>
                <Button variant="outline" onClick={closeInstallDrawer}>
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
