const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

export let rows = 5;
const cols = 9;
const gridSize = 50; 

// Updates canvas size based on rows and columns
canvas.width = cols * gridSize;
canvas.height = rows * gridSize;

export function drawGrid() {
    ctx.strokeStyle = "gray";
    ctx.lineWidth = 2;
    
    for (let x = 0; x <= canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
    }
    for (let y = 0; y <= canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }
}
