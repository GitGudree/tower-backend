import { rows } from "./grid.js"; // ✅ Beholder grid-importen
import { enemies } from "../entities/enemies/enemy.js";



let wave = 1;
 // ✨ Flyttet enemies hit

export async function spawnWave(waves) {
    const { createEnemy } = await import("../entities/enemies/enemyFactory.js"); // 🔥 Lazy import

    for (let i = 0; i < waves * 2; i++) {
        setTimeout(() => {
            let row = Math.floor(Math.random() * rows) + 1;
            
            let type;
            if (waves % 5 === 0) {
                type = "boss";
            } else {
                let rand = Math.random();
                if (rand < 0.3) type = "fast";  
                else if (rand < 0.6) type = "tank"; 
                else type = "normal";  
            }

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
