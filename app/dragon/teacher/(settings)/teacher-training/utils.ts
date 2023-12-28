import axios from "axios";

export const getVideoIdfromYoutubeUrl = (url: string) => {
  if (url.includes("?v=")) {
    const videoId = url.split("?v=")[1];
    return videoId;
  }
  if (url.includes("?si=")) {
    console.log("wcwe");
    const videoId = url.split("?si=")[0].split("/").slice(-1)[0];
    return videoId;
  }
  return url;
};

const photo = `https://img.youtube.com/vi/h02ti0Bl6zk/0.jpg`;

function parseDuration(duration: string) {
  // Parse YouTube duration format (ISO 8601)
  const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/) || [];

  const hours = parseInt(match[1]) || 0;
  const minutes = parseInt(match[2]) || 0;
  const seconds = parseInt(match[3]) || 0;

  if (hours === 0) {
    return `${minutes}:${seconds}`;
  }

  return `${hours}:${minutes}:${seconds}`;
}

export async function getYouTubeVideoMetadata({
  videoId,
}: {
  videoId: string;
}) {
  try {
    const apiKey = process.env.GOOGLE_API_KEY || "";
    const apiUrl = `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${apiKey}&part=snippet,contentDetails`;

    const response = await axios.get(apiUrl);

    if (!response.data.items[0]) return null;

    const metaData = {
      title: response.data.items[0].snippet.title,
      duration: parseDuration(response.data.items[0].contentDetails.duration),
      thumbnail: response.data.items[0].snippet.thumbnails.default.url,
      publishedAt: new Date(response.data.items[0].snippet.publishedAt),
    };
    return metaData;
  } catch (err) {
    console.log(err);
    return null;
  }
}
