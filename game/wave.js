import { Enemy, enemies } from "../entities/enemy.js";
import { rows } from "./grid.js"; // Trenger ikke topBar her

/**
 * Enemy class
 *
 * @constructor wave
 * @author:    Anarox
 * @contributor: Randomfevva 
 * Created:   25.01.2025
 **/

let wave = 1;

export function spawnWave(waves) {
    for (let i = 0; i < waves * 2; i++) {
        setTimeout(() => {
            let row = Math.floor(Math.random() * rows) + 1; // ✅ Sikrer at fiender ikke spawner i GUI

            let type;
            if (waves % 5 === 0) {
                type = "boss"; // ✅ Boss kun hver 5. bølge
            } else {
                let rand = Math.random();
                if (rand < 0.3) type = "fast";  
                else if (rand < 0.6) type = "tank"; 
                else type = "normal";  
            }

            enemies.push(new Enemy(row, waves, type)); 
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
