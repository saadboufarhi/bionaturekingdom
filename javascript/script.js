// Carousel functionality
const carouselState = {
    oils: { currentIndex: 0, totalSlides: 10, visibleSlides: 3, autoScrollInterval: null },
    creams: { currentIndex: 0, totalSlides: 4, visibleSlides: 3, autoScrollInterval: null }
};

function updateVisibleSlides() {
    const width = window.innerWidth;
    if (width < 600) {
        carouselState.oils.visibleSlides = 1;
        carouselState.creams.visibleSlides = 1;
    } else if (width < 900) {
        carouselState.oils.visibleSlides = 2;
        carouselState.creams.visibleSlides = 2;
    } else {
        carouselState.oils.visibleSlides = 3;
        carouselState.creams.visibleSlides = 3;
    }
}

function moveCarousel(carouselName, direction) {
    updateVisibleSlides();
    const state = carouselState[carouselName];
    const track = document.getElementById(carouselName + 'Track');
    const slides = track.querySelectorAll('.carousel-slide');
    
    state.currentIndex += direction;
    
    const maxIndex = Math.max(0, slides.length - state.visibleSlides);
    if (state.currentIndex < 0) state.currentIndex = maxIndex;
    if (state.currentIndex > maxIndex) state.currentIndex = 0;
    
    // 20px is the gap
    const slideWidth = slides.length > 0 ? slides[0].offsetWidth + 20 : 0; 
    track.style.transform = `translateX(${state.currentIndex * slideWidth}px)`;
    
    updateDots(carouselName);
    updateProgress(carouselName);
}

function goToSlide(carouselName, index) {
    updateVisibleSlides();
    const state = carouselState[carouselName];
    const track = document.getElementById(carouselName + 'Track');
    const slides = track.querySelectorAll('.carousel-slide');
    
    const maxIndex = Math.max(0, slides.length - state.visibleSlides);
    state.currentIndex = Math.min(index, maxIndex);
    
    // 20px is the gap
    const slideWidth = slides.length > 0 ? slides[0].offsetWidth + 20 : 0;
    track.style.transform = `translateX(${state.currentIndex * slideWidth}px)`;
    
    updateDots(carouselName);
    updateProgress(carouselName);
}

function updateDots(carouselName) {
    updateVisibleSlides();
    const state = carouselState[carouselName];
    const dotsContainer = document.getElementById(carouselName + 'Dots');
    const maxIndex = state.totalSlides - state.visibleSlides;
    
    // Calculate actual number of pages (no blank pages)
    const totalPages = maxIndex + 1;
    const stepsPerPage = Math.ceil(totalPages / Math.min(totalPages, 4)); // Max 4 dots
    const numDots = Math.min(4, totalPages);
    
    dotsContainer.innerHTML = '';
    for (let i = 0; i < numDots; i++) {
        const dot = document.createElement('div');
        const dotIndex = i * stepsPerPage;
        const isActive = state.currentIndex >= dotIndex && state.currentIndex < dotIndex + stepsPerPage;
        dot.className = 'carousel-dot' + (isActive ? ' active' : '');
        dot.onclick = () => goToSlide(carouselName, Math.min(dotIndex, maxIndex));
        dotsContainer.appendChild(dot);
    }
}

function updateProgress(carouselName) {
    const state = carouselState[carouselName];
    const progressBar = document.getElementById(carouselName + 'Progress');
    const maxIndex = state.totalSlides - state.visibleSlides;
    const progress = maxIndex > 0 ? ((state.currentIndex / maxIndex) * 100) : 100;
    progressBar.style.width = Math.max(10, progress) + '%';
}

// Auto-scroll functionality
function startAutoScroll(carouselName) {
    const state = carouselState[carouselName];
    if (state.autoScrollInterval) clearInterval(state.autoScrollInterval);
    state.autoScrollInterval = setInterval(() => {
        // Move to the next slide (using direction -1 for Arabic RTL flow)
        moveCarousel(carouselName, -1); 
    }, 4000);
}

