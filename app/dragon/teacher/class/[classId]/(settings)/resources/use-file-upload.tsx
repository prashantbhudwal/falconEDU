import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import { toast } from "sonner";
import { ACCEPTED_FILE_TYPES } from "@/app/api/parser/parser/config";

export function useFileUpload() {
  const [text, setText] = useState("");

  const onDrop = useCallback(async (acceptedFiles: any) => {
    const formData = new FormData();
    if (acceptedFiles.length === 0) throw new Error("No file provided");
    const file = acceptedFiles[0] as File;
    formData.append("file", file);
    const promise = axios.post("/api/parser", formData);
    toast.promise(promise, {
      loading: "Loading file...",
      success: "File loaded successfully",
      error: "Error loading file",
    });
    const parsedDocs = await promise;
    if (parsedDocs) setText(parsedDocs.data);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    noDrag: false,
    accept: ACCEPTED_FILE_TYPES,
  });

  return { text, getRootProps, getInputProps };
}
