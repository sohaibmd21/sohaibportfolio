// pdf-navigation.js

// Handle cursor visibility
let cursorTimeout;

function showCursor() {
    document.body.style.cursor = 'auto'; // Show cursor
    clearTimeout(cursorTimeout); // Clear existing timeout
    cursorTimeout = setTimeout(() => {
        document.body.style.cursor = 'none'; // Hide cursor after 2 seconds
    }, 2000);
}

document.addEventListener('mousemove', showCursor);
document.addEventListener('touchmove', showCursor);

// Ensure cursor is shown when interacting with the PDF container
document.getElementById('pdfContainer').addEventListener('mousemove', showCursor);
document.getElementById('pdfContainer').addEventListener('touchmove', showCursor);

// PDF navigation
document.addEventListener('DOMContentLoaded', () => {
    const pdfIframe = document.getElementById('pdfIframe');

    function navigatePdf(direction) {
        if (pdfIframe) {
            const currentUrl = new URL(pdfIframe.src, window.location.href);
            const urlParams = new URLSearchParams(currentUrl.search);
            const currentPage = parseInt(urlParams.get('page')) || 1;

            const newPage = Math.max(currentPage + direction, 1); // Ensure page number is at least 1
            urlParams.set('page', newPage);
            pdfIframe.src = `${currentUrl.pathname}?${urlParams.toString()}`;
        }
    }

    document.addEventListener('keydown', (event) => {
        switch (event.key) {
            case 'ArrowLeft': // Navigate to previous page
            case 'ArrowUp':   // Navigate to previous page
                navigatePdf(-1);
                break;
            case 'ArrowRight': // Navigate to next page
            case 'ArrowDown':  // Navigate to next page
                navigatePdf(1);
                break;
        }
    });
});