function stopAutoScroll(carouselName) {
    const state = carouselState[carouselName];
    if (state.autoScrollInterval) {
        clearInterval(state.autoScrollInterval);
        state.autoScrollInterval = null;
    }
}

// Touch/Swipe support
function initTouchSupport(carouselName) {
    const carousel = document.getElementById(carouselName + 'Carousel');
    if (!carousel) return;
    
    let startX = 0;
    let isDragging = false;

    carousel.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        stopAutoScroll(carouselName);
    }, { passive: true });

    carousel.addEventListener('touchend', (e) => {
        const endX = e.changedTouches[0].clientX;
        const diff = startX - endX;
        // Check if the drag was significant enough
        if (Math.abs(diff) > 50) {
            // Direction for RTL carousel: positive diff (swipe right to left) is next slide (-1 direction)
            moveCarousel(carouselName, diff > 0 ? -1 : 1);
        }
        startAutoScroll(carouselName);
    }, { passive: true });

    // Mouse drag support
    carousel.addEventListener('mousedown', (e) => {
        e.preventDefault(); // Prevent text selection
        startX = e.clientX;
        isDragging = true;
        carousel.style.cursor = 'grabbing';
        stopAutoScroll(carouselName);
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        // This makes the slide drag/pan visually for a better UX (optional)
        const track = document.getElementById(carouselName + 'Track');
        const slides = track.querySelectorAll('.carousel-slide');
        const slideWidth = slides.length > 0 ? slides[0].offsetWidth + 20 : 0;
        const currentTranslation = -carouselState[carouselName].currentIndex * slideWidth;
        const deltaX = e.clientX - startX;
        track.style.transform = `translateX(${currentTranslation + deltaX}px)`;
    });

    document.addEventListener('mouseup', (e) => {
        if (isDragging) {
            const track = document.getElementById(carouselName + 'Track');
            const slides = track.querySelectorAll('.carousel-slide');
            const diff = startX - e.clientX;
            
            // Recalculate based on the correct current index after visual drag
            if (Math.abs(diff) > 50) {
                moveCarousel(carouselName, diff > 0 ? -1 : 1);
            } else {
                // Snap back to the original position if drag wasn't significant
                const slideWidth = slides.length > 0 ? slides[0].offsetWidth + 20 : 0;
                track.style.transform = `translateX(-${carouselState[carouselName].currentIndex * slideWidth}px)`;
            }
            
            isDragging = false;
            carousel.style.cursor = 'grab';
            startAutoScroll(carouselName);
        }
    });

    carousel.addEventListener('mouseleave', () => {
        if (isDragging) {
            isDragging = false;
            carousel.style.cursor = 'grab';
            startAutoScroll(carouselName);
        }
    });

    carousel.addEventListener('mouseenter', () => {
        stopAutoScroll(carouselName);
    });

    carousel.style.cursor = 'grab';
}

function toggleFaq(num) {
    const faq = document.getElementById('faq' + num);
    const icon = document.getElementById('icon' + num);
    
    if (faq.classList.contains('hidden')) {
        faq.classList.remove('hidden');
        icon.textContent = '−';
    } else {
        faq.classList.add('hidden');
        icon.textContent = '+';
    }
}

// Global functions need to be attached to window if used in HTML onClick
window.moveCarousel = moveCarousel;
window.toggleFaq = toggleFaq;

// Initialize carousels on page load
document.addEventListener('DOMContentLoaded', function() {
    updateVisibleSlides();
    updateDots('oils');
    updateProgress('oils');
    initTouchSupport('oils');
    startAutoScroll('oils');
    
    // Initialize creams carousel
    updateDots('creams');
    updateProgress('creams');
    initTouchSupport('creams');
    startAutoScroll('creams');
});

// Update on window resize
window.addEventListener('resize', function() {
    updateVisibleSlides();
    updateDots('oils');
    updateProgress('oils');
    updateDots('creams');
    updateProgress('creams');
});