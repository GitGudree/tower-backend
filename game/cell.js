import { ctx } from "./game.js";
import { cellSize } from "./grid.js";
import { gridRectColission, mouse } from "./eventHandler.js";
import { enemies } from "../entities/enemies/enemy.js";

/**
 * Tower Class
 *               

 * @description Blueprint for each cellvalue in the grid. 
 * Author:    Anarox
 * Created:   25.01.2025
 **/
export class Cell {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = cellSize;
        this.height = cellSize;
    }
    draw() {
        const enemyWithinRect = enemies.filter(enemy => gridRectColission(this, enemy)).length > 0;

        if (mouse.x && mouse.y && gridRectColission(this, mouse)) {
            ctx.strokeStyle = enemyWithinRect ? 'gray' : 'green';
            ctx.strokeRect(this.x, this.y, this.width, this.height);
            ctx.lineWidth = 1;
        }   
    }
}