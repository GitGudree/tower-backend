import { enemies } from "../entities/enemy.js";
import { towers } from "../entities/Tower.js";
import { projectiles } from "../entities/projectiles/projectiles.js";
import { createGrid, handleGameGrid, topBar } from "./grid.js";
import { startWaveButton } from "./wave.js";
import { collision } from "./hitreg.js";
import { bullets } from "../entities/projectiles/Bullet.js";
import { getWave } from "./wave.js";
import { Tower } from "../entities/Tower.js";


export const canvas = document.getElementById("gameCanvas");
export const ctx = canvas.getContext("2d");

export const towerDamageElement = document.querySelector('.tower-damage');
export const towerUpgradePriceElement = document.querySelector('.tower-upgrade-price');
export const towerUpgradeElement = document.querySelector('.tower-upgrade-btn');


window.startWaveButton = startWaveButton;

// export let money = (50 + 150 + 300 + 1e3) * 5 * 16;
export let money = 500;
export let price = 50;
export let resources = 100;
export let gameOver;


/**
 * Draw function that updates the grid and UI.
 *               

 *
 * @author:    Anarox
 * Created:   25.01.2025
 **/
export function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Topbar
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#ffa500';
    ctx.fillRect(0, 0, topBar.width, topBar.height);
    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.textAlign = 'left';
    ctx.fillText("💶 " + money, 20, topBar.height / 2);
    ctx.textAlign = 'center';
    ctx.fillText("⚒️ Resources: " + resources, canvas.width / 2, topBar.height / 2);
    ctx.textAlign = 'right';
    ctx.fillText("Wave: " + getWave(), canvas.width - 20, topBar.height / 2);
    ctx.textAlign = 'center';
    
    if (gameOver) {
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.font = '50px Arial';
        ctx.fillStyle = 'white';
        ctx.fillText("💀 Game Over 💀", canvas.width / 2, canvas.height / 2);
        return;
    }

    createGrid();
    handleGameGrid();

    enemies.forEach(enemy => {
        enemy.draw(ctx);
    });

    towers.forEach((tower) => {
        tower.draw(ctx);
    });

    for (let projectile of projectiles){
        projectile.draw(ctx);
    }
}

/**
 * Update function that updates in-game interactions, movement and stats.
 *               

 *
 * @author:    Anarox
 * Created:   28.01.2025
 **/
export function updateGameState() {
    let selectedTower = towers.find(tower => tower.selected);

    enemies.forEach((enemy, enemyIndex) => {
        enemy.move();

        // When enemy dies, it gets removed.
        if (enemy.health <= 0) {
            enemies.splice(enemyIndex, 1);
            updateMoney("increase", 20);
        }

        // When enemy goes out of canvas, it gets removed.
        if (enemy.x + enemy.width < 0) {
            enemies.splice(enemyIndex, 1);
            updateResources("decrease", 10);
        }
    });

    
    towers.forEach((tower, towerIndex) => {
        tower.attack(enemies, projectiles, towerIndex);
        
    });
    
    if (resources <= 0) {
        gameOver = true;
    }
    
    if (selectedTower) {
        

        if (money >= selectedTower.upgradeCost) {

            // console.log("Money:", money);
            // console.log("Upgrade cost:", selectedTower.upgradeCost);
            // console.log("Comparison result:", money >= selectedTower.upgradeCost);
            // console.log("selectedTower: " + selectedTower);

            towerUpgradeElement.innerText = "UPGRADE ˋ°•*⁀➷";
            towerUpgradeElement.classList.add('upgrade');
            towerUpgradeElement.classList.add('hover-upgrade');
        } else {
            towerUpgradeElement.innerText = "Insufficient balance";
            towerUpgradeElement.classList.remove('upgrade');
            towerUpgradeElement.classList.remove('hover-upgrade');
            console.log("Jeg havner her jeg :D");
        }
    } 
}


export function updateButton() {
    if (towers.length > 0) {
        let anyTower = towers.find(tower => !tower.selected);
        
        if (anyTower && money >= anyTower.upgradeCost) {
            updateTowerInfo(anyTower);
            towerUpgradeElement.classList.add('active');
            towerUpgradeElement.innerText = "Select a tower to upgrade!";
        } else {
            towerUpgradeElement.classList.remove('active');
            towerUpgradeElement.innerText = "Insufficient balance";
        }
    } 
}       

