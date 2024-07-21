// pdf-navigation.js

document.addEventListener('DOMContentLoaded', () => {
    const pdfIframe = document.getElementById('pdfIframe');

    function navigatePdf(pageOffset) {
        if (pdfIframe) {
            const currentUrl = new URL(pdfIframe.src, window.location.href);
            const urlParams = new URLSearchParams(currentUrl.search);
            const currentPage = parseInt(urlParams.get('page')) || 1;

            // Calculate the new page number
            const newPage = Math.max(currentPage + pageOffset, 1); // Ensure page number is at least 1

            // Update the URL to navigate to the new page
            urlParams.set('page', newPage);
            pdfIframe.src = `${currentUrl.pathname}?${urlParams.toString()}`;
        }
    }

    // Add event listeners for arrow keys
    document.addEventListener('keydown', (event) => {
        switch (event.key) {
            case 'ArrowLeft':
                navigatePdf(-1); // Move to the previous page
                break;
            case 'ArrowRight':
                navigatePdf(1); // Move to the next page
                break;
            case 'ArrowUp':
                navigatePdf(-1); // Move to the previous page (for consistency)
                break;
            case 'ArrowDown':
                navigatePdf(1); // Move to the next page (for consistency)
                break;
        }
    });
});
