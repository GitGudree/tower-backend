import { sprites } from "../spriteLoader.js";
import { SpriteAnimator } from "../spriteAnimator.js";
import { Bullet } from "../projectiles/Bullet.js";
import { collision } from "../../game/hitreg.js";
import { updateResources, towerDamageElement, towerUpgradePriceElement, resources } from "../../game/game.js";
import { cellSize, rows } from "../../game/grid.js";
import { money, updateMoney } from "../../game/game.js";
import { toastSuccess, toastError, toastWarning, TOAST_MESSAGES } from "../../game/toast-message.js";
import { getTowerPrice } from "../../game/towerUnlockSystem.js";
import { soundManager } from "../../game/soundManager.js";

/**
 * Base Tower class implementing core tower functionality.
 * 
 * @class Tower
 * @param {number} x - X coordinate
 * @param {number} y - Y coordinate
 * @param {string} type - Tower type
 * @param {number} row - Row position
 * @author Anarox, Quetzalcoatl
 * @date 2025-01-25
 **/
export class Tower {
    constructor(x, y, type, row) {
        this.x = x;
        this.y = y;
        this.name = "Shooter";
        this.baseHealth = 100;
        this.baseRange = 500;
        this.baseDamage = 5;
        this.baseFireRate = 40;
        
        this.maxHealth = this.baseHealth;
        this.health = this.maxHealth;
        this.range = this.baseRange;
        this.damage = this.baseDamage;
        this.fireRate = this.baseFireRate;
        
        this.width = cellSize;
        this.height = cellSize;
        this.projectiles = [];
        this.timer = 0;
        this.iFrames = 0;
        this.stopEnemy = 100;
        this.upgradeCost = 150;
        this.upgrades = 0;
        this.selected = false;
        this.bulletType = type;
        this.isColliding = false;
        this.laneIndex = row;

        this.synergyRange = 2;
        this.synergyBonus = {
            damage: 0,
            fireRate: 0,
            range: 0,
            health: 0,
            piercing: 0,
            slowEffect: 0
        };
        this.synergizedWith = new Set();
        this.synergyGlowColor = null;
        this.hasActiveSynergies = false;
        this.lastSynergyCheck = 0;
        this.appliedSynergyBonuses = new Set();

        this.background = 'blue';
        this.textColor = 'lightgray';

        this.isFiring = false;
        this.deathDuration = 50;
        this.deathTimer = this.deathDuration;
        this.isDead = false;
        this.animationExtend = 3;
        this.fireAnimation = 0;
        this.fireAnimationTime = 500;
        this.frameInterval = 100;
        

        this.animatorLive = new SpriteAnimator (sprites.default, 0, 50, 50, 3); 
        this.animatorDead = new SpriteAnimator (sprites.default, 50, 50, 50, 2, 200);
    }
    
    stopEnemyMovement(enemies) { 
        if (this.stopEnemy <= 0){
            for (let enemy of enemies){
                if (collision(this, enemy)) {
                    this.isColliding = true;
                    enemy.stopMove();
                }
            }
        } else if (this.stopEnemy > 0){
            this.stopEnemy --
        }
            
    }

    updateTowerCollision(enemies, towerIndex) {
        if (this.iFrames <= 0) {
            for (let enemy of enemies) {
                if (collision(this, enemy, "test")) {
                    enemy.stopMove();
                    enemy.attack(this);
                        
                    if (this.health <= 0) {
                        this.isDead = true;
                        this.deathTimer = this.deathDuration;
                        this.isColliding = false;
                        soundManager.play('tower_destroy');
                        
                        for (let enemy of enemies) {
                            enemy.resumeMove();
                        }
                    }
                }
                this.iFrames += enemy.attackspeed;
            }
               
        } else {
            this.iFrames--;
        }
    }
    
       
    update(deltaTime) {
        if (this.isDead) {
            this.animatorDead.update(deltaTime)
            if (this.deathTimer >= 0){
                this.deathDuration -= deltaTime;
            }
        } else {
            if (this.fireAnimation > 0) {
                this.animatorLive.update(deltaTime);
                this.fireAnimation -= deltaTime;
            }
        }
    }
    
