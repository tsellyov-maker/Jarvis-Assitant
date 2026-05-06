import { env } from '../config/env.mjs';
import { askOllama } from '../services/ollama.service.mjs';

export async function classifyWithOllama(input) {
  const system = `
Você é o classificador de intenções do Jarvis.

Responda SOMENTE JSON válido.

Tipos disponíveis:
- light
- mode
- chat
- unknown

Regras:
- Se for sobre ligar/desligar luz, type = "light"
- Se for sobre modo cinema/noturno/foco/relaxar, type = "mode"
- Se for pergunta, conversa, explicação ou assunto geral, type = "chat"
- Se não entender, type = "unknown"

Formato:
{
  "type": "light|mode|chat|unknown",
  "action": "texto limpo do comando"
}
`;

  const raw = await askOllama({
    model: env.OLLAMA_COMMAND_MODEL,
    system,
    prompt: input
  });

  try {
    const parsed = JSON.parse(raw);

    if (!parsed.type || !parsed.action) {
      return { type: 'unknown', action: input };
    }

    return parsed;
  } catch {
    return { type: 'unknown', action: input };
  }
}

export async function chatWithMixtral(input) {
  const system = `
Você é Jarvis, um assistente pessoal em português do Brasil.
Responda de forma curta, elegante e útil.
Não seja prolixo.
Tom: calmo, direto e inteligente.
`;

  const response = await askOllama({
    model: env.OLLAMA_CHAT_MODEL,
    system,
    prompt: input
  });

  return response || 'Não consegui formular uma resposta agora.';
}