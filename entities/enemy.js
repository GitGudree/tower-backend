import { canvas, ctx } from "../game/game.js";

export class Enemy {
    constructor(row, wave) {
        this.x = canvas.width;
        this.y = row * 50;
        this.speed = 1;
        this.health = 90 + (wave * 10); // maybe set to something like if (wave > 3){this.health = 100 + ((wave - 3) + 10)} + the else ofc. only an example of how to make start rounds easyer if they end up being hard
        this.width = 50;
        this.height = 50;
        this.laneIndex = row;
    }

    move() {
        this.x -= this.speed;
    }

    draw(ctx) {
        ctx.fillStyle = "red";
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.fillStyle = "black";
        ctx.font = '20px Impact';
        ctx.fillText(Math.floor(this.health), this.x + 15, this.y + 30)
    }
    
}

export const enemies = [];
