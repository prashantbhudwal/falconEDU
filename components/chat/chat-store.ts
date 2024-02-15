import { Message } from "ai";
import { create } from "zustand";
import { ChatProps } from "./chat-dragon";

interface ChatPropsStore {
  id: string;
  initialMessages: Message[];
  apiPath: string;
  emptyMessage: string;
  className: string;
  chatBody: Record<string, unknown>;
  botImage: string;
  isDisabled: boolean;
  isSubmitted: boolean;
  type: string;
  hidePanel: boolean;
  taskId: string;
  showSuggestions: boolean;
  setChatProps: (props: ChatProps) => void;
  messages: Message[];
  setMessages: (messages: Message[]) => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
}

export const useChatPropsStore = create<ChatPropsStore>((set) => ({
  id: "",
  initialMessages: [],
  apiPath: "",
  emptyMessage: "",
  className: "",
  chatBody: {},
  botImage: "",
  isDisabled: false,
  isSubmitted: false,
  type: "",
  hidePanel: false,
  taskId: "",
  messages: [],
  showSuggestions: false,
  setChatProps: (props) => set((state) => ({ ...state, ...props })),
  setMessages: (messages) => set((state) => ({ ...state, messages })),
  isLoading: false,
  setIsLoading: (isLoading) => set((state) => ({ ...state, isLoading })),
}));
