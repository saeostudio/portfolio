document.addEventListener('DOMContentLoaded', () => {

    // --- Custom Cursor Logic ---
    const cursorDot = document.querySelector('.cursor-dot');

    if (cursorDot) {
        window.addEventListener('mousemove', (e) => {
            const posX = e.clientX;
            const posY = e.clientY;

            // Simple direct movement
            cursorDot.style.left = `${posX}px`;
            cursorDot.style.top = `${posY}px`;
        });

        // Add hover effect trigger to body (optional, mostly for legacy CSS if any left)
        // But since we removed outline, we might not need body.hovering except if we want the dot to change.
        // Let's keep the dot simple as requested.
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

    // --- Stamp / Sticker Feature (Kept as Easter Egg) ---
    const deskContainer = document.getElementById('deskContainer');
    if (deskContainer) {
        deskContainer.addEventListener('click', (e) => {
            // Prevent stamp if clicking on a category item (which is now an anchor) or header
            if (e.target.closest('a') || e.target.closest('header')) return;

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
    // If on a subpage that has list items, we might want to follow the cursor with an image.
    // The previous CSS handled opacity. We just need to move the reveal image if it exists.
    // Note: The previous code assumed a single #hoverRevealImg element exists, but the HTML generation for subpages isn't visible here.
    // Assuming standard list page structure involves `data-img` on list items.

    // Let's create the hoverRevealImg dynamically if it doesn't exist but list items do?
    // Or assume the subpages have it.
    // Since I can't see subpages right now, I'll keep the logic generic.

    const listItems = document.querySelectorAll('.list-item');
    let revealImg = document.getElementById('hoverRevealImg');

    if (listItems.length > 0) {
        // Create reveal img if missing (helper)
        if (!revealImg) {
            revealImg = document.createElement('img');
            revealImg.id = 'hoverRevealImg';
            revealImg.className = 'hover-reveal';
            document.body.appendChild(revealImg);
        }

        window.addEventListener('mousemove', (e) => {
            // Move the image near cursor
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
