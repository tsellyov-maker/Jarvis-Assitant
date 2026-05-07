import { execFile } from 'child_process';
import { promisify } from 'util';
import { generateSpeech } from './fish-audio.service.mjs';

const execFileAsync = promisify(execFile);

const RAW_MP3 = './audio/output.mp3';
const INPUT_WAV = './audio/input.wav';
const CLEAN_WAV = './audio/clean_ai.wav';
const FINAL_WAV = './audio/jarvis_final.wav';

// --- Etapas do pipeline ---

async function convertMp3ToWav(input, output) {
  await execFileAsync('ffmpeg', ['-y', '-i', input, output]);
}

async function runVoiceFixer(input, output) {
  await execFileAsync('python3', ['tools/enhance_voice.py', input, output]);
}

async function runFinalPolish(input, output) {
  await execFileAsync('ffmpeg', [
    '-y',
    '-i',
    input,
    '-af',
    'highpass=f=80,lowpass=f=12000,equalizer=f=3000:t=q:w=1:g=4,equalizer=f=6500:t=q:w=1:g=3,acompressor=threshold=-20dB:ratio=2:attack=15:release=150,loudnorm=I=-16:LRA=11:TP=-1.5',
    output
  ]);
}

// --- Player melhorado (sem sobreposição) ---

function playAudio(file) {
  // mata qualquer áudio anterior
  execFile('pkill', ['ffplay'], () => {
    execFile(
      'ffplay',
      ['-nodisp', '-autoexit', file],
      (error) => {
        if (error) {
          console.error('Erro ao tocar áudio:', error.message);
        }
      }
    );
  });
}

// --- Função principal ---

export async function speak(text) {
  try {
    // 1. TTS
    await generateSpeech(text);

    try {
      // 2. Converter MP3 → WAV
      await convertMp3ToWav(RAW_MP3, INPUT_WAV);

      // 3. Limpeza IA
      await runVoiceFixer(INPUT_WAV, CLEAN_WAV);

      // 4. Polimento final
      await runFinalPolish(CLEAN_WAV, FINAL_WAV);

      // 5. Tocar
      playAudio(FINAL_WAV);

      return FINAL_WAV.replace('./audio', '/audio');

    } catch (enhanceError) {
      console.error('⚠️ Falha no processamento. Usando áudio original:', enhanceError.message);

      playAudio(RAW_MP3);

      return RAW_MP3.replace('./audio', '/audio');
    }

  } catch (err) {
    console.error('❌ Erro no TTS:', err.message);
    return null;
  }
}