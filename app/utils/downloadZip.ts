import { saveAs } from "file-saver";
import JSZip from "jszip";

export async function downloadZip(docxArray: Blob[]): Promise<void> {
  const zip = new JSZip();

  docxArray.forEach((docx, index) => {
    zip.file(`document_${index + 1}.docx`, docx);
  });

  const zipBlob = await zip.generateAsync({ type: "blob" });
  saveAs(zipBlob, "documents.zip");
}
