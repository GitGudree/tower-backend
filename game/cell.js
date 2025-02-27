import { canvas, ctx } from "./game.js";
import { cellSize } from "./grid.js";
import { gridRectColission, mouse } from "./eventHandler.js";

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
        if (mouse.x && mouse.y && gridRectColission(this, mouse)) {
        ctx.strokeStyle = 'gray';
        ctx.strokeRect(this.x, this.y, this.width, this.height);
        ctx.lineWidth = 1;
        
        }   
    }
}