import type { MessageRole } from '../types';

export interface ApiMessage {
  role: MessageRole;
  content: string;
}

export interface ChatCompletionRequest {
  model: string;
  messages: ApiMessage[];
  stream?: boolean;
  temperature?: number;
  top_p?: number;
  max_tokens?: number;
}

export interface ChatAdapter {
  sendMessage: (
    messages: ApiMessage[],
    options: { model: string; temperature: number; topP: number; maxTokens: number },
    signal?: AbortSignal,
  ) => AsyncGenerator<string, void, unknown>;
}
