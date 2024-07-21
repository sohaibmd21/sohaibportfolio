document.addEventListener('DOMContentLoaded', () => {
    const pdfContainer = document.getElementById('pdfContainer');
    let lastTouchDistance = null;
    let cursorTimeout;

    // Handle keydown events for PDF navigation
    document.addEventListener('keydown', function(event) {
        const iframe = document.getElementById('pdfIframe');
        if (iframe && iframe.contentWindow) {
            switch (event.key) {
                case 'ArrowRight':
                case 'ArrowDown':
                    iframe.contentWindow.postMessage({ type: 'NEXT_PAGE' }, '*');
                    break;
                case 'ArrowLeft':
                case 'ArrowUp':
                    iframe.contentWindow.postMessage({ type: 'PREV_PAGE' }, '*');
                    break;
            }
        }
    });

    // Show/hide cursor based on activity
    function showCursor() {
        document.body.style.cursor = 'auto'; // Show cursor
        clearTimeout(cursorTimeout);
        cursorTimeout = setTimeout(() => {
            document.body.style.cursor = 'none'; // Hide cursor after 2 seconds
        }, 2000);
    }

    document.addEventListener('mousemove', showCursor);
    document.addEventListener('touchmove', showCursor);
    pdfContainer.addEventListener('mousemove', showCursor);
    pdfContainer.addEventListener('touchmove', showCursor);

    // Handle pinch-to-zoom functionality
    function handlePinchZoom(event) {
        if (event.touches.length === 2) {
            const x1 = event.touches[0].clientX;
            const y1 = event.touches[0].clientY;
            const x2 = event.touches[1].clientX;
            const y2 = event.touches[1].clientY;

            const currentDistance = Math.hypot(x2 - x1, y2 - y1);

            if (lastTouchDistance !== null) {
                const scale = currentDistance / lastTouchDistance;
                const pdfContainer = document.getElementById('pdfContainer');
                let currentScale = getComputedStyle(pdfContainer).transform.match(/matrix\(([^)]+)\)/);
                currentScale = currentScale ? parseFloat(currentScale[1].split(',')[0]) : 1;
                pdfContainer.style.transform = `scale(${currentScale * scale})`;
            }

            lastTouchDistance = currentDistance;
        } else {
            lastTouchDistance = null;
        }
    }

    pdfContainer.addEventListener('touchmove', handlePinchZoom);
});
