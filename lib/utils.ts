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

export const generateZodEnumSchema = <T extends Record<string, EnumValues<T>>>(
  enumObject: T,
) => {
  const enumValues = Object.values(enumObject) as EnumValues<T>[];
  const enumArray = enumValues.map(String) as [string, ...string[]];
  return z.enum(enumArray);
};

// -----------------------------------------------------------------------------------------------------------------------

/**
 * Formats a name string based on the provided options.
 * @example
 * formatName({ name: 'john doe' });
 * Returns: 'John Doe'
 * formatName({ name: 'john doe', capitalize: true });
 * Returns: 'JOHN DOE'
 * formatName({ name: 'john_doe' });
 * Returns: 'John Doe'
 * formatName({ name: 'john_doe', capitalize: true });
 * Returns: 'JOHN DOE'
 */
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
  } else {
    if (capitalize) return name.toUpperCase();
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  }
};

// -----------------------------------------------------------------------------------------------------------------------

/**
 * Converts a Tailwind CSS color class to a hex color value.
 * @param {string} colorClass - The Tailwind CSS color class.
 * @returns {string} The hex color value.
 * @throws {Error} An error if the color is not found.
 */
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

/**
 * Generates an array of options from an enum object.
 */
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

/**
 *  Simulates an asynchronous operation.
 * @param {Object} options - The options for the simulator.
 * @param {number} [options.ms=3000] - The time in milliseconds to simulate the operation.
 * @param {boolean} [options.randomFailure=true] - Whether to randomly fail the operation.
 * @param {boolean} [options.alwaysFail=false] - Whether to always fail the operation.
 * @param {boolean} [options.alwaysSucceed=false] - Whether to always succeed the operation.
 * @returns {Promise} A promise that resolves after the specified time.
 * @throws {Error} An error if the operation fails.
 */
export const asyncSimulator = async ({
  ms = 3000,
  randomFailure = true,
  alwaysFail = false,
  alwaysSucceed = false,
} = {}) => {
  await new Promise((resolve) => setTimeout(resolve, ms));
  if (alwaysFail) {
    throw Promise.reject(new Error("Failure"));
  }
  if (alwaysSucceed) {
    return Promise.resolve();
  }
  if (randomFailure) {
    const random = Math.random();
    if (random < 0.5) {
      return Promise.reject(new Error("Random failure"));
    }
  }
  return Promise.resolve();
};

export const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// Date formatting -----------------------------------------------------------------------------------------------------------------------

/**
 * Formats a date to a string.
 *
 * @param {Date} date - The date to format.
 * @param {Object} options - The formatting options.
 * @param {boolean} [options.withTime=false] - Whether to include time in the formatted date.
 * @returns {string} The formatted date string with or without time.
 */
export const formatDate = (
  date: Date,
  {
    withTime = false,
    withYear = false,
  }: { withTime?: boolean; withYear?: boolean } = {},
) => {
  const timeZone = "Asia/Kolkata";

  const formatString = withYear
    ? withTime
      ? "dd MMM yyyy, hh:mm a"
      : "dd MMM yyyy"
    : withTime
      ? "dd MMM, hh:mm a"
      : "dd MMM";

  const formattedDate = format(date, formatString, { timeZone });
  return formattedDate;
};

/**
 * Formats a date to a string in a specific timezone.
 *
 * @deprecated This function is deprecated. Use formatDate instead.
 */
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

/**
 * Formats a date to a string.
 *
 * @deprecated This function is deprecated. Use formatDate instead.
 */
export const getFormattedDate = (date: string) => {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

/**
 * Converts a File object into an Buffer.
 *
 *`Browser + Node.js`
 *
 * This function takes a File object as input and returns a Promise that
 * resolves with an Buffer. The Buffer represents the contents
 * of the file.
 *
 *
 * @param file - The File object to be converted.
 * @returns A Promise that resolves with an Buffer.
 * @throws {Error} Will throw an error if the conversion fails.
 *
 */
export const getBufferFromFile = async (file: File): Promise<Buffer> => {
  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    return buffer;
  } catch (error) {
    throw new Error("Something went wrong while processing the file.");
  }
};

/**
 * Calculates the approximate time taken to generate content using GPT-3 or GPT-4.
 * @param contentValue - The length of the content to be generated.
 * @param model - The model to be used for generation. Optional. Defaults to "GPT4".
 * @returns The approximate time taken in seconds.
 */
export const getGptGenerationTime = (
  contentValue: number,
  model: "GPT3" | "GPT4" = "GPT4",
) => {
  const timeForOneCharacterInMs = model === "GPT4" ? 50 : 5;
  const approximateTimeInSeconds = Math.ceil(
    (contentValue * timeForOneCharacterInMs) / 1000,
  );
  return approximateTimeInSeconds;
};

// -----------------------------------------------------------------------------------------------------------------------
/**
 * Checks if an object is non-empty.
 * @param {Object} obj - The object to check.
 * @returns {boolean} Whether the object is non-empty.
 * @example
 * isNonEmptyObject({}); // false
 */
export const isNonEmptyObject = (obj: Object) => {
  return obj && typeof obj === "object" && Object.keys(obj).length > 0;
};

// -----------------------------------------------------------------------------------------------------------------------

/**
 * Checks if a string is a valid URL.
 * @param {string} url - The string to check.
 * @returns {boolean} Whether the string is a valid URL.
 * Endpoint = blr.cdn.digitaloceanspaces.com
 */
export const constructDigitalOceanUrl = ({
  bucket,
  key,
}: {
  bucket: string;
  key: string;
}) => {
  return `https://${bucket}.blr1.cdn.digitaloceanspaces.com/${key}`;
};
