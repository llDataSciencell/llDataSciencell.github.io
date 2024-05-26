let slideIndex = 0;
let currentAlbum = 0;
const imagesPerAlbum = 5;
const totalImages = 20;
const albums = Math.ceil(totalImages / imagesPerAlbum);
const slideInterval = 3500; // Interval time in milliseconds (3.5 seconds)
let slideTimer;

document.addEventListener("DOMContentLoaded", () => {
    loadAlbum(0);
    createAlbumIndicators();
});

function loadAlbum(albumIndex) {
    currentAlbum = albumIndex;
    const slideshowContainer = document.querySelector('.slideshow-container');
    slideshowContainer.innerHTML = '';
    for (let i = 0; i < imagesPerAlbum; i++) {
        const slideDiv = document.createElement('div');
        slideDiv.className = 'mySlides fade';
        const img = document.createElement('img');
        img.src = `imgs_${albumIndex + 1}/sample${i + 1}.jpg`; // Correct path for each album and image
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
    for (let i = 0; i < albums; i++) {
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
    currentAlbum = (currentAlbum + 1) % albums;
    loadAlbum(currentAlbum);
}

function showSlides() {
    let i;
    const slides = document.getElementsByClassName("mySlides");
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    slideIndex++;
    if (slideIndex > slides.length) { slideIndex = 1 }
    if (slides.length > 0) {
        slides[slideIndex - 1].style.display = "block";
    }
    clearTimeout(slideTimer);
    slideTimer = setTimeout(showSlides, slideInterval); // Change image every 3.5 seconds
}

function plusSlides(n) {
    slideIndex += n;
    if (slideIndex > document.getElementsByClassName("mySlides").length) { slideIndex = 1 }
    if (slideIndex < 1) { slideIndex = document.getElementsByClassName("mySlides").length }
    showSlides();
}

function currentSlide(n) {
    slideIndex = n;
    showSlides();
}
