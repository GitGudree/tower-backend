import { Tower, towers } from "../entities/towers/tower.js";
import { createTower } from "../entities/towers/towerFactory.js";
import { canvas, money, price, updateMoney, updateResources, updateTowerStats } from "./game.js";
import { cellSize } from "./grid.js";
import { getChosenTower } from "../entities/towers/towerState.js";

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

    /**
     * Handles tower selection logic.
     * 
     * @function
     * @author Anarox
     * @contributor Quetzalcoatl
     * @date 2025-02-27
     */
    if (towers) {
        const selectedTower = towers.find(tower => tower.selected);
        if (selectedTower) selectedTower.selected = false;
    }

    for (let tower of towers) {
        if (tower.x === gridMousePosX && tower.y === gridMousePosY) {
            tower.selected = true;
            break;
        }
    }

    const type = getChosenTower();
    if (type) {
        const isInventoryItem = ['barricade', 'mine', 'slowtrap'].includes(type.toLowerCase());
        
        if ((money >= price || isInventoryItem) && !towers.some(tower => tower.selected)) {
            console.log(type);
            var laneIndex = gridMousePosY / 50; // find what lane tower is in for laneIndex
            const tower = createTower(gridMousePosX, gridMousePosY, type, laneIndex);
            towers.push(tower);
            tower.selected = true;
            
            // Only charge money if it's not an inventory item
            if (!isInventoryItem) {
                updateMoney("decrease", price);
            }
            updateResources("increase", 10);
        }
    }
    
    if (towers) {
        const selectedTower = towers.find(tower => tower.selected);
        updateTowerStats(selectedTower);
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

window.openTab = openTab;


