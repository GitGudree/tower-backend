let inventory = [];


//Oppdatering av Inventory, kjøres ved åpning av Inventory tabben og når items legges inn
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

//Funksjon for å velge et item å vise på siden av inventory.
function selectItem(item) {
    document.getElementById("selected-item-image").src = item.image;
    document.getElementById("selected-item-name").textContent = item.name;
    document.getElementById("selected-item-description").textContent = item.description;
}

//Funksjon for å legge til et item i inventory.
function addInventoryItem(item) {
    inventory.push(item);
    updateInventory();
}

/*Funksjon for å bruke et valgt item (ikke implementert)
function useItem() {

}*/

/*Funksjon for å slette et valgt item (ikke implementert)
function deleteItem() {

}*/

export { addInventoryItem, inventory}; //Eksporterer for bruk i shop.js