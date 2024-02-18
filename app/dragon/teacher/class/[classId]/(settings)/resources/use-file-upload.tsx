import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import { toast } from "sonner";
import { ACCEPTED_FILE_TYPES, MimeTypes } from "@/app/api/parser/parser/config";
import { parseWithTesseract } from "@/app/api/parser/parser/img";

const PARSING_API = "/api/parser";

const toastifyPromise = (promise: Promise<any>) => {
  return toast.promise(promise, {
    loading: "Reading your file...",
    success: "File read successfully",
    error: "Error reading file",
  });
};

const parseOnServer = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  const promise = axios.post(PARSING_API, formData);
  toastifyPromise(promise);
  const parsedFile = await promise;
  return parsedFile.data as string;
};

const parseOnClient = async (file: File) => {
  const promise = parseWithTesseract(file);
  toastifyPromise(promise);
  const parsedFile = await promise;
  return parsedFile;
};

const parseFile = async (file: File) => {
  const fileType = file.type;
  const imageFileTypes = [MimeTypes.JPG, MimeTypes.PNG] as string[];
  return imageFileTypes.includes(fileType)
    ? await parseOnClient(file)
    : await parseOnServer(file);
};

export function useFileUpload() {
  const [text, setText] = useState("");
  const onDrop = useCallback(async (acceptedFiles: any) => {
    if (acceptedFiles.length === 0) {
      toast.error("No file uploaded");
      return;
    }
    const file = acceptedFiles[0] as File;
    const parsedFile = await parseFile(file);
    if (parsedFile) setText(parsedFile);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    noDrag: false,
    accept: ACCEPTED_FILE_TYPES,
    maxSize: 10485760, // 10MB
  });

  return { text, getRootProps, getInputProps };
}
