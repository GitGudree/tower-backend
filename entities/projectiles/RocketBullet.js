import { cellSize } from "../../game/grid.js";
import { projectiles } from "./projectiles.js";
/**
 * Rocket projectile class implementing explosive behavior.
 * 
 * @class RocketBullet
 * @param {number} x - X coordinate
 * @param {number} y - Y coordinate
 * @param {Object} enemy - Target enemy instance
 * @param {number} laneIndex - Lane position
 * @author Randomfevva
 * @contributor Quetzalcoatl
 * @date 2025-03-27
 **/
export class RocketBullet {
    constructor(x, y, enemy, laneIndex) {
        this.x = x;
        this.y = y;
        this.target = enemy;
        this.name = "rocket"
        this.exploded = false;
        this.bulletDamage = 3; 
        this.speed = 0.05;
        this.width = 5;
        this.height = 5;
        this.aoe = 80;
        this.laneIndex = laneIndex;
        this.explosionLifetime = 100;
        this.pierceAmount = 1;
        this.hitEnemies = new Set();
        this.color = "purple"
    }

    move() {
        if (!this.exploded) {
            this.x += (this.target.x - this.x) * this.speed; 
            this.y += (this.target.y - this.y) * this.speed;
        }
    }

    draw(ctx) {
        ctx.fillStyle = "red";
        ctx.beginPath();
        ctx.arc(this.x + cellSize / 2, this.y + cellSize / 2, 5, 0, Math.PI * 2);
        ctx.fill();

        if (this.exploded) {
            ctx.fillStyle = "orange";
            ctx.beginPath();
            ctx.arc(this.x + cellSize / 2, this.y + cellSize / 2, this.aoe, 0, Math.PI * 2);
            ctx.fill();

            setTimeout(() => {
                const index = projectiles.indexOf(this);
                if (index > -1){
                    projectiles.splice(index, 1)
                }
            }, this.explosionLifetime);   
        }
    }

    dealDamage(enemy, enemies) {
        if (!this.exploded) {
            if (typeof enemy.takeDamage === 'function') {
                enemy.takeDamage(this.bulletDamage);
            } else {
                enemy.health -= this.bulletDamage;
            }

            enemies.forEach(e => {
                if (Math.abs(e.x - this.x) < this.aoe && Math.abs(e.y - this.y) < this.aoe) {
                    if (typeof e.takeDamage === 'function') {
                        e.takeDamage(this.bulletDamage);
                    } else {
                        e.health -= this.bulletDamage;
                    }
                }
            });

            this.exploded = true;
        }
    }
    doesLaserHit() { 
        return false;
    }

}