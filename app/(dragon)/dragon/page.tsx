import { nanoid } from "@/utils";
import Agent from "../components/Agent";

export default function Dragon() {
  const id = nanoid();
  return <Agent id={id} />;
}
