import { Tower, towers } from "../entities/Tower.js";
import { canvas, money, price, updateMoney, updateResources, towerUpgradeElement, towerUpgradePriceElement, updateTowerInfo, updateButton, upgradeTowerStats } from "./game.js";
import { cellSize } from "./grid.js";

let selectedTower = null;

export const mouse = {
    x: 10,
    y: 10,
    width: 0.1,
    height: 0.1,
}

/**
 * handleCanvasClick-event
 *               

 * @description Event that listens to clicks on the gameCanvas. 
 * Author:    Anarox
 * Created:   23.01.2025
 **/
export function handleCanvasClick() {
    // The closest grid cellvalue to where the mouse is.
    const gridMousePosX = mouse.x - (mouse.x % cellSize);
    const gridMousePosY = mouse.y - (mouse.y % cellSize);

    // Stops user from being able to place turrets on topBar.
    if (gridMousePosY < cellSize) {
        return;
    }

    /**
     * MouseEvent that acts as a selection tool to select / upgrade / and analyze individual tower stats.
     *               

    * @description Event that listens to mouse-clicks on the same mouse-positions with different behaviour.
    * Author:    Anarox
    * Created:   27.02.2025
    **/
    for (let tower of towers) {
        if (tower.x === gridMousePosX && tower.y === gridMousePosY) {
            tower.selected = true;
            selectedTower = tower;
        } else {
            tower.selected = false;
            
        }
    }

    if (money >= price && !towers.some(tower => tower.selected)) {
        towers.push(new Tower(gridMousePosX, gridMousePosY));
        updateMoney("decrease", price);
        updateResources("increase", 10);
    }

    for (let tower of towers) {
        if (tower.x === gridMousePosX && tower.y === gridMousePosY) {
            tower.selected = true;
            selectedTower = tower;
        } else {
            tower.selected = false;
            
        }
    }

    if (money >= price && !towers.some(tower => tower.selected)) {
        towers.push(new Tower(gridMousePosX, gridMousePosY));
        updateMoney("decrease", price);
        updateResources("increase", 10);
    }

}



/**
 * MouseMouse event
 *               

 * @description Event that listens to where the mouse is on the screen. 
 * Author:    Anarox
 * Created:   27.02.2025
 **/
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
    document.querySelectorAll('.tabs>.selected').forEach(tab => {
        tab.classList.remove('selected');
    });
    btn.classList.add('selected');
    
    document.querySelector('.tab.open').classList.remove('open');

    const tabName = btn.getAttribute('data-tab');
    document.querySelector(`.tab.${tabName}`).classList.add('open');
}


window.upgradeTower = () => {
    const tower = towers.find(tower => tower.selected);
    console.log("H" + towers.length)
    
    if (tower) {
        tower.upgrade();
        upgradeTowerStats(tower);
    }
}

window.openTab = openTab;