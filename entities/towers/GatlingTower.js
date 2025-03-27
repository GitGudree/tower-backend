import { Tower } from "./tower.js";
/**
 * Gatling tower class
 *
 * @constructor (x, y, row)
 * Author:    Anarox
 * Editor:    Quetzalcoatl
 * Created:   27.03.2025
 **/
export class GatlingTower extends Tower {
    constructor(x, y, type) {
        super(x, y, type);
        this.name = "Gatling";
        this.health = 60;
        this.range = 300;
        this.damage = 1;
        this.projectiles = [];
        this.fireRate = 10;
        this.bulletType = type;
        this.background = "green";
        
    }
}
