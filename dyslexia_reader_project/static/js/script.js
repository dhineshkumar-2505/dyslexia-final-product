let textChunks = [];
let currentPage = 0;
let audio = null;

// Upload file and extract text with pagination
function uploadFile() {
    const fileInput = document.getElementById('fileUpload');
    const file = fileInput.files[0];

    if (file) {
        const formData = new FormData();
        formData.append('file', file);

        fetch('/upload', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            textChunks = data.chunks;
            currentPage = 0;
            displayPage(currentPage);
            updatePaginationButtons();
        })
        .catch(error => console.error('Error uploading file:', error));
    }
}

// Display the current page of text
function displayPage(page) {
    document.getElementById('textOutput').value = textChunks[page];
    document.getElementById('pageInfo').textContent = `Page ${page + 1} of ${textChunks.length}`;
}

// Handle pagination buttons
function updatePaginationButtons() {
    document.getElementById('prevPage').disabled = currentPage === 0;
    document.getElementById('nextPage').disabled = currentPage === textChunks.length - 1;
}

function nextPage() {
    if (currentPage < textChunks.length - 1) {
        currentPage++;
        displayPage(currentPage);
        updatePaginationButtons();
    }
}

function prevPage() {
    if (currentPage > 0) {
        currentPage--;
        displayPage(currentPage);
        updatePaginationButtons();
    }
}

// Text-to-speech functionality
function playTextToSpeech() {
    const speechSpeed = document.getElementById('speechSpeed').value;
    const voice = document.getElementById('voiceSelect').value;

    fetch('/text-to-speech', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: textChunks[currentPage], lang: voice, speed: speechSpeed })
    })
    .then(response => response.blob())
    .then(blob => {
        const audioUrl = URL.createObjectURL(blob);
        audio = new Audio(audioUrl);
        audio.play();
    })
    .catch(error => console.error('Error with TTS:', error));
}

function pauseSpeech() {
    if (audio) {
        audio.pause();
    }
}

function stopSpeech() {
    if (audio) {
        audio.pause();
        audio.currentTime = 0;  // Reset audio to start
    }
}

// Translate text functionality
function translateText() {
    const lang = document.getElementById('translateLang').value;

    fetch('/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: textChunks[currentPage], lang: lang })
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('textOutput').value = data.translated_text;
    })
    .catch(error => console.error('Error translating text:', error));
}

// Customize text appearance
document.getElementById('fontSize').addEventListener('input', function () {
    document.getElementById('textOutput').style.fontSize = this.value + 'px';
});

document.getElementById('lineSpacing').addEventListener('input', function () {
    document.getElementById('textOutput').style.lineHeight = this.value;
});

document.getElementById('fontFamily').addEventListener('change', function () {
    document.getElementById('textOutput').style.fontFamily = this.value;
});

document.getElementById('textColor').addEventListener('input', function () {
    document.getElementById('textOutput').style.color = this.value;
});

document.getElementById('bgColor').addEventListener('input', function () {
    document.getElementById('readingArea').style.backgroundColor = this.value;
});
