import { Tower, towers } from "../entities/towers/tower.js";
import { createTower } from "../entities/towers/towerFactory.js";
import { canvas, money, updateMoney, updateResources, updateTowerStats } from "./game.js";
import { cellSize } from "./grid.js";
import { getChosenTower, setChosenTower, getLastSelectedTower, setLastSelectedTower } from "../entities/towers/towerState.js";
import { getTowerPrice, isTowerUnlocked } from "./towerUnlockSystem.js";
import { toastError } from "./toast-message.js";
import { removeSelectedItem, inventory, selectedItem } from "../entities/inventory.js";


/**
 * Mouse position tracking object.
 * @type {Object}
 */
export const mouse = {
    x: 10,
    y: 10,
    width: 0.1,
    height: 0.1,
}

/**
 * Handles canvas click events for tower placement and selection.
 * 
 * @function handleCanvasClick
 * @description Handles tower placement, selection, and tab switching logic
 * @author Anarox
 * @date 2025-02-27
 */
export function handleCanvasClick() {
    const gridMousePosX = mouse.x - (mouse.x % cellSize);
    const gridMousePosY = mouse.y - (mouse.y % cellSize);

    if (gridMousePosY < cellSize) {
        return;
    }

    // Check if we're in tower tab or inventory tab
    const towerTab = document.querySelector('.tabs [data-tab="tower-tab"]');
    const isInTowerTab = towerTab.classList.contains('selected');
    
    const inventoryTab = document.querySelector('.tabs [data-tab="inventory-tab"]');
    const isInInventoryTab = inventoryTab.classList.contains('selected');

    if (towers) {
        const selectedTower = towers.find(tower => tower.selected);
        if (selectedTower) {
            selectedTower.selected = false;
            selectedTower.checkSynergies(towers, true);
        }
    }

    // Check for existing tower selection first
    for (let tower of towers) {
        if (tower.x === gridMousePosX && tower.y === gridMousePosY) {
            tower.selected = true;
            tower.checkSynergies(towers, true);
            updateTowerStats(tower);
            // Switch to tower tab when selecting a tower
            if (!isInTowerTab) {
                openTab(towerTab);
            }
            return;
        }
    }

    // If clicking on empty grid and not in tower or inventory tab, redirect to tower tab
    if (!isInTowerTab && !isInInventoryTab) {
        openTab(towerTab);
        // Restore the last selected tower
        const lastTower = getLastSelectedTower();
        if (lastTower) {
            setChosenTower(lastTower);
        }
        return;
    }

    // If in inventory tab but no item is selected, redirect to tower tab
    if (isInInventoryTab && !selectedItem) {
        openTab(towerTab);
        // Restore the last selected tower
        const lastTower = getLastSelectedTower();
        if (lastTower) {
            setChosenTower(lastTower);
        }
        return;
    }
    

    const type = getChosenTower();
    if (type) {
        const isInventoryItem = ['barricade', 'mine', 'slowtrap'].includes(type.toLowerCase());
        
        if (!towers.some(tower => tower.x === gridMousePosX && tower.y === gridMousePosY)) {
            const towerPrice = getTowerPrice(type);
            
            if (type.toLowerCase() === 'artillery') {
                const row = gridMousePosY / cellSize;
                if (towers.some(tower => tower.towerType === 'artillery' && Math.floor(tower.y / cellSize) === row)) {
                    toastError('Only one Artillery Tower can be placed per row!');
                    return;
                }
            }
            if (isInventoryItem || (isTowerUnlocked(type) && money >= towerPrice)) {
                var laneIndex = gridMousePosY / 50;
                const tower = createTower(gridMousePosX, gridMousePosY, type, laneIndex);
                towers.push(tower);
                tower.selected = true;
                
                if (isInventoryItem) {
                    // If placing from inventory, stay in inventory tab and auto-select next item
                    removeSelectedItem();
                    // Stay in inventory tab after placing
                    if (isInInventoryTab) {
                        openTab(inventoryTab);
                    }
                } else {
                    updateMoney("decrease", towerPrice);
                }
                
                towers.forEach(t => t.checkSynergies(towers, true));
                
                document.dispatchEvent(new CustomEvent('towerPlaced', {
                    detail: { towerType: type }
                }));
                
                updateTowerStats(tower);
            } else if (!isInventoryItem && money < towerPrice) {
                toastError("Not enough money to place this tower!");
            }
        }
    }
}

/**
 * Prevents context menu from appearing on right-click.
 * 
 * @event contextmenu
 * @description Prevents default context menu to avoid game interaction issues
 * @author Anarox
 * @date 2025-03-17
 */
canvas.addEventListener("contextmenu", e => e.preventDefault())

/**
 * Tracks mouse movement on the canvas.
 * 
 * @function mouseMove
 * @param {Event} event - Mouse event object
 * @description Updates mouse position relative to canvas
 * @author Anarox
 * @date 2025-02-27
 */
export function mouseMove(event) {
    let canvasPosition = canvas.getBoundingClientRect();

    mouse.x = event.x - canvasPosition.left;
    mouse.y = event.y - canvasPosition.top;
}

export function mouseLeave(event) {
    mouse.x = undefined;
    mouse.y = undefined;
}

export function gridRectColission(first, second) {
    if (    !(  first.x > second.x + second.width ||
                first.x + first.width < second.x ||
                first.y > second.y + second.height ||
                first.y + first.height < second.y)) {
        return true;
    }
    return false;
}

/**
 * Opens a tab and closes others.
 * 
 * @function openTab
 * @param {HTMLElement} btn - The tab button element
 * @description Handles tab switching and updates the last selected tower
 * @author Anarox
 * @date 2025-02-27
 */
export function openTab(btn) {
    document.querySelectorAll('.tabs>.selected').forEach(tab => {
        tab.classList.remove('selected');
    });
    btn.classList.add('selected');

    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('open');
    });

    const tabName = btn.getAttribute('data-tab');
    document.querySelector(`.tab.${tabName}`).classList.add('open');

    // Store the last selected tower when switching to tower tab
    if (tabName === 'tower-tab') {
        const currentTower = getChosenTower();
        if (currentTower) {
            setLastSelectedTower(currentTower);
        }
    }
}

window.upgradeTower = () => {
    const tower = towers.find(tower => tower.selected);
    console.log("H" + towers.length)
    
    if (tower) {
        tower.oldStats = { 
            ...tower.newStats
        };

        tower.upgrade();
        updateTowerStats(tower);
    }
}

window.repairTower = () => {
    const tower = towers.find(tower => tower.selected);
    if (tower) {
        tower.repair();
        updateTowerStats(tower);
    }
}

window.scrapTower = () => {
    const tower = towers.find(tower => tower.selected);
    if (tower) {
        if (tower.scrap()) {
            updateTowerStats(null);
        }
    }
}

document.querySelectorAll('[tower-type]').forEach(button => {
    button.addEventListener('click', () => {
        const towerType = button.getAttribute('tower-type');
        setChosenTower(towerType)
    });
});

// Make openTab available globally
window.openTab = openTab;


