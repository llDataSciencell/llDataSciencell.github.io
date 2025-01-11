let slideIndex = 0;
let currentAlbum = 0;
const imagesPerAlbum = 5;
const albums = [];
const slideInterval = 3500; // Interval time in milliseconds (3.5 seconds)
let slideTimer;
let isAllAlbumsLoop = false;

// Initialize the slideshow
document.addEventListener("DOMContentLoaded", async () => {
    await detectAlbums();
    if (albums.length > 0) {
        loadAlbum(0);
        createAlbumIndicators();
    } else {
        alert("アルバムが見つかりませんでした。");
    }
});

// Detect available albums dynamically
async function detectAlbums() {
    for (let i = 1; ; i++) {
        const albumExists = await checkAlbumExists(i);
        if (albumExists) {
            albums.push(`imgs_${i}`);
        } else {
            break;
        }
    }
}

// Check if a specific album exists
function checkAlbumExists(albumIndex) {
    const testImageUrl = `imgs_${albumIndex}/sample1.jpg`; // Check the first image of each album
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
        img.src = testImageUrl;
    });
}

function loadAlbum(albumIndex) {
    isAllAlbumsLoop = false; // Reset all albums loop mode
    currentAlbum = albumIndex;
    const slideshowContainer = document.querySelector('.slideshow-container');
    slideshowContainer.innerHTML = '';
    for (let i = 0; i < imagesPerAlbum; i++) {
        const slideDiv = document.createElement('div');
        slideDiv.className = 'mySlides fade';
        const img = document.createElement('img');
        img.src = `${albums[albumIndex]}/sample${i + 1}.jpg`;
        img.style.width = '100%';
        slideDiv.appendChild(img);
        slideshowContainer.appendChild(slideDiv);
    }
    updateAlbumIndicators();
    slideIndex = 0;
    showSlides();
}

function createAlbumIndicators() {
    const albumIndicators = document.querySelector('.album-indicators');
    albumIndicators.innerHTML = ''; // Clear existing indicators
    for (let i = 0; i < albums.length; i++) {
        const button = document.createElement('button');
        button.className = 'album-indicator';
        button.innerText = `${i + 1}`;
        button.onclick = () => loadAlbum(i);
        albumIndicators.appendChild(button);
    }
}

function updateAlbumIndicators() {
    const albumIndicators = document.querySelectorAll('.album-indicator');
    albumIndicators.forEach((indicator, index) => {
        if (index === currentAlbum) {
            indicator.classList.add('active');
        } else {
            indicator.classList.remove('active');
        }
    });
}

function nextAlbum() {
    currentAlbum = (currentAlbum + 1) % albums.length;
    loadAlbum(currentAlbum);
}

function showSlides() {
    const slides = document.getElementsByClassName("mySlides");
    for (let i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    slideIndex++;
    if (slideIndex > slides.length) { slideIndex = 1; }
    if (slides.length > 0) {
        slides[slideIndex - 1].style.display = "block";
    }
    clearTimeout(slideTimer);
    slideTimer = setTimeout(isAllAlbumsLoop ? showAllAlbumsSlides : showSlides, slideInterval); // Adapt based on mode
}

function startAllAlbumsLoop() {
    isAllAlbumsLoop = true;
    slideIndex = 0;
    showAllAlbumsSlides();
}

function showAllAlbumsSlides() {
    const slideshowContainer = document.querySelector('.slideshow-container');
    slideshowContainer.innerHTML = '';
    const allImages = [];
    albums.forEach((album, albumIndex) => {
        for (let i = 0; i < imagesPerAlbum; i++) {
            allImages.push(`${album}/sample${i + 1}.jpg`);
        }
    });
    const slideDiv = document.createElement('div');
    slideDiv.className = 'mySlides fade';
    const img = document.createElement('img');
    img.src = allImages[slideIndex];
    img.style.width = '100%';
    slideDiv.appendChild(img);
    slideshowContainer.appendChild(slideDiv);
    slideIndex++;
    if (slideIndex >= allImages.length) { slideIndex = 0; }
    clearTimeout(slideTimer);
    slideTimer = setTimeout(showAllAlbumsSlides, slideInterval);
}


