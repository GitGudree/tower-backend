import { gameGrid, createGrid, handleGameGrid } from "./game/grid.js";
import { drawGame, projectileHandler, updateGameState } from "./game/game.js";
import { handleCanvasClick, mouseLeave, mouseMove } from "./game/eventHandler.js";
import { canvas, gameOver } from "./game/game.js";
import { projectiles } from "./entities/projectiles/projectiles.js";
import { enemies } from "../entities/enemies/Enemy.js";
import { towers} from "../entities/towers/tower.js"


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
    if (secondsSinceLastRender < 1 / GAME_SPEED) return;

    lastRenderTime = currentTime;

    const preUpdateGameStateTime = performance.now();
    updateGameState();
    performanceTimers.updateGameStateTime = performance.now() - preUpdateGameStateTime;

    const preProjectileHandlerTime = performance.now();
    projectileHandler();
    performanceTimers.projectileHandlerTime = performance.now() - preProjectileHandlerTime;

    // console.log('drawGame:', drawGameTime);
    // console.log('updateGameState:', updateGameStateTime);
    // console.log('projectileHandler:', projectileHandlerTime);
}

gameLoop();


window.printCounters = e => {
    console.clear();

    console.log('projectiles:', projectiles.length);
    console.log('enemies:', enemies.length);
    console.log('towers:', towers.length);

    for (let timer in performanceTimers) {
        console.log(timer + ':', performanceTimers[timer]);
    }
}

// setInterval(printCounters, 2e3);