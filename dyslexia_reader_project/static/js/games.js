// Word Scramble Game
const words = ["dyslexia", "education", "learning", "teacher", "student"];
let currentWord;
let timeLimit = 30; // 30 seconds
let timer;

function startWordScrambleGame() {
    document.getElementById('wordScrambleGame').style.display = 'block';
    document.getElementById('wordScrambleGame').innerHTML = '';
    currentWord = words[Math.floor(Math.random() * words.length)];
    const scrambledWord = scrambleWord(currentWord);
    
    let html = `
        <h3>Unscramble the word:</h3>
        <h1>${scrambledWord}</h1>
        <input type="text" id="userGuess" placeholder="Type your guess here">
        <button onclick="checkGuess()">Submit</button>
        <div id="timer">Time Left: ${timeLimit}</div>
    `;
    document.getElementById('wordScrambleGame').innerHTML = html;
    
    // Start timer
    timer = setInterval(() => {
        timeLimit--;
        document.getElementById('timer').textContent = `Time Left: ${timeLimit}`;
        if (timeLimit <= 0) {
            clearInterval(timer);
            alert(`Time's up! The correct word was "${currentWord}".`);
            resetGame();
        }
    }, 1000);
}

function scrambleWord(word) {
    return word.split('').sort(() => 0.5 - Math.random()).join('');
}

function checkGuess() {
    const userGuess = document.getElementById('userGuess').value;
    if (userGuess.toLowerCase() === currentWord.toLowerCase()) {
        clearInterval(timer);
        alert("Correct! Well done!");
    } else {
        alert(`Incorrect! Try again.`);
    }
}

// Color Matching Game
const colors = [
    { name: 'Red', hex: '#FF0000' },
    { name: 'Green', hex: '#00FF00' },
    { name: 'Blue', hex: '#0000FF' },
    { name: 'Yellow', hex: '#FFFF00' },
    { name: 'Purple', hex: '#800080' },
];
let currentColor;

function startColorMatchingGame() {
    document.getElementById('colorMatchingGame').style.display = 'block';
    document.getElementById('colorMatchingGame').innerHTML = '';
    
    currentColor = colors[Math.floor(Math.random() * colors.length)];
    const colorDiv = `<div style="width: 100px; height: 100px; background-color: ${currentColor.hex};"></div>`;
    
    let html = `
        <h3>Click on the card that matches the color:</h3>
        ${colorDiv}
        <div class="color-options">
            ${colors.map(color => `<button style="background-color: ${color.hex};" onclick="checkColor('${color.name}')">${color.name}</button>`).join('')}
        </div>
    `;
    document.getElementById('colorMatchingGame').innerHTML = html;
}

function checkColor(colorName) {
    if (colorName === currentColor.name) {
        alert("Correct! Well done!");
    } else {
        alert(`Incorrect! The correct color was "${currentColor.name}".`);
    }
}
