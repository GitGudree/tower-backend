import { items } from "./entities/items.js"; // Importer items

document.addEventListener("DOMContentLoaded", () => {
    const shopItemsContainer = document.querySelector(".shop-items");

    // Tømmer eksisterende innhold
    shopItemsContainer.innerHTML = "";

    // Genererer butikkens innhold dynamisk
    Object.keys(items).forEach((key) => {
        const item = items[key];

        const itemElement = document.createElement("div");
        itemElement.classList.add("shop-item");
        itemElement.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <p>${item.name}</p>
            <p class="item-price">${item.cost} 💶</p>
        `;
        itemElement.onclick = () => selectItem(key);

        shopItemsContainer.appendChild(itemElement);
    });
});

// Oppdaterer detaljvisningen når et item velges
function selectItem(itemKey) {
    const item = items[itemKey];

    document.getElementById("item-image").src = item.image;
    document.getElementById("item-name").textContent = item.name;
    document.getElementById("item-description").textContent = item.description;
    document.getElementById("item-price").textContent = item.cost;
}

// Kjøpsfunksjon (kan utvides med spillmekanikk)
function buyItem() {
    alert("Item purchased!");
}
