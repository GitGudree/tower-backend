import { SniperTower } from "./SniperTower.js";
import { GatlingTower } from "./GatlingTower.js";
import { LaserTower } from "./LaserTower.js";
import { ErrorTower } from "./ErrorTower.js"
import { RocketTower } from "./RocketTower.js";
import { Barricade } from "./Barricade.js";
import { Mine } from "./Mine.js";
import { SlowTrap } from "./SlowTrap.js";
import { setChosenTower } from "./towerState.js";
import { Tower } from "./tower.js";
/**
 * towerFactory class
 *
 * @author:    Randomfevva, Quetzalcoatl
 * Created:   27.03.2025
 **/

export function createTower(x, y, type, laneIndex) {
    let tower;
    console.log("placed" + " " + type);

    switch (type) {
        case "sniper":
            tower = new SniperTower(x, y, "pierce", laneIndex)
            break;
        case "gatling":
            tower = new GatlingTower(x, y, "basic", laneIndex)
            break;
        case "laser":
            tower = new LaserTower(x, y, "laser", laneIndex)
            break;
        case "rocket":
            tower = new RocketTower(x, y, "rocket", laneIndex)
            break;
        case "barricade":
            tower = new Barricade(x, y, laneIndex)
            setChosenTower("basic")
            break;
        case "mine":
            tower = new Mine(x, y, "mine", laneIndex)
            setChosenTower("basic")
            break;
        case "slowtrap":
            tower = new SlowTrap(x, y, "slowtrap", laneIndex)
            setChosenTower("basic")
            break;
        case "basic":
            tower = new Tower(x, y, "basic", laneIndex)
            break;
        default:
            tower = new ErrorTower(x, y, "error", laneIndex);
    }
    return tower;
}