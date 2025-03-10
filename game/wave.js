import { rows } from "./grid.js"; 
import { enemies } from "../entities/enemies/enemy.js";

/**
 * Wave class class
 *
 * @author:    Anarox
 * @contributor: Randomfevva
 * Created:   07.03.2025
 **/



let wave = 1;
 

export async function spawnWave(waves) {
    const { createEnemy } = await import("../entities/enemies/enemyFactory.js");

    const enemyTypes = [
        { type: "fast", weight: 0.3 },
        { type: "tank", weight: 0.3 },
        { type: "normal", weight: 0.4 }
    ];

    function getRandomEnemyType() {
        let rand = Math.random();
        let sum = 0;
        for (let enemy of enemyTypes) {
            sum += enemy.weight;
            if (rand < sum) return enemy.type;
        }
    }

    for (let i = 0; i < waves * 2; i++) {
        setTimeout(() => {
            let row = Math.floor(Math.random() * rows) + 1;
            let type = waves % 5 === 0 ? "boss" : getRandomEnemyType();
            let enemy = createEnemy(row, waves, type);
            enemies.push(enemy);
            console.log("Enemies array:", enemies);
        }, i * 1000);
    }
}


export function startWaveButton() {
    spawnWave(wave);
    wave++;
}

export function getWave() {
    return wave;
}
