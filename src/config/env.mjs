import 'dotenv/config';

export const env = {
  PORT: process.env.PORT || 3001,

  FISH_API_KEY: process.env.FISH_API_KEY || '',
  FISH_MODEL: process.env.FISH_MODEL || 's2-pro',
  FISH_REFERENCE_ID: process.env.FISH_REFERENCE_ID || '',

  OLLAMA_URL: process.env.OLLAMA_URL || 'http://localhost:11434',
  OLLAMA_COMMAND_MODEL: process.env.OLLAMA_COMMAND_MODEL || 'llama3.2:3b',
  OLLAMA_CHAT_MODEL: process.env.OLLAMA_CHAT_MODEL || 'mixtral:latest',
};