import { parseWithTesseract } from "./tesseract";

export const parseImage = async (file: File): Promise<string> => {
  const string = await parseWithTesseract(file);
  return string;
};
