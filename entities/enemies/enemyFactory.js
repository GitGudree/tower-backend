import { FastEnemy } from "./FastEnemy.js";
import { TankEnemy } from "./TankEnemy.js";
import { BossEnemy } from "./BossEnemy.js";
import { Enemy } from "./enemy.js"; // Standard fiende

export function createEnemy(row, wave, type) {
    let enemy;
    if (type === "fast") enemy = new FastEnemy(row, wave);
    else if (type === "tank") enemy = new TankEnemy(row, wave);
    else if (type === "boss") enemy = new BossEnemy(row, wave);
    else enemy = new Enemy(row, wave);

    console.log("Spawned enemy:", enemy); // 🔥 Debugging

    return enemy;
}
