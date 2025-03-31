import { SniperTower } from "./SniperTower.js";
import { GatlingTower } from "./GatlingTower.js";
import { LaserTower } from "./LaserTower.js";
import { Tower } from "./tower.js";
/**
 * towerFactory class
 *
 * @author:    Randomfevva, Quetzalcoatl
 * Created:   27.03.2025
 **/

export function createTower(x, y, type) {
    let tower;
    console.log(type);

    switch (type) {
        case "sniper":
            tower = new SniperTower(x, y, "pierce")
            break;
        case "gatling":
            tower = new GatlingTower(x, y, "basic")
            break;
        case "laser":
            tower = new LaserTower(x, y, "laser")
            break;
        case "basic":
            tower = new Tower(x, y, "basic")
            break;
        default:
            tower = new Tower(x, y, "normal");
    }
    return tower;
}