import mammoth from "mammoth";
import "server-only";
import Showdown from "showdown";
import { JSDOM } from "jsdom";
export const parseDocx = async (file: File) => {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  try {
    const result = await mammoth.convertToHtml({ buffer });
    const convertor = new Showdown.Converter();
    const dom = new JSDOM(result.value);
    const parsedHTML = dom.window.document;
    const markdown = convertor.makeMarkdown(result.value, parsedHTML);
    return markdown;
  } catch (error) {
    console.error("Error while trying to parse the DOCX file\n", error);
    throw new Error("Something went wrong during parsing.");
  }
};
