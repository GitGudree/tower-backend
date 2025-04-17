import { SniperTower } from "./SniperTower.js";
import { GatlingTower } from "./GatlingTower.js";
import { LaserTower } from "./LaserTower.js";
import { ErrorTower } from "./ErrorTower.js"
import { RocketTower } from "./RocketTower.js";
import { Barricade } from "./Barricade.js";
import { Tower } from "./tower.js";
/**
 * towerFactory class
 *
 * @author:    Randomfevva, Quetzalcoatl
 * Created:   27.03.2025
 **/

export function createTower(x, y, type) {
    let tower;
    console.log("placed" + " " + type);

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
        case "rocket":
            tower = new RocketTower(x, y, "rocket")
            break;
        case "barricade":
            tower = new Barricade(x, y)
            break;
        case "basic":
            tower = new Tower(x, y, "basic")
            break;
        default:
            tower = new ErrorTower(x, y, "error");
    }
    return tower;
}