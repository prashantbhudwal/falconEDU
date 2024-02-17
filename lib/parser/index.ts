import { parsePdf } from "./pdf";
import { parseDocx } from "./docx";
import { parseText } from "./txt";

const MimeTypes = {
  PDF: "application/pdf",
  DOCX: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  TXT: "text/plain",
} as const;

export const ACCEPTED_FILE_TYPES = {
  [MimeTypes.PDF]: [".pdf"],
  [MimeTypes.DOCX]: [".docx"],
  [MimeTypes.TXT]: [".txt"],
};

const parsingMap = {
  [MimeTypes.PDF]: parsePdf,
  [MimeTypes.DOCX]: parseDocx,
  [MimeTypes.TXT]: parseText,
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
