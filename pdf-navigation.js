document.addEventListener('DOMContentLoaded', () => {
    const pdfContainer = document.getElementById('pdfContainer');
    const canvas = document.getElementById('pdfCanvas');
    const context = canvas.getContext('2d');
    let pdfDoc = null;
    let pageNum = 1;
    let lastTouchDistance = null;
    let cursorTimeout;

    // Load and render the PDF
    pdfjsLib.getDocument('Portfolio.pdf').promise.then(pdf => {
        pdfDoc = pdf;
        renderPage(pageNum);
    });

    function renderPage(num) {
        pdfDoc.getPage(num).then(page => {
            const viewport = page.getViewport({ scale: 1 });
            canvas.width = viewport.width;
            canvas.height = viewport.height;
            const renderContext = {
                canvasContext: context,
                viewport: viewport
            };
            page.render(renderContext);
        });
    }

    // Handle keydown events for PDF navigation
    document.addEventListener('keydown', function(event) {
        if (pdfDoc) {
            switch (event.key) {
                case 'ArrowRight':
                case 'ArrowDown':
                    if (pageNum < pdfDoc.numPages) {
                        pageNum++;
                        renderPage(pageNum);
                    }
                    break;
                case 'ArrowLeft':
                case 'ArrowUp':
                    if (pageNum > 1) {
                        pageNum--;
                        renderPage(pageNum);
                    }
                    break;
            }
        }
    });

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
                let currentTransform = getComputedStyle(pdfContainer).transform;
                let currentScale = currentTransform === 'none' ? 1 : parseFloat(currentTransform.match(/matrix\(([^)]+)\)/)[1].split(',')[0]);
                pdfContainer.style.transform = `scale(${Math.min(Math.max(currentScale * scale, 1), 2)})`; // Clamp scale between 1 and 2
            }

            lastTouchDistance = currentDistance;
        } else {
            lastTouchDistance = null;
        }
    }

    pdfContainer.addEventListener('touchmove', handlePinchZoom);

    // Fullscreen toggle and zoom fix
    function toggleFullscreen() {
        const isFullscreen = !!document.fullscreenElement;
        if (isFullscreen) {
            document.exitFullscreen();
            pdfContainer.style.transform = 'none'; // Reset zoom
        } else {
            document.documentElement.requestFullscreen?.();
            pdfContainer.style.transform = 'scale(1.12)'; // Apply zoom
            pdfContainer.style.transformOrigin = 'center'; // Center the PDF
        }
    }

    document.querySelector('.fullscreen-button').addEventListener('click', toggleFullscreen);

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
});
