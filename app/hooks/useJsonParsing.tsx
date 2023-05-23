import { useEffect, useState } from "react";

type UseJsonParsingProps = {
  contentStreamCompleted: boolean;
  content: string[];
};

const isJson = (str: string) => {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
};

type ParsedContent = Record<string, unknown>;

const useJsonParsing = ({
  contentStreamCompleted,
  content,
}: UseJsonParsingProps) => {
  const [parsedContent, setParsedContent] = useState<ParsedContent>({});

  useEffect(() => {
    if (contentStreamCompleted && content) {
      const jsonString = content.join("");
      // console.log(jsonString);
      if (isJson(jsonString)) {
        const jsonObject = JSON.parse(jsonString);
        setParsedContent(jsonObject);
      }
    }
  }, [content, contentStreamCompleted]);

  return parsedContent;
};

export default useJsonParsing;
