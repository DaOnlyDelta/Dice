// PlayersDiv scale animation
const playersDiv = document.getElementById('players');
playersDiv.addEventListener('mouseenter', () => {
    playersDiv.classList.add('mouseIn');
});

playersDiv.addEventListener('mouseleave', () => {
    playersDiv.classList.remove('mouseIn');
});

// Add players
const addPlayers = document.getElementById('addPlayers');
const leftArrow = document.getElementById('leftArrow');
const rightArrow = document.getElementById('rightArrow');

addPlayers.addEventListener('click', () => {
    const player = document.createElement('div');
    
    playersDiv.appendChild(player);
});

leftArrow.addEventListener('click', () => {

});

rightArrow.addEventListener('click', () => {

});
