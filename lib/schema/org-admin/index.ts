import { BoardName, IndianStates, OrgType, Language } from "@prisma/client";
import * as z from "zod";

export const orgRegisterFormSchema = z.object({
  name: z.string().min(2),
  type: z.nativeEnum(OrgType),
  brandName: z.string().min(2),
  boardNames: z.nativeEnum(BoardName),
  city: z.string().optional(),
  state: z.nativeEnum(IndianStates).optional(),
  language_medium: z.nativeEnum(Language),
  language_native: z.string().optional(),
});
