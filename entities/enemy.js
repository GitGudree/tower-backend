import { canvas, ctx, updateResources } from "../game/game.js";
import { cellSize } from "../game/grid.js";

/**
 * Enemy class
 *

 * @constructor row, wave
 * @author:    Anarox
 * Created:   25.01.2025
 **/
export class Enemy {
    constructor(row, wave, config) {
        this.x = canvas.width;
        this.y = row * 50;
        this.speed = Math.random() * 0.2 + 0.4;
        // maybe set to something like if (wave > 3){this.health = 100 + ((wave - 3) + 10)} + the else ofc. only an example of how to make start rounds easyer if they end up being hard
        this.health = 100 + (wave - 1) * 20;
        this.width = cellSize;
        this.height = cellSize;
        this.laneIndex = row;
        this.movement = this.speed;
        this.isStopped = false;
        this.damage = 2;
        this.background = 'red';
    }

    move() {
        if(!this.isStopped) {
            this.x -= this.movement;
        }
        
    }

    stopMove() {
        this.isStopped = true;
        this.x = cellSize * Math.ceil(this.x / 50);
    }

    resumeMove() {
        this.isStopped = false;
    }

    draw(ctx) {
        ctx.fillStyle = this.background;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.fillStyle = "black";
        ctx.font = '20px Impact';
        ctx.textAlign = 'center';
        ctx.fillText(Math.floor(this.health), this.x + cellSize / 2, this.y + cellSize / 2);
    }
    
    attack(tower) {
        tower.health -= this.damage;
    }
}

export const enemies = [];
