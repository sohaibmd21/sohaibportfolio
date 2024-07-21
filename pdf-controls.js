// pdf-controls.js

// Initialize PDF.js
let pdfDoc = null;
let pageNum = 1;
const scale = 1.12;
const pdfContainer = document.getElementById('pdfViewer');

// Load PDF
function loadPdf(url) {
    pdfjsLib.getDocument(url).promise.then(pdf => {
        pdfDoc = pdf;
        renderPage(pageNum);
    });
}

// Render PDF Page
function renderPage(num) {
    pdfDoc.getPage(num).then(page => {
        const viewport = page.getViewport({ scale });
        const canvas = document.createElement('canvas');
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        pdfContainer.innerHTML = '';
        pdfContainer.appendChild(canvas);

        const ctx = canvas.getContext('2d');
        const renderContext = {
            canvasContext: ctx,
            viewport: viewport
        };
        page.render(renderContext);
    });
}

// Toggle Fullscreen
function toggleFullscreen() {
    const isFullscreen = !!document.fullscreenElement;

    if (isFullscreen) {
        document.exitFullscreen();
        pdfContainer.style.transform = 'none'; // Reset zoom
    } else {
        document.documentElement.requestFullscreen?.() || document.documentElement.mozRequestFullScreen?.() || document.documentElement.webkitRequestFullscreen?.() || document.documentElement.msRequestFullscreen?.();
        pdfContainer.style.transform = `scale(${scale})`; // Apply zoom
        pdfContainer.style.transformOrigin = 'center'; // Center the PDF
    }
}

// Handle Arrow Key Navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        if (pdfDoc && pageNum < pdfDoc.numPages) {
            pageNum++;
            renderPage(pageNum);
        }
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        if (pdfDoc && pageNum > 1) {
            pageNum--;
            renderPage(pageNum);
        }
    }
});

// Fullscreen change event
document.addEventListener('fullscreenchange', () => {
    document.querySelector('.fullscreen-button').style.display = document.fullscreenElement ? 'none' : 'block';
});

// Initial Load
loadPdf('Portfolio.pdf');