    draw(ctx) {
        this.drawSprite(ctx);
        this.drawSynergyEffects(ctx);
    }

    drawSprite(ctx) {
        if (!this.isDead) {
            this.animatorLive.draw(ctx, this.x, this.y);
        } else {
            this.animatorDead.draw(ctx, this.x, this.y);
        }

        if (this.selected) {
            ctx.save();
            ctx.strokeStyle = 'yellow';
            ctx.lineWidth = 2;
            ctx.strokeRect(this.x, this.y, cellSize, cellSize);
            ctx.restore();
        }
    }

    drawSynergyEffects(ctx) {
        if (this.hasActiveSynergies) {
            ctx.save();
            
            ctx.strokeStyle = this.synergyGlowColor;
            ctx.lineWidth = 2;
            ctx.globalAlpha = 0.4;
            ctx.strokeRect(this.x, this.y, cellSize, cellSize);

            ctx.setLineDash([3, 3]);
            ctx.lineWidth = 1;
            ctx.globalAlpha = 0.3;
            for (const otherTower of this.synergizedWith) {
                ctx.beginPath();
                ctx.moveTo(this.x + this.width / 2, this.y + this.height / 2);
                ctx.lineTo(otherTower.x + otherTower.width / 2, otherTower.y + otherTower.height / 2);
                ctx.stroke();
            }
            ctx.setLineDash([]);

            ctx.font = '14px Arial';
            ctx.textAlign = 'center';
            ctx.fillStyle = this.synergyGlowColor;
            ctx.globalAlpha = 1;
            
            let synergyIcon = '';
            const towerName = this.name.toLowerCase();
            
            if (towerName === 'laser' && this.synergyBonus.piercing) {
                synergyIcon = '⚡'; 
            } else if (towerName === 'gatling' && (this.synergyBonus.damage > 0 || this.synergyBonus.fireRate > 0)) {
                synergyIcon = this.synergyBonus.damage > 0 ? '⚔️' : '⚡'; 
            } else if (towerName === 'sniper' && this.synergyBonus.range > 0) {
                synergyIcon = '🎯'; 
            } else if (towerName === 'barricade' && this.synergyBonus.health > 0) {
                synergyIcon = '❤️'; 
            } else if (towerName === 'rocket' && (this.synergyBonus.range > 0 || this.synergyBonus.damage > 0)) {
                synergyIcon = '🎯'; 
            } else if (towerName === 'mine' && this.synergyBonus.damage > 0) {
                synergyIcon = '⚔️'; 
            } else if (towerName === 'slowtrap' && this.synergyBonus.slowEffect > 0) {
                synergyIcon = '❄️'; 
            }

            if (synergyIcon) {
                ctx.fillText(synergyIcon, this.x + this.width / 2, this.y - 5);
            }

            ctx.restore();
        }

        if (this.selected) {
            ctx.save();
            ctx.strokeStyle = 'yellow';
            ctx.lineWidth = 2;
            ctx.strokeRect(this.x, this.y, cellSize, cellSize);
            ctx.restore();
        }
    }
    
        attack(enemies, bullets) {
            if (this.timer <= 0 && !this.isDead) {
                this.isFiring = false;
                let foundTarget = false;
                
                enemies.forEach(enemy => {
                    if (Math.abs(enemy.y - this.y) < 10 && Math.abs(enemy.x - this.x) < this.range) {
                        this.animationExtend = this.animationExtend;
                        const bullet = new Bullet(this.x + 18, this.y - 4, this.bulletType, this.laneIndex);
                        bullet.bulletDamage = this.damage;
                        bullets.push(bullet);
                        this.isFiring = true;
                        foundTarget = true;
                    }           
                });

                if (this.isFiring) {
                    this.fireAnimation = this.fireAnimationTime;
                    this.animatorLive.reset();
                    soundManager.play('tower_shoot');
                } else if (!foundTarget) {
                    this.fireAnimation = 0;
                    this.animatorLive.reset();
                    
                }
                
                this.timer = this.fireRate;
            } else {
                this.timer--;
            }
        }

