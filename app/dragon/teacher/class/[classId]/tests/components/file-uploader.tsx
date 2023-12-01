"use client";
import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { WebPDFLoader } from "langchain/document_loaders/web/pdf";
import mammoth from "mammoth";

const FileUploader = () => {
  const [docs, setDocs] = useState("");

  const onDrop = useCallback(async (acceptedFiles: any) => {
    const file = acceptedFiles[0];

    if (file.type === "application/pdf") {
      const blob = new Blob([file], { type: "application/pdf" });
      const loader = new WebPDFLoader(blob);

      try {
        const pdfDocs = await loader.load();
        let allPages = pdfDocs.map((doc) => doc.pageContent).join("\n");
        setDocs(allPages);
      } catch (error) {
        console.error("Error loading PDF:", error);
      }
    } else if (
      file.type ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      try {
        const reader = new FileReader();
        reader.onload = async (event) => {
          const target = event.target;
          if (target && target.result) {
            const arrayBuffer = target.result as ArrayBuffer;
            try {
              const result = await mammoth.extractRawText({ arrayBuffer });
              setDocs(result.value);
            } catch (error) {
              console.error("Error loading DOCX:", error);
            }
          }
        };
        reader.readAsArrayBuffer(file);
      } catch (error) {
        console.error("Error loading DOCX:", error);
      }
    }
  }, []);

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <>
      <div {...getRootProps()} className="dropzone">
        <input {...getInputProps()} />
        <p>Upload</p>
      </div>
      <div>
        <p className="whitespace-pre-wrap w-screen">{docs}</p>
      </div>
    </>
  );
};

export default FileUploader;
