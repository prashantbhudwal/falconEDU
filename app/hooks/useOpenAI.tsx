import useSWR from "swr";
import axios from "axios";

const ROUTE = "/api/falcon";

const processOpenAIResponse = function (OpenAIResponse: any) {
  const response = OpenAIResponse.choices[0].message.content;
  const topic = OpenAIResponse.topic;
  const promptType = OpenAIResponse.promptType;
  const id = OpenAIResponse.id;
  return { response, topic, promptType, id };
};

const fetcher = async function (body: any) {
  try {
    const response = await axios.post(ROUTE, body, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = response.data;
    return processOpenAIResponse(data.response);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred.";
    return { error: errorMessage };
  }
};

export default function useOpenAI(
  chatTopic: string,
  chatSubtopic: string,
  chatGrade: string,
  blockType: string
) {
  const body = {
    topic: chatTopic,
    subtopic: chatSubtopic,
    grade: chatGrade,
    promptType: blockType,
  };

  const { data, error, isLoading, isValidating, mutate } = useSWR(
    ROUTE,
    () => fetcher(body),
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      revalidateOnMount: false,
      initialData: { response: "", topic: "", promptType: "", id: "" },
    }
  );
  return [data, error, isLoading, isValidating, mutate];
}
