interface SystemMessage {
  messageText: string;
  isError: boolean;
}

export interface SmallTalkResponse<T> {
  data: T;
  statusCode: number;
  systemMessage?: SystemMessage;
  jwt?: string;
}