import useSWR from "swr";

export default function useOpenAI(
  chatTopic: string,
  blockType: string,
  setChatResponse: any,
  setFetchNow: any,
  fetchNow: boolean
) {
  const fetcher = function () {
    console.log(`🔴 Fetch started`);
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
        setChatResponse(data.response.content);
        setFetchNow(false);
        return data.response.content;
      });
  };
  const { data, error, isLoading } = useSWR(
    fetchNow ? "/api/openAPI" : null,
    fetcher
  );

  return {
    data,
    error,
    isLoading,
  };
}
