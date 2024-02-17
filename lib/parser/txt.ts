export const parseText = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      if (reader.result) {
        resolve(reader.result as string);
      } else {
        reject(new Error("No result found"));
      }
    };
    reader.onerror = (error) => reject(error);
    reader.readAsText(file);
  });
};
