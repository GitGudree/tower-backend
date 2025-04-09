import { items } from "./items.js"; // Importer items fra en separat modul
import { addInventoryItem } from "./inventory.js"; //Importerer inventory funksjonen

console.log("Shop.js loaded");
console.log("Items:", items);


document.addEventListener("DOMContentLoaded", () => {
    const shopItemsContainer = document.querySelector(".shop-items");

    // Tømmer eksisterende innhold
    shopItemsContainer.innerHTML = "";

    // Genererer butikkens innhold dynamisk
    for (let itemKey in items) {
        console.log("Processing item:", itemKey, items[itemKey]);
        const item = items[itemKey];

        const itemElement = document.createElement("div");
        itemElement.classList.add("shop-item");
        itemElement.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <p>${item.name}</p>
            <p class="item-price"><span>${item.price}</span> 💶</p>
        `;
        itemElement.onclick = () => selectItem(itemKey);

        shopItemsContainer.appendChild(itemElement);
    }
});

// Oppdaterer detaljvisningen når et item velges
function selectItem(itemKey) {
    const item = items[itemKey];
    if (item) {
        document.getElementById("item-image").src = item.image;
        document.getElementById("item-name").textContent = item.name;
        document.getElementById("item-description").textContent = item.description;
        document.getElementById("item-price").textContent = item.price;

        window.selectedItem = item;
    }
}

// Kjøpsfunksjon (kan utvides med spillmekanikk)
document.getElementById("buy-button").addEventListener("click", () => {
    if (window.selectedItem) {
        addInventoryItem(window.selectedItem);
        alert("Item purchased!");
    } else {
        alert("Select an item first!");
    }
});
