/**
 * Bullet classes
 *               
 * @author:    Quetzalcoatl, 
 * @contributer: Randomfevva 
 * Created:   25.01.2025
 **/

import { cellSize } from "../../game/grid.js";
import { resources } from "../../game/game.js";

export class Bullet {
    constructor(x, y, row, type = "normal") {
        this.x = x;
        this.y = y;
        this.speed = 3;
        this.width = 5;
        this.height = 5;
        this.bulletDamage = 2;
        this.laneIndex = row;
        this.type = type;
    }

    move() {
        this.x += this.speed;
    }

    draw(ctx) {
        ctx.fillStyle = "black";
        ctx.fillRect(this.x + (cellSize / 2), this.y + (cellSize / 2), this.width, this.height);
    }

    dealDamage(enemy) {
        const actualDamage = Math.max(this.bulletDamage, Math.round(this.bulletDamage * (resources / 200)));
        enemy.health -= actualDamage;
    }
}

/** 🔥 LaserBullet - Treffer umiddelbart */
export class LaserBullet extends Bullet {
    constructor(x, y, targetX, targetY) {
        super(x, y, y, "laser");
        this.targetX = targetX;
        this.targetY = targetY;
    }

    move() {
        // Laser trenger ikke å bevege seg, den treffer umiddelbart
    }

    draw(ctx) {
        ctx.strokeStyle = "cyan";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(this.x + cellSize / 2, this.y + cellSize / 2);
        ctx.lineTo(this.targetX + cellSize / 2, this.targetY + cellSize / 2);
        ctx.stroke();
    }

    dealDamage(enemy) {
        enemy.health -= this.bulletDamage * 2; // Laser gjør mer skade
    }
}

/** 💥 RocketBullet - Eksploderer på treff */
export class RocketBullet extends Bullet {
    constructor(x, y, enemy) {
        super(x, y, y, "rocket");
        this.target = enemy;
        this.exploded = false;
    }

    move() {
        if (!this.exploded) {
            this.x += (this.target.x - this.x) * 0.05; // Juster fart mot fienden
            this.y += (this.target.y - this.y) * 0.05;
        }
    }

    draw(ctx) {
        ctx.fillStyle = "red";
        ctx.beginPath();
        ctx.arc(this.x + cellSize / 2, this.y + cellSize / 2, 5, 0, Math.PI * 2);
        ctx.fill();

        if (this.exploded) {
            ctx.fillStyle = "orange";
            ctx.beginPath();
            ctx.arc(this.x + cellSize / 2, this.y + cellSize / 2, 20, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    dealDamage(enemy) {
        if (!this.exploded) {
            enemy.health -= this.bulletDamage * 1.5; // Rakett gjør middels skade

            // Eksplosjonseffekt - skader flere fiender innenfor radius
            enemies.forEach(e => {
                if (Math.abs(e.x - this.x) < 50 && Math.abs(e.y - this.y) < 50) {
                    e.health -= this.bulletDamage;
                }
            });

            this.exploded = true;
        }
    }
}

export const bullets = [];
