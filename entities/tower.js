import { BasicBullet } from "./projectiles/basicBullet.js";

export class Tower {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.range = 700;
        this.fireRate = 60;
        this.timer = 0;
    }
    attack(enemies, bullets) {
        if (this.timer <= 0) {
            enemies.forEach(enemy => {
                if (Math.abs(enemy.y - this.y) < 40 && Math.abs(enemy.x - this.x) < this.range) {
                    bullets.push(new BasicBullet(this.x + 25, this.y + 25));
                }
            });
            this.timer = this.fireRate;
        } else {
            this.timer--;
        }
    }
    draw(ctx) {
        ctx.fillStyle = "blue";
        ctx.fillRect(this.x, this.y, 50, 50);
    }
}

export const towers = [];
