export const MimeTypes = {
  PDF: "application/pdf",
  DOCX: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  TXT: "text/plain",
  JPG: "image/jpeg",
  PNG: "image/png",
} as const;

export const ACCEPTED_FILE_TYPES = {
  [MimeTypes.PDF]: [".pdf"],
  [MimeTypes.DOCX]: [".docx"],
  [MimeTypes.TXT]: [".txt"],
  [MimeTypes.JPG]: [".jpg", ".jpeg"],
  [MimeTypes.PNG]: [".png"],
};
