import { MimeTypes } from "./config";
import { parseDocx } from "./docx";
import { parseImage } from "./img";
import { parsePdf } from "./pdf";
import { parseText } from "./txt";

export const parsingMap = {
  [MimeTypes.PDF]: parsePdf,
  [MimeTypes.DOCX]: parseDocx,
  [MimeTypes.TXT]: parseText,
  [MimeTypes.JPG]: parseImage, // Associate your new parser
  [MimeTypes.PNG]: parseImage, // Duplicate as needed for other image types
} as const;

/**
 * Parses a file to a string
 * @param file - The file to parse
 * @returns The parsed string
 * @throws If the file type is not supported, or if parsing fails
 */
export const parseFileToString = async (file: File) => {
  const fileType = file.type as keyof typeof parsingMap;
  if (!(fileType in parsingMap)) {
    throw new Error(`Unsupported file type: ${file.type}`);
  }
  const parser = parsingMap[fileType];
  return parser(file);
};
