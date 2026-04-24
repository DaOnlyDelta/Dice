// PlayersDiv scale animation
const playersDiv = document.getElementById('players');
playersDiv.addEventListener('mouseenter', () => {
    playersDiv.classList.add('mouseIn');
});

playersDiv.addEventListener('mouseleave', () => {
    playersDiv.classList.remove('mouseIn');
});

// Add players
const playerTitle = document.getElementById('playerTitle');
const addPlayerBtn = document.getElementById('addPlayer');
const removePlayerBtn = document.getElementById('removePlayer');
const leftArrow = document.getElementById('leftArrow');
const rightArrow = document.getElementById('rightArrow');
let players = [];
let totalPlayers = 0;
let playersI = 0;
let img = [];
let imgI = 0;
for (let i = 1; i <= 5; i++) {
    img.push(`./img/${i}.png`);
}

addPlayerBtn.addEventListener('click', (e) => {
    e.preventDefault(); // Prevent form from submitting when clicking +
    addPlayer();
});

removePlayerBtn.addEventListener('click', (e) => {
    e.preventDefault();
    players[playersI].remove();
    players.pop();
    playersI--;
    playerTitle.innerHTML = `Player ${playersI + 1}`;
    players[playersI].classList.remove('left');
    totalPlayers--;
    imgI--;
    if (totalPlayers === 1) {
        setButtons(false);
        leftArrow.classList.add('disabled');
    };
});

function addPlayer() {
    const player = document.createElement('div');
    const pfp = document.createElement('img');
    const inputField = document.createElement('input');
    inputField.type = 'text';
    pfp.src = img[imgI % 5];
    imgI++;
    player.appendChild(pfp);
    player.appendChild(inputField);
    if (totalPlayers !== 0) player.classList.add('right');
    playersDiv.appendChild(player);

    players.push(player);
    totalPlayers++;

    // Force a browser reflow so CSS transitions trigger correctly
    // when modifying the newly added player's classes immediately.
    void player.offsetWidth;

    if (totalPlayers > 1) focusAdded();
}

leftArrow.addEventListener('click', (e) => {
    if (leftArrow.classList.contains('disabled')) return;
    playersI--;
    rightArrow.classList.remove('disabled');
    setButtons(false);
    if (playersI === 0) {
        leftArrow.classList.add('disabled');
    }
    focusPlayer(false);
});

rightArrow.addEventListener('click', () => {
    if (rightArrow.classList.contains('disabled')) return;
    playersI++;
    leftArrow.classList.remove('disabled');
    if (playersI === totalPlayers - 1) {
        rightArrow.classList.add('disabled');
        if (totalPlayers > 1) {
            setButtons(true);
        }
    }
    focusPlayer(true);
});

function focusPlayer(direction = null) { // true = right, false = left
    playerTitle.innerHTML = `Player ${playersI + 1}`;
    if (direction) { // true
        players[playersI].classList.remove('right');
        players[playersI - 1].classList.add('left');
    } else {
        players[playersI].classList.remove('left');
        players[playersI + 1].classList.add('right');
    }
    players[playersI].querySelector('input').focus({ preventScroll: true });
}

// Cycle trough each player till you reach the new one
function focusAdded() {
    rightArrow.classList.add('disabled');
    leftArrow.classList.remove('disabled');
    players[playersI].classList.add('left');
    playersI++;
    players[playersI].classList.remove('right');
    playerTitle.innerHTML = `Player ${playersI + 1}`;
    const interval = setInterval(() => {
        if (playersI < totalPlayers - 1) {
            players[playersI].classList.add('left');
            playersI++;
            players[playersI].classList.remove('right');
            playerTitle.innerHTML = `Player ${playersI + 1}`;
        } else {
            clearInterval(interval);
            players[playersI].querySelector('input').focus({ preventScroll: true });
            setButtons(true);
        }
    }, 250);
}

function setButtons(active) {
    if (active) {
        removePlayerBtn.classList.add('active');
        addPlayerBtn.classList.add('active');
    } else {
        removePlayerBtn.classList.remove('active');
        addPlayerBtn.classList.remove('active');
    }
}

addPlayer();
