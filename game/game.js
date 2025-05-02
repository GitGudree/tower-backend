import { enemies, setEnemies } from "../entities/enemies/enemy.js";
import { towers } from "../entities/towers/tower.js";
import { projectiles } from "../entities/projectiles/projectiles.js";
import { createGrid, handleGameGrid, topBar } from "./grid.js";
import { startWaveButton } from "./wave.js";
import { collision } from "./hitreg.js";
import { getWave, tryEndWave } from "./wave.js";
import { GatlingTower } from "../entities/towers/GatlingTower.js";


export const canvas = document.getElementById("gameCanvas");
export const ctx = canvas.getContext("2d");

export const towerDamageElement = document.querySelector('.tower-damage');
export const towerUpgradePriceElement = document.querySelector('.tower-upgrade-price');
export const towerUpgradeElement = document.querySelector('.tower-upgrade-btn');


window.startWaveButton = startWaveButton;

export let money = 1000;
export let resources = 100;
export let gameOver;
export let isUpgradeBtnActive = false;

/**
 * Renders the game state by updating the grid and UI elements.
 * 
 * @function drawGame
 * @author Anarox
 * @date 2025-01-25
 */
export function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Topbar
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#2d2d2d';
    ctx.fillRect(0, 0, topBar.width, topBar.height);
    ctx.fillStyle = '#e0e0e0';
    ctx.font = '20px Arial';
    ctx.textAlign = 'left';
    ctx.fillText("💶 " + money, 20, topBar.height / 2);
    ctx.textAlign = 'center';
    ctx.fillText("⚒️ Resources: " + resources, canvas.width / 2, topBar.height / 2);
    ctx.textAlign = 'right';
    ctx.fillText("Wave: " + Math.max(1, getWave()), canvas.width - 20, topBar.height / 2);
    ctx.textAlign = 'center';
    
    if (gameOver) {
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.font = '50px Arial';
        ctx.fillStyle = 'white';
        ctx.fillText("💀 Game Over 💀", canvas.width / 2, canvas.height / 2);
        return;
    }

    // Set background color for game grid
    ctx.fillStyle = '#666666';
    ctx.fillRect(0, topBar.height, canvas.width, canvas.height - topBar.height);

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
 * Updates in-game interactions, movement, and statistics.
 * 
 * @function updateGameState
 * @param {number} deltaTime - Time elapsed since last frame
 * @author Anarox, Quetzalcoatl
 * @date 2025-01-28
 */
export function updateGameState(deltaTime) {
    
    let selectedTower = towers.find(tower => tower.selected);

    const enemiesArray = [];
    for (let enemy of enemies) {
        enemy.move();

        if (enemy.health <= 0) {
            updateMoney('increase', 20);
            updateResources('increase', 1);
            continue;
        }

        if (enemy.x + enemy.width < 0) {
            updateResources('decrease', 10);
            continue;
        }

        enemiesArray.push(enemy);
    }
    setEnemies(enemiesArray);
    tryEndWave();

    //towers.forEach((tower, towerIndex) => {
    for (let i = towers.length - 1; i >= 0; i--) { // byttet fra for each for å unngå edge cases -quetz
        const tower = towers[i];
        tower.update(deltaTime);
        tower.stopEnemyMovement(enemies)
        tower.updateTowerCollision(enemies, i)
        tower.attack(enemies, projectiles);

        if (tower.isDead && tower.deathTimer <= 0){
            towers.splice(i, 1)
        }
    };
    
    if (resources <= 0) {
        gameOver = true;
    }

    updateTowerStats(selectedTower);
}    

/**
 * Updates the player's money balance.
 * 
 * @function updateMoney
 * @param {string} action - Type of update ("increase" or "decrease")
 * @param {number} amount - Amount to modify
 * @author Anarox
 * @date 2025-01-25
 */
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
 * Updates the player's resource count.
 * 
 * @function updateResources
 * @param {string} action - Type of update ("increase" or "decrease")
 * @param {number} amount - Amount to modify
 * @author Anarox
 * @date 2025-01-25
 */
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
 * Converts tower level to star representation.
 * 
 * @function updateTowerLevel
 * @param {Object} tower - Selected tower instance
 * @returns {string} Star representation of tower level
 * @author Anarox
 * @date 2025-03-09
 */
