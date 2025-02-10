import { canvas, ctx } from "../game/game.js";

export class Enemy {
    constructor(row, wave) {
        this.x = canvas.width;
        this.y = row * 50;
        this.speed = 1;
        this.health = 100 + (wave * 10);
        this.width = 50;
        this.height = 50;
    }

    move() {
        this.x -= this.speed;
    }

    draw(ctx) {
        ctx.fillStyle = "red";
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

export const enemies = [];
