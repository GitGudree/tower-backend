// Import items from separate module
import { items } from "./items.js";
// Import inventory function
import { addInventoryItem } from "./inventory.js";
// Import money and updateMoney functions
import { updateMoney, money } from "../game/game.js";
// Import toast messages
import { toastSuccess, toastError, TOAST_MESSAGES } from "../game/toast-message.js";

console.log("Shop.js loaded");
console.log("Items:", items);

/**
 * Initialize shop content when DOM is ready.
 * 
 * @listens DOMContentLoaded
 */
document.addEventListener("DOMContentLoaded", () => {
    const shopItemsContainer = document.querySelector(".shop-items");
    shopItemsContainer.innerHTML = ""; // Clear existing content

    // Generate shop item elements
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

    // Purchase button logic
    const buyButton = document.getElementById("buy-button");

    buyButton.addEventListener("click", () => {
        if (window.selectedItem) {
            const price = window.selectedItem.price;

            if (money >= price) {
                // Deduct money
                updateMoney("decrease", price);

                // Add item to inventory
                addInventoryItem(window.selectedItem);

                // Show success message
                toastSuccess(TOAST_MESSAGES.SHOP.PURCHASE_SUCCESS);
            } else {
                // Show error message
                toastError(TOAST_MESSAGES.SHOP.PURCHASE_ERROR);
            }
        } else {
            toastWarning("Please select an item first");
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
        // Remove select class from all items
        document.querySelectorAll('.shop-item').forEach(item => {
            item.classList.remove('select');
        });

        // Add select class to clicked item
        const selectedItemElement = document.querySelector(`[data-item-key="${itemKey}"]`);
        if (selectedItemElement) {
            selectedItemElement.classList.add('select');
        }

        // Update item details display
        document.getElementById("item-image").src = item.image;
        document.getElementById("item-name").textContent = item.name;
        document.getElementById("item-description").textContent = item.description;
        document.getElementById("item-price").textContent = `${item.price} 💶`;
        document.getElementById("price-display").classList.remove("hidden");

        window.selectedItem = item;
    }
}

