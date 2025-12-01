document.addEventListener('DOMContentLoaded', () => {
    initCarousel('oilsTrack', 'oilsDots');
    initCarousel('creamsTrack', 'creamsDots');
});

function initCarousel(trackId, dotsId) {
    const track = document.getElementById(trackId);
    const viewport = track.parentElement.parentElement.querySelector('.carousel-viewport');
    const dotsContainer = document.getElementById(dotsId);
    const slides = track.querySelectorAll('.carousel-slide');
    
    if (!slides.length) return;

    // Generate Dots
    slides.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (index === 0) dot.classList.add('active');
        
        dot.addEventListener('click', () => {
            const slide = slides[index];
            slide.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        });
        
        dotsContainer.appendChild(dot);
    });

    // Update Active Dot on Scroll
    let scrollTimeout;
    viewport.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            let minDistance = Infinity;
            let activeIndex = 0;

            slides.forEach((slide, index) => {
                // Get distance of slide center to viewport center
                const slideRect = slide.getBoundingClientRect();
                const viewportRect = viewport.getBoundingClientRect();
                
                const slideVisualCenter = slideRect.left + (slideRect.width / 2);
                const viewportVisualCenter = viewportRect.left + (viewportRect.width / 2);
                
                const distance = Math.abs(slideVisualCenter - viewportVisualCenter);
                
                if (distance < minDistance) {
                    minDistance = distance;
                    activeIndex = index;
                }
            });

            updateDots(dotsContainer, activeIndex);
        }, 50); // Debounce slightly
    });
}

function updateDots(container, activeIndex) {
    const dots = container.querySelectorAll('.dot');
    dots.forEach((dot, index) => {
        if (index === activeIndex) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
}

// Carousel Scroll Logic for Buttons
function scrollCarousel(trackId, offset) {
    const track = document.getElementById(trackId);
    // track is inside viewport
    const viewport = track.parentElement; 
    
    viewport.scrollBy({
        left: -offset, // Negative because offset passed was for "direction" logic (RTL inverted)
        behavior: 'smooth'
    });
}

// FAQ Toggle Logic
function toggleFaq(id, iconId) {
    const element = document.getElementById(id);
    const icon = document.getElementById(iconId);
    
    if (element.classList.contains('active')) {
        element.classList.remove('active');
        element.style.maxHeight = null;
        icon.innerText = '+';
        icon.style.transform = 'rotate(0deg)';
    } else {
        // Close others
        document.querySelectorAll('.faq-content').forEach(el => {
            el.classList.remove('active');
            el.style.maxHeight = null;
        });
        document.querySelectorAll('[id^="icon"]').forEach(ic => {
            ic.innerText = '+';
            ic.style.transform = 'rotate(0deg)';
        });

        element.classList.add('active');
        element.style.maxHeight = element.scrollHeight + "px";
        icon.innerText = '-';
        icon.style.transform = 'rotate(180deg)';
    }
}