/**
 * Updates money with ("increase"/decrease)
 *               

 * @param: action, amount
 * @author:    Anarox
 * Created:   25.01.2025
 **/
export function updateMoney(action, amount) {
    if (typeof amount !== "number" || isNaN(amount)) {
        console.error("Invalid amount:", amount);
        return;
    }

    switch (action) {
        case "increase":
            money += amount;
            break;
        case "decrease":
            money -= amount;
            break;
        default:
            console.warn(`Unknown action: "${action}". No changes made.`);
            return;
    }

}


/**
 * Updates resources with ("increase"/decrease)
 *               

 * @param: action, amount
 * @author:    Anarox
 * Created:   25.01.2025
 **/
export function updateResources(action, amount) {
    if (typeof amount !== "number" || isNaN(amount)) {
        console.error("Invalid amount:", amount);
        return;
    }

    switch (action) {
        case "increase":
            resources += amount;
            break;
        case "decrease":
            resources -= amount;
            break;
        default:
            console.warn(`Unknown action: "${action}". No changes made.`);
            return;
    }

}

/**
 * Updates the tower level with stars instead of a number.
 *               

 * @param: tower (Takes in selectedTower)
 * @author:    Anarox
 * Created:   09.03.2025
**/
export function updateTowerLevel(tower) {
    let stars = "";

    for (let i = 0; i <= tower.upgrades; i++) {
        stars += "⭐";
        console.log("added ⭐");
    }
    return stars;
}

/**
 * Updates the stat-display in Tower-section to show the selected tower.
 *               

 * @param: tower (Takes in selectedTower)
 * @author:    Anarox
 * Created:   09.03.2025
**/
export function updateTowerInfo(tower) {

    document.querySelector(".tower-title-display").textContent = tower.name;
    document.querySelector(".tower-lvl").textContent = updateTowerLevel(tower);
    document.querySelector(".hp-title-display").textContent = tower.health;
    document.querySelector(".range-title-display").textContent = tower.range;
    document.querySelector(".firerate-title-display").textContent = tower.fireRate;
    document.querySelector(".tower-upgrade-price").textContent = tower.upgradeCost;

}

export function upgradeTowerStats(tower) {
    const stats = tower.getUpgradeStats();

    console.log("getUpgradeStats: " + tower.getUpgradeStats());
    console.log(stats);
    console.log("Old stats:", stats.oldStats);
    console.log("New stats:", stats.newStats);

    document.querySelector(".tower-title-display").textContent = `${stats.oldStats.health} → ${stats.newStats.health}`;
    document.querySelector(".tower-lvl").textContent = updateTowerLevel(tower);
    document.querySelector(".range-title-up").textContent = `${stats.oldStats.range} → ${stats.newStats.range}`;
    document.querySelector(".firerate-title-up").textContent = `${stats.oldStats.fireRate} → ${stats.newStats.fireRate}`;
    document.querySelector(".tower-upgrade-price").textContent = tower.upgradeCost;
}


/**
 * Rewritten Projectile handler
 *               

 * @param: action, amount
 * @author:    Anarox, Quetzalcoatl
 * Created:   09.03.2025
**/
export function projectileHandler(){
    const activeProjectiles = [];
    // const enemiesAtRow = [];

    // for (let i = 0; i < rows; i++) {
    //     enemiesAtRow[i] = enemies.filter(enemy => Math.floor((enemy.y - topBar.height) / cellSize) === i);
    // }

    for (let projectile of projectiles) {
        projectile.move();
        let hit = false;

        // const projectileRowIndex = Math.floor((projectile.laneIndex - topBar.height) / cellSize);
        // for (let enemy of enemiesAtRow[projectileRowIndex] || []) {
        for (let enemy of enemies) {
            if (collision(enemy, projectile)) {
                projectile.dealDamage(enemy);
                hit = true;
                break;
            }
        }

        if (!hit && projectile.x < canvas.width - 50) {
            activeProjectiles.push(projectile);
        }
    }

    projectiles.length = 0;
    projectiles.push(...activeProjectiles);
}
