import { gameGrid, createGrid, handleGameGrid } from "./game/grid.js";
import { drawGame, projectileHandler, updateGameState, initGame } from "./game/game.js";
import { handleCanvasClick, mouseLeave, mouseMove } from "./game/eventhandler.js";
import { canvas, gameOver } from "./game/game.js";
import { projectiles } from "./entities/projectiles/projectiles.js";
import { enemies } from "./entities/enemies/enemy.js";
import { towers} from "./entities/towers/tower.js"
import { soundManager } from "./game/soundManager.js";

/**
 * Main game loop and initialization              
 * @author:    Anarox
 * @contributor: Randomfevva, Quetzalcoatl
 * Created:   11.02.2025
**/

initGame().then(() => {
    gameLoop();
});

canvas.addEventListener("click", handleCanvasClick);
canvas.addEventListener("mousemove", mouseMove);
canvas.addEventListener("mouseleave", mouseLeave);

let lastRenderTime = -1;
const GAME_SPEED = 250;

let performanceTimers = {
    drawGameTime: 0,
    updateGameStateTime: 0,
    projectileHandlerTime: 0
};


function gameLoop(currentTime) {
    const preDrawGameTime = performance.now();
    drawGame();
    performanceTimers.drawGameTime = performance.now() - preDrawGameTime;

    if (gameOver) return;
    requestAnimationFrame(gameLoop);

    const secondsSinceLastRender = (currentTime - lastRenderTime) / 1000;
    const deltaTime = ( currentTime - lastRenderTime);
    if (secondsSinceLastRender < 1 / GAME_SPEED) return;

    lastRenderTime = currentTime;

    const preUpdateGameStateTime = performance.now();
    updateGameState(deltaTime);
    performanceTimers.updateGameStateTime = performance.now() - preUpdateGameStateTime;

    const preProjectileHandlerTime = performance.now();
    projectileHandler();
    performanceTimers.projectileHandlerTime = performance.now() - preProjectileHandlerTime;

    // console.log('drawGame:', drawGameTime);
    // console.log('updateGameState:', updateGameStateTime);
    // console.log('projectileHandler:', projectileHandlerTime);
}

window.printCounters = e => {
    console.clear();

    console.log('projectiles:', projectiles.length);
    console.log('enemies:', enemies.length);
    console.log('towers:', towers.length);

    for (let timer in performanceTimers) {
        console.log(timer + ':', performanceTimers[timer]);
    }
}
window.openTab = openTab;
// setInterval(printCounters, 2e3);