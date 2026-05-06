import time
import wave
import audioop
import requests
import sounddevice as sd
import whisper

JARVIS_URL = "http://localhost:3001/jarvis"

MODEL_NAME = "base"
SAMPLE_RATE = 16000
CHANNELS = 1
BLOCK_DURATION = 0.2
BLOCK_SIZE = int(SAMPLE_RATE * BLOCK_DURATION)

SILENCE_LIMIT = 1.2
MAX_RECORD_SECONDS = 5
MIN_RECORD_SECONDS = 0.8

VOLUME_THRESHOLD = 700
AUDIO_FILE = "command.wav"

WAKE_WORDS = ["jarvis", "javis", "jarves", "james", "chaves"]

model = whisper.load_model(MODEL_NAME)

def save_wav(filename, frames):
    with wave.open(filename, "wb") as wf:
        wf.setnchannels(CHANNELS)
        wf.setsampwidth(2)
        wf.setframerate(SAMPLE_RATE)
        wf.writeframes(b"".join(frames))

def transcribe(filename):
    result = model.transcribe(
        filename,
        language="pt",
        fp16=False
    )
    return result["text"].strip()

def has_wake_word(text):
    text = text.lower()
    return any(word in text for word in WAKE_WORDS)

def remove_wake_word(text):
    clean = text.lower()

    for word in WAKE_WORDS:
        clean = clean.replace(word, "")

    return clean.strip(" ,.!?;:")

def send_to_jarvis(text):
    print("➡️ Enviando:", text)

    try:
        response = requests.post(
            JARVIS_URL,
            json={"text": text},
            timeout=30
        )

        data = response.json()
        print("🤖 Jarvis:", data.get("response"))

    except Exception as e:
        print("Erro ao enviar para Jarvis:", e)

def listen_once():
    frames = []
    recording = False
    start_time = None
    last_voice_time = None

    with sd.RawInputStream(
        samplerate=SAMPLE_RATE,
        blocksize=BLOCK_SIZE,
        dtype="int16",
        channels=CHANNELS
    ) as stream:
        while True:
            data, overflowed = stream.read(BLOCK_SIZE)
            volume = audioop.rms(data, 2)
            now = time.time()

            if volume > VOLUME_THRESHOLD:
                if not recording:
                    print("🎤 Voz detectada, gravando...")
                    recording = True
                    start_time = now

                last_voice_time = now
                frames.append(bytes(data))

            elif recording:
                frames.append(bytes(data))

                recorded_time = now - start_time
                silence_time = now - last_voice_time

                if recorded_time >= MAX_RECORD_SECONDS:
                    print("⏱️ Tempo máximo atingido.")
                    break

                if recorded_time >= MIN_RECORD_SECONDS and silence_time >= SILENCE_LIMIT:
                    print("🤫 Silêncio detectado, processando...")
                    break

    return frames

print("🟢 Listener automático ativo. Diga: 'Jarvis' + comando.")

while True:
    frames = listen_once()

    if not frames:
        continue

    save_wav(AUDIO_FILE, frames)

    text = transcribe(AUDIO_FILE)

    if not text:
        print("⚠️ Nada entendido.")
        continue

    print("📝 Texto:", text)

    if not has_wake_word(text):
        print("⏳ Ignorado: sem wake word.")
        continue

    command = remove_wake_word(text)

    if not command:
        print("⚠️ Wake word detectada, mas nenhum comando foi dito.")
        continue

    print("🧠 Wake word detectada.")
    send_to_jarvis(command)

    time.sleep(0.5)