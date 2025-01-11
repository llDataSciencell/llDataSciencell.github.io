let slideIndex = 0;
let currentAlbum = 0;
const slideInterval = 3500; // Interval time in milliseconds (3.5 seconds)
let slideTimer;
let isAllAlbumsLoop = false;

const albums = {}; // Albums will be loaded from JSON dynamically
const albumKeys = [];

// Initialize the slideshow
document.addEventListener("DOMContentLoaded", async () => {
    console.log("Initializing slideshow...");
    await loadAlbums();
    if (albumKeys.length > 0) {
        console.log(`Loaded albums: ${albumKeys.join(", ")}`);
        loadAlbum(0);
        createAlbumIndicators();
        updateAlbumIndicators(); // Ensure the initial indicator is set to album 1
    } else {
        console.error("No albums found.");
        alert("アルバムが見つかりませんでした。");
    }
});

// Load albums dynamically from JSON
async function loadAlbums() {
    try {
        console.log("Loading albums from albums.json...");
        const response = await Promise.race([
            fetch("albums.json"),
            new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 10000)) // 10秒でタイムアウト
        ]);
        if (!response.ok) {
            throw new Error(`Failed to load albums.json: ${response.status}`);
        }
        const data = await response.json();
        Object.assign(albums, data);
        albumKeys.push(...Object.keys(albums));
    } catch (error) {
        console.error("Error loading albums:", error);
        alert("アルバムデータの読み込みに失敗しました。");
    }
}

function loadAlbum(albumIndex) {
    console.log(`Loading album at index: ${albumIndex}`);
    isAllAlbumsLoop = false; // Reset all albums loop mode
    currentAlbum = albumIndex;
    const slideshowContainer = document.querySelector('.slideshow-container');
    slideshowContainer.innerHTML = '';

    const albumName = albumKeys[albumIndex];
    const imageList = albums[albumName];

    if (!imageList || imageList.length === 0) {
        console.error(`No images found in album: ${albumName}`);
        alert(`アルバム「${albumName}」に画像が見つかりませんでした。`);
        return;
    }

    imageList.forEach((image) => {
        console.log(`Adding image: ${albumName}/${image}`);
        const slideDiv = document.createElement('div');
        slideDiv.className = 'mySlides fade';
        const img = document.createElement('img');
        img.src = `${albumName}/${image}`;
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
    console.log("Creating album indicators...");
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
    console.log("Updating album indicators...");
    const albumIndicators = document.querySelectorAll('.album-indicator');
    albumIndicators.forEach((indicator, index) => {
        if (index === currentAlbum || (isAllAlbumsLoop && index === currentAlbumIndex)) {
            indicator.classList.add('active');
            indicator.style.backgroundColor = "blue"; // Active album is blue
        } else {
            indicator.classList.remove('active');
            indicator.style.backgroundColor = "lightblue"; // Non-active albums are light blue
        }
    });
}

function nextAlbum() {
    console.log("Switching to the next album...");
    currentAlbum = (currentAlbum + 1) % albumKeys.length;
    loadAlbum(currentAlbum);
}

function showSlides() {
    console.log("Showing slides...");
    clearTimeout(slideTimer);
    const slides = document.getElementsByClassName("mySlides");
    if (slides.length === 0) {
        console.error("No slides to display.");
        return;
    }
    for (let i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    slideIndex++;
    if (slideIndex > slides.length) {
        slideIndex = 1;
    }
    slides[slideIndex - 1].style.display = "block";

    slideTimer = setTimeout(isAllAlbumsLoop ? showAllAlbumsSlides : showSlides, slideInterval);
}

function startAllAlbumsLoop() {
    console.log("startAllAlbumsLoop called");
    console.log(`isAllAlbumsLoop before: ${isAllAlbumsLoop}`);
    isAllAlbumsLoop = true;
    slideIndex = 0;
    currentAlbumIndex = 0; // Reset the album index
    console.log("Starting loop for all albums...");
    showAllAlbumsSlides();
}

let currentAlbumIndex = 0; // Track the current album being displayed

function showAllAlbumsSlides() {
    console.log("showAllAlbumsSlides called");
    console.log(`Current album index: ${currentAlbumIndex}, Slide index: ${slideIndex}`);
    console.log(`Total albums: ${albumKeys.length}`);

    const slideshowContainer = document.querySelector('.slideshow-container');
    slideshowContainer.innerHTML = ''; // Clear existing slides

    const albumName = albumKeys[currentAlbumIndex];
    const imageList = albums[albumName];

    if (!imageList || imageList.length === 0) {
        console.error(`No images found in album: ${albumName}`);
        currentAlbumIndex = (currentAlbumIndex + 1) % albumKeys.length;
        slideIndex = 0;
        showAllAlbumsSlides();
        return;
    }

    const currentImage = imageList[slideIndex];
    console.log(`Displaying image: ${albumName}/${currentImage}`);

    const slideDiv = document.createElement('div');
    slideDiv.className = 'mySlides fade active';
    const img = document.createElement('img');
    img.src = `${albumName}/${currentImage}`;
    img.style.width = '100%';
    img.onerror = () => {
        console.error(`Failed to load image: ${albumName}/${currentImage}`);
    };
    slideDiv.appendChild(img);
    slideshowContainer.appendChild(slideDiv);

    slideIndex++;
    if (slideIndex >= imageList.length) {
        slideIndex = 0;
        currentAlbumIndex = (currentAlbumIndex + 1) % albumKeys.length;
    }

    updateAlbumIndicators(); // Update indicators during the loop

    clearTimeout(slideTimer);
    console.log("Setting next slide timer...");
    slideTimer = setTimeout(showAllAlbumsSlides, slideInterval);
}