    upgrade() {
        const UPGRADE_COSTS = [150, 300, 500, 750, 1000]; // Costs for levels 2-6
        if (this.upgrades >= 5) {
            return false;
        }
        
        const cost = UPGRADE_COSTS[this.upgrades];
        if (money < cost) {
            return false;
        }
        
        // Deduct money first
        updateMoney('decrease', cost);
        
        // Then apply upgrades
        this.baseHealth += 50;
        this.maxHealth += 50;
        this.health += 50;
        
        const nextLevel = this.upgrades + 1;
        
        if (nextLevel >= 2) {
            this.baseRange = Math.floor(this.baseRange * (1 + 0.1)); 
            this.baseFireRate = Math.floor(this.baseFireRate * (1 - 0.05)); 
            
            if (nextLevel >= 3) {
                this.baseDamage += nextLevel; 
            }
        }
        
        const statMultiplier = 1 + (nextLevel * 0.1); 
        this.range = Math.floor(this.baseRange * statMultiplier);
        this.damage = Math.floor(this.baseDamage * statMultiplier);
        this.fireRate = Math.floor(this.baseFireRate * (1 - (nextLevel * 0.05))); 
        
        this.upgrades++;
        return true;
    }
    
    /**
     * Retrieves current and next upgrade statistics for the tower.
     * 
     * @method getUpgradeStats
     * @returns {Object} Contains current and projected upgrade statistics
     * @description Provides two objects containing current and projected stats after upgrade
     * @author Anarox
     * @date 2025-03-09
     **/
    getUpgradeStats() {
        const oldStats = {
            health: this.health,
            range: this.range,
            fireRate: this.fireRate,
            damage: this.damage,
            upgradeCost: this.upgradeCost
        };

        const UPGRADE_COSTS = [150, 300, 500, 750, 1000]; 
        const nextLevel = this.upgrades + 1;
        const statMultiplier = 1 + (nextLevel * 0.1); 
        
        const newStats = {
            health: oldStats.health + 50,
            range: Math.floor(this.baseRange * statMultiplier),
            fireRate: Math.floor(this.baseFireRate * (1 - (nextLevel * 0.05))),
            damage: Math.floor(this.baseDamage * statMultiplier),
            upgradeCost: this.upgrades < 5 ? UPGRADE_COSTS[this.upgrades] : -1
        };

        return { oldStats, newStats };
    }

    /**
     * Check for and apply synergies with nearby towers
     * @param {Array} towers - All towers in the game
     * @param {boolean} force - Force synergy check regardless of time
     */
    checkSynergies(towers, force = false) {
        const currentTime = Date.now();
        if (!force && currentTime - this.lastSynergyCheck < 1000) {
            return;
        }
        this.lastSynergyCheck = currentTime;

        const oldSynergies = new Set(this.synergizedWith);
        
        this.synergizedWith.clear();
        this.synergyGlowColor = null;

        for (const otherTower of towers) {
            if (otherTower === this) continue;

            const thisGridX = Math.floor(this.x / cellSize);
            const thisGridY = Math.floor(this.y / cellSize);
            const otherGridX = Math.floor(otherTower.x / cellSize);
            const otherGridY = Math.floor(otherTower.y / cellSize);

            if (thisGridY !== otherGridY) continue;

            const gridDistance = Math.abs(thisGridX - otherGridX);
            if (gridDistance <= this.synergyRange) {
                this.applySynergyEffects(otherTower);
            }
        }

        const synergyStateChanged = 
            this.synergizedWith.size !== oldSynergies.size ||
            ![...this.synergizedWith].every(tower => oldSynergies.has(tower));

        if (synergyStateChanged) {
            this.hasActiveSynergies = this.synergizedWith.size > 0;
            
            for (const oldSynergyTower of oldSynergies) {
                if (!this.synergizedWith.has(oldSynergyTower)) {
                    this.removeSynergyBonuses(oldSynergyTower);
                }
            }

            for (const newSynergyTower of this.synergizedWith) {
                if (!oldSynergies.has(newSynergyTower)) {
                    this.applySynergyBonuses(newSynergyTower);
                }
            }

            if (this.hasActiveSynergies) {
                console.log(`${this.name} tower synergies updated:`, {
                    synergiesWith: [...this.synergizedWith].map(t => t.name),
                    bonuses: this.synergyBonus
                });
            }
        }
    }

