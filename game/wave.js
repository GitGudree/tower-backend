import { Enemy, enemies } from "../entities/enemy.js";
import { rows } from "./grid.js";

let wave = 1;

export function spawnWave(waves, rows) {
    for (let i = 0; i < waves * 2; i++) {
        setTimeout(() => {
            let row = Math.floor(Math.random() * rows);
            enemies.push(new Enemy(row, waves));
        }, i * 1000);
    }
}

export function startWaveButton() {
    console.log("funker")
    spawnWave(wave, rows);
    wave++;

}
