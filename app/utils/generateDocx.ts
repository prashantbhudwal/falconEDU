// generateDocx.ts
import { Document, Packer, Paragraph, HeadingLevel } from "docx";
import { saveAs } from "file-saver";

interface DocData {
  topic: string;
  subtopic: string;
  messages: string[];
}

export async function generateDocx(data: DocData): Promise<void> {
  const text = data.messages.join("");
  const paragraphs = text.split("\n").map((paragraphContent) => {
    return new Paragraph({
      text: paragraphContent.trim(),
    });
  });

  const doc = new Document({
    sections: [
      {
        children: [
          new Paragraph({
            text: data.topic,
            heading: HeadingLevel.HEADING_1,
          }),
          new Paragraph({
            text: data.subtopic,
            heading: HeadingLevel.HEADING_2,
          }),
          ...paragraphs,
        ],
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  });
  saveAs(blob, `${data.subtopic}.docx`);
}
