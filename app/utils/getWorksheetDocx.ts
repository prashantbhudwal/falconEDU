import {
  QuestionBank,
  QuestionItem,
  QuestionObject,
  MultipleChoiceSingleCorrect,
} from "@/types";
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
import { getQuestionTypeTitle } from "@/app/utils/index";

export async function getWorksheetDocx(questionBank: QuestionBank) {
  const headerParagraph = new Paragraph({
    children: [
      new TextRun({
        text: `Worksheet Generated With Falcon AI`,
        size: 24,
        color: "6B7280",
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
    spacing: {
      before: 500,
    },
  });

  const footer = new Footer({
    children: [footerParagraph],
  });

  const docChildren: any = [];

  questionBank.forEach((questionObject: QuestionObject) => {
    if (questionObject.questions.length > 0) {
      const sectionParagraphs = [
        new Paragraph({
          spacing: {
            before: 500,
          },
        }),
        new Paragraph({
          text: `Section: ${getQuestionTypeTitle(questionObject.type)}`,
          heading: HeadingLevel.HEADING_2,
          alignment: AlignmentType.LEFT,
          spacing: {
            after: 100,
          },
        }),
        new Paragraph({
          border: {
            bottom: {
              color: "4B5563",
              size: 2,
              space: 2,
              style: BorderStyle.SINGLE,
            },
          },
        }),
      ];

      questionObject.questions.forEach(
        (question: QuestionItem, index: number) => {
          const questionParagraph = new Paragraph({
            children: [
              new TextRun({
                text: `${index + 1}. ${question.question}`,
                size: 24,
              }),
            ],
            spacing: {
              line: 336,
            },
          });

          sectionParagraphs.push(questionParagraph);

          if (question.type === "multipleChoiceSingleCorrect") {
            const mcqQuestion = question as MultipleChoiceSingleCorrect;
            if (mcqQuestion.options && mcqQuestion.options.length > 0) {
              mcqQuestion.options.forEach((option) => {
                const optionParagraph = new Paragraph({
                  children: [
                    new TextRun({
                      text: option.charAt(0).toUpperCase() + option.slice(1),
                    }),
                  ],
                  spacing: {
                    line: 336,
                  },
                });
                sectionParagraphs.push(optionParagraph);
              });

              sectionParagraphs.push(new Paragraph({})); // Add an empty paragraph for spacing after options
            }
          }
        }
      );

      docChildren.push(...sectionParagraphs);
    }
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
        children: docChildren,
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  });
  saveAs(blob, `Worksheet.docx`);
  return blob;
}
