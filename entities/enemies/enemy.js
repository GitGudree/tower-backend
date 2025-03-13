import { canvas} from "../../game/game.js";
import { cellSize } from "../../game/grid.js";


/**
 * Enemy class (STANDARD)
 *
 * @constructor row, wave, type
 * @author:    Anarox
 * @contributor: Randomfevva 
 * Created:   25.01.2025
 **/
export class Enemy {
    constructor(row, wave) {
        this.x = canvas.width;
        this.y = row * cellSize;
        this.type = "normal";
        this.health = 100 + (wave - 1) * 15;
        this.speed = 0.8;
        this.background = "red";
        this.laneIndex = row;
        this.width = cellSize;
        this.height = cellSize;
        this.isStopped = false;
        
        this.damage = 2;
    }

    move() {
        if (!this.isStopped) {
            this.x -= this.speed;
        }
    }

    stopMove() {
        this.isStopped = true;
        this.x = cellSize * Math.ceil(this.x / cellSize);
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