    applySynergyBonuses(otherTower) {
        if (!this.appliedSynergyBonuses.has(otherTower)) {
            const thisName = this.name.toLowerCase();
            const otherName = otherTower.name.toLowerCase();

            if (thisName === "laser" && otherName === "gatling") {
                this.piercing = true;
                this.synergyBonus.piercing = 1;
            } else if (thisName === "gatling" && otherName === "laser") {
                this.damage += 2;
                this.synergyBonus.damage = 2;
            } else if (thisName === "sniper" && otherName === "barricade") {
                this.range += 100;
                this.synergyBonus.range = 100;
            } else if (thisName === "barricade" && otherName === "sniper") {
                this.health += 50;
                this.synergyBonus.health = 50;
            } else if (thisName === "rocket" && otherName === "mine") {
                this.range += 50;
                this.damage += 2;
                this.synergyBonus.range = 50;
                this.synergyBonus.damage = 2;
            } else if (thisName === "mine" && otherName === "rocket") {
                this.damage += 5;
                this.synergyBonus.damage = 5;
            } else if (thisName === "slowtrap" && otherName === "gatling") {
                this.slowEffect = 2; // Double slow effect
                this.synergyBonus.slowEffect = 1;
            } else if (thisName === "gatling" && otherName === "slowtrap") {
                this.fireRate = Math.max(1, this.fireRate - 5);
                this.synergyBonus.fireRate = 5;
            }

            this.appliedSynergyBonuses.add(otherTower);
        }
    }

    removeSynergyBonuses(otherTower) {
        const thisName = this.name.toLowerCase();
        const otherName = otherTower.name.toLowerCase();

        if (thisName === "laser" && otherName === "gatling") {
            this.piercing = false;
            this.synergyBonus.piercing = 0;
        } else if (thisName === "gatling" && otherName === "laser") {
            this.damage -= 2;
            this.synergyBonus.damage = 0;
        } else if (thisName === "sniper" && otherName === "barricade") {
            this.range -= 100;
            this.synergyBonus.range = 0;
        } else if (thisName === "barricade" && otherName === "sniper") {
            this.health -= 50;
            this.synergyBonus.health = 0;
        } else if (thisName === "rocket" && otherName === "mine") {
            this.range -= 50;
            this.damage -= 2;
            this.synergyBonus.range = 0;
            this.synergyBonus.damage = 0;
        } else if (thisName === "mine" && otherName === "rocket") {
            this.damage -= 5;
            this.synergyBonus.damage = 0;
        } else if (thisName === "slowtrap" && otherName === "gatling") {
            this.slowEffect = 1; // Reset to normal slow effect
            this.synergyBonus.slowEffect = 0;
        } else if (thisName === "gatling" && otherName === "slowtrap") {
            this.fireRate = Math.min(this.fireRate + 5, this.baseFireRate);
            this.synergyBonus.fireRate = 0;
        }

        this.appliedSynergyBonuses.delete(otherTower);
    }

    getBaseStats() {
        return {
            health: this.baseHealth,
            range: this.baseRange,
            damage: this.baseDamage,
            fireRate: this.baseFireRate
        };
    }

    getCurrentStats() {
        return {
            health: this.health,
            range: this.range,
            damage: this.damage,
            fireRate: this.fireRate,
            synergyBonus: { ...this.synergyBonus }
        };
    }

