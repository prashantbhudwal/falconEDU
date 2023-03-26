import useSWR from "swr";
import axios from "axios";

const processOpenAIResponse = function (OpenAIResponse: any) {
  const response = OpenAIResponse.choices[0].message.content;
  const topic = OpenAIResponse.topic;
  const promptType = OpenAIResponse.promptType;
  const id = OpenAIResponse.id;
  return { response, topic, promptType, id };
};

const fetcher = async function (body: any, setFetchNow: any) {
  try {
    const response = await axios.post("/api/falcon", body, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    setFetchNow(false);
    const data = response.data;
    return processOpenAIResponse(data.response);
  } catch (error) {
    setFetchNow(false);
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred.";
    return { error: errorMessage };
  }
};

export default function useOpenAI(
  chatTopic: string,
  chatSubtopic: string,
  chatGrade: string,
  blockType: string,
  setFetchNow: any,
  fetchNow: boolean
) {
  const body = {
    topic: chatTopic,
    subtopic: chatSubtopic,
    grade: chatGrade,
    promptType: blockType,
  };

  const { data, error, isLoading } = useSWR(
    fetchNow ? "/api/falcon" : null,
    () => fetcher(body, setFetchNow),
    { refreshInterval: 500 } // Jugaad here -> Need to revalidate on click
  );
  return [data, error, isLoading];
}
