import sounddevice as sd
import wave
import whisper

model = whisper.load_model("base")

samplerate = 16000
duration = 10

print("🎤 Fale algo...")
audio = sd.rec(int(duration * samplerate), samplerate=samplerate, channels=1, dtype='int16')
sd.wait()

with wave.open("test.wav", "wb") as wf:
    wf.setnchannels(1)
    wf.setsampwidth(2)
    wf.setframerate(16000)
    wf.writeframes(audio.tobytes())

result = model.transcribe(
    "test.wav",
    language="pt",
    fp16=False
)

print("📝 Texto:", result["text"])