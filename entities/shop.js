import { items } from "./items.js"; // Importer items fra en separat modul
import { addInventoryItem } from "./inventory.js"; // Importerer inventory-funksjonen
import { updateMoney, money } from "../game/game.js"; // Importer money og updateMoney

console.log("Shop.js loaded");
console.log("Items:", items);

// Generer butikkens innhold når DOM er klar
document.addEventListener("DOMContentLoaded", () => {
    const shopItemsContainer = document.querySelector(".shop-items");
    shopItemsContainer.innerHTML = ""; // Tøm eksisterende innhold

    // Generer butikkens item-elementer
    for (let itemKey in items) {
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

    // Kjøpsknapp-logikk
    const buyButton = document.getElementById("buy-button");
    const purchaseMessage = document.getElementById("purchase-message");

    buyButton.addEventListener("click", () => {
        if (window.selectedItem) {
            const price = window.selectedItem.price;

            if (money >= price) {
                // Trekk penger
                updateMoney("decrease", price);

                // Legg til item i inventory
                addInventoryItem(window.selectedItem);

                // Vis kjøpsmelding
                purchaseMessage.textContent = "Item purchased!";
                purchaseMessage.classList.remove("hidden");

                setTimeout(() => {
                    purchaseMessage.classList.add("hidden");
                }, 2000);
            } else {
                alert("Not enough money!");
            }
        } else {
            alert("Select an item first!");
        }
    });
});

// Når du klikker på et item, oppdater visningen
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

