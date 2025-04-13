import { cellSize } from "../../game/grid.js";
import { projectiles } from "./projectiles.js";
/**
 * laser bullet class
 *
 * @author:    Randomfevva
 * editor:     Quetzalcoatl
 * Created:   27.03.2025
 **/
export class RocketBullet {
    constructor(x, y, enemy) {
        this.x = x;
        this.y = y;
        this.target = enemy;
        this.name = "rocket"
        this.exploded = false;
        this.bulletDamage = 3; // Rakett gjør middels skade
        this.speed = 0.05;
        this.width = 5;
        this.height = 5;
        this.aoe = 60;
        this.bulletDamage = 2;
        this.explosionLifetime = 100;
        this.pierceAmount = 1;
        this.hitEnemies = new Set();
        this.color = "purple"
    }

    move() {
        if (!this.exploded) {
            this.x += (this.target.x - this.x) * this.speed; // Juster fart mot fienden
            this.y += (this.target.y - this.y) * this.speed;
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
            ctx.arc(this.x + cellSize / 2, this.y + cellSize / 2, 40, 0, Math.PI * 2);
            ctx.fill();

            setTimeout(() => {
                const index = projectiles.indexOf(this);
                if (index > -1){
                    projectiles.splice(index, 1)
                }
            }, this.explosionLifetime);   
        }
    }

    dealDamage(enemy, enemies) {
        if (!this.exploded) {
            enemy.health -= this.bulletDamage;

            // Eksplosjonseffekt - skader flere fiender innenfor radius
            enemies.forEach(e => {
                if (Math.abs(e.x - this.x) < this.aoe && Math.abs(e.y - this.y) < this.aoe) {
                    e.health -= this.bulletDamage;
                }
            });

            this.exploded = true;
        }
    }
}