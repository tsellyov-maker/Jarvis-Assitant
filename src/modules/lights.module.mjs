export async function handleLight(action) {
  if (action.includes('ligar')) {
    return 'Ligando a luz';
  }

  if (action.includes('desligar')) {
    return 'Desligando a luz';
  }

  return 'Comando de luz não reconhecido';
}