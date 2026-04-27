/**
 * Game page behavior (rolling dice)
 *
 * Responsibilities:
 * - Draw dice faces on <canvas>
 * - Handle per-die roll and per-player "Roll All / Reset"
 * - Track which player card is selected; only selected player can roll
 * - Write rolled values into hidden inputs (submitted to php/result.php)
 *
 * Notes:
 * - Unrolled dice keep the hidden input empty (""), and are displayed as face 0 (blank).
 * - Rolled dice values are 1–6 and are stored in the hidden input.
 */
(() => {
    const game = document.getElementById('game');
    let selected = 0;

    // ===== Visual tuning =====
    const SELECTED_SCALE = 1;
    const UNSELECTED_SCALE = 0.9;

    // ===== Dice face definitions =====
    // 0 is a "blank" face used for the default/unrolled state.
    const FACE_PIPS = {
        0: [],
        1: [[1, 1]],
        2: [[0, 0], [2, 2]],
        3: [[0, 0], [1, 1], [2, 2]],
        4: [[0, 0], [2, 0], [0, 2], [2, 2]],
        5: [[0, 0], [2, 0], [1, 1], [0, 2], [2, 2]],
        6: [[0, 0], [0, 1], [0, 2], [2, 0], [2, 1], [2, 2]],
    };

    /** Returns the hidden result input inside a dice box. */
    function getResultInput(diceBox) {
        return diceBox?.querySelector?.('input.die-result') || null;
    }

    /** True if a die has been rolled already (either via dataset or input value). */
    function isDiceRolled(diceBox) {
        if (diceBox?.dataset?.rolled === '1') return true;
        const input = getResultInput(diceBox);
        return Boolean(input && String(input.value).trim() !== '');
    }

    /** Marks a die as rolled/unrolled and toggles the visual state for its button. */
    function setDiceRolled(diceBox, rolled) {
        diceBox.dataset.rolled = rolled ? '1' : '0';
        const btn = diceBox.querySelector('button');
        btn.classList.toggle('rolled', Boolean(rolled));
    }

    /** Updates the "Roll All" button to become "Reset" when all dice are rolled. */
    function updateRollAllButton(playerBox) {
        const rollAllBtn = playerBox.querySelector(':scope > .rollAll');

        const diceBoxes = Array.from(playerBox.querySelectorAll('.dice-box'));
        const allRolled = diceBoxes.length > 0 && diceBoxes.every((db) => isDiceRolled(db));

        if (allRolled) {
            rollAllBtn.classList.add('reset');
            rollAllBtn.textContent = 'Reset';
        } else {
            rollAllBtn.classList.remove('reset');
            rollAllBtn.textContent = 'Roll All';
        }
    }

    function redrawPlayerDice(playerBox) {
        playerBox.querySelectorAll('.dice-box canvas').forEach((canvas) => {
            const face = Number(canvas.dataset.face || '0');
            drawDieFace(canvas, Number.isFinite(face) ? face : 0);
        });
    }

    /**
     * Resets all dice for one player:
     * - clears hidden inputs
     * - sets blank face (0)
     * - re-enables rolling based on current selection
     */
    function resetPlayer(playerBox) {
        playerBox.querySelectorAll('.dice-box').forEach((diceBox) => {
            const canvas = diceBox.querySelector('canvas');
            const btn = diceBox.querySelector('button');
            const input = getResultInput(diceBox);

            diceBox.dataset.rolling = '0';
            if (input) input.value = '';
            setDiceRolled(diceBox, false);

            if (canvas) {
                canvas.dataset.face = '0';
                drawDieFace(canvas, 0);
            }

            // Re-enable only if this player is currently selected; layoutPlayers() will enforce this.
            if (btn) {
                btn.disabled = false;
            }
        });

        updateRollAllButton(playerBox);
        layoutPlayers();
        redrawPlayerDice(playerBox);
    }

    function resizeCanvasToDisplaySize(canvas) {
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        const width = Math.max(1, Math.round(rect.width * dpr));
        const height = Math.max(1, Math.round(rect.height * dpr));
        if (canvas.width !== width || canvas.height !== height) {
            canvas.width = width;
            canvas.height = height;
            return true;
        }
        return false;
    }

    function roundedRectPath(ctx, x, y, w, h, r) {
        const radius = Math.min(r, w / 2, h / 2);
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.arcTo(x + w, y, x + w, y + h, radius);
        ctx.arcTo(x + w, y + h, x, y + h, radius);
        ctx.arcTo(x, y + h, x, y, radius);
        ctx.arcTo(x, y, x + w, y, radius);
        ctx.closePath();
    }

    function drawDieFace(canvas, face) {
        resizeCanvasToDisplaySize(canvas);
        const ctx = canvas.getContext('2d');
        const dpr = window.devicePixelRatio || 1;
        const w = canvas.width;
        const h = canvas.height;

        ctx.clearRect(0, 0, w, h);

        const dieFill = '#62aec5';
        const dieStroke = 'rgba(0, 0, 0, 0.18)';
        const pipFill = '#ffffff';
        const shadow = 'rgba(0, 0, 0, 0.12)';

        // Leave some bottom space so the Roll button doesn't overlap the die visually.
        const padding = Math.round(0.10 * Math.min(w, h));
        const bottomReserve = Math.round(0.22 * h);

        const availW = w - padding * 2;
        const availH = h - padding * 2 - bottomReserve;
        const size = Math.max(1, Math.min(availW, availH));
        const x = Math.round((w - size) / 2);
        const y = Math.round(padding);
        const radius = Math.round(0.12 * size);

        // Die shadow.
        ctx.save();
        ctx.fillStyle = shadow;
        roundedRectPath(ctx, x + Math.round(0.04 * size), y + Math.round(0.05 * size), size, size, radius);
        ctx.fill();
        ctx.restore();

        // Die body.
        ctx.save();
        ctx.fillStyle = dieFill;
        roundedRectPath(ctx, x, y, size, size, radius);
        ctx.fill();
        ctx.lineWidth = Math.max(1, Math.round(2 * dpr));
        ctx.strokeStyle = dieStroke;
        ctx.stroke();
        ctx.restore();

        // Pips.
        const pips = FACE_PIPS[face] ?? FACE_PIPS[0];
        const cell = size / 3;
        const pipRadius = Math.max(1, Math.round(0.18 * cell));

        ctx.save();
        ctx.fillStyle = pipFill;
        pips.forEach(([cx, cy]) => {
            const px = x + (cx + 0.5) * cell;
            const py = y + (cy + 0.5) * cell;
            ctx.beginPath();
            ctx.arc(px, py, pipRadius, 0, Math.PI * 2);
            ctx.fill();
        });
        ctx.restore();

        canvas.dataset.face = String(face);
    }

    /** Draws all dice faces once on page load (or after layout changes). */
    function initDice() {
        if (!game) return;
        game.querySelectorAll('.dice-box canvas').forEach((canvas) => {
            const face = Number(canvas.dataset.face || '0');
            drawDieFace(canvas, Number.isFinite(face) ? face : 0);
        });

        game.querySelectorAll('.player-box').forEach((playerBox) => updateRollAllButton(playerBox));
    }

    function rollOneDiceBox(diceBox, opts = {}) {
        const { durationMs = 850, tickMs = 75 } = opts;
        const canvas = diceBox.querySelector('canvas');
        const btn = diceBox.querySelector('button');
        const input = getResultInput(diceBox);
        if (!canvas || !btn) return;
        if (diceBox.dataset.rolling === '1') return;
        if (isDiceRolled(diceBox)) return;

        diceBox.dataset.rolling = '1';
        btn.disabled = true;

        const start = performance.now();
        let lastFace = 1;
        const timer = setInterval(() => {
            lastFace = 1 + Math.floor(Math.random() * 6);
            drawDieFace(canvas, lastFace);
            if (performance.now() - start >= durationMs) {
                clearInterval(timer);
                diceBox.dataset.rolling = '0';
                if (input) input.value = String(lastFace);

                setDiceRolled(diceBox, true);
                btn.disabled = true;

                const playerBox = diceBox.closest('.player-box');
                updateRollAllButton(playerBox);
            }
        }, tickMs);
    }

    function attachRollHandlers() {
        if (!game) return;

        // Per-die roll.
        game.querySelectorAll('.dice-box > button').forEach((btn) => {
            if (btn.dataset.rollBound === '1') return;
            btn.dataset.rollBound = '1';
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const diceBox = btn.closest('.dice-box');
                if (!diceBox) return;
                rollOneDiceBox(diceBox);
            });
        });

        // Roll all for a player.
        game.querySelectorAll('.player-box > .rollAll').forEach((btn) => {
            if (btn.dataset.rollBound === '1') return;
            btn.dataset.rollBound = '1';
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const playerBox = btn.closest('.player-box');

                if (btn.classList.contains('reset')) {
                    resetPlayer(playerBox);
                    return;
                }

                playerBox.querySelectorAll('.dice-box').forEach((diceBox) => rollOneDiceBox(diceBox));
            });
        });
    }

    function layoutPlayers() {
        const players = Array.from(game.querySelectorAll('.player-box'));
        const first = players[0];
        if (!first) return;

        // Use layout width (not affected by transform scaling).
        const cardWidthPx = first.offsetWidth;
        const gapPx = window.innerHeight * 0.02; // 2vh
        const centerX = game.clientWidth / 2;

        players.forEach((player, index) => {
            const isSelected = index === selected;
            player.style.left = `${centerX - cardWidthPx / 2 + (index - selected) * (cardWidthPx + gapPx)}px`;
            player.style.setProperty('--card-scale', (isSelected) ? String(SELECTED_SCALE) : String(UNSELECTED_SCALE));
            player.style.zIndex = String(100 - Math.abs(index - selected));
            player.style.cursor = (isSelected) ? 'default' : 'pointer';

            // Per-die buttons: disabled if player unselected OR die already rolled OR currently rolling.
            player.querySelectorAll('.dice-box').forEach((diceBox) => {
                const dieBtn = diceBox.querySelector('button');
                setDiceRolled(diceBox, isDiceRolled(diceBox));

                const isRolling = diceBox.dataset.rolling === '1';
                const shouldEnable = isSelected && !isDiceRolled(diceBox) && !isRolling;
                dieBtn.disabled = !shouldEnable;
            });

            // Roll All / Reset: disabled if player unselected.
            const rollAllBtn = player.querySelector(':scope > .rollAll');
            if (rollAllBtn) {
                updateRollAllButton(player);
                rollAllBtn.disabled = !isSelected;
            }

            player.querySelectorAll('div').forEach((div) => {
                div.style.setProperty('--hover-scale', (isSelected) ? String(1.05) : String(1));
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
                layoutPlayers();
            }
            return;
        }

        const players = Array.from(game.querySelectorAll('.player-box'));
        const clicked = e.target.closest('.player-box');
        const clickedIndex = players.indexOf(clicked);

        if (clickedIndex === -1) return;
        selected = clickedIndex;
        layoutPlayers();
    });

    function layoutAndRedrawSoon() {
        requestAnimationFrame(() => {
            layoutPlayers();
            initDice();
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            attachRollHandlers();
            layoutAndRedrawSoon();
        });
    } else {
        attachRollHandlers();
        layoutAndRedrawSoon();
    }

    window.addEventListener('resize', layoutAndRedrawSoon);
})();
