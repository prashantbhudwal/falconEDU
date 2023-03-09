import useSWR from "swr";

export default function useOpenAI(
  chatTopic: string,
  blockType: string,
  setFetchNow: any,
  fetchNow: boolean
) {
  const fetcher = function () {
    const body = {
      topic: chatTopic,
      promptType: blockType,
    };
    return fetch(`/api/falcon`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })
      .then((res) => res.json())
      .then((data) => {
        setFetchNow(false);
        return data;
      })
      .then((data) => {
        const response = data.response.choices[0].message.content;
        const topic = data.response.topic;
        const promptType = data.response.promptType;
        const id = data.response.id;
        return { response, topic, promptType, id };
      });
  };
  const { data, error, isLoading } = useSWR(
    fetchNow ? "/api/openAPI" : null,
    fetcher
  );
  return [data, error, isLoading];
}
