import { enemies } from "../entities/enemy.js";
import { towers } from "../entities/tower.js";
import { bullets } from "../entities/bullet.js";
import { drawGrid } from "./grid.js";
import { spawnWave, startWaveButton } from "./wave.js";


export const canvas = document.getElementById("gameCanvas");
export const ctx = canvas.getContext("2d");

const moneyDisplay = document.getElementById("money");
window.startWaveButton = startWaveButton;

export let money = 150;

export function updateGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    drawGrid();

    enemies.forEach((enemy, index) => {
        enemy.move();
        enemy.draw(ctx);

        // When enemy dies, it gets removed.
        if (enemy.health <= 0) {
            enemies.splice(index, 1);
            updateMoney("increase", 10);
        }
    });

    towers.forEach(tower => {
        tower.attack(enemies, bullets);
        tower.draw(ctx);
    });

    bullets.forEach((bullet, bulletIndex) => {
        bullet.move();
        bullet.draw(ctx);

        enemies.forEach((enemy, enemyIndex) => {
            if (bullet.x >= enemy.x &&
                bullet.x <= enemy.x + 50
            ) {
                enemy.health -= 20;
                bullets.splice(bulletIndex, 1)
            }
        })
        // Bullets that go to the end of the canvas, goes away.
        if (bullet.x > canvas.width) {
            bullets.splice(bulletIndex, 1);
        }
    });
}

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

    moneyDisplay.innerText = money;
}

