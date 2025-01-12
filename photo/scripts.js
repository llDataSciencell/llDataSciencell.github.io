let slideIndex = 0;
let currentAlbum = 0;
const slideInterval = 9000; // Interval time in milliseconds (3.5 seconds)
let slideTimer;
let isAllAlbumsLoop = false;

const albums = {}; // Albums will be loaded from JSON dynamically
const albumKeys = [];

document.addEventListener("DOMContentLoaded", async () => {
    console.log("Initializing slideshow...");
    await loadAlbums();
    if (albumKeys.length > 0) {
        console.log(`Loaded albums: ${albumKeys.join(", ")}`);
        loadAlbum(0); // デフォルトで1番目のアルバムをロード
        createAlbumIndicators();
        updateAlbumIndicators();
    } else {
        console.error("No albums found.");
        alert("アルバムが見つかりませんでした。");
    }
});

async function loadAlbums() {
    try {
        console.log("Loading albums from albums.json...");
        const response = await fetch("albums.json");
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
        const slideDiv = document.createElement('div');
        slideDiv.className = 'mySlides';
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
    albumIndicators.innerHTML = '';
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
            // 現在選択されているアルバムのインジケーターを青に設定
            indicator.classList.add('active');
            indicator.style.backgroundColor = "blue";
        } else {
            // 選択されていないアルバムのインジケーターを薄い水色に設定
            indicator.classList.remove('active');
            indicator.style.backgroundColor = "lightblue";
        }
    });
}

function nextAlbum() {
    currentAlbum = (currentAlbum + 1) % albumKeys.length;
    loadAlbum(currentAlbum);
}

function showSlides() {
    clearTimeout(slideTimer);
    const slides = document.getElementsByClassName("mySlides");
    if (slides.length === 0) {
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
    isAllAlbumsLoop = true;
    slideIndex = 0;
    currentAlbumIndex = 0; // 全アルバムループ時の現在のアルバムインデックスをリセット
    currentAlbum = currentAlbumIndex; // 現在のアルバムにリセット
    updateAlbumIndicators(); // インジケータをリセット
    showAllAlbumsSlides();
}
let currentAlbumIndex = 0;

function showAllAlbumsSlides() {
    const slideshowContainer = document.querySelector('.slideshow-container');
    slideshowContainer.innerHTML = '';

    const albumName = albumKeys[currentAlbumIndex];
    const imageList = albums[albumName];

    if (!imageList || imageList.length === 0) {
        // 現在のアルバムに画像がない場合、次のアルバムに進む
        currentAlbumIndex = (currentAlbumIndex + 1) % albumKeys.length;
        slideIndex = 0;
        showAllAlbumsSlides();
        return;
    }

    const currentImage = imageList[slideIndex];

    const slideDiv = document.createElement('div');
    slideDiv.className = 'mySlides active';
    const img = document.createElement('img');
    img.src = `${albumName}/${currentImage}`;
    img.style.width = '100%';
    slideDiv.appendChild(img);
    slideshowContainer.appendChild(slideDiv);

    slideIndex++;
    if (slideIndex >= imageList.length) {
        slideIndex = 0;
        currentAlbumIndex = (currentAlbumIndex + 1) % albumKeys.length;
    }

    currentAlbum = currentAlbumIndex; // 現在のアルバムをインジケータに反映
    updateAlbumIndicators(); // インジケータを更新

    slideTimer = setTimeout(showAllAlbumsSlides, slideInterval);
}

