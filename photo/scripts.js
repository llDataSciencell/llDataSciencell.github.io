let slideIndex = 0;
let currentAlbum = 0;
const slideInterval = 3500; // Interval time in milliseconds (3.5 seconds)
let slideTimer;
let isAllAlbumsLoop = false;

const albums = {}; // Albums will be loaded from JSON dynamically
const albumKeys = [];

// Initialize the slideshow
document.addEventListener("DOMContentLoaded", async () => {
    await loadAlbums();
    if (albumKeys.length > 0) {
        loadAlbum(0);
        createAlbumIndicators();
    } else {
        alert("アルバムが見つかりませんでした。");
    }
});

// Load albums dynamically from JSON
async function loadAlbums() {
    try {
        const response = await fetch("albums.json");
        if (!response.ok) {
            throw new Error(`Failed to load albums.json: ${response.status}`);
        }
        const data = await response.json();
        Object.assign(albums, data);
        albumKeys.push(...Object.keys(albums));
    } catch (error) {
        console.error("Error loading albums:", error);
    }
}

function loadAlbum(albumIndex) {
    isAllAlbumsLoop = false; // Reset all albums loop mode
    currentAlbum = albumIndex;
    const slideshowContainer = document.querySelector('.slideshow-container');
    slideshowContainer.innerHTML = '';

    const albumName = albumKeys[albumIndex];
    const imageList = albums[albumName];

    imageList.forEach((image) => {
        const slideDiv = document.createElement('div');
        slideDiv.className = 'mySlides fade';
        const img = document.createElement('img');
        img.src = `${albumName}/${image}`; // Use the image names from albums.json
        img.style.width = '100%';
        img.onerror = () => {
            console.error(`Failed to load image: ${albumName}/${image}`);
        };
        slideDiv.appendChild(img);
        slideshowContainer.appendChild(slideDiv);
    });

    updateAlbumIndicators();
    slideIndex = 0;
    showSlides();
}

function createAlbumIndicators() {
    const albumIndicators = document.querySelector('.album-indicators');
    albumIndicators.innerHTML = ''; // Clear existing indicators
    albumKeys.forEach((_, index) => {
        const button = document.createElement('button');
        button.className = 'album-indicator';
        button.innerText = `${index + 1}`;
        button.onclick = () => loadAlbum(index);
        albumIndicators.appendChild(button);
    });
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
    currentAlbum = (currentAlbum + 1) % albumKeys.length;
    loadAlbum(currentAlbum);
}

function showSlides() {
    const slides = document.getElementsByClassName("mySlides");
    for (let i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    slideIndex++;
    if (slideIndex > slides.length) {
        slideIndex = 1;
    }
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
    albumKeys.forEach((albumName) => {
        albums[albumName].forEach((image) => {
            allImages.push(`${albumName}/${image}`);
        });
    });

    const slideDiv = document.createElement('div');
    slideDiv.className = 'mySlides fade';
    const img = document.createElement('img');
    img.src = allImages[slideIndex];
    img.style.width = '100%';
    img.onerror = () => {
        console.error(`Failed to load image: ${allImages[slideIndex]}`);
    };
    slideDiv.appendChild(img);
    slideshowContainer.appendChild(slideDiv);

    slideIndex++;
    if (slideIndex >= allImages.length) {
        slideIndex = 0;
    }
    clearTimeout(slideTimer);
    slideTimer = setTimeout(showAllAlbumsSlides, slideInterval);
}



