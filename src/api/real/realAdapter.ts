import type { ChatAdapter, ApiMessage } from '../types';
import { getAccessToken, resetToken } from './auth';

async function fetchCompletion(
  messages: ApiMessage[],
  options: { model: string; temperature: number; topP: number; maxTokens: number },
  signal?: AbortSignal,
  isRetry = false,
): Promise<Response> {
  const token = await getAccessToken();

  const res = await fetch('/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      model: options.model,
      messages,
      stream: true,
      temperature: options.temperature,
      top_p: options.topP,
      max_tokens: options.maxTokens,
    }),
    signal,
  });

  if (res.status === 401 && !isRetry) {
    resetToken();
    return fetchCompletion(messages, options, signal, true);
  }

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GigaChat API error (${res.status}): ${text}`);
  }

  return res;
}

async function* parseSSEStream(
  reader: ReadableStreamDefaultReader<Uint8Array>,
): AsyncGenerator<string, void, unknown> {
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() ?? '';

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || !trimmed.startsWith('data:')) continue;

      const data = trimmed.slice(5).trim();
      if (data === '[DONE]') return;

      try {
        const parsed = JSON.parse(data);
        const content = parsed.choices?.[0]?.delta?.content;
        if (content) yield content;
      } catch {
        // skip malformed JSON chunks
      }
    }
  }
}

async function* fallbackRest(
  messages: ApiMessage[],
  options: { model: string; temperature: number; topP: number; maxTokens: number },
  signal?: AbortSignal,
): AsyncGenerator<string, void, unknown> {
  const token = await getAccessToken();

  const res = await fetch('/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      model: options.model,
      messages,
      stream: false,
      temperature: options.temperature,
      top_p: options.topP,
      max_tokens: options.maxTokens,
    }),
    signal,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GigaChat API error (${res.status}): ${text}`);
  }

  const data = await res.json();
  const content = data.choices?.[0]?.message?.content;
  if (content) yield content;
}

export const realAdapter: ChatAdapter = {
  async *sendMessage(messages, options, signal) {
    try {
      const res = await fetchCompletion(messages, options, signal);

      if (!res.body) {
        yield* fallbackRest(messages, options, signal);
        return;
      }

      const reader = res.body.getReader();
      try {
        yield* parseSSEStream(reader);
      } finally {
        reader.releaseLock();
      }
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') throw err;

      // fallback to REST if streaming failed
      try {
        yield* fallbackRest(messages, options, signal);
      } catch (restErr) {
        if (restErr instanceof DOMException && restErr.name === 'AbortError') throw restErr;
        throw restErr;
      }
    }
  },
};
