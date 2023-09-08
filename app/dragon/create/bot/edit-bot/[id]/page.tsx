import BotPreferencesForm from "../../bot-preferences-form";
import { getInitialValues } from "./actions";

export interface BotPageProps {
  params: {
    id: string;
  };
}

export default async function BotPage({ params }: BotPageProps) {
  console.log(params);

  const { id } = params;

  const initialValues = await getInitialValues(id);
  return <BotPreferencesForm initialValues={initialValues} />;
}
