export async function handleMode(action) {
  if (action.includes('cinema')) {
    return 'Ativando modo cinema';
  }

  if (action.includes('noturno')) {
    return 'Ativando modo noturno';
  }

  return 'Modo não reconhecido';
}