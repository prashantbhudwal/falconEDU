import mammoth from "mammoth";

export const parseDocx = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (event) => {
      const target = event.target;
      if (target && target.result) {
        const arrayBuffer = target.result as ArrayBuffer;
        try {
          const result = await mammoth.extractRawText({ arrayBuffer });
          resolve(result.value);
        } catch (error) {
          reject(error);
        }
      }
    };
    reader.readAsArrayBuffer(file);
  });
};
