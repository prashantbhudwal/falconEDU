import useSWR from "swr";

export default function useOpenAI(
  chatTopic: string,
  chatSubtopic: string,
  chatGrade: string,
  blockType: string,
  setFetchNow: any,
  fetchNow: boolean
) {
  const fetcher = function () {
    const body = {
      topic: chatTopic,
      subtopic: chatSubtopic,
      grade: chatGrade,
      promptType: blockType,
    };
    return fetch(`/api/falcon`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("An error occurred while fetching the data.");
        }
        return res.json();
      })
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
      })
      .catch((error) => {
        setFetchNow(false);
        return { error: error.message };
      });
  };
  const { data, error, isLoading } = useSWR(
    fetchNow ? "/api/falcon" : null,
    fetcher,
    { refreshInterval: 500 } // Jugaad here -> Need to revalidate on click
  );
  return [data, error, isLoading];
}
