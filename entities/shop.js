import { items } from "./items.js";
import { addInventoryItem, inventory } from "./inventory.js";
import { updateMoney, money } from "../game/game.js";
import { toastSuccess, toastError, toastWarning, TOAST_MESSAGES } from "../game/toast-message.js";

/**
 * Shop module implementing item purchase functionality.
 * 
 * @module shop
 * @author Randomfevva
 **/

console.log("Shop.js loaded");
console.log("Items:", items);

/**
 * Initialize shop content when DOM is ready.
 * 
 * @listens DOMContentLoaded
 */
document.addEventListener("DOMContentLoaded", () => {
    const shopItemsContainer = document.querySelector(".shop-items");
    shopItemsContainer.innerHTML = "";

    for (let itemKey in items) {
        const item = items[itemKey];

        const itemElement = document.createElement("div");
        itemElement.classList.add("shop-item");
        itemElement.setAttribute("data-item-key", itemKey);
        itemElement.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <p>${item.name}</p>
            <p class="item-price"><span>${item.price}</span> 💶</p>
        `;
        itemElement.onclick = () => selectItem(itemKey);

        shopItemsContainer.appendChild(itemElement);
    }

    const buyButton = document.getElementById("buy-button");

    buyButton.addEventListener("click", () => {
        if (window.selectedItem) {
            
            if (inventory.length >= 9) {
                toastWarning("Inventory full!");
                return;
            }

            const price = window.selectedItem.price;

            if (money >= price) {
                updateMoney("decrease", price);

                addInventoryItem(window.selectedItem);

                toastSuccess(TOAST_MESSAGES.SHOP.PURCHASE_SUCCESS);
            } else {
                toastError(TOAST_MESSAGES.SHOP.PURCHASE_ERROR);
            }
        } else {
            toastError("Please select an item first");
        }
    });
});

/**
 * Update display when clicking an item.
 * 
 * @function selectItem
 * @param {string} itemKey - Key of the selected item
 */
function selectItem(itemKey) {
    const item = items[itemKey];
    if (item) {
        document.querySelectorAll('.shop-item').forEach(item => {
            item.classList.remove('select');
        });

        const selectedItemElement = document.querySelector(`[data-item-key="${itemKey}"]`);
        if (selectedItemElement) {
            selectedItemElement.classList.add('select');
        }

        document.getElementById("item-image").src = item.image;
        document.getElementById("item-name").textContent = item.name;
        document.getElementById("item-description").textContent = item.description;
        document.getElementById("item-price").textContent = `${item.price} 💶`;
        document.getElementById("price-display").classList.remove("hidden");

        window.selectedItem = item;
    }
}

