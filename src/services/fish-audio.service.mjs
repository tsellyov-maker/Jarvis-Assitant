import fs from 'fs';
import { env } from '../config/env.mjs';

const OUTPUT_PATH = './audio/output.mp3';

export async function generateSpeech(text) {
  const response = await fetch('https://api.fish.audio/v1/tts', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.FISH_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      text,
      model: env.FISH_MODEL,
      reference_id: env.FISH_REFERENCE_ID || undefined
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Erro no Fish Audio: ${response.status} ${errorText}`);
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  fs.writeFileSync(OUTPUT_PATH, buffer);

  return OUTPUT_PATH;
}