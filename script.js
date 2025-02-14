function handleScroll() {
    let infoText = document.querySelector('.info-text');
    let imageContainer = document.querySelector('.image-container');
    let extraContent = document.querySelector('.extra-content');
    let scrollPosition = window.scrollY + window.innerHeight;

    // Sichtbarkeit für den "INFORMATIONEN"-Text
    if (scrollPosition > infoText.offsetTop + 100) {
        infoText.classList.add('visible');
    }

    // Sichtbarkeit für das Bild
    if (scrollPosition > imageContainer.offsetTop + 100) {
        imageContainer.classList.add('visible');
    }

    // Sichtbarkeit für den zusätzlichen Inhalt
    if (scrollPosition > extraContent.offsetTop + 100) {
        extraContent.classList.add('visible');
    }
}

// Scroll-Event hinzufügen, um die Animationen auszulösen
window.addEventListener('scroll', handleScroll);
