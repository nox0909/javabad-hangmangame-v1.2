const hangmanImage = document.querySelector(".hangman-box img");
const wordDisplay = document.querySelector(".word-display");
const guessesText = document.querySelector(".guesses-text b");
const keyboardDiv = document.querySelector(".keyboard");
const gameModal = document.querySelector(".game-modal");
const playAgainBtn = document.querySelector(".play-again");
const difficultySelect = document.querySelector("#difficulty-select");
const scoreDisplay = document.getElementById("score");
const leaderboard = document.getElementById("leaderboard");
const codeInputContainer = document.querySelector(".code-input-container");
const codeInput = document.getElementById("code-input");
const submitCodeBtn = document.getElementById("submit-code");

const wordList = [
    // Easy level
    {
        word: "html",
        hint:  "acronym for HyperText Markup Language.",
        difficulty: "easy"
    },
    {
        word: "css",
        hint:  "acronym for Cascading Style Sheet.",
        difficulty: "easy"
    },
    {
        word: "div",
        hint:  "HTML element for division or section.",
        difficulty: "easy"
    },
    {
        word: "header",
        hint:  "HTML element representing introductory content.",
        difficulty: "easy"
    },
    {
        word: "footer",
        hint:  "HTML element representing the footer of a document.",
        difficulty: "easy"
    },
    // Medium level
    {
        word: "span",
        hint:  "HTML inline container for text.",
        difficulty: "medium"
    },
    {
        word: "strong",
        hint:  "used to define important text.",
        difficulty: "medium"
    },
    {
        word: "audio",
        hint:  "used for playing audio files.",
        difficulty: "medium"
    },
    // Hard words (with code lines)
    {
        word: "callback",
        hint:  "a function passed into another function as an argument to be executed later.",
        difficulty: "hard"
    },
    {
        word: "promise",
        hint:  "an object representing the eventual completion or failure of an asynchronous operation.",
        difficulty: "hard"
    },
    {
        word: "closure",
        hint:  "a feature in JavaScript where an inner function has access to the outer (enclosing) function’s variables.",
        difficulty: "hard"
    },
    {
        word: "recursion",
        hint:  "the process in which a function calls itself directly or indirectly.",
        difficulty: "hard"
    },
    {
        word: "prototype",
        hint:  "an object from which other objects inherit properties in JavaScript.",
        difficulty: "hard"
    },
    // Code lines
    {
        word: "console.log('Hello, world!')",
        hint:  "how do we print the phrase 'Hello, world!'?",
        difficulty: "hard"
    },
    {
        word: "let myVariable = 10;",
        hint:  "declares a variable.",
        difficulty: "hard"
    },
    {
        word: "let promise = new;",
        hint:  "creating a new Promise in JavaScript.",
        difficulty: "hard"
    },
    {
        word: "<button>Click Me</button>",
        hint:  "how do we create buttons?",
        difficulty: "hard"
    },
    {
        word: "<p>This is a paragraph.</p>",
        hint:  "Createing a paragraph.",
        difficulty: "hard"
    }
];

let currentWord, correctLetters, wrongGuessCount;
let maxGuesses;
let score = 0;
let currentQuestionIndex = 0;
const totalQuestions = 10;
const difficultySettings = {
    easy: 6,
    medium: 6,
    hard: 6
};

const resetGame = () => {
    correctLetters = [];
    wrongGuessCount = 0;
    hangmanImage.src = `hangman-${wrongGuessCount}.svg`;
    guessesText.innerText = `${wrongGuessCount} / ${maxGuesses}`;
    keyboardDiv.querySelectorAll("button").forEach(btn => btn.disabled = false);
    gameModal.classList.remove("show");
    codeInputContainer.style.display = 'none';
    codeInput.value = '';
}

const getRandomWord = () => {
    const selectedDifficulty = difficultySelect.value;
    const filteredWords = wordList.filter(word => word.difficulty === selectedDifficulty);
    const { word, hint } = filteredWords[Math.floor(Math.random() * filteredWords.length)];
    currentWord = word;
    maxGuesses = difficultySettings[selectedDifficulty];
    document.querySelector(".hint-text b").innerText = hint;
    resetGame();
    wordDisplay.innerHTML = word.split("").map(() => `<li class="letter">`).join("");
    if (selectedDifficulty === 'hard' && word.includes(' ')) {
        codeInputContainer.style.display = 'block';
        keyboardDiv.style.display = 'none';
        wordDisplay.style.display = 'none';
    } else {
        codeInputContainer.style.display = 'none';
        keyboardDiv.style.display = 'flex';
        wordDisplay.style.display = 'flex';
        wordDisplay.innerHTML = word.split("").map(() => `<li class="letter">`).join("");
    }
}

