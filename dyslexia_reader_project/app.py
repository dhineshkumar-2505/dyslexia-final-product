from flask import Flask, request, jsonify, render_template, send_file
import fitz  # PyMuPDF for handling PDFs
from googletrans import Translator
from gtts import gTTS
import io
import os

app = Flask(__name__)
UPLOAD_FOLDER = 'uploads/'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Ensure uploads folder exists
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

# Extract text from PDF and split into 250-word chunks
def extract_text_and_split(file_path):
    text = ""
    if file_path.endswith(".pdf"):
        with fitz.open(file_path) as pdf:
            for page in pdf:
                text += page.get_text()
    else:
        return None

    # Split text into chunks of 250 words
    words = text.split()
    chunks = [' '.join(words[i:i + 250]) for i in range(0, len(words), 250)]
    return chunks

# Endpoint to handle file uploads and return paginated text
@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({"error": "No file provided"}), 400

    file = request.files['file']
    file_path = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
    file.save(file_path)

    text_chunks = extract_text_and_split(file_path)
    if text_chunks is None:
        return jsonify({"error": "Unsupported file format"}), 400

    return jsonify({"chunks": text_chunks})

# Translate text
@app.route('/translate', methods=['POST'])
def translate_text():
    data = request.get_json()
    text = data.get('text')
    lang = data.get('lang')
    
    if not text or not lang:
        return jsonify({'error': 'Invalid input'}), 400
    
    translator = Translator()
    translated = translator.translate(text, dest=lang)
    
    return jsonify({"translated_text": translated.text})

# Text-to-speech functionality
@app.route('/text-to-speech', methods=['POST'])
def text_to_speech():
    data = request.get_json()
    text = data['text']
    lang = data.get('lang', 'en')
    speed = float(data.get('speed', 1.0))

    tts = gTTS(text=text, lang=lang, slow=speed < 1.0)
    audio_bytes = io.BytesIO()
    tts.write_to_fp(audio_bytes)
    audio_bytes.seek(0)

    return send_file(audio_bytes, mimetype='audio/mp3', as_attachment=True, download_name='speech.mp3')

# Serve the main page
@app.route('/')
def home():
    return render_template('index.html')

# Serve the games page
@app.route('/games')
def games():
    return render_template('games.html')

if __name__ == '__main__':
    app.run(debug=True)
