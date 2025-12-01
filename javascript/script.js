/**
 * Bio Nature Kingdom Script
 * Handles Carousel scrolling and FAQ toggling
 */

/**
 * Scrolls the carousel view horizontally
 * @param {string} trackId - The ID of the track element (not viewport)
 * @param {number} offset - The number of pixels to scroll (positive or negative)
 */
function scrollCarousel(trackId, offset) {
    const track = document.getElementById(trackId);
    if (!track) return;
    
    const viewport = track.parentElement;
    
    // In RTL, negative 'left' usually moves visually to the right,
    // but browser implementation of scrollBy in RTL varies.
    // For standard scrollBy, negative X moves left, positive X moves right.
    viewport.scrollBy({
        left: -offset, 
        behavior: 'smooth'
    });
}

/**
 * Toggles the FAQ accordion state
 * @param {string} id - The ID of the content div to show/hide
 * @param {string} iconId - The ID of the span element containing the +/- icon
 */
function toggleFaq(id, iconId) {
    const element = document.getElementById(id);
    const icon = document.getElementById(iconId);
    
    if (!element || !icon) return;
    
    if (element.classList.contains('active')) {
        // Close the clicked item
        element.classList.remove('active');
        element.style.maxHeight = null;
        icon.innerText = '+';
        icon.style.transform = 'rotate(0deg)';
    } else {
        // 1. Close all other open FAQs first (Accordion behavior)
        document.querySelectorAll('.faq-content').forEach(el => {
            el.classList.remove('active');
            el.style.maxHeight = null;
        });
        
        // 2. Reset all icons
        document.querySelectorAll('[id^="icon"]').forEach(ic => {
            ic.innerText = '+';
            ic.style.transform = 'rotate(0deg)';
        });

        // 3. Open the clicked item
        element.classList.add('active');
        element.style.maxHeight = element.scrollHeight + "px";
        icon.innerText = '-';
        icon.style.transform = 'rotate(180deg)';
    }
}