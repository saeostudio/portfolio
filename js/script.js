document.addEventListener('DOMContentLoaded', () => {

    // --- Custom Cursor Logic ---
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');

    if (cursorDot && cursorOutline) {
        window.addEventListener('mousemove', (e) => {
            const posX = e.clientX;
            const posY = e.clientY;

            // Dot follows instantly
            cursorDot.style.left = `${posX}px`;
            cursorDot.style.top = `${posY}px`;

            // Outline follows with slight delay (animation in CSS keyframes or just standard transform transition)
            // Using animate for smooth trailing
            cursorOutline.animate({
                left: `${posX}px`,
                top: `${posY}px`
            }, { duration: 500, fill: "forwards" });
        });

        // Hover Effect on clickable elements
        const clickables = document.querySelectorAll('a, .menu-toggle, .menu-close, .draggable-item');
        clickables.forEach(el => {
            el.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
            el.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));
        });
    }

    // --- Menu Toggle Logic ---
    const menuToggle = document.getElementById('menuToggle');
    const menuClose = document.getElementById('menuClose');
    const menuOverlay = document.getElementById('menuOverlay');

    if (menuToggle && menuOverlay) {
        menuToggle.addEventListener('click', () => {
            menuOverlay.classList.add('active');
        });

        menuClose.addEventListener('click', () => {
            menuOverlay.classList.remove('active');
        });
    }

    // --- Draggable Logic (Homepage) ---
    const deskContainer = document.getElementById('deskContainer');
    if (deskContainer) {
        let activeItem = null;
        let initialX, initialY, currentX, currentY;
        let xOffset = 0, yOffset = 0;

        // Select all draggable items
        const draggables = document.querySelectorAll('.draggable-item');

        draggables.forEach(item => {
            item.addEventListener('mousedown', dragStart);
        });

        document.addEventListener('mouseup', dragEnd);
        document.addEventListener('mousemove', drag);

        function dragStart(e) {
            activeItem = e.currentTarget; // The item we clicked

            // Get current transform values to maintain position
            const style = window.getComputedStyle(activeItem);
            const matrix = new WebKitCSSMatrix(style.transform);

            // We need to calculate offset relative to the item's current position
            // But simplify: just use client rects for offset
            const rect = activeItem.getBoundingClientRect();

            initialX = e.clientX - rect.left;
            initialY = e.clientY - rect.top;

            // Bring to front
            activeItem.style.zIndex = 1000;
        }

        function dragEnd(e) {
            if (activeItem) {
                activeItem.style.zIndex = ""; // Reset z-index or keep it high?
                activeItem = null;
            }
        }

        function drag(e) {
            if (activeItem) {
                e.preventDefault();

                // Calculate new position relative to container
                const x = e.clientX - initialX;
                const y = e.clientY - initialY;

                activeItem.style.left = `${x}px`;
                activeItem.style.top = `${y}px`;
                // Remove transform centering if we set left/top directly
                // But initial CSS uses transform for rotation, so we need to keep rotation!
                // Let's just update left/top and rely on existing transform rotate.
                // However, the initial CSS has some items positioned with percentages.
                // Once we drag, we switch to pixels.
            }
        }
    }

    // --- Stamp / Sticker Feature (Homepage Easter Egg) ---
    if (deskContainer) {
        deskContainer.addEventListener('click', (e) => {
            // Prevent stamping if clicking on a draggable or header
            if (e.target.closest('.draggable-item') || e.target.closest('header')) return;

            const stickers = ['★', '✿', '☺', '✸', '✦', '👁️', '✨'];
            const sticker = stickers[Math.floor(Math.random() * stickers.length)];

            const el = document.createElement('div');
            el.classList.add('stamp');
            el.innerText = sticker;
            el.style.left = `${e.clientX}px`;
            el.style.top = `${e.clientY}px`;
            // Random color
            const colors = ['#ff0000', '#0000ff', '#00ff00', '#ff00ff', '#000000'];
            el.style.color = colors[Math.floor(Math.random() * colors.length)];

            deskContainer.appendChild(el);

            // Cleanup after animation
            setTimeout(() => {
                el.remove();
            }, 2000);
        });
    }

    // --- Hover Reveal Logic (List Pages) ---
    const listItems = document.querySelectorAll('.list-item');
    const revealImg = document.getElementById('hoverRevealImg');

    if (listItems.length > 0 && revealImg) {
        window.addEventListener('mousemove', (e) => {
            // Move the reveal image with cursor
            // Add slight offset so it doesn't block cursor
            const x = e.clientX + 20;
            const y = e.clientY + 20;

            revealImg.style.left = `${x}px`;
            revealImg.style.top = `${y}px`;

            // Using transform in CSS for smoothness, here just setting left/top or transform
            // Actually, best performance is transform translate
            // But sticky positioning logic above in CSS `transform: translate` needs dynamic values
            // Let's just set left/top on fixed element
            // (CSS has .hover-reveal { position: fixed; ... })
        });

        listItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                const src = item.getAttribute('data-img');
                if (src) {
                    revealImg.src = src;
                    revealImg.style.opacity = 1;
                }
            });

            item.addEventListener('mouseleave', () => {
                revealImg.style.opacity = 0;
            });
        });
    }

});
