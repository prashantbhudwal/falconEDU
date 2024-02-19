"use client";
import { useState, useEffect } from "react";
import { Variants, cubicBezier, motion } from "framer-motion";
import { MdCloudUpload } from "react-icons/md";
import { cn } from "@/lib/utils";
import { useFileUpload } from "../../(settings)/resources/edit/[resourceId]/use-file-upload";

type PropTypes = {
  setParsedDocs: ({ docs }: { docs: string }) => void;
  className?: string;
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

const FileUploader = ({ setParsedDocs, className }: PropTypes) => {
  const [isButtonHovered, setIsButtonHovered] = useState(false);
  const { text, getRootProps, getInputProps } = useFileUpload();

  useEffect(() => {
    if (text) setParsedDocs({ docs: text });
  }, [text]);

  return (
    <div {...getRootProps()} className={cn("dropzone", className)}>
      <input {...getInputProps()} />
      <motion.div
        onMouseEnter={() => setIsButtonHovered(true)}
        onMouseLeave={() => setIsButtonHovered(false)}
        variants={containerVariant}
        initial="collapsed"
        animate={isButtonHovered ? "expanded" : "collapsed"}
        className="border-text-slate-500 flex h-11 w-11 cursor-pointer items-center justify-center overflow-hidden rounded-full border-[3px] text-slate-200"
      >
        <div className="absolute left-0 flex h-11 w-11 items-center rounded-[28px]">
          <MdCloudUpload className="h-5 w-11" />
        </div>
        <motion.span
          variants={textVariant}
          initial="hide"
          animate={isButtonHovered ? "show" : "hide"}
          className="ml-9 mr-2 whitespace-nowrap text-xs text-slate-400"
        >
          Upload
        </motion.span>
      </motion.div>
    </div>
  );
};

export default FileUploader;