export function updateTowerLevel(tower) {
    let stars = "";

    for (let i = 0; i <= tower.upgrades; i++) {
        stars += "⭐";
    }
    return stars;
}

/**
 * Updates the tower statistics display in the UI.
 * 
 * @function updateTowerStats
 * @param {Object} tower - Selected tower instance
 * @author Anarox
 * @date 2025-03-09
 */
export function updateTowerStats(tower) {
    const towerImage = document.getElementById('tower-image');
    const towerTitle = document.getElementById('tower-title');
    const towerDescription = document.getElementById('tower-description');
    const towerStats = document.getElementById('tower-stats');
    const upgradeBtn = document.querySelector('.tower-upgrade-btn');

    if (!tower) {
        // Default state when no tower is selected
        towerImage.src = 'public/sprites/emptyicon.png';
        towerTitle.textContent = 'Select a tower!';
        towerDescription.textContent = 'Choose a tower to view its stats.';
        towerStats.classList.add('hidden');
        upgradeBtn.classList.add('hidden');
        return;
    }

    // Show tower information when selected
    towerImage.src = tower.sprite || 'public/sprites/emptyicon.png';
    towerTitle.textContent = `${tower.name}, Level ${tower.upgrades + 1}`;
    towerDescription.textContent = 'A powerful defensive tower.';
    towerStats.classList.remove('hidden');
    upgradeBtn.classList.remove('hidden');

    // Calculate stat improvements (assuming 20% increase per upgrade)
    const healthImprovement = Math.round(tower.health * 0.2);
    const rangeImprovement = Math.round(tower.range * 0.2);
    const fireRateImprovement = Math.round(tower.fireRate * 0.2);

    // Update stats with improvement indicators
    document.querySelector('.hp-title-display').textContent = 
        `${tower.health} ${money >= tower.upgradeCost ? `(+${healthImprovement})` : ''}`;
    document.querySelector('.range-title-display').textContent = 
        `${tower.range} ${money >= tower.upgradeCost ? `(+${rangeImprovement})` : ''}`;
    document.querySelector('.firerate-title-display').textContent = 
        `${tower.fireRate} ${money >= tower.upgradeCost ? `(+${fireRateImprovement})` : ''}`;
    
    // Update upgrade button based on affordability
    upgradeBtn.textContent = `UPGRADE (${tower.upgradeCost}💶)`;
    if (money >= tower.upgradeCost) {
        upgradeBtn.classList.add('upgrade', 'hover-upgrade');
    } else {
        upgradeBtn.classList.remove('upgrade', 'hover-upgrade');
    }
}


/**
 * Handles projectile movement and collision detection.
 * 
 * @function projectileHandler
 * @author Anarox, Quetzalcoatl
 * @date 2025-03-09
 */
export function projectileHandler(){
    const activeProjectiles = [];

    for (let projectile of projectiles) {
        projectile.move();
        let finalHit = false;

        if (projectile.name === "laser" && projectile.localIframes > 0){
            projectile.localIframes--;
        }

        if (projectile.name === "laser") {
            for (let enemy of enemies) {
                if ( projectile.doesLaserHit(enemy) && projectile.localIframes <= 0 && projectile.lifetime > 0) {
                    projectile.dealDamage(enemy);
                    activeProjectiles.push(projectile);
                }
            }
        } else{

            for (let enemy of enemies) {
                if (collision(enemy, projectile, "boundingBox") && projectile.pierceAmount > 0 && !projectile.hitEnemies.has(enemy)) { // bruker bounding box hot detection for bullets

                    if (projectile.name == "rocket"){
                        projectile.dealDamage(enemy, enemies);
                    } else{
                        projectile.dealDamage(enemy);
                    }
                    if (projectile.pierceAmount <= 0){    // om du mener dette burde være en switch ta det opp med ask så fikser jeg det
                        finalHit = true;
                    }
                    break;
                }
            }
        }

        

        if (!finalHit && projectile.x < canvas.width - 50) {
            activeProjectiles.push(projectile);
        }
    }

    projectiles.length = 0;
    projectiles.push(...activeProjectiles);
}
