import { cellSize } from "../../game/grid.js";
/**
 * Laser projectile class implementing laser-specific behavior.
 * 
 * @class LaserBullet
 * @param {number} x - X coordinate
 * @param {number} y - Y coordinate
 * @param {number} targetX - Target X coordinate
 * @param {number} targetY - Target Y coordinate
 * @param {Object} source - Source tower instance
 * @author Randomfevva, Quetzalcoatl
 * @date 2025-03-27
 **/

export class LaserBullet {
    constructor(x, y, targetX, targetY, source) {
        this.x = x;
        this.y = y;
        this.name = "laser";
        this.width = 2;
        this.height = 2;
        this.targetX = targetX;
        this.targetY = targetY;
        this.bulletDamage = 4; // Higher damage for laser type
        this.pierceAmount = 1;
        this.localIframes = 0; // Damage frequency control
        this.lifetime = 1;
        this.bulletSource = source;
        this.name = "laser";
    }

    move() {
        // Laser hits instantly, no movement needed
    }

    isAlive() {
        return this.lifetime > 0 && this.bulletSource?.health > 0;
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
        console.log(this.lifetime)
        enemy.health -= this.bulletDamage;
        this.localIframes = 30;
    }

    doesLaserHit(enemy) {
        const dx = this.targetX - this.x;
        const dy = this.targetY - this.y;
        const lengthSqr = dx * dx + dy * dy;
    
        const t = ((enemy.x - this.x) * dx + (enemy.y - this.y) * dy) / lengthSqr;

        const clampedT = Math.max(0, Math.min(1, t));
    
        const closestX = this.x + clampedT * dx;
        const closestY = this.y + clampedT * dy;
    
        const distX = enemy.x - closestX;
        const distY = enemy.y - closestY;
        const distanceSqr = distX * distX + distY * distY;
    
        return distanceSqr < 400;
    }
}


        