document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 70, // Adjust for fixed header
                    behavior: 'smooth'
                });
            }
        });
    });

    // Lightbox Functionality
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const captionText = document.getElementById('caption');
    const closeBtn = document.getElementsByClassName('close')[0];

    // Select all gallery items
    const galleryItems = document.querySelectorAll('.gallery-item img');

    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            lightbox.style.display = 'block';
            lightboxImg.src = this.src;
            captionText.innerHTML = this.alt;
        });
    });

    // Close lightbox
    closeBtn.onclick = function() {
        lightbox.style.display = 'none';
    }

    // Close when clicking outside the image
    window.onclick = function(event) {
        if (event.target == lightbox) {
            lightbox.style.display = 'none';
        }
    }

    // Close with Escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === "Escape" && lightbox.style.display === 'block') {
             lightbox.style.display = 'none';
        }
    });
});