    applySynergyEffects(otherTower) {
        const thisName = this.name.toLowerCase();
        const otherName = otherTower.name.toLowerCase();

        if ((thisName === "laser" && otherName === "gatling") ||
            (thisName === "gatling" && otherName === "laser")) {
            this.synergyGlowColor = '#ff00ff'; 
            this.synergizedWith.add(otherTower);
        } else if ((thisName === "sniper" && otherName === "barricade") ||
            (thisName === "barricade" && otherName === "sniper")) {
            this.synergyGlowColor = '#00ff00'; 
            this.synergizedWith.add(otherTower);
        } else if ((thisName === "rocket" && otherName === "mine") ||
            (thisName === "mine" && otherName === "rocket")) {
            this.synergyGlowColor = '#ff0000'; 
            this.synergizedWith.add(otherTower);
        } else if ((thisName === "slowtrap" && otherName === "gatling") ||
            (thisName === "gatling" && otherName === "slowtrap")) {
            this.synergyGlowColor = '#00ffff'; 
            this.synergizedWith.add(otherTower);
        }
    }

    /**
     * Repairs the tower's health using resources
     * @returns {boolean} Whether the repair was successful
     */
    repair() {
        if (this.health >= this.maxHealth) {
            toastWarning("Tower is already at full health!");
            return false;
        }

        const missingHealth = this.maxHealth - this.health;
        const repairCost = Math.ceil(missingHealth * 0.5); 

        if (resources >= repairCost) {
            updateResources("decrease", repairCost);
            this.health = this.maxHealth;
            toastSuccess("Tower repaired successfully!");
            return true;
        } else {
            toastError("Not enough resources to repair tower!");
            return false;
        }
    }

    /**
     * Scraps the tower for a refund
     * @returns {boolean} Whether the scrap was successful
     */
    scrap() {
        const refundAmount = Math.ceil(getTowerPrice(this.bulletType) * 0.7); 
        updateMoney("increase", refundAmount);
        
        const towerIndex = towers.findIndex(t => t === this);
        if (towerIndex !== -1) {
            towers.splice(towerIndex, 1);
        }

        toastSuccess(TOAST_MESSAGES.TOWER.SOLD);
        return true;
    }
    
}
export const towers = [];

/**
 * towerTypes object
 *

 * @description An object that contains all information about the turret
 * Author:    Anarox
 * Created:   09.03.2025
 **/

export const towerTypes = {
    'Shooter': {
        stats: {
            health: 100,
            healthIncrement: 50,
            range: 500,
            damage: 2,
            fireRate: 30,
            background: 'blue',
            textColor: 'lightgray'
        },
        upgradePath: [{
            range: 550,
            fireRate: 25,
            background: 'green',
            textColor: 'lightgray',
            upgradeCost: 150,
        }, {
            range: 650,
            damage: 3,
            fireRate: 20,
            background: 'yellow',
            textColor: 'gray',
            upgradeCost: 300
        }, {
            range: 800,
            damage: 5,
            fireRate: 15,
            background: 'orange',
            textColor: 'gray',
            upgradeCost: 1_000
        }, {
            range: 1_000,
            damage: 10,
            fireRate: 10,
            background: 'purple',
            textColor: 'lightgray',
            upgradeCost: 5_000
        }]
    },
    'Sniper': {
        stats: {
            health: 50,
            range: 1000,
            damage: 20,
            fireRate: 100,
            background: 'grey',
            textColor: 'lightgrey'
        },
        upgradePath: [{
            damage: 25,
            fireRate: 80,
            upgradeCost: 1_000,
        }, {
            damage: 30,
            fireRate: 60,
            upgradeCost: 5_000,
        }, {
            damage: 50,
            fireRate: 50,
            upgradeCost: 20_000,
        }, {
            damage: 100,
            fireRate: 50,
            upgradeCost: 100_000,
        }]
    }
        
}
    
