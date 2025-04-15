const flowerData = {
    "chrysanthemum": {
        name: "Chrysanthemum",
        description: "White daisies represent innocence and happiness. With their bright, fresh look, they bring positivity and warmth to any occasion.",
        price: "150.000 VND",
        image: "./assets/img/chrysanthemum.jpg"
    },
    "tulips": {
        name: "Tulips",
        description: "Tulips symbolize love, warmth, and new beginnings. Their elegant petals and vibrant colors make them perfect for expressing admiration and joy.",
        price: "200.000 VND",
        image: "./assets/img/tulips.jpg"
    },
    "roses": {
        name: "Roses",
        description: "Roses are the ultimate symbol of love and beauty. Each color tells a story, making them perfect for heartfelt gestures and special moments.",
        price: "250.000 VND",
        image: "./assets/img/roses.jpg"
    }
};

// Lấy tên hoa từ URL
const params = new URLSearchParams(window.location.search);
const flowerName = params.get("flower")?.toLowerCase();
const flower = flowerData[flowerName];

const flowerInfoDiv = document.getElementById("flower-info");

if (flower) {
    flowerInfoDiv.innerHTML = `
        <div class="flower-card">
            <img src="${flower.image}" alt="${flower.name}">
            <div class="flower-card-content">
                <h3>${flower.name}</h3>
                <p><b>Description:</b> ${flower.description}</p>
                <br>
                <p><b>Price:</b> ${flower.price}</p>
                <a href="index.html#product"     class="view-more-btn">See More</a>
            </div>
        </div>
`;

} else {
    flowerInfoDiv.innerHTML = `
        <p style="color: #b33a3a;">No flower found with keywords: <b>${flowerName}</b></p>
    `;
}