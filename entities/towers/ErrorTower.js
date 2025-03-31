import { Tower } from "./tower.js";
/**
 * Error tower class used only if the towerFactory gets an incorrect input and thus uses the default
 *
 * @constructor (x, y, row)
 * Author:    Anarox
 * Editor:    Quetzalcoatl
 * Created:   27.03.2025
 **/
export class ErrorTower extends Tower {
    constructor(x, y, type) {
        super(x, y, type);
        this.name = "error";
        this.health = 60;
        this.range = 300;
        this.damage = 1;
        this.projectiles = [];
        this.fireRate = 10;
        this.bulletType = type;
        this.background = "black";
    }
}
