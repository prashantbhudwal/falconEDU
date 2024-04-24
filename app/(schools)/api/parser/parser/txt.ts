export const parseText = async (file: File): Promise<string> => {
  return await file.text();
};
