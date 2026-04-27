/**
 * Results page behavior
 *
 * Responsibilities:
 * - Home button: navigate back to the main menu
 * - Scroll arrows: scroll the leaderboard by exactly 1 row per click
 * - Arrow visibility: hide/disable arrows at the top/bottom (and if not scrollable)
 *
 * Notes:
 * - This file assumes it is only loaded on php/result.php where the required DOM exists.
 * - The list uses CSS scroll snapping; JS scrolls to the nearest row boundary.
 */
(() => {
    'use strict';

    // ===== Elements =====
    const home = document.getElementById('home');
    const list = document.getElementById('resultsList');
    const arrowUp = document.getElementById('scrollArrowUp');
    const arrowDown = document.getElementById('scrollArrowDown');

    // ===== Navigation =====
    home.addEventListener('click', () => {
        window.location.href = 'http://localhost/Dice/index.html';
    });

    // ===== Helpers =====
    const getStep = () => {
        // One scroll step = one row height + the CSS row gap.
        const row = list.querySelector('.result-row');
        const gap = parseFloat(getComputedStyle(list).rowGap || '0') || 0;
        return row.offsetHeight + gap;
    };

    const scrollOneRow = (dir) => {
        // dir: -1 (up) or +1 (down)
        const step = getStep();
        const maxScrollTop = Math.max(0, list.scrollHeight - list.clientHeight);

        // Snap to the nearest row boundary, then move exactly one.
        const index = Math.round(list.scrollTop / step);
        const target = Math.max(0, Math.min(maxScrollTop, (index + dir) * step));

        list.scrollTo({ top: target, behavior: 'smooth' });
    };

    const syncArrows = () => {
        // Hide arrows entirely if the list can't scroll.
        const canScroll = list.scrollHeight > list.clientHeight + 1;
        if (!canScroll) {
            arrowUp.style.opacity = '0';
            arrowDown.style.opacity = '0';
            return;
        }

        // Small epsilon avoids flicker due to smooth scroll rounding.
        const eps = 2;
        const atTop = list.scrollTop <= eps;
        const atBottom = list.scrollTop >= (list.scrollHeight - list.clientHeight - eps);

        arrowUp.style.opacity = atTop ? '0' : '1';
        arrowUp.style.pointerEvents = atTop ? 'none' : 'auto';

        arrowDown.style.opacity = atBottom ? '0' : '1';
        arrowDown.style.pointerEvents = atBottom ? 'none' : 'auto';
    };

    // ===== Events =====
    arrowUp.addEventListener('click', () => scrollOneRow(-1));
    arrowDown.addEventListener('click', () => scrollOneRow(1));

    list.addEventListener('scroll', syncArrows, { passive: true });
    window.addEventListener('resize', syncArrows);

    // ===== Init =====
    syncArrows();
})();
