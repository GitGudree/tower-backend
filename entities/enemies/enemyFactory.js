import { FastEnemy } from "./FastEnemy.js";
import { TankEnemy } from "./TankEnemy.js";
import { BossEnemy } from "./BossEnemy.js";
import { Enemy } from "./enemy.js"; 

/**
 * enemyFactory class
 *
 * @author:    Randomfevva
 * Created:   07.03.2025
 **/

export function createEnemy(row, wave, type) {
    let enemy;

    switch (type) {
        case "fast":
            enemy = new FastEnemy(row, wave);
            break;
        case "tank":
            enemy = new TankEnemy(row, wave);
            break;
        case "boss":
            enemy = new BossEnemy(row, wave);
            break;
        default:
            enemy = new Enemy(row, wave);
            break;
    }

    return enemy;
}

