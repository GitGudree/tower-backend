import { updateMoney } from './path/to/your/money.js'; // juster path etter behov

let inventory = [];
let selectedItem = null;
let refundRate = 0.5; // 50 % tilbake ved sletting

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

function addInventoryItem(item) {
    inventory.push(item);
    updateInventory();
}

function useItem(gameState) {
    if (!selectedItem) {
        alert("Velg et item før du bruker det.");
        return;
    }

    if (typeof selectedItem.effect !== "function") {
        alert("Dette itemet har ingen definert effekt.");
        return;
    }

    selectedItem.effect(gameState);

    if (!selectedItem.reusable) {
        inventory = inventory.filter(i => i !== selectedItem);
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

        const refundAmount = Math.floor((selectedItem.cost || 0) * refundRate);
        updateMoney("increase", refundAmount);
    }

    selectedItem = null;
    updateInventory();
    clearSelectedDisplay();
}

function clearSelectedDisplay() {
    document.getElementById("selected-item-image").src = "";
    document.getElementById("selected-item-name").textContent = "Ingen Items Valgt!";
    document.getElementById("selected-item-description").textContent = "Velg et item.";
}

// Eksporter funksjoner
export { addInventoryItem, useItem, deleteButton, inventory };
