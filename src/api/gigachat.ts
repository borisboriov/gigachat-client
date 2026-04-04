import type { ChatAdapter } from './types';
import { mockAdapter } from './mock/mockAdapter';
import { realAdapter } from './real/realAdapter';

const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false';

export const chatAPI: ChatAdapter = USE_MOCK ? mockAdapter : realAdapter;
