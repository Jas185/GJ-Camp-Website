let currentSlideIndex = 0;

function showSlide(index) {
    const slides = document.querySelectorAll('.carousel-item');
    const indicators = document.querySelectorAll('.indicator');

    if (index >= slides.length) {
        currentSlideIndex = 0;
    }
    if (index < 0) {
        currentSlideIndex = slides.length - 1;
    }

    slides.forEach(slide => slide.classList.remove('active'));
    indicators.forEach(indicator => indicator.classList.remove('active'));

    slides[currentSlideIndex].classList.add('active');
    indicators[currentSlideIndex].classList.add('active');
}

function currentSlide(index) {
    currentSlideIndex = index;
    showSlide(currentSlideIndex);
}

function nextSlide() {
    currentSlideIndex++;
    showSlide(currentSlideIndex);
}

// Auto-rotate carousel toutes les 5 secondes
setInterval(nextSlide, 5000);

// Initialiser le carousel
showSlide(currentSlideIndex);// This file is intentionally left blank.