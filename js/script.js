document.addEventListener('DOMContentLoaded', () => {

    // --- Custom Cursor Logic ---
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');

    if (cursorDot && cursorOutline) {
        window.addEventListener('mousemove', (e) => {
            const posX = e.clientX;
            const posY = e.clientY;

            cursorDot.style.left = `${posX}px`;
            cursorDot.style.top = `${posY}px`;

            cursorOutline.animate({
                left: `${posX}px`,
                top: `${posY}px`
            }, { duration: 500, fill: "forwards" });
        });

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
        let startX, startY; // To detect click vs drag

        const draggables = document.querySelectorAll('.draggable-item');

        draggables.forEach(item => {
            item.addEventListener('mousedown', dragStart);
            item.addEventListener('touchstart', dragStart, {passive: false});
        });

        document.addEventListener('mouseup', dragEnd);
        document.addEventListener('touchend', dragEnd);
        document.addEventListener('mousemove', drag);
        document.addEventListener('touchmove', drag, {passive: false});

        function dragStart(e) {
            // Check if touch or mouse
            const clientX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
            const clientY = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY;

            activeItem = e.currentTarget;
            startX = clientX;
            startY = clientY;

            const rect = activeItem.getBoundingClientRect();
            initialX = clientX - rect.left;
            initialY = clientY - rect.top;

            activeItem.style.zIndex = 1000;
        }

        function dragEnd(e) {
            if (!activeItem) return;

            // Detect Click vs Drag
            // If it's a touch event, changedTouches might be needed, but we rely on the last move pos or just compare start
            // Actually, for mouseup, we can use clientX if available, or just track if we moved.

            // Let's use a flag or distance check.
            // But we need the final coordinate.
            // Simpler: Determine if we moved significantly during the drag phase.
            // We can check the item's current position vs start, or just use a `isDragging` flag set in `drag()`.

            // However, distinguishing click requires us to know where we ended up.
            // Since `drag` updates the style, we can check.
            // OR better: calculate distance from startX/startY.

            // For mouseup, e.clientX exists. For touchend, it doesn't.
            // Let's rely on a global `hasMoved` flag.

            activeItem.style.zIndex = "";
            activeItem = null;
        }

        let hasMoved = false;

        function drag(e) {
            if (activeItem) {
                e.preventDefault();

                const clientX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
                const clientY = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY;

                // Calculate distance to determine "Moved" status
                const dist = Math.hypot(clientX - startX, clientY - startY);
                if (dist > 5) {
                    hasMoved = true;
                } else {
                    hasMoved = false;
                }

                const x = clientX - initialX;
                const y = clientY - initialY;

                activeItem.style.left = `${x}px`;
                activeItem.style.top = `${y}px`;
            }
        }

        // Handle Link Navigation on Click
        draggables.forEach(item => {
            item.addEventListener('click', (e) => {
                if (hasMoved) {
                    e.preventDefault(); // Prevent link if dragged
                    hasMoved = false; // Reset
                } else {
                    // It's a click!
                    const link = item.getAttribute('data-link');
                    if (link) {
                        window.location.href = link;
                    }
                }
            });
            // Touch devices often fire click after touchend, but not always if preventDefault is called in touchmove.
            // If we called preventDefault in touchmove (we did), click might not fire on some devices.
            // We need to manually handle navigation for touch if it was a tap.

            item.addEventListener('touchend', (e) => {
                // If we didn't move (tap), we should navigate.
                // Note: dragEnd runs before this listener usually if attached to document, but here it's on item.
                // Wait, I attached dragEnd to document.

                // Let's handle tap logic inside this listener or a unified handler.
                // If hasMoved is false, treat as click.
                if (!hasMoved) {
                    const link = item.getAttribute('data-link');
                    if (link) {
                        window.location.href = link;
                    }
                }
                hasMoved = false; // Reset
            });
        });
    }

    // --- Stamp / Sticker Feature ---
    if (deskContainer) {
        deskContainer.addEventListener('click', (e) => {
            if (e.target.closest('.draggable-item') || e.target.closest('header')) return;

            const stickers = ['★', '✿', '☺', '✸', '✦', '👁️', '✨'];
            const sticker = stickers[Math.floor(Math.random() * stickers.length)];

            const el = document.createElement('div');
            el.classList.add('stamp');
            el.innerText = sticker;
            el.style.left = `${e.clientX}px`;
            el.style.top = `${e.clientY}px`;
            const colors = ['#ff0000', '#0000ff', '#00ff00', '#ff00ff', '#000000'];
            el.style.color = colors[Math.floor(Math.random() * colors.length)];

            deskContainer.appendChild(el);

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
            const x = e.clientX + 20;
            const y = e.clientY + 20;

            revealImg.style.left = `${x}px`;
            revealImg.style.top = `${y}px`;
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
