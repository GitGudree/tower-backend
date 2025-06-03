import { Tower } from "./tower.js";
import { cellSize } from "../../game/grid.js";
import { money, updateMoney } from "../../game/game.js";
import { collision } from "../../game/hitreg.js";
import { soundManager } from "../../game/soundManager.js";
import { sprites } from "../spriteLoader.js";
import { SpriteAnimator } from "../spriteAnimator.js";
import { recordTowerDamage } from "../../game/statistics.js";

/**
 * Slow Trap tower class implementing enemy movement reduction functionality.
 * 
 * @class SlowTrap
 * @extends Tower
 * @param {number} x - X coordinate
 * @param {number} y - Y coordinate
 * @param {string} type - Tower type
 * @param {number} laneIndex - Lane position
 * @author Randomfevva
 **/

export class SlowTrap extends Tower {
    constructor(x, y, type, laneIndex) {
        super(x, y, type, laneIndex);
        this.name = "SlowTrap";
        this.x = x;
        this.y = y;
        this.slowFactor = 0.5; 
        this.slowDuration = 3000; 
        this.background = '#4682B4'; 
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
        this.affectedEnemies = new Map(); 
        
        this.stopEnemy = 0;
        this.isColliding = false;

        this.animatorLive= new SpriteAnimator (sprites.slowTower, 0, 50, 50, 1, 50000); 
    }

    update(deltaTime) {
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
            for (const [enemy, data] of this.affectedEnemies.entries()) {
                if (!enemy.isDead) {
                    enemy.speed = data.originalSpeed;
                    enemy.isSlowed = false;
                }
            }
            return true; 
        }
        return false;
    }

    attack(enemies) {
        if (this.isActive && this.health > 0) {
            for (let enemy of enemies) {
                if (collision(this, enemy) && !enemy.isSlowed && !this.affectedEnemies.has(enemy)) {
                    const originalSpeed = enemy.speed;
                    enemy.speed *= this.slowFactor;
                    enemy.isSlowed = true;
                    
                    this.affectedEnemies.set(enemy, {
                        originalSpeed: originalSpeed,
                        timer: 0
                    });

                    this.health -= 25;  
                    recordTowerDamage(25);
                    soundManager.play('slow_trap');
                    console.log("Slow trap activated!");
                }
            }
        }
    }

    draw(ctx) {
        if (this.health > 0) {
            
         
            /*
            if (this.selected) {
                ctx.strokeStyle = 'white';
                ctx.lineWidth = 2;
                ctx.stroke();
            }*/


            if (this.affectedEnemies.size > 0) {
                ctx.strokeStyle = 'rgba(70, 130, 180, 1)';
                ctx.beginPath();
                ctx.arc(this.x + cellSize/2, this.y + cellSize/2, cellSize/2, 0, Math.PI * 2);
                ctx.stroke();
            }
                

            this.drawSynergyEffects(ctx);
            this.drawSprite(ctx);
        }
    }

    drawSprite(ctx) {
        this.animatorLive.draw(ctx, this.x, this.y);

        if (this.selected) {
            ctx.save();
            ctx.strokeStyle = 'yellow';
            ctx.lineWidth = 2;
            ctx.strokeRect(this.x, this.y, cellSize, cellSize);
            ctx.restore();
        }
    }
    
    stopEnemyMovement() {
        return;
    }

    updateTowerCollision() {
        return;
    }

    upgrade() {
        const UPGRADE_COSTS = [150, 300, 500, 750, 1000]; 
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

        const UPGRADE_COSTS = [150, 300, 500, 750, 1000]; 
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