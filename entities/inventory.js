import { updateMoney, money } from "../game/game.js"; // Import money and updateMoney functions
import { setChosenTower } from "./towers/towerState.js"; // Import setChosenTower

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
        itemSlot.innerHTML = `
            <img src="${item.image}" alt="${item.name}"/>
            <h3>${item.name}</h3>
        `;
        itemSlot.addEventListener('click', () => selectItem(item));
        inventorySlots.push(itemSlot);
    }

    const inventoryCards = document.getElementById('inventoryCards');
    inventoryCards.replaceChildren(...inventorySlots);
}

function selectItem(item) {
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
    // Create a new copy if item has a constructor
    const newItem = item.constructor ? new item.constructor() : { ...item };
    inventory.push(newItem);
    updateInventory();
}

function useItem(gameState) {
    if (!selectedItem) {
        alert("Velg et item før du bruker det.");
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
        if (gameState) {
            gameState.selectedTowerType = towerType;
        }
        setChosenTower(towerType);
        console.log("Ready to place:", towerType);
    } else if (typeof selectedItem.effect === "function") {
        selectedItem.effect(gameState);
    }

    // Remove only one instance of the item
    const index = inventory.indexOf(selectedItem);
    if (index !== -1 && !selectedItem.reusable) {
        inventory.splice(index, 1);
    }

    selectedItem = null;
    updateInventory();
    clearSelectedDisplay();
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
}

function clearSelectedDisplay() {
    document.getElementById("selected-item-image").src = "";
    document.getElementById("selected-item-name").textContent = "No item chosen!";
    document.getElementById("selected-item-description").textContent = "Choose an item.";
}

// Export functions
export { addInventoryItem, useItem, deleteButton, inventory };

window.useItem = useItem;
window.deleteButton = deleteButton;
