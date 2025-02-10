import { Tower, towers } from "../entities/tower.js";
import { money, updateMoney } from "./game.js";

export function handleCanvasClick(event) {
    const canvas = document.getElementById("gameCanvas");
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((event.clientX - rect.left) / 50) * 50;
    const y = Math.floor((event.clientY - rect.top) / 50) * 50;

    if (money >= 50) {
        towers.push(new Tower(x, y));
        updateMoney("decrease", 50);
        document.getElementById("money").innerText = money;
    }
}
