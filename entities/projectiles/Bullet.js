import { cellSize } from "../../game/grid.js";
import { resources } from "../../game/game.js";
import { recordTowerDamage } from "../../game/statistics.js";

/**
 * Base Bullet class implementing core projectile functionality.
 * 
 * @class Bullet
 * @param {number} x - X coordinate
 * @param {number} y - Y coordinate
 * @param {string} type - Bullet type
 * @param {number} laneIndex - Lane position
 * @author Anarox
 * @contributor Quetzalcoatl
 * @date 2025-01-25
 **/

export class Bullet {
    constructor(x, y, type, laneIndex) {
        this.x = x;
        this.y = y;
        this.name = "bullet"
        this.speed = 3;
        this.width = 5;
        this.height = 5;
        this.bulletDamage = 2;
        this.laneIndex = laneIndex;
        this.pierceAmount = 1;

        this.hitEnemies = new Set();
        this.color = "purple"
        switch(type){
            case "pierce":
                this.pierceAmount = 3;
                this.color = "blue";
                break;
            case "basic":
                this.pierceAmount = 1;
                this.color = "black";
                break;
            default:
                this.color = "pink"
        }
    }

    doesLaserHit() { 
        return false;
    }

    move() {
        this.x += this.speed;
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x + (cellSize / 2), this.y + (cellSize / 2), this.width, this.height);
    }

    dealDamage(enemy) {
        if (typeof enemy.takeDamage === 'function') {
            enemy.takeDamage(this.bulletDamage);
            recordTowerDamage(this.bulletDamage);
        } else {
            enemy.health -= this.bulletDamage;
            recordTowerDamage(this.bulletDamage);
        }
        this.pierceAmount --
        this.hitEnemies.add(enemy)
    }
}

export const bullets = [];