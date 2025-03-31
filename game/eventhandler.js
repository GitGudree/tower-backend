import { Tower, towers } from "../entities/towers/tower.js";
import { createTower } from "../entities/towers/towerFactory.js";
import { canvas, money, price, updateMoney, updateResources, updateTowerStats } from "./game.js";
import { cellSize } from "./grid.js";
import { getChosenTower } from "../entities/towers/towerState.js";



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
     * Handles tower selection and ensures that the right tower is selected.
     *               

     * Author:    Anarox
     * Editor: Quetzalcoatl
     * Created:   27.02.2025
     **/
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

    if (money >= price && !towers.some(tower => tower.selected)) {
        var type = getChosenTower();
        console.log(type)
        const tower = createTower(gridMousePosX, gridMousePosY, type);
        towers.push(tower);
        tower.selected = true;
        updateMoney("decrease", price);
        updateResources("increase", 10);
    }
    
    if (towers) {
        const selectedTower = towers.find(tower => tower.selected);
        updateTowerStats(selectedTower);
    }
}


/**
 * Remove contextmenu
 *               

 * @description Event that removes contextmenu/right-click and solves a game bug.
 * Author:    Anarox
 * Created:   17.03.2025
 **/
canvas.addEventListener("contextmenu", e => e.preventDefault())



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

        tower.oldStats = { 
            ...tower.newStats
        };


        tower.upgrade();
        updateTowerStats(tower);
    }
}

window.openTab = openTab;


