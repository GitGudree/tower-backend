import { ctx } from "./game.js";
import { cellSize } from "./grid.js";
import { gridRectColission, mouse } from "./eventhandler.js";
import { enemies } from "../entities/enemies/enemy.js";
import { towers } from "../entities/towers/tower.js";

/**
 * Cell Class
 *               
 * @description Blueprint for each cell value in the grid. 
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
        const tower = towers.find(t => t.x === this.x && t.y === this.y);
        const enemyWithinRect = enemies.filter(enemy => gridRectColission(this, enemy)).length > 0;

        if (mouse.x && mouse.y && gridRectColission(this, mouse)) {
            ctx.strokeStyle = enemyWithinRect ? '#ff4444' : '#e0e0e0';
            ctx.lineWidth = 1;
            ctx.strokeRect(this.x, this.y, this.width, this.height);
        }

        if (tower && tower.hasActiveSynergies && tower.synergyGlowColor) {
            ctx.save();
            
            
            ctx.strokeStyle = tower.synergyGlowColor;
            ctx.lineWidth = 3;
            ctx.globalAlpha = 0.8;
            
            ctx.shadowColor = tower.synergyGlowColor;
            ctx.shadowBlur = 8;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
            
            ctx.strokeRect(this.x, this.y, this.width, this.height);

            if (tower.selected && tower.synergizedWith) {
                ctx.setLineDash([5, 5]);
                ctx.lineWidth = 2;
                ctx.globalAlpha = 0.6;
                ctx.shadowBlur = 0;

                for (const synergizedTower of tower.synergizedWith) {
                    ctx.beginPath();
                    ctx.moveTo(this.x + this.width / 2, this.y + this.height / 2);
                    ctx.lineTo(
                        synergizedTower.x + synergizedTower.width / 2,
                        synergizedTower.y + synergizedTower.height / 2
                    );
                    ctx.stroke();
                }
                ctx.setLineDash([]);
            }

            ctx.restore();
        }
    }
}