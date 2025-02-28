import { cellSize } from "../../game/grid.js";
import { resources } from "../../game/game.js";

export class Bullet {
    constructor(x, y, row) {
        this.x = x;
        this.y = y;
        this.speed = 3;
        this.width = 5;
        this.height = 5;
        this.bulletDamage = 2;
        this.laneIndex = row;
    }

    move() {
        this.x += this.speed;
    }

    draw(ctx) {
        ctx.fillStyle = "black";
        ctx.fillRect(this.x + (cellSize / 2), this.y + (cellSize / 2), this.width, this.height);
    }

    dealDamage(enemy) {
        const actualDamage = Math.max(this.bulletDamage, Math.round(this.bulletDamage * (resources / 200)));
        enemy.health -= actualDamage;
    }
}

export const bullets = [];