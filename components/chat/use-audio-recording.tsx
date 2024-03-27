import { useState, useEffect } from "react";
import axios from "axios";
import { TaskType } from "@/types";
import { useAtom } from "jotai";
import { isRecordingAtom, isProcessingAudioAtom } from "@/lib/atoms/recorder";

export const useAudioRecording = (
  type: TaskType,
  attemptId: string,
  taskId: string,
  setInput: (value: string) => void,
) => {
  const [isRecording, setIsRecording] = useAtom(isRecordingAtom);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null,
  );
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const [isProcessingAudio, setIsProcessingAudio] = useAtom(
    isProcessingAudioAtom,
  );

  useEffect(() => {
    if (!isRecording && audioChunks.length > 0) {
      sendAudioToServer();
      setAudioChunks([]);
    }
  }, [isRecording, audioChunks]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      const newRecorder = new MediaRecorder(stream);
      newRecorder.ondataavailable = (event: BlobEvent) => {
        setAudioChunks((currentChunks) => [...currentChunks, event.data]);
      };
      newRecorder.start();
      setMediaRecorder(newRecorder);
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing microphone: ", error);
    }
  };

  const stopRecording = () => {
    mediaRecorder?.stop();
    mediaRecorder?.stream?.getTracks().forEach((track) => track.stop());
    setIsRecording(false);
    setMediaRecorder(null);
  };

  const sendAudioToServer = async () => {
    setIsProcessingAudio(true);
    const audioBlob = new Blob(audioChunks, { type: "audio/mpeg" });
    const audioFile = new File([audioBlob], "audio.mp3", {
      type: "audio/mpeg",
    });

    if (audioFile) {
      const formData = new FormData();
      formData.append("file", audioFile);
      formData.append("taskType", type);
      formData.append("attemptId", attemptId);
      formData.append("taskId", taskId);
      try {
        const response = await axios.post("/dragon/ai/transcribe", formData);
        setIsProcessingAudio(false);
        setInput(response.data.transcription);
        return response.data.transcription;
      } catch (error) {
        console.error("Error sending audio to server:", error);
        setIsProcessingAudio(false);
        return "";
      }
    }
  };

  const toggleRecording = async (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();
    event.stopPropagation();

    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return {
    isRecording,
    isProcessingAudio,
    startRecording,
    stopRecording,
    sendAudioToServer,
    toggleRecording,
  };
};
