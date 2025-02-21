// the following forms are similar
export const wsUrl = "ws://localhost:5163/ws";

export type WsMessage = {
  Message: string;
  Data: ChatMessage | Notification;
}

export type ChatMessage = {
  userId: number;
  senderId: number;
  receiverId: number;
  message: string;
  timestamp: string;
}

export type Notification = {
  status: number;
  content: string;
  timestamp: string;
}