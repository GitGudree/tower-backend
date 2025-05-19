import { rows } from "./grid.js"; 
import { enemies, getRandomEnemyType } from "../entities/enemies/enemy.js";
import { createEnemy } from "../entities/enemies/enemyFactory.js";
import { soundManager } from "./soundManager.js";

let wave = 0;
let isWaveStarted = false;
let waveInterval;

/**
 * spawnWave function that ensures enemies spawn and walk to a random lane
 *               

 * @param: waves, rows
 * @author:    Anarox
 * @contributor: Randomfevva
 * Created:   11.02.2025
**/
export async function spawnWave() {
    let test = false; 
    if (isWaveStarted && !test) {
        return;
    };
    
    wave++;
    isWaveStarted = true;

    soundManager.fadeOutMusic('background_music', 800, () => soundManager.playMusic('gameplay'));

    const spawnEnemies = wave * 2;
    for (let i = 0; i < spawnEnemies; i++) {
        let row = Math.floor(Math.random() * rows) + 1;
        const type = getRandomEnemyType(wave);
        const enemy = createEnemy(row, wave, type);

        enemies.push(enemy);
        await wait(Math.max(100, 1000 - wave));
    }
}

export function startWaveButton() {
    spawnWave();
}

export function tryEndWave() {
    if (enemies.length >= 1) {
        return;
    }

    isWaveStarted = false;

    const autoWaveEnabled = document.getElementById('autoWaveCheckbox')?.checked;
    if (!autoWaveEnabled) {
        soundManager.playMusic('background');
    }
}

export function getWave() {
    return wave;
}

async function wait(ms) {
    return new Promise(res => setTimeout(res, ms));
}

window.toggleAutoWave = () => {
    const autoWaveEnabled = document.getElementById('autoWaveCheckbox').checked;

    if (autoWaveEnabled) {
        waveInterval = setInterval(spawnWave, 500);
        console.log("Auto wave enabled");
    } else {
        clearInterval(waveInterval);
        console.log("Auto wave disabled");
    }
}