const gameOver = (isVictory) => {
    setTimeout(() => {
        const modalText = isVictory ? `You found the word:` : `The correct word was:`;
        if (isVictory) {
            score += 10; // Increase score by 10 for each correct word
        }
        gameModal.querySelector("img").src = `${isVictory ? 'victory' : 'lost'}.gif`;
        gameModal.querySelector("h4").innerText = `${isVictory ? 'Congrats!' : 'Game Over!'}`;
        gameModal.querySelector("p").innerHTML = `${modalText} <b>${currentWord}</b>`;
        gameModal.classList.add("show");
        scoreDisplay.innerText = score;

        if (currentQuestionIndex < totalQuestions - 1 && isVictory) {
            currentQuestionIndex++;
            getRandomWord();
        } else {
            updateLeaderboard();
            score = 0; // Reset the score after updating the leaderboard
            scoreDisplay.innerText = score;
            currentQuestionIndex = 0; // Reset the question index for a new game
        }
    }, 300);
}

const updateLeaderboard = () => {
    const playerName = prompt('Enter your name for the leaderboard:');
    const leaderboardEntry = document.createElement('li');
    leaderboardEntry.textContent = `${playerName}: ${score}`;
    leaderboard.appendChild(leaderboardEntry);

    // Save leaderboard to localStorage
    saveLeaderboard();

    // Sort the leaderboard entries
    const leaderboardEntries = Array.from(leaderboard.querySelectorAll('li'));
    leaderboardEntries.sort((a, b) => {
        const scoreA = parseInt(a.textContent.split(': ')[1]);
        const scoreB = parseInt(b.textContent.split(': ')[1]);
        return scoreB - scoreA;
    });

    // Clear the leaderboard and add the sorted entries
    leaderboard.innerHTML = '';
    leaderboardEntries.forEach(entry => leaderboard.appendChild(entry));
}

const saveLeaderboard = () => {
    const leaderboardEntries = Array.from(leaderboard.querySelectorAll('li')).map(entry => entry.textContent);
    localStorage.setItem('leaderboard', JSON.stringify(leaderboardEntries));
}

const loadLeaderboard = () => {
    const savedLeaderboard = JSON.parse(localStorage.getItem('leaderboard'));
    if (savedLeaderboard) {
        savedLeaderboard.forEach(entry => {
            const leaderboardEntry = document.createElement('li');
            leaderboardEntry.textContent = entry;
            leaderboard.appendChild(leaderboardEntry);
        });
    }
}

const initGame = (button, clickedLetter) => {
    if (currentWord.includes(clickedLetter)) {
        [...currentWord].forEach((letter, index) => {
            if (letter === clickedLetter) {
                correctLetters.push(letter);
                wordDisplay.querySelectorAll("li")[index].innerText = letter;
                wordDisplay.querySelectorAll("li")[index].classList.add("guessed");
            }
        })
    } else {
        wrongGuessCount++;
        hangmanImage.src = `hangman-${wrongGuessCount}.svg`;
    }
    button.disabled = true;
    guessesText.innerText = `${wrongGuessCount} / ${maxGuesses}`;

    if (wrongGuessCount === maxGuesses) return gameOver(false);
    if (correctLetters.length === currentWord.length) return gameOver(true);
}

for (let i = 97; i <= 122; i++) {
    const button = document.createElement("button");
    button.innerText = String.fromCharCode(i);
    keyboardDiv.appendChild(button);
    button.addEventListener("click", e => initGame(e.target, String.fromCharCode(i)));
}

submitCodeBtn.addEventListener("click", () => {
    const enteredCode = codeInput.value.trim();
    if (enteredCode === currentWord) {
        gameOver(true);
    } else {
        wrongGuessCount++;
        hangmanImage.src = `hangman-${wrongGuessCount}.svg`;
        guessesText.innerText = `${wrongGuessCount} / ${maxGuesses}`;
        if (wrongGuessCount === maxGuesses) return gameOver(false);
    }
});

// Load the leaderboard when the game starts
loadLeaderboard();

getRandomWord();
playAgainBtn.addEventListener("click", getRandomWord);
difficultySelect.addEventListener("change", getRandomWord);