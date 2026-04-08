import whisper
import tempfile

model = whisper.load_model("base")

def speech_to_text(file):
    with tempfile.NamedTemporaryFile(delete=False) as temp:
        temp.write(file.file.read())
        temp_path = temp.name

    result = model.transcribe(temp_path)
    return result["text"]