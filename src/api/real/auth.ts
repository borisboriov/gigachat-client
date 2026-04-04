let cachedToken: string | null = null;
let expiresAt = 0;

const BUFFER_MS = 60_000;

export async function getAccessToken(): Promise<string> {
  if (cachedToken && Date.now() < expiresAt - BUFFER_MS) {
    return cachedToken;
  }

  const authKey = import.meta.env.VITE_GIGACHAT_AUTH_KEY;
  const scope = import.meta.env.VITE_GIGACHAT_SCOPE || 'GIGACHAT_API_PERS';

  const rqUID = crypto.randomUUID();

  const res = await fetch('/api/oauth', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json',
      RqUID: rqUID,
      Authorization: `Basic ${authKey}`,
    },
    body: `scope=${scope}`,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`OAuth failed (${res.status}): ${text}`);
  }

  const data: { access_token: string; expires_at: number } = await res.json();
  cachedToken = data.access_token;
  expiresAt = data.expires_at;

  return cachedToken;
}

export function resetToken(): void {
  cachedToken = null;
  expiresAt = 0;
}
