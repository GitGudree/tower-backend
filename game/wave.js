import { Enemy, enemies } from "../entities/enemy.js";
import { rows } from "./grid.js";

let wave = 1;
let waveInterval;


/**
 * spawnWave function that ensures enemies spawn and walk to a random lane
 *               

 * @param: waves, rows
 * @author:    Anarox
 * Created:   11.02.2025
**/
export function spawnWave(waves, rows) {
    for (let i = 0; i < waves * 2; i++) {
        setTimeout(() => {
            let row = Math.floor(Math.random() * rows) + 1;
            enemies.push(new Enemy(row, waves));
        }, i * 1000);
    }
}

export function startWaveButton() {
    spawnWave(wave, rows);
    wave++;

}

export function getWave() {
    return wave;
}


function toggleAutoWave() {
    autoWaveEnabled = document.getElementById('autoWaveCheckbox').checked;

    if (autoWaveEnabled) {
        waveInterval = setInterval(spawnWave, 5000);
        console.log("Auto wave enabled");
    } else {
        clearInterval(waveInterval);
        console.log("Auto wave disabled");
    }
}
