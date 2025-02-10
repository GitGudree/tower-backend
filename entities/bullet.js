export class Bullet {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.speed = 5;
        this.width = 5;
        this.height = 5;
    }

    move() {
        this.x += this.speed;
    }

    draw(ctx) {
        ctx.fillStyle = "black";
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

export const bullets = [];
