import { Bullet } from './Bullet.js';
import { cellSize } from "../../game/grid.js";
import { projectiles } from "./projectiles.js";

export class ArtilleryShell extends Bullet {
    constructor(x, y, target, laneIndex) {
        super(x, y, "basic", laneIndex);
        this.target = target;
        this.speed = 0.05; // Slower speed for dramatic effect
        this.size = 15; // Larger size for visual impact
        this.color = '#8B4513'; // Brown color for artillery shell
        this.trailColor = 'rgba(139, 69, 19, 0.3)'; // Semi-transparent brown for trail
        this.trailLength = 20; // Longer trail for dramatic effect
        this.explosionRadius = 50; // Area of effect for the explosion
        this.hit = false;
        this.bulletDamage = 1000; // Set the damage to 1000
        this.explosionLifetime = 100; // How long the explosion effect lasts
    }

    move() {
        if (!this.hit && this.target) {
            // Move towards target
            this.x += (this.target.x - this.x) * this.speed;
            this.y += (this.target.y - this.y) * this.speed;

            // Collision check: if close enough to target, deal damage
            const dx = (this.target.x - this.x);
            const dy = (this.target.y - this.y);
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < this.size) {
                this.dealDamage(this.target);
            }
        }
    }

    draw(ctx) {
        // Draw trail
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        for (let i = 0; i < this.trailLength; i++) {
            const trailX = this.x - (this.dx * i * 0.5);
            const trailY = this.y - (this.dy * i * 0.5);
            ctx.lineTo(trailX, trailY);
        }
        ctx.strokeStyle = this.trailColor;
        ctx.lineWidth = this.size * 0.5;
        ctx.stroke();

        // Draw shell
        ctx.beginPath();
        ctx.arc(this.x + cellSize/2, this.y + cellSize/2, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw explosion effect when hitting
        if (this.hit) {
            // Draw multiple explosion circles for more dramatic effect
            for (let i = 0; i < 3; i++) {
                const radius = this.explosionRadius * (1 - i * 0.2);
                ctx.beginPath();
                ctx.arc(this.x + cellSize/2, this.y + cellSize/2, radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 165, 0, ${0.3 - i * 0.1})`;
                ctx.fill();
                ctx.strokeStyle = `rgba(255, 165, 0, ${0.5 - i * 0.1})`;
                ctx.lineWidth = 3;
                ctx.stroke();
            }

            // Remove the projectile after explosion animation
            setTimeout(() => {
                const index = projectiles.indexOf(this);
                if (index > -1) {
                    projectiles.splice(index, 1);
                }
            }, this.explosionLifetime);
        }
    }

    dealDamage(enemy) {
        if (!this.hit) {
            if (typeof enemy.takeDamage === 'function') {
                enemy.takeDamage(this.bulletDamage);
            } else {
                enemy.health -= this.bulletDamage;
            }
            this.hit = true;
        }
    }
} 