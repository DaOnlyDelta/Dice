/**
 * Results page behavior
 *
 * Responsibilities:
 * - Home button: navigate back to the main menu
 *
 * Notes:
 * - This file assumes it is only loaded on php/result.php where the required DOM exists.
 */
(() => {
    'use strict';

    // ===== Elements =====
    const home = document.getElementById('home');
    const stop = document.getElementById('stop');

    // ===== Navigation =====
    home.addEventListener('click', () => {
        window.location.href = '../index.html';
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
                window.location.href = '../index.html';
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

    // ===== Fireworks =====
    function triggerFireworks() {
        if (typeof confetti !== 'function') return;

        const duration = 5 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        function randomInRange(min, max) {
            return Math.random() * (max - min) + min;
        }

        const interval = setInterval(function() {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            // Since particles fall down, start a bit higher than random
            confetti(Object.assign({}, defaults, {
                particleCount,
                origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
            }));
            confetti(Object.assign({}, defaults, {
                particleCount,
                origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
            }));
        }, 250);
    }

    // Start fireworks on load
    triggerFireworks();
})();
