import { Tower } from './tower.js';
import { ArtilleryShell } from '../projectiles/ArtilleryShell.js';
import { money, updateMoney } from '../../game/game.js';
import { soundManager } from '../../game/soundManager.js';
import { sprites } from "../spriteLoader.js";
import { SpriteAnimator } from "../spriteAnimator.js";
import { cellSize } from "../../game/grid.js";

/**
 * Artillery Tower class implementing long-range explosive damage functionality.
 * 
 * @class ArtilleryTower
 * @extends Tower
 * @param {number} x - X coordinate
 * @param {number} y - Y coordinate
 * @param {string} type - Tower type
 * @param {number} laneIndex - Lane position
 * @author Randomfevva
 **/

export class ArtilleryTower extends Tower {
    constructor(x, y, type, laneIndex) {
        super(x, y, type, laneIndex);
        this.name = "Artillery";
        this.description = "A powerful artillery piece that fires devastating shells. Only one can be placed per row.";
        this.baseHealth = 150;
        this.baseRange = 500;  
        this.baseDamage = 1000;
        this.baseFireRate = 3000;
        
        this.maxHealth = this.baseHealth;
        this.health = this.maxHealth;
        this.range = this.baseRange;
        this.damage = this.baseDamage;
        this.fireRate = this.baseFireRate;
        this.cost = 800;
        this.projectileType = ArtilleryShell;
        this.rotationSpeed = 0.02;
        this.towerType = "artillery"; 

        this.animatorLive = new SpriteAnimator (sprites.artillery, 0, 50, 50, 3); 
        this.animatorDead = new SpriteAnimator (sprites.artillery, 50, 50, 50, 1);
        this.timer = 0; 
    }

    canPlace(grid) {
        const row = Math.floor(this.y / grid.cellSize);
        for (let col = 0; col < grid.cols; col++) {
            const cell = grid.getCell(col, row);
            if (cell && cell.tower && cell.tower.towerType === "artillery") {
                return false;
            }
        }
        return true;
    }

    attack(enemies, bullets) {
        if (this.timer <= 0 && !this.isDead) {
            this.isFiring = false;
            let foundTarget = false;
            
            enemies.forEach(enemy => {
                if (Math.abs(enemy.y - this.y) < 10 && 
                    enemy.x > this.x && 
                    Math.abs(enemy.x - this.x) < this.range) {
                    const bullet = new ArtilleryShell(this.x + 18, this.y - 4, enemy, this.laneIndex);
                    bullet.bulletDamage = this.damage;
                    bullets.push(bullet);
                    this.isFiring = true;
                    foundTarget = true;
                }           
            });

            if (this.isFiring) {
                this.fireAnimation = this.fireAnimationTime;
                this.animatorLive.reset();
                soundManager.play('artillery_fire');
                this.timer = this.fireRate;
                this.animatorLive.currentFrame = 0;
                this.fireAnimation = 0;
            } else if (!foundTarget) {
                this.animatorLive.reset();
                this.fireAnimation = 0;
            }
        } else {
            this.timer--;
        }
    }

    update(deltaTime, enemies, grid, bullets) {
        super.update(deltaTime, enemies, grid);
    }

    upgrade() {
        const UPGRADE_COSTS = [150, 300, 500, 750, 1000];
        if (this.upgrades >= 5 || money < UPGRADE_COSTS[this.upgrades]) {
            return false;
        }
        
        updateMoney('decrease', UPGRADE_COSTS[this.upgrades]);
        
        this.baseHealth += 40;  
        this.maxHealth += 40;
        this.health += 40;
        this.baseDamage += 200; 
        this.damage += 200;
        this.baseFireRate = Math.max(2400, this.baseFireRate - 200); 
        this.fireRate = this.baseFireRate;
        
        this.upgrades++;
        return true;
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
            health: oldStats.health + 40,
            range: 550, 
            fireRate: Math.max(2400, oldStats.fireRate - 200),
            damage: oldStats.damage + 200,
            upgradeCost: this.upgrades < 5 ? UPGRADE_COSTS[this.upgrades] : -1
        };
        
        return { oldStats, newStats };
    }
} 