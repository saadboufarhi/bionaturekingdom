document.addEventListener('DOMContentLoaded', () => {
    initCarousel('oilsTrack', 'oilsDots');
    initCarousel('creamsTrack', 'creamsDots');
});

function initCarousel(trackId, dotsId) {
    const track = document.getElementById(trackId);
    const viewport = track.parentElement.parentElement.querySelector('.carousel-viewport'); // Adjusted for new structure
    const dotsContainer = document.getElementById(dotsId);
    const slides = track.querySelectorAll('.carousel-slide');
    
    if (!slides.length) return;

    // Generate Dots
    slides.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (index === 0) dot.classList.add('active');
        
        dot.addEventListener('click', () => {
            // Calculate scroll position
            // Note: This simple calculation assumes fixed width slides.
            // For RTL, negative scroll might be needed depending on browser.
            // We'll use the slide's offsetLeft logic relative to track.
            
            const slide = slides[index];
            // In smooth scroll, simple left assignment works best
            // But for horizontal scroll snap, scrollTo is better
            const scrollLeft = slide.offsetLeft - track.offsetLeft; // Position relative to track start
            
            // Center alignment adjustment?
            // If we want to center: scrollLeft - (viewportWidth/2) + (slideWidth/2)
            const centerOffset = (viewport.clientWidth - slide.offsetWidth) / 2;
            
            // In RTL, the logic is tricky. Let's stick to basic scrollIntoView if possible
            slide.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        });
        
        dotsContainer.appendChild(dot);
    });

    // Update Active Dot on Scroll
    let scrollTimeout;
    viewport.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            const center = viewport.scrollLeft + (viewport.clientWidth / 2);
            // Note: In RTL, scrollLeft might be negative or start from right.
            // We'll use a distance check.
            
            let minDistance = Infinity;
            let activeIndex = 0;

            slides.forEach((slide, index) => {
                // Get distance of slide center to viewport center
                const slideCenter = slide.offsetLeft + (slide.offsetWidth / 2);
                // Since slide.offsetLeft is relative to the track (scrolled content),
                // and center is relative to scrolled content (scrollLeft),
                // we can compare them directly? No, offsetLeft is static relative to parent.
                
                // Let's use getBoundingClientRect for accurate visual position
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
    // trackId is passed, but buttons are now siblings to viewport container in hierarchy?
    // The structure is .carousel-container > button, viewport, button
    // But we passed trackId (inside viewport). 
    // Let's find viewport via trackId
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