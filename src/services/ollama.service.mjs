import { env } from '../config/env.mjs';

export async function askOllama({ model, system, prompt }) {
  const response = await fetch(`${env.OLLAMA_URL}/api/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model,
      stream: false,
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: prompt }
      ],
      options: {
        temperature: 0.4
      },
      keep_alive: '10m'
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Ollama erro ${response.status}: ${errorText}`);
  }

  const data = await response.json();
  return data.message?.content?.trim() || '';
}