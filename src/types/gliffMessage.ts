type MessageType = "gesture" | "action" | "textInput" | "context";

export type GliffMessage = {
  userName: string;
  message: {
    messageType: MessageType;
    content: string;
    timestamp?: number;
    emoji?: string;
  };
};
