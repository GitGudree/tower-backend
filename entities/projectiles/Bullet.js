/**
 * normal Bullet class
 *               
 * @author:    Anarox, Quetzalcoatl
 * Created:   25.01.2025
 **/


import { cellSize } from "../../game/grid.js";
import { resources } from "../../game/game.js";

export class Bullet {
    constructor(x, y, row, type) {
        this.x = x;
        this.y = y;
        this.speed = 3;
        this.width = 5;
        this.height = 5;
        this.bulletDamage = 2;
        this.laneIndex = row;
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

    

    move() {
        this.x += this.speed;
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x + (cellSize / 2), this.y + (cellSize / 2), this.width, this.height);
    }

    dealDamage(enemy) {
            enemy.health -= this.bulletDamage;
            this.pierceAmount --
            this.hitEnemies.add(enemy)
    }
}

export const bullets = [];