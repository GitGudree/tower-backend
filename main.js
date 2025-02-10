import { drawGrid } from "./game/grid.js";
import { updateGame } from "./game/game.js";
import { handleCanvasClick } from "./game/eventHandler.js";

const canvas = document.getElementById("gameCanvas");

canvas.addEventListener("click", handleCanvasClick);

function gameLoop() {
    updateGame();
    console.log("kjører..")
    requestAnimationFrame(gameLoop);
}

gameLoop();
