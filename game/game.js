import { enemies } from "../entities/enemies/Enemy.js";
import { towers } from "../entities/tower.js";
import { projectiles } from "../entities/projectiles/projectiles.js";
import { createGrid, handleGameGrid, topBar, rows, cellSize } from "./grid.js";
import { startWaveButton } from "./wave.js";
import { collision } from "./hitreg.js";
import { bullets } from "../entities/projectiles/Bullet.js";
import { getWave } from "./wave.js";


export const canvas = document.getElementById("gameCanvas");
export const ctx = canvas.getContext("2d");

export const towerDamageElement = document.querySelector('.tower-damage');
export const towerUpgradePriceElement = document.querySelector('.tower-upgrade-price');
export const towerUpgradeElement = document.querySelector('.tower-upgrade-btn');


export const moneyElement = document.querySelector(".money");
window.startWaveButton = startWaveButton;

// export let money = (50 + 150 + 300 + 1e3) * 5 * 16;
export let money = 150;
export let price = 50;
export let resources = 500;
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

    if (resources <= 0) {
        gameOver = true;
    }

    towers.forEach((tower, towerIndex) => {
        tower.attack(enemies, projectiles, towerIndex);
    });

    const selectedTower = towers.find(tower => tower.selected);
    if (money >= (selectedTower?.upgradeCost ?? Infinity)) {
        towerUpgradeElement.classList.add('can-buy');
    } else {
        towerUpgradeElement.classList.remove('can-buy');
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

    moneyElement.innerText = money;
}


/**
 * Updates money with ("increase"/decrease)
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
