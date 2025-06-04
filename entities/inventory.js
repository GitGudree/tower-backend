import { money, updateMoney } from "../game/game.js";
import { toastSuccess, toastError, toastWarning, TOAST_MESSAGES } from "../game/toast-message.js";
import { items } from "./items.js";
import { setChosenTower } from "./towers/towerState.js"; // Import setChosenTower

/**
 * Inventory module implementing item management functionality.
 * 
 * @module inventory
 * @author Mag4nd
 * @contributor Randomfevva
 * @date 2025-01-25
 **/

let inventory = [];
let selectedItem = null;
let refundRate = 0.5; 

/**
 * Updates the inventory display in the UI.
 * 
 * @function updateInventory
 * @private
 */
function updateInventory() {
    const inventorySlots = [];
    const inventoryCards = document.getElementById('inventoryCards');

    
    if (inventory.length === 0) {
        inventoryCards.style.display = 'none';
        return;
    }

    
    inventoryCards.style.display = 'grid';

    for (let item of inventory) {
        const itemSlot = document.createElement('div');
        itemSlot.classList.add('slot');
        itemSlot.setAttribute('data-item-name', item.name);
        itemSlot.innerHTML = `
            <img src="${item.image}" alt="${item.name}"/>
            <h3>${item.name}</h3>
        `;
        if (selectedItem && selectedItem.name === item.name) {
            itemSlot.classList.add('select');
        }
        itemSlot.addEventListener('click', () => selectItem(item));
        inventorySlots.push(itemSlot);
    }

    inventoryCards.replaceChildren(...inventorySlots);
}

function selectItem(item) {
    document.querySelectorAll('.slot').forEach(slot => {
        slot.classList.remove('select');
    });

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
    document.querySelectorAll('.slot').forEach(slot => {
        slot.classList.remove('select');
    });
}

export { addInventoryItem, useItem, deleteButton, inventory, removeSelectedItem };

window.useItem = useItem;
window.deleteButton = deleteButton;

document.addEventListener('DOMContentLoaded', updateInventory);
