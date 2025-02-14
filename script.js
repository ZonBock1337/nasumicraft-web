function handleScroll() {
    let infoText = document.querySelector('.info-text');
    let imageContainer = document.querySelector('.image-container');
    let scrollPosition = window.scrollY + window.innerHeight;

    // Sichtbarkeit für den "INFORMATIONEN"-Text
    if (scrollPosition > infoText.offsetTop + 100) {
        infoText.classList.add('visible');
    }

    // Sichtbarkeit für das Bild
    if (scrollPosition > imageContainer.offsetTop + 100) {
        imageContainer.classList.add('visible');
    }
}

// Scroll-Event hinzufügen, um die Animationen auszulösen
window.addEventListener('scroll', handleScroll);
