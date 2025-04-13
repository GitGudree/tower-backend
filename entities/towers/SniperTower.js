import { Tower } from "./tower.js";
import { RocketBullet } from "../projectiles/RocketBullet.js";
/**
 * Sniper tower class
 *
 * @constructor (x, y, row)
 * Author:    Anarox
 * Editor:    Quetzalcoatl
 * Created:   27.03.2025
 **/
export class SniperTower extends Tower {
    constructor(x, y, type) {
        super(x, y, type);
        this.name = "Sniper";
        this.health = 30;
        this.range = 700;
        this.damage = 15;
        this.projectiles = [];
        this.fireRate = 120;
        this.bulletType = type;
        this.background = "yellow";  
    }
}
