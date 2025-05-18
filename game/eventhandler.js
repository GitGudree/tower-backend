import { Tower, towers } from "../entities/towers/tower.js";
import { createTower } from "../entities/towers/towerFactory.js";
import { canvas, money, updateMoney, updateResources, updateTowerStats } from "./game.js";
import { cellSize } from "./grid.js";
import { getChosenTower, setChosenTower } from "../entities/towers/towerState.js";
import { getTowerPrice, isTowerUnlocked } from "./towerUnlockSystem.js";
import { toastError } from "./toast-message.js";
import { removeSelectedItem } from "../entities/inventory.js";

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
 * Handles click events on the game canvas.
 * 
 * @function handleCanvasClick
 * @description Processes tower placement and selection on canvas click
 * @author Anarox
 * @date 2025-01-23
 */
export function handleCanvasClick() {
    // The closest grid cellvalue to where the mouse is.
    const gridMousePosX = mouse.x - (mouse.x % cellSize);
    const gridMousePosY = mouse.y - (mouse.y % cellSize);

    // Stops user from being able to place turrets on topBar.
    if (gridMousePosY < cellSize) {
        return;
    }

    // Deselect previously selected tower
    if (towers) {
        const selectedTower = towers.find(tower => tower.selected);
        if (selectedTower) {
            selectedTower.selected = false;
            // Force a synergy check when deselecting
            selectedTower.checkSynergies(towers, true);
        }
    }

    // Check for tower selection first
    for (let tower of towers) {
        if (tower.x === gridMousePosX && tower.y === gridMousePosY) {
            tower.selected = true;
            // Force a synergy check when selecting
            tower.checkSynergies(towers, true);
            updateTowerStats(tower);
            return;
        }
    }

    const type = getChosenTower();
    if (type) {
        const isInventoryItem = ['barricade', 'mine', 'slowtrap'].includes(type.toLowerCase());
        
        // Check if the spot is available
        if (!towers.some(tower => tower.x === gridMousePosX && tower.y === gridMousePosY)) {
            const towerPrice = getTowerPrice(type);
            
            // Artillery row restriction
            if (type.toLowerCase() === 'artillery') {
                const row = gridMousePosY / cellSize;
                if (towers.some(tower => tower.towerType === 'artillery' && Math.floor(tower.y / cellSize) === row)) {
                    toastError('Only one Artillery Tower can be placed per row!');
                    return;
                }
            }
            // Different logic for inventory items vs regular towers
            if (isInventoryItem || (isTowerUnlocked(type) && money >= towerPrice)) {
                var laneIndex = gridMousePosY / 50;
                const tower = createTower(gridMousePosX, gridMousePosY, type, laneIndex);
                towers.push(tower);
                tower.selected = true;
                
                if (isInventoryItem) {
                    removeSelectedItem();
                } else {
                    updateMoney("decrease", towerPrice);
                }
                
                // Force synergy check for all towers when placing a new one
                towers.forEach(t => t.checkSynergies(towers, true));
                
                // Dispatch towerPlaced event
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
                first.y + first.height < second.y )
    ) {
        return true;
    }
}

function openTab(btn) {
    // Remove 'selected' from all buttons
    document.querySelectorAll('.tabs>.selected').forEach(tab => {
        tab.classList.remove('selected');
    });
    btn.classList.add('selected');

    // Close all tabs before opening new one
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('open');
    });

    // Open selected tab
    const tabName = btn.getAttribute('data-tab');
    document.querySelector(`.tab.${tabName}`).classList.add('open');
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
            // Clear the tower info display since the tower is gone
            updateTowerStats(null);
        }
    }
}

//passes data along to setChosenTower
document.querySelectorAll('[tower-type]').forEach(button => {
    button.addEventListener('click', () => {
        const towerType = button.getAttribute('tower-type');
        setChosenTower(towerType)
    });
});

window.openTab = openTab;


