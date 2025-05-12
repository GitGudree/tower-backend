import { Tower } from "./tower.js";
import { cellSize } from "../../game/grid.js";
import { money, updateMoney } from "../../game/game.js";
import { collision } from "../../game/hitreg.js";
import { soundManager } from "../../game/soundManager.js";

export class SlowTrap extends Tower {
    constructor(x, y, type, laneIndex) {
        super(x, y, type, laneIndex);
        this.name = "SlowTrap";
        this.x = x;
        this.y = y;
        this.slowFactor = 0.5; // Reduces enemy speed by 50%
        this.slowDuration = 3000; // 3 seconds in milliseconds
        this.background = '#4682B4'; // Steel blue color
        this.textColor = 'white';
        this.selected = false;
        this.laneIndex = laneIndex;
        this.isActive = true;
        this.baseHealth = 100;
        this.baseRange = 0;
        this.baseDamage = 0;
        this.baseFireRate = 0;
        this.health = this.baseHealth;
        this.range = this.baseRange;
        this.damage = this.baseDamage;
        this.fireRate = this.baseFireRate;
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
                    soundManager.play('slow_trap');
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

            // Draw synergy effects
            this.drawSynergyEffects(ctx);
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
        const UPGRADE_COSTS = [150, 300, 500, 750, 1000]; // Costs for levels 2-6
        if (this.upgrades >= 5 || money < UPGRADE_COSTS[this.upgrades]) return;
        updateMoney('decrease', UPGRADE_COSTS[this.upgrades]);
        this.maxHealth += 50;
        this.health += 50;
        this.upgrades++;
    }

    getUpgradeStats() {
        const oldStats = {
            health: this.health,
            range: this.range,
            fireRate: this.fireRate,
            damage: this.damage,
            upgradeCost: this.upgradeCost
        };

        const UPGRADE_COSTS = [150, 300, 500, 750, 1000]; // Costs for levels 2-6
        const newStats = {
            health: oldStats.health + 50,
            range: oldStats.range,
            fireRate: oldStats.fireRate,
            damage: oldStats.damage,
            upgradeCost: this.upgrades < 5 ? UPGRADE_COSTS[this.upgrades] : -1
        };

        return { oldStats, newStats };
    }
} 