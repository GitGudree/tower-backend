import { canvas, ctx, updateResources } from "../game/game.js";
import { cellSize } from "../game/grid.js";

/**
 * Enemy class
 *
 * @constructor row, wave, type
 * @author:    Anarox
 * @contributer: Randomfevva 
 * Created:   25.01.2025
 **/
export class Enemy {
    constructor(row, wave, type = "normal") {
        this.x = canvas.width;
        this.y = row * cellSize;
        this.type = type;
        this.laneIndex = row;
        this.width = cellSize;
        this.height = cellSize;
        this.isStopped = false;
        
        // Setter helse, fart og farge basert på type
        switch (this.type) {
            case "fast":
                this.health = 50 + (wave - 1) * 10;
                this.speed = 1.2; // Raskere enn vanlig fiende
                this.background = "orange";
                break;
            case "tank":
                this.health = 200 + (wave - 1) * 20;
                this.speed = 0.5; // Saktere, men tanky
                this.background = "darkgreen";
                break;
            case "boss":
                this.health = 500 + (wave - 1) * 50;
                this.speed = 0.8;
                this.background = "purple";
                break;
            default: "normal"
                this.health = 100 + (wave - 1) * 15;
                this.speed = 0.8;
                this.background = "red";
                break;
        }
        this.movement = this.speed;
        this.damage = 2;
    }

    move() {
        if (!this.isStopped) {
            this.x -= this.movement;
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

