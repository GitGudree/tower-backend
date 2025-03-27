import { cellSize } from "../../game/grid.js";
/**
 * laser bullet class
 *
 * @author:    Randomfevva
 * Created:   27.03.2025
 **/

export class LaserBullet {
    constructor(x, y, targetX, targetY) {
        this.x = x;
        this.y = y;
        this.targetX = targetX;
        this.targetY = targetY;
        this.bulletDamage = 4; // Laser gjør mer skade
        this.pierceAmount = 1;
        this.hitEnemies = new Set();
    }

    move() {
        // Laser trenger ikke å bevege seg, den treffer umiddelbart
    }

    draw(ctx) {
        ctx.strokeStyle = "cyan";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(this.x + cellSize / 2, this.y + cellSize / 2);
        ctx.lineTo(this.targetX + cellSize / 2, this.targetY + cellSize / 2);
        ctx.stroke();
    }

    dealDamage(enemy) {
        enemy.health -= this.bulletDamage;
        this.pierceAmount--
        this.hitEnemies.add(enemy)
        console.log("hit" + enemy)
        updateTowerDamageTotal(this.bulletDamage); // Send skaden videre
    }
}
    export function updateTowerDamageTotal(damage) {
    totalDamage += damage; // Øker total skade
    document.getElementById("towerDamageTotal").textContent = "Tower damage: " + totalDamage;
} 


        