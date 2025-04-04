import { cellSize } from "../../game/grid.js";
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
        this.exploded = false;
        this.bulletDamage = 3; // Rakett gjør middels skade
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
            enemy.health -= this.bulletDamage;

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