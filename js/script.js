// PlayersDiv scale animation
const playersDiv = document.getElementById('players');
playersDiv.addEventListener('mouseenter', () => {
    playersDiv.classList.add('mouseIn');
});

playersDiv.addEventListener('mouseleave', () => {
    playersDiv.classList.remove('mouseIn');
});

// Add players
const addPlayerBtn = document.getElementById('addPlayer');
const leftArrow = document.getElementById('leftArrow');
const rightArrow = document.getElementById('rightArrow');
const img = [];
let imgI = 0;
for (let i = 1; i <= 5; i++) {
    img.push(`./img/${i}.png`);
}

addPlayerBtn.addEventListener('click', (e) => {
    e.preventDefault(); // Prevent form from submitting when clicking +
    addPlayer();
});

function addPlayer() {
    const player = document.createElement('div');
    const pfp = document.createElement('img');
    pfp.src = img[imgI % 5];
    imgI++;
    player.appendChild(pfp);
    playersDiv.appendChild(player);
}

leftArrow.addEventListener('click', () => {

});

rightArrow.addEventListener('click', () => {

});
