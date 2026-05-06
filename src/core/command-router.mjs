export function routeCommand(text) {
  const input = text.toLowerCase();

  if (input.includes('luz')) {
    return { type: 'light', action: input };
  }

  if (input.includes('modo')) {
    return { type: 'mode', action: input };
  }

  const chatTriggers = [
    'quem',
    'o que',
    'porque',
    'por que',
    'como',
    'me explique',
    'converse',
    'fale sobre'
  ];

  if (chatTriggers.some(trigger => input.includes(trigger))) {
    return { type: 'chat', action: input };
  }

  return { type: 'unknown', action: input };
}