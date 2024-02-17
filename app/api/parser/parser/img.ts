import { createWorker } from "tesseract.js";

export const parseImage = async (file: File): Promise<string> => {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  try {
    const worker = await createWorker("eng");
    const {
      data: { text },
    } = await worker.recognize(buffer);
    await worker.terminate();
    return text;
  } catch (error) {
    console.error("Error while trying to parse the image file\n", error);
    throw new Error("Something went wrong during parsing.");
  }
};
