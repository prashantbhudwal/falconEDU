"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getEditBotURL, getStudentsURL, getTestEditBotURL } from "@/lib/urls";
import Link from "next/link";
import React, { useState } from "react";
import {
  typePublishedBotByClassId,
  typePublishedTestByClassId,
} from "../queries";
import { createBotConfig } from "@/app/dragon/teacher/mutations";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";

type propType = {
  classId: string;
  publishedBot?: typePublishedBotByClassId;
  unpublishedBot?: typePublishedBotByClassId;
  publishedTest?: typePublishedTestByClassId;
  unpublishedTest?: typePublishedTestByClassId;
  configType: string;
};

const TotalBotConfigCount = ({
  classId,
  publishedBot,
  unpublishedBot,
  publishedTest,
  unpublishedTest,
  configType,
}: propType) => {
  const getBotConfigValue = (configType: string, val?: string) => {
    if (configType === "bots" && val === "publishedBots") {
      return publishedBot ? publishedBot.length : 0;
    }

    if (configType === "bots" && val === "unpublishedBots") {
      return unpublishedBot ? unpublishedBot.length : 0;
    }

    if (configType === "test" && val === "publishedTests") {
      return publishedTest ? publishedTest.length : 0;
    }

    if (configType === "test" && val === "unpublishedTests") {
      return unpublishedTest ? unpublishedTest.length : 0;
    }
    if (configType == "bots") {
      return publishedBot && unpublishedBot
        ? publishedBot.length + unpublishedBot.length
        : 0;
    }
    if (configType == "test") {
      return publishedTest && unpublishedTest
        ? publishedTest.length + unpublishedTest.length
        : 0;
    }
    return 0;
  };
  const { data } = useSession();
  const userId = data?.user?.id ?? "";
  const [botConfigCount, setbotConfigCount] = useState(
    getBotConfigValue(configType)
  );
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const createNewConfig = async (
    userId: string,
    classId: string,
    botConfigType: string
  ) => {
    setLoading(true);
    const configName =
      botConfigType === "bots" ? "Untitled Bot" : "Untitled Test";
    const configType = botConfigType === "bots" ? "chat" : "test";
    const botConfig = await createBotConfig(
      userId,
      classId,
      configName,
      configType
    );
    const configId = botConfig?.id;
    if (!configId) {
      setLoading(false);
      throw new Error("Failed to create bot config");
    }
    router.push(
      configType === "chat"
        ? getEditBotURL(classId, configId)
        : getTestEditBotURL(classId, configId)
    );
    setLoading(false);
  };

  return (
    <div className="my-10 flex justify-between gap-1 items-center text-lg">
      <span className="tracking-wide flex items-center gap-3">
        Total Number of
        <Select
          onValueChange={(value) =>
            setbotConfigCount(getBotConfigValue(configType, value))
          }
        >
          <SelectTrigger className="min-w-[150px] max-w-fit">
            <SelectValue
              className="text-lg tracking-wide"
              placeholder={`${configType === "bots" ? "Bots" : "Tests"}`}
            />
          </SelectTrigger>
          <SelectContent>
            <SelectItem
              value={`${
                configType === "bots" ? "publishedBots" : "publishedTests"
              }`}
            >
              {configType === "bots" ? "Published Bots" : "Published Tests"}
            </SelectItem>
            <SelectItem
              value={`${
                configType === "bots" ? "unpublishedBots" : "unpublishedTests"
              }`}
            >
              {configType === "bots" ? "Unpublished Bots" : "Unpublished Tests"}
            </SelectItem>
          </SelectContent>
        </Select>
        in your class :
        <span className="text-white font-semibold text-xl">
          {botConfigCount}
        </span>
      </span>
      <Button
        onClick={() => createNewConfig(userId, classId, configType)}
        className="text-xs font-semibold cursor-pointer rounded-lg flex items-center justify-center min-w-[130px]"
      >
        {loading ? (
          <span className="loading loading-infinity loading-sm"></span>
        ) : (
          <span>Create new {configType === "bots" ? "Bot" : "Test"}</span>
        )}
      </Button>
    </div>
  );
};

export default TotalBotConfigCount;
