import { nanoid } from "@/lib";
import Agent from "./components/agent";

export default function Dragon() {
  const id = nanoid();
  return <Agent id={id} />;
}
