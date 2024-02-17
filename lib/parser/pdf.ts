import { WebPDFLoader } from "langchain/document_loaders/web/pdf";

export const parsePdf = async (file: File) => {
  const blob = new Blob([file], { type: "application/pdf" });
  const loader = new WebPDFLoader(blob);

  try {
    const pdfDocs = await loader.load();
    let allPages = pdfDocs.map((doc) => doc.pageContent).join("\n");
    return allPages;
  } catch (error) {
    console.error("Error while trying to parse the PDF file\n", error);
    throw new Error("Something went wrong during parsing.");
  }
};
