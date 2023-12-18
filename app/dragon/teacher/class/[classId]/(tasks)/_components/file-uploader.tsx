"use client";
import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { WebPDFLoader } from "langchain/document_loaders/web/pdf";
import mammoth from "mammoth";
import { Variants, cubicBezier, motion } from "framer-motion";
import { MdCloudUpload } from "react-icons/md";

type PropTypes = {
  setParsedDocs: ({ docs }: { docs: string }) => void;
};

const containerVariant: Variants = {
  expanded: {
    width: "auto",
    transition: { duration: 0.8, ease: [0.6, 0.05, -0.01, 0.9] },
  },
  collapsed: {
    width: "44px",
    transition: { duration: 0.8, ease: [0.6, 0.05, -0.01, 0.9] },
  },
};

const textVariant: Variants = {
  show: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: cubicBezier(0.6, 0.05, -0.01, 0.9),
      delay: 0.3,
    },
  },
  hide: {
    opacity: 0,
    x: 12,
    transition: {
      duration: 0.3,
      ease: cubicBezier(0.6, 0.05, -0.01, 0.9),
    },
  },
};

const FileUploader = ({ setParsedDocs }: PropTypes) => {
  const [isButtonHovered, setIsButtonHovered] = useState(false);

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
              setParsedDocs({ docs: result.value });
            } catch (error) {
              console.error("Error loading DOCX:", error);
            }
          }
        };
        reader.readAsArrayBuffer(file);
      } catch (error) {
        console.error("Error loading DOCX:", error);
      }
    } else if (file.type === "text/plain") {
      try {
        const reader = new FileReader();
        reader.onload = async (event) => {
          if (reader.result) {
            setParsedDocs({ docs: reader.result as string });
          }
        };
        reader.readAsText(file);
      } catch (error) {
        console.log("Error loading TXT:", error);
      }
    }
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    noDrag: false,
    accept: {
      "application/pdf": [".pdf"],
      // "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [".docx"],
      "text/plain": [".txt"],
    },
  });

  return (
    <div
      {...getRootProps()}
      className="dropzone absolute bottom-3 right-3 bg-base-300 "
    >
      <input {...getInputProps()} />
      <motion.div
        onMouseEnter={() => setIsButtonHovered(true)}
        onMouseLeave={() => setIsButtonHovered(false)}
        variants={containerVariant}
        initial="collapsed"
        animate={isButtonHovered ? "expanded" : "collapsed"}
        className="cursor-pointer w-11 h-11 flex items-center justify-center text-slate-200 border-[3px] border-text-slate-500 rounded-full overflow-hidden"
      >
        <div className="w-11 h-11 rounded-[28px] flex absolute left-0 items-center">
          <MdCloudUpload className="h-5 w-11" />
        </div>
        <motion.span
          variants={textVariant}
          initial="hide"
          animate={isButtonHovered ? "show" : "hide"}
          className="text-xs text-slate-400 mr-2 ml-9 whitespace-nowrap"
        >
          Upload
        </motion.span>
      </motion.div>
    </div>
  );
};

export default FileUploader;
