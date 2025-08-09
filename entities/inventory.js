import { money, updateMoney } from "../game/game.js";
import { toastSuccess, toastError, toastWarning, TOAST_MESSAGES } from "../game/toast-message.js";
import { items } from "./items.js";
import { setChosenTower, getChosenTower } from "./towers/towerState.js"; // Import setChosenTower and getChosenTower
import { openTab } from "../game/eventhandler.js";

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
        
        // Show quantity for stackable items
        const quantityText = item.quantity && item.quantity > 1 ? ` (${item.quantity})` : '';
        
        // Use key symbol for keys
        const displayName = item.name === 'Key' ? '🔑 Key' : item.name;
        
        itemSlot.innerHTML = `
            <img src="${item.image}" alt="${item.name}"/>
            <h3>${displayName}${quantityText}</h3>
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
    // If clicking on the same item that's already selected, deselect it
    if (selectedItem && selectedItem.name === item.name) {
        selectedItem = null;
        clearSelectedDisplay();
        // Automatically select the currently chosen tower when deselecting an item
        const currentTower = getChosenTower();
        if (currentTower && currentTower !== "basic") {
            setChosenTower(currentTower);
        }
        return;
    }

    // Select the new item
    document.querySelectorAll('.slot').forEach(slot => {
        slot.classList.remove('select');
    });

    const slot = document.querySelector(`.slot[data-item-name="${item.name}"]`);
    if (slot) {
        slot.classList.add('select');
    }

    selectedItem = item;
    document.getElementById("selected-item-image").src = item.image;
    
    // Use key symbol for keys
    const displayName = item.name === 'Key' ? '🔑 Key' : item.name;
    document.getElementById("selected-item-name").textContent = displayName;
    document.getElementById("selected-item-description").textContent = item.description;

    // If this is a placeable item (tower), set it as the chosen tower
    const itemToTowerType = {
        'Barricade': 'barricade',
        'Mine': 'mine',
        'Slow Trap': 'slowtrap'
    };

    const towerType = itemToTowerType[item.name];
    if (towerType) {
        setChosenTower(towerType);
        console.log("Ready to place:", towerType);
    }
}

/**
 * Adds a new item to the inventory.
 * 
 * @function addInventoryItem
 * @param {Object} item - Item to add to inventory
 */
function addInventoryItem(item) {
    // Check if item is stackable (like keys)
    if (item.name === 'Key') {
        const existingKey = inventory.find(invItem => invItem.name === 'Key');
        if (existingKey) {
            // Stack the key
            existingKey.quantity = (existingKey.quantity || 1) + 1;
            updateInventory();
            return true;
        }
    }
    
    // For non-stackable items, check inventory space
    if (inventory.length >= 9) {
        toastError(TOAST_MESSAGES.SHOP.INVENTORY_FULL);
        return false;
    }
    
    // Add quantity property for stackable items
    if (item.name === 'Key') {
        item.quantity = 1;
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

    // For placeable items (towers), they are already set as chosen tower when selected
    // For consumable items, apply their effect
    if (typeof selectedItem.effect === "function") {
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
    if (index !== -1) {
        const itemName = selectedItem.name;
        
        // Handle stackable items
        if (selectedItem.quantity && selectedItem.quantity > 1) {
            selectedItem.quantity--;
            updateInventory();
            toastSuccess(TOAST_MESSAGES.INVENTORY.ITEM_USED);
            // Keep the same item selected since it still has quantity
            return;
        } else {
            inventory.splice(index, 1);
            
            // Check if we're in inventory tab for auto-selection
            const inventoryTab = document.querySelector('.tabs .selected[data-tab="inventory-tab"]');
            const isInInventoryTab = inventoryTab !== null;
            
            if (isInInventoryTab) {
                // Auto-select next item of the same type
                const nextSameTypeItem = inventory.find(item => item.name === itemName);
                if (nextSameTypeItem) {
                    selectedItem = nextSameTypeItem;
                    updateInventory();
                    // Update the selection display
                    const displayName = selectedItem.name === 'Key' ? '🔑 Key' : selectedItem.name;
                    document.getElementById("selected-item-image").src = selectedItem.image;
                    document.getElementById("selected-item-name").textContent = displayName;
                    document.getElementById("selected-item-description").textContent = selectedItem.description;
                    
                    // Set as chosen tower if it's a placeable item
                    const itemToTowerType = {
                        'Mine': 'mine',
                        'Barricade': 'barricade',
                        'Slow Trap': 'slowtrap'
                    };
                    const towerType = itemToTowerType[selectedItem.name];
                    if (towerType) {
                        setChosenTower(towerType);
                    }
                    
                    toastSuccess(TOAST_MESSAGES.INVENTORY.ITEM_USED);
                    return;
                } else {
                    // No more items of the same type, redirect to tower tab
                    const towerTab = document.querySelector('.tabs [data-tab="tower-tab"]');
                    if (towerTab) {
                        openTab(towerTab);
                    }
                }
            }
            
            updateInventory();
            clearSelectedDisplay();
            toastSuccess(TOAST_MESSAGES.INVENTORY.ITEM_USED);
        }
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

export { addInventoryItem, useItem, deleteButton, inventory, removeSelectedItem, selectedItem };

window.deleteButton = deleteButton;

document.addEventListener('DOMContentLoaded', updateInventory);
