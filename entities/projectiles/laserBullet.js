import { cellSize } from "../../game/grid.js";
/**
 * Laser Bullet class implementing continuous beam damage functionality.
 * 
 * @class LaserBullet
 * @extends Bullet
 * @param {number} x - X coordinate
 * @param {number} y - Y coordinate
 * @param {string} type - Bullet type
 * @param {number} laneIndex - Lane position
 * @author Quetzalcoatl
 * @contributor Randomfevva
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
        this.bulletDamage = 0.5;
        this.bulletSource = source;
        this.localIframes = 0;
        this.lifetime = 30;
        this.pierceAmount = source?.synergyBonus?.piercing ? Infinity : 1;
        this.hitEnemies = new Set();
    }

    move() {
        if (this.lifetime > 0) {
            this.lifetime--;
        }
        if (this.localIframes > 0) {
            this.localIframes--;
        }
    }

    draw(ctx) {
        if (this.bulletSource?.isDead || this.lifetime <= 0) return;
        
        ctx.strokeStyle = "cyan";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(this.x + cellSize / 2, this.y + cellSize / 2);
        ctx.lineTo(this.targetX + cellSize / 2, this.targetY + cellSize / 2);
        ctx.stroke();
    }

    dealDamage(enemy) {
        if (!this.bulletSource?.isDead && !this.hitEnemies.has(enemy)) {
            if (typeof enemy.takeDamage === 'function') {
                enemy.takeDamage(this.bulletDamage);
            } else {
                enemy.health -= this.bulletDamage;
            }
            this.localIframes = this.bulletSource?.synergyBonus?.piercing ? 15 : 30; // Faster hit rate when piercing
            if (!this.bulletSource?.synergyBonus?.piercing) {
                this.hitEnemies.add(enemy);
            }
        }
    }

    doesLaserHit(enemy) {
        if (this.bulletSource?.isDead || (!this.bulletSource?.synergyBonus?.piercing && this.hitEnemies.has(enemy))) return false;
        
        // Sjekk om fienden er nær nok laserens linje
        const dx = this.targetX - this.x;
        const dy = this.targetY - this.y;
        
        // Beregn avstanden fra fienden til laserlinjen
        const enemyDx = enemy.x - this.x;
        const enemyDy = enemy.y - this.y;
        
        // Projiser fienden på laserlinjen
        const length = Math.sqrt(dx * dx + dy * dy);
        if (length === 0) return false;
        
        const dot = (enemyDx * dx + enemyDy * dy) / length;
        const projX = this.x + (dot * dx) / length;
        const projY = this.y + (dot * dy) / length;
        
        // Sjekk om projeksjonen er på laserlinjen
        const isOnLine = dot >= 0 && dot <= length;
        
        // Beregn avstand fra fienden til projeksjonen
        const distX = enemy.x - projX;
        const distY = enemy.y - projY;
        const distance = Math.sqrt(distX * distX + distY * distY);
        
        return isOnLine && distance < 30;
    }
}


        