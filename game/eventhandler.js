import { Tower, towers } from "../entities/tower.js";
import { canvas, money, price, updateMoney, updateResources, towerDamageElement, towerUpgradePriceElement, moneyElement } from "./game.js";
import { cellSize } from "./grid.js";
import { resources } from "./game.js";

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

    // Selecting a placed tower to upgrade!
    for (let tower of towers) {
        if (tower.x === gridMousePosX && tower.y === gridMousePosY) {
            tower.selected = true;

            towerDamageElement.textContent = tower.damage;
            towerUpgradePriceElement.textContent = tower.upgradeCost;
        } else {
            tower.selected = false;
        }
    }

    if (money >= price && !towers.some(tower => tower.selected)) {
        towers.push(new Tower(gridMousePosX, gridMousePosY));
        updateMoney("decrease", price);
        updateResources("increase", 10);
        moneyElement.innerText = money;
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
    console.log('Mouse left...')
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





window.upgradeTower = () => {
    const tower = towers.find(tower => tower.selected);

    if (tower) {
        tower.upgrade();
    }
}