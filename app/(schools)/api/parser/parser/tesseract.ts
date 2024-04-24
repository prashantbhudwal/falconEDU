import { getBufferFromFile } from "@/lib/utils";
import { createWorker } from "tesseract.js";

type tesseractLanguage = "eng" | "hin" | "eng+hin";

export const parseWithTesseract = async (
  file: File,
  {
    language = "eng+hin",
  }: {
    language?: tesseractLanguage;
  } = {},
): Promise<string> => {
  try {
    const buffer = await getBufferFromFile(file);
    const worker = await createWorker(language);
    const {
      data: { text },
    } = await worker.recognize(buffer);
    await worker.terminate();
    return text;
  } catch (error) {
    throw new Error("Something went wrong during parsing.");
  }
};
