"use client";
import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { WebPDFLoader } from "langchain/document_loaders/web/pdf";
import mammoth from "mammoth";
import { motion } from "framer-motion";
import { MdCloudUpload } from "react-icons/md";

type PropTypes = {
  setParsedDocs: ({ docs }: { docs: string }) => void;
};

const FileUploader = ({ setParsedDocs }: PropTypes) => {
  const [docs, setDocs] = useState("");

  const onDrop = useCallback(async (acceptedFiles: any) => {
    const file = acceptedFiles[0];

    if (file.type === "application/pdf") {
      const blob = new Blob([file], { type: "application/pdf" });
      const loader = new WebPDFLoader(blob);

      try {
        const pdfDocs = await loader.load();
        let allPages = pdfDocs.map((doc) => doc.pageContent).join("\n");
        setParsedDocs({ docs: allPages });
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
      <div {...getRootProps()} className="dropzone absolute bottom-3 right-3 ">
        <input {...getInputProps()} />
        <motion.div
          whileHover="animate"
          animate="initial"
          initial="initial"
          className="cursor-pointer flex items-center text-slate-200 p-2 border-[3px] border-text-slate-500 rounded-full overflow-hidden"
        >
          <MdCloudUpload className="w-full" />
          <motion.span
            variants={{
              initial: {
                x: "100%",
                opacity: 0,
                width: "0",
              },
              animate: {
                x: "0",
                opacity: 1,
                width: "100%",
              },
            }}
            className="text-xs text-slate-400"
          >
            {/* adding this span to give space between upload icon and text cause framer motion don't animate
                              padding or other space realted field smoothly */}
            <span className="text-transparent">..</span>
            Upload
          </motion.span>
        </motion.div>
      </div>
    </>
  );
};

export default FileUploader;
