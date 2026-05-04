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
    const stop = document.getElementById('stop');
    const list = document.getElementById('resultsList');
    const arrowUp = document.getElementById('scrollArrowUp');
    const arrowDown = document.getElementById('scrollArrowDown');

    // ===== Navigation =====
    home.addEventListener('click', () => {
        window.location.href = 'http://localhost/Dice/index.html';
    });

    stop.addEventListener('click', () => {
        stopped = true;
        clearInterval(timer);
        stop.style.display = 'none';
        home.innerHTML = 'Return';
        home.style.width = '18vh';
    });

    let mouseInside = false;
    let stopped = false;
    let counter = 10;
    const timer = setInterval(() => {
            if (counter === 0) {
                window.location.href = 'http://localhost/Dice/index.html';
                return;
            }
            counter--;
            if (!mouseInside) {
                home.innerHTML = `Returning.. ${counter}`;
            }
        }, 1000);

    home.addEventListener('mouseenter', () => {
        if (stopped) return;
        home.innerHTML = 'Return now?';
        mouseInside = true;
    });

    home.addEventListener('mouseleave', () => {
        if (stopped) return;
        mouseInside = false;
        home.innerHTML = `Returning.. ${counter}`;
    });

    // ===== Helpers =====
    const getStep = () => {
        // One scroll step = one row height + the CSS row gap.
        const row = list.querySelector('.result-row');
        const gap = parseFloat(getComputedStyle(list).rowGap || '0') || 0;
        return row.offsetHeight + gap;
    };

    const getPadTop = () => {
        const styles = getComputedStyle(list);
        return parseFloat(styles.paddingTop || '0') || 0;
    };

    const scrollOneRow = (dir) => {
        // dir: -1 (up) or +1 (down)
        const step = getStep();
        const padTop = getPadTop();
        const maxScrollTop = Math.max(0, list.scrollHeight - list.clientHeight);

        // Snap to the nearest row boundary, then move exactly one.
        const normalized = Math.max(0, list.scrollTop - padTop);
        const index = Math.round(normalized / step);
        const target = Math.max(0, Math.min(maxScrollTop, padTop + ((index + dir) * step)));

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

        // Determine top/bottom based on what the user can actually see.
        // This avoids edge cases where scroll snapping prevents reaching maxScrollTop.
        const rows = list.querySelectorAll('.result-row');
        if (rows.length === 0) {
            arrowUp.style.opacity = '0';
            arrowDown.style.opacity = '0';
            return;
        }

        const eps = 1;
        const listRect = list.getBoundingClientRect();
        const firstRect = rows[0].getBoundingClientRect();
        const lastRect = rows[rows.length - 1].getBoundingClientRect();

        const atTop = firstRect.top >= (listRect.top - eps);
        const atBottom = lastRect.bottom <= (listRect.bottom + eps);

        arrowUp.style.opacity = atTop ? '0' : '1';
        arrowUp.style.pointerEvents = atTop ? 'none' : 'auto';

        arrowDown.style.opacity = atBottom ? '0' : '1';
        arrowDown.style.pointerEvents = atBottom ? 'none' : 'auto';
    };

    // ===== Events =====
    arrowUp.addEventListener('click', () => scrollOneRow(-1));
    arrowDown.addEventListener('click', () => scrollOneRow(1));

    // Force wheel scrolling to move exactly one row per gesture.
    // This makes scrolling deterministic regardless of OS/browser scroll settings.
    let wheelAccum = 0;
    let wheelLocked = false;
    let wheelResetTimer = null;
    const WHEEL_THRESHOLD = 30;

    list.addEventListener('wheel', (e) => {
        e.preventDefault();

        if (wheelLocked) return;
        wheelAccum += e.deltaY;

        if (wheelResetTimer) {
            clearTimeout(wheelResetTimer);
        }
        wheelResetTimer = setTimeout(() => {
            wheelAccum = 0;
            wheelResetTimer = null;
        }, 140);

        if (Math.abs(wheelAccum) < WHEEL_THRESHOLD) return;

        const dir = wheelAccum > 0 ? 1 : -1;
        wheelAccum = 0;
        wheelLocked = true;
        scrollOneRow(dir);
        setTimeout(() => {
            wheelLocked = false;
        }, 260);
    }, { passive: false });

    list.addEventListener('scroll', syncArrows, { passive: true });
    window.addEventListener('resize', syncArrows);

    // ===== Init =====
    syncArrows();
})();
