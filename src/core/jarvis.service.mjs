import { routeCommand } from './command-router.mjs';
import { classifyWithOllama, chatWithMixtral } from './ai-router.mjs';
import { handleLight } from '../modules/lights.module.mjs';
import { handleMode } from '../modules/modes.module.mjs';
import { speak } from '../services/tts.service.mjs';

async function executeCommand(command) {
  switch (command.type) {
    case 'light':
      return await handleLight(command.action);

    case 'mode':
      return await handleMode(command.action);

    case 'chat':
      return await chatWithMixtral(command.action);

    default:
      return 'Não entendi o comando.';
  }
}

export async function handleJarvisCommand(input) {
  let command = routeCommand(input);

  if (command.type === 'unknown') {
    try {
      command = await classifyWithOllama(input);
    } catch (err) {
      console.error('Erro ao classificar com Ollama:', err.message);
      command = { type: 'unknown', action: input };
    }
  }

  const responseText = await executeCommand(command);
  const audio = await speak(responseText);

  return {
    response: responseText,
    audio,
    command
  };
}