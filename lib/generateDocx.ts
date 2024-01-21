// generateDocx.ts
import {
  Document,
  Packer,
  Paragraph,
  HeadingLevel,
  TextRun,
  AlignmentType,
  BorderStyle,
  WidthType,
  Header,
  Footer,
} from "docx";
import { saveAs } from "file-saver";

interface DocData {
  topic: string;
  subtopic: string;
  fetchedContent: string;
}

export async function generateDocx(data: DocData): Promise<void> {
  const text = data.fetchedContent;
  const paragraphs = text.split("\n").map((paragraphContent) => {
    return new Paragraph({
      children: [
        new TextRun({
          text: paragraphContent.trim(),
          size: 24, // equivalent to text-lg in Tailwind CSS
        }),
      ],
      spacing: {
        line: 336, // equivalent to leading-7 in Tailwind CSS
      },
    });
  });

  const headerParagraph = new Paragraph({
    children: [
      new TextRun({
        text: `${data.topic}`,
        size: 24, // equivalent to text-lg in Tailwind CSS
        color: "6B7280", // equivalent to text-slate-600 in Tailwind CSS
        font: "Helvetica",
      }),
    ],
    alignment: AlignmentType.CENTER,
  });

  const header = new Header({
    children: [headerParagraph],
  });

  const footerParagraph = new Paragraph({
    children: [
      new TextRun({
        text: "Generated with Falcon AI",
        size: 24,
        font: "Helvetica",
      }),
    ],
    alignment: AlignmentType.CENTER,
  });

  const footer = new Footer({
    children: [footerParagraph],
  });

  const doc = new Document({
    sections: [
      {
        headers: {
          default: header,
        },
        footers: {
          default: footer,
        },
        children: [
          new Paragraph({
            text: data.subtopic,
            heading: HeadingLevel.HEADING_1,
            alignment: AlignmentType.CENTER,
          }),
          new Paragraph({
            border: {
              bottom: {
                color: "4B5563", // equivalent to border-slate-700 in Tailwind CSS
                size: 2,
                space: 2,
                style: BorderStyle.SINGLE,
              },
            },
          }),
          new Paragraph({
            spacing: {
              after: 200, // Add spacing after the border
            },
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
  saveAs(
    blob,
    `${data.topic.charAt(0).toUpperCase() + data.topic.slice(1)}-${
      data.subtopic
    }.docx`,
  );
}
