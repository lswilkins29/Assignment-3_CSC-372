/* rock-paper-scissors game logic */

let wins = 0;
let losses = 0;
let ties = 0;
let playerChoice = null;
let computerInterval = null;

const choices = [
    { name: 'rock', src: 'images/rock.PNG' },
    { name: 'paper', src: 'images/paper.PNG' },
    { name: 'scissors', src: 'images/scissors.PNG' }
];

function $(id) {
    return document.getElementById(id);
}

function updateScoreDisplay() {
    $('wins').textContent = wins;
    $('losses').textContent = losses;
    $('ties').textContent = ties;
}

function clearSelections() {
    document.querySelectorAll('#player-choices img').forEach(img => img.classList.remove('selected'));
}

function decideWinner() {
    const comp = $('computer-throw').dataset.choice;
    const player = playerChoice;
    let result;

    if (player === comp) {
        ties++;
        result = 'It\'s a tie!';
    } else if (
        (player === 'rock' && comp === 'scissors') ||
        (player === 'paper' && comp === 'rock') ||
        (player === 'scissors' && comp === 'paper')
    ) {
        wins++;
        result = 'You win!';
    } else {
        losses++;
        result = 'Computer wins.';
    }

    $('outcome').textContent = result;
    updateScoreDisplay();
}

function startComputerThrow() {
    const display = $('computer-throw');
    let elapsed = 0;

    // shuffle every 500ms
    computerInterval = setInterval(() => {
        const rnd = choices[Math.floor(Math.random() * choices.length)];
        display.src = rnd.src;
        display.dataset.choice = rnd.name;
        elapsed += 500;
        if (elapsed >= 3000) {
            clearInterval(computerInterval);
            computerInterval = null;
            // final choice ensures already in dataset
            decideWinner();
        }
    }, 500);
}

function onPlayerClick(event) {
    if (computerInterval) {
        // ignore clicks during computer thinking
        return;
    }

    const img = event.currentTarget;
    playerChoice = img.dataset.choice;
    clearSelections();
    img.classList.add('selected');
    // reset outcome text until computer decides
    $('outcome').textContent = 'Computer is choosing...';
    // start computer's turn
    startComputerThrow();
}

function resetGame() {
    wins = losses = ties = 0;
    updateScoreDisplay();
    clearSelections();
    $('computer-throw').src = 'images/question-mark.PNG';
    $('computer-throw').removeAttribute('data-choice');
    $('outcome').textContent = 'Make your choice to start the game.';
    playerChoice = null;
    if (computerInterval) {
        clearInterval(computerInterval);
        computerInterval = null;
    }
}

function init() {
    // wire up player choices
    document.querySelectorAll('#player-choices img').forEach(img => {
        img.addEventListener('click', onPlayerClick);
    });

    $('reset-btn').addEventListener('click', resetGame);

    // initialize display
    resetGame();
}

document.addEventListener('DOMContentLoaded', init);
