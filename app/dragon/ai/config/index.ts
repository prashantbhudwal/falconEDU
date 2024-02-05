import { ImageGenerateParams } from "openai/resources";
import { SpeechCreateParams } from "openai/resources/audio/speech";
import { TranscriptionCreateParams } from "openai/resources/audio/transcriptions";
import { ChatCompletionCreateParamsBase } from "openai/resources/chat/completions";

type ChatModel = ChatCompletionCreateParamsBase["model"];
type ImageModel = ImageGenerateParams["model"];
type TranscriptionModel = TranscriptionCreateParams["model"];
type SpeechModel = SpeechCreateParams["model"];

type ModelObject = {
  GPT3: ChatModel;
  GPT4: ChatModel;
  DALLE3: ImageModel;
  WHISPER: TranscriptionModel;
  SPEECH: SpeechModel;
  SPEECH_HD: SpeechModel;
  VISION: ChatModel;
};

export const OPENAI_MODEL: ModelObject = {
  GPT3: "gpt-3.5-turbo",
  GPT4: "gpt-4-turbo-preview",
  DALLE3: "dall-e-3",
  WHISPER: "whisper-1",
  SPEECH: "tts-1",
  SPEECH_HD: "tts-1-hd",
  VISION: "gpt-4-vision-preview",
} as const;
