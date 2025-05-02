import { updateMoney, money } from "../game/game.js"; // Import money and updateMoney functions
import { setChosenTower } from "./towers/towerState.js"; // Import setChosenTower
import { toastSuccess, toastError, toastWarning, TOAST_MESSAGES } from "../game/toast-message.js";

let inventory = [];
let selectedItem = null;
let refundRate = 0.5; // 50% refund on deletion

/**
 * Updates the inventory display in the UI.
 * 
 * @function updateInventory
 * @private
 */
function updateInventory() {
    const inventorySlots = [];

    for (let item of inventory) {
        const itemSlot = document.createElement('div');
        itemSlot.classList.add('slot');
        // Add data attribute for easier selection matching
        itemSlot.setAttribute('data-item-name', item.name);
        itemSlot.innerHTML = `
            <img src="${item.image}" alt="${item.name}"/>
            <h3>${item.name}</h3>
        `;
        // Add selected class if this is the currently selected item
        if (selectedItem && selectedItem.name === item.name) {
            itemSlot.classList.add('select');
        }
        itemSlot.addEventListener('click', () => selectItem(item));
        inventorySlots.push(itemSlot);
    }

    const inventoryCards = document.getElementById('inventoryCards');
    inventoryCards.replaceChildren(...inventorySlots);
}

function selectItem(item) {
    // Remove selection from all slots
    document.querySelectorAll('.slot').forEach(slot => {
        slot.classList.remove('select');
    });

    // Find and select the slot containing this item
    const slot = document.querySelector(`.slot[data-item-name="${item.name}"]`);
    if (slot) {
        slot.classList.add('select');
    }

    selectedItem = item;
    document.getElementById("selected-item-image").src = item.image;
    document.getElementById("selected-item-name").textContent = item.name;
    document.getElementById("selected-item-description").textContent = item.description;
}

/**
 * Adds a new item to the inventory.
 * 
 * @function addInventoryItem
 * @param {Object} item - Item to add to inventory
 */
function addInventoryItem(item) {
    if (inventory.length >= 9) {
        toastError(TOAST_MESSAGES.SHOP.INVENTORY_FULL);
        return false;
    }
    
    inventory.push(item);
    updateInventory();
    return true;
}

function useItem(gameState) {
    if (!selectedItem) {
        toastWarning("Please select an item first");
        return;
    }

    // Map item names to tower types
    const itemToTowerType = {
        'Barricade': 'barricade',
        'Mine': 'mine',
        'Slow Trap': 'slowtrap'
    };

    const towerType = itemToTowerType[selectedItem.name];
    if (towerType) {
        setChosenTower(towerType);
        console.log("Ready to place:", towerType);
    } else if (typeof selectedItem.effect === "function") {
        selectedItem.effect(gameState);
        // For instant-use items, remove them immediately
        const index = inventory.indexOf(selectedItem);
        if (index !== -1 && !selectedItem.reusable) {
            inventory.splice(index, 1);
        }
        selectedItem = null;
        updateInventory();
        clearSelectedDisplay();
        toastSuccess(TOAST_MESSAGES.INVENTORY.ITEM_USED);
    }
}

// Add new function to handle successful placement
function removeSelectedItem() {
    if (!selectedItem) return;
    
    const index = inventory.indexOf(selectedItem);
    if (index !== -1 && !selectedItem.reusable) {
        inventory.splice(index, 1);
        updateInventory();
        clearSelectedDisplay();
        toastSuccess(TOAST_MESSAGES.INVENTORY.ITEM_USED);
    }
    selectedItem = null;
}

function deleteButton() {
    if (!selectedItem) return;

    const index = inventory.indexOf(selectedItem);
    if (index !== -1) {
        inventory.splice(index, 1);

        const refundAmount = Math.floor((selectedItem.price || 0) * refundRate);
        updateMoney("increase", refundAmount);
        console.log(`Refunding: ${refundAmount} for deleting ${selectedItem.name}`);
    }

    selectedItem = null;
    updateInventory();
    clearSelectedDisplay();
    toastSuccess(TOAST_MESSAGES.INVENTORY.ITEM_DELETED);
}

function clearSelectedDisplay() {
    document.getElementById("selected-item-image").src = "";
    document.getElementById("selected-item-name").textContent = "No item chosen!";
    document.getElementById("selected-item-description").textContent = "Choose an item.";
    // Clear any selected slots
    document.querySelectorAll('.slot').forEach(slot => {
        slot.classList.remove('select');
    });
}

// Export functions
export { addInventoryItem, useItem, deleteButton, inventory, removeSelectedItem };

window.useItem = useItem;
window.deleteButton = deleteButton;

// Initialize inventory display when DOM is loaded
document.addEventListener('DOMContentLoaded', updateInventory);
