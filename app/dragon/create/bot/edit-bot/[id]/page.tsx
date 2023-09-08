"use client";
import BotPreferencesForm from "../../bot-preferences-form";

export interface BotPageProps {
  params: {
    id: string;
  };
}

export default function BotPage({ params }: BotPageProps) {
  console.log(params);
  return <BotPreferencesForm />;
}
