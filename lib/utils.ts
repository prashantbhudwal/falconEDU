import { clsx, type ClassValue } from "clsx";
import { customAlphabet } from "nanoid";
import { twMerge } from "tailwind-merge";
import { z } from "zod";
export * from "./is-authorized";
import { format, utcToZonedTime } from "date-fns-tz";
import colors from "tailwindcss/colors";

type EnumValues<T> = T[keyof T];

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const nanoid = customAlphabet(
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
  7,
); // 7-character random string

export async function fetcher<JSON = any>(
  input: RequestInfo,
  init?: RequestInit,
): Promise<JSON> {
  const res = await fetch(input, init);

  if (!res.ok) {
    const json = await res.json();
    if (json.error) {
      const error = new Error(json.error) as Error & {
        status: number;
      };
      error.status = res.status;
      throw error;
    } else {
      throw new Error("An unexpected error occurred");
    }
  }

  return res.json();
}
// -----------------------------------------------------------------------------------------------------------------------

export function formatDate(input: string | number | Date): string {
  const date = new Date(input);
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}
// -----------------------------------------------------------------------------------------------------------------------

export const getFormattedDate = (date: string) => {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

// -----------------------------------------------------------------------------------------------------------------------

type SchemaType<T extends z.ZodTypeAny> =
  T extends z.ZodType<infer R, any, any> ? R : never;

export const removeOptionalFieldFormZodTypes = <T extends z.ZodObject<any>>(
  schema: T,
): z.ZodObject<SchemaType<T>> => {
  const updatedSchema = schema.partial().refine((data) => {
    const requiredFields = Object.keys(schema.shape).filter((field) =>
      schema.shape[field as keyof typeof schema.shape].optional(),
    ) as (keyof typeof schema.shape)[];

    return requiredFields.every((field) => data[String(field)] !== undefined);
  });

  return updatedSchema as unknown as z.ZodObject<SchemaType<T>>;
};

// -----------------------------------------------------------------------------------------------------------------------

export const formatName = ({
  name,
  capitalize = false,
}: {
  name: string;
  capitalize?: boolean;
}) => {
  if (name.includes(" ")) {
    if (capitalize) return name.toUpperCase();
    const nameArray = name.split(" ");
    return nameArray
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  }
  if (name.includes("_")) {
    const nameArray = name.split("_");
    if (capitalize) return nameArray.join(" ").toUpperCase();
    return nameArray
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  }
  // if (name.includes("-")) {
  //   const nameArray = name.split("-");
  //   if (capitalize) return nameArray.join(" ").toUpperCase();
  //   return nameArray
  //     .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
  //     .join(" ");
  // }
  else {
    if (capitalize) return name.toUpperCase();
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  }
};

// -----------------------------------------------------------------------------------------------------------------------

export const formatDateWithTimeZone = ({
  createdAt,
  dateFormat,
}: {
  createdAt: Date;
  dateFormat: string;
}) => {
  const timeZone = "Asia/Kolkata";
  const zonedDate = utcToZonedTime(createdAt, timeZone);
  const formattedDate = format(zonedDate, dateFormat, { timeZone });
  return formattedDate;
};

// -----------------------------------------------------------------------------------------------------------------------

export const tailwindColorToHex = (colorClass: string): string => {
  const colorParts: string[] = colorClass.split("-");
  const colorName: string = colorParts[1];
  const colorShade: number | undefined = parseInt(colorParts[2]) || 500;
  const colorValue: string | undefined = (colors as { [key: string]: any })[
    colorName
  ]?.[colorShade];
  return colorValue || "Color not found";
};

// -----------------------------------------------------------------------------------------------------------------------

export const generateZodEnumSchema = <T extends Record<string, EnumValues<T>>>(
  enumObject: T,
) => {
  const enumValues = Object.values(enumObject) as EnumValues<T>[];
  const enumArray = enumValues.map(String) as [string, ...string[]];
  return z.enum(enumArray);
};

// -----------------------------------------------------------------------------------------------------------------------

export const generateOptionsFromEnum = <
  T extends Record<string, EnumValues<T>>,
>({
  enumObject,
  capitalizeOptions = false,
}: {
  enumObject: T;
  capitalizeOptions?: boolean;
}) => {
  return Object.keys(enumObject).map((key) => ({
    value: key,
    label: formatName({
      name: key,
      capitalize: capitalizeOptions,
    }),
  }));
};

// -----------------------------------------------------------------------------------------------------------------------
