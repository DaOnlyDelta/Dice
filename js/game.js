(() => {
    const game = document.getElementById('game');
    let selected = 0;

    function layoutPlayers() {
        const players = Array.from(game.querySelectorAll('.player-box'));
        const first = players[0];
        const nDice = first.querySelectorAll('.dice-box').length;
        void nDice;

        // Use layout width (not affected by transform scaling).
        const cardWidthPx = first.offsetWidth;
        const gapPx = window.innerHeight * 0.02; // 2vh
        const centerX = game.clientWidth / 2;

        players.forEach((player, index) => {
            player.style.right = 'auto';
            player.style.left = `${centerX - cardWidthPx / 2 + (index - selected) * (cardWidthPx + gapPx)}px`;
            player.style.transform = (index === selected) ? 'scale(1)' : 'scale(0.8)';
            player.style.zIndex = String(100 - Math.abs(index - selected));

            const isSelected = index === selected;
            player.querySelectorAll('button').forEach((btn) => {
                btn.disabled = !isSelected;
            });
        });
    }

    // If you click a button on a non-selected card, select the card first.
    // (Prevents rolling dice on an unselected player.)
    game.addEventListener('click', (e) => {
        if (e.target && e.target.tagName === 'BUTTON') {
            const players = Array.from(game.querySelectorAll('.player-box'));
            const owner = e.target.closest('.player-box');
            const ownerIndex = players.indexOf(owner);

            if (ownerIndex !== -1 && ownerIndex !== selected) {
                e.preventDefault();
                e.stopPropagation();
                selected = ownerIndex;
                layoutSoon();
            }
            return;
        }

        const players = Array.from(game.querySelectorAll('.player-box'));
        const clicked = e.target.closest('.player-box');
        const clickedIndex = players.indexOf(clicked);

        if (clickedIndex === -1) return;
        selected = clickedIndex;
        layoutSoon();
    });

    function layoutSoon() {
        requestAnimationFrame(layoutPlayers);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', layoutSoon);
    } else {
        layoutSoon();
    }

    window.addEventListener('resize', layoutSoon);
})();
