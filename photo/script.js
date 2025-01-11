let slideIndex = 0;
let currentAlbum = 0;
const slideInterval = 3500; // Interval time in milliseconds (3.5 seconds)
let slideTimer;
let isAllAlbumsLoop = false;

// Define the album structure
const albums = {
    "imgs_1": ["image1.jpg", "image2.jpg", "image3.jpg", "image4.jpg", "image5.jpg"],
    "imgs_2": ["photoA.jpg", "photoB.jpg", "photoC.jpg", "photoD.jpg", "photoE.jpg"],
    "imgs_3": ["pic_01.png", "pic_02.png", "pic_03.png", "pic_04.png", "pic_05.png"],
    // Add more albums as needed
};

// Extract album keys dynamically
const albumKeys = Object.keys(albums);

document.addEventListener("DOMContentLoaded", () => {
    if (albumKeys.length > 0) {
        loadAlbum(0);
        createAlbumIndicators();
    } else {
        alert("アルバムが見つかりませんでした。");
    }
});

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
        img.src = `${albumName}/${image}`;
        img.style.width = '100%';
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
    slideDiv.appendChild(img);
    slideshowContainer.appendChild(slideDiv);

    slideIndex++;
    if (slideIndex >= allImages.length) { slideIndex = 0; }
    clearTimeout(slideTimer);
    slideTimer = setTimeout(showAllAlbumsSlides, slideInterval);
}


