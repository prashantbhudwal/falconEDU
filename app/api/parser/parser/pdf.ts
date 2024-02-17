import { PDFLoader } from "langchain/document_loaders/fs/pdf";

export const parsePdf = async (file: File) => {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const blob = new Blob([buffer], { type: "application/pdf" });
  const loader = new PDFLoader(blob);
  try {
    const pdfDocs = await loader.load();
    let allPages = pdfDocs.map((doc) => doc.pageContent).join("\n");
    return allPages;
  } catch (error) {
    console.error("Error while trying to parse the PDF file\n", error);
    throw new Error("Something went wrong during parsing.");
  }
};
