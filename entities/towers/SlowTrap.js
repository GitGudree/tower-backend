import { Tower } from "./tower.js";
import { cellSize } from "../../game/grid.js";
import { money, updateMoney } from "../../game/game.js";
import { collision } from "../../game/hitreg.js";

export class SlowTrap extends Tower {
    constructor(x, y, type, laneIndex) {
        super(x, y, type, laneIndex);
        this.name = "slowtrap";
        this.x = x;
        this.y = y;
        this.slowFactor = 0.5; // Reduces enemy speed by 50%
        this.slowDuration = 3000; // 3 seconds in milliseconds
        this.background = '#4682B4'; // Steel blue color
        this.textColor = 'white';
        this.selected = false;
        this.laneIndex = laneIndex;
        this.isActive = true;
        this.health = 100; // Can be used a few times before breaking
        this.affectedEnemies = new Map(); // Track affected enemies and their timers
        
        // Completely disable collision handling
        this.stopEnemy = 0;
        this.isColliding = false;
    }

    update(deltaTime) {
        // Update slow effect timers and remove expired effects
        for (const [enemy, data] of this.affectedEnemies.entries()) {
            if (enemy.isDead) {
                this.affectedEnemies.delete(enemy);
                continue;
            }

            data.timer += deltaTime;
            if (data.timer >= this.slowDuration) {
                enemy.speed = data.originalSpeed;
                enemy.isSlowed = false;
                this.affectedEnemies.delete(enemy);
            }
        }

        if (this.health <= 0) {
            // Remove all slow effects before destroying the trap
            for (const [enemy, data] of this.affectedEnemies.entries()) {
                if (!enemy.isDead) {
                    enemy.speed = data.originalSpeed;
                    enemy.isSlowed = false;
                }
            }
            return true; // Remove the trap if it's broken
        }
        return false;
    }

    // Override the attack method to check for enemy collision instead of shooting
    attack(enemies) {
        if (this.isActive && this.health > 0) {
            for (let enemy of enemies) {
                if (collision(this, enemy) && !enemy.isSlowed && !this.affectedEnemies.has(enemy)) {
                    // Store original speed and start tracking the enemy
                    const originalSpeed = enemy.speed;
                    enemy.speed *= this.slowFactor;
                    enemy.isSlowed = true;
                    
                    this.affectedEnemies.set(enemy, {
                        originalSpeed: originalSpeed,
                        timer: 0
                    });

                    this.health -= 25; // Reduce trap health each time it's triggered
                    console.log("Slow trap activated!");
                }
            }
        }
    }

    draw(ctx) {
        if (this.health > 0) {
            ctx.fillStyle = this.background;
            // Draw trap base
            ctx.beginPath();
            ctx.moveTo(this.x + cellSize/2, this.y + cellSize/4);
            ctx.lineTo(this.x + cellSize*3/4, this.y + cellSize*3/4);
            ctx.lineTo(this.x + cellSize/4, this.y + cellSize*3/4);
            ctx.closePath();
            ctx.fill();

            if (this.selected) {
                ctx.strokeStyle = 'white';
                ctx.lineWidth = 2;
                ctx.stroke();
            }

            // Draw health indicator
            ctx.fillStyle = this.textColor;
            ctx.font = '16px Impact';
            ctx.textAlign = 'center';
            ctx.fillText(Math.floor(this.health), this.x + cellSize/2, this.y + cellSize/2);

            // Draw slow effect radius if active
            if (this.affectedEnemies.size > 0) {
                ctx.strokeStyle = 'rgba(70, 130, 180, 0.3)';
                ctx.beginPath();
                ctx.arc(this.x + cellSize/2, this.y + cellSize/2, cellSize/2, 0, Math.PI * 2);
                ctx.stroke();
            }
        }
    }

    // Override all collision-related methods to do nothing
    stopEnemyMovement() {
        return;
    }

    updateTowerCollision() {
        return;
    }

    // Basic upgrade functionality
    upgrade() {
        if (money < this.upgradeCost || this.upgradeCost === -1) return;
        
        const cost = this.upgradeCost;
        switch (this.upgrades) {
            case 0:
                this.slowDuration += 1000; // Add 1 second to slow duration
                this.health = 100; // Restore health
                break;
            default:
                return;
        }
        
        updateMoney('decrease', cost);
        this.upgrades++;
    }

    getUpgradeStats() {
        const oldStats = {
            health: this.health,
            range: 0,
            fireRate: 0,
            damage: 0,
            upgradeCost: this.upgradeCost
        };

        const newStats = {
            health: 100, // Full health after upgrade
            range: 0,
            fireRate: 0,
            damage: 0,
            upgradeCost: -1 // Can only upgrade once
        };

        return { oldStats, newStats };
    }
} 