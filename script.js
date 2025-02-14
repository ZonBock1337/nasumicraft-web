function handleScroll() {
    let infoText = document.querySelector('.info-text');
    let imageContainer = document.querySelector('.image-container');
    let scrollPosition = window.scrollY + window.innerHeight;

    if (scrollPosition > infoText.offsetTop + 100) {
        infoText.classList.add('visible');
    }
    
    if (scrollPosition > imageContainer.offsetTop + 100) {
        imageContainer.classList.add('visible');
    }
}

window.addEventListener('scroll', handleScroll);
