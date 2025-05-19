import { Tower } from "./tower.js";
import { LaserBullet } from "../projectiles/laserBullet.js";
import { sprites } from "../spriteLoader.js";
import { SpriteAnimator } from "../spriteAnimator.js";
import { money, updateMoney } from "../../game/game.js";
import { soundManager } from "../../game/soundManager.js";

/**
 * Laser tower class
 *
 * @constructor (x, y, row)
 * @author Quetzalcoatl
 * @contributor Randomfevva
 * Created:   27.03.2025
 **/
export class LaserTower extends Tower {
    constructor(x, y, type, laneIndex) {
        super(x, y, type, laneIndex);
        this.name = "Laser";
        this.description = "A high-tech laser tower with piercing damage.";
        this.baseHealth = 50;
        this.baseRange = 1000;
        this.baseDamage = 0.5;
        this.baseFireRate = 5;
        this.maxHealth = this.baseHealth;
        this.health = this.maxHealth;
        this.range = this.baseRange;
        this.damage = this.baseDamage;
        this.fireRate = this.baseFireRate;
        this.width = 5;
        this.height = 5;
        this.health = 50; 
        this.range = 1000;
        this.damage = 0.5;
        this.fireRate = 5;
        this.projectiles = [];
        this.bulletType = type;
        this.background = "purple";
        this.laneIndex = laneIndex;
        this.currentBullet = null;

        this.deathDuration = 50;
        this.deathTimer = this.deathDuration;
        this.isDead = false;

        this.animatorLive = new SpriteAnimator (sprites.laser, 0, 50, 50, 10, 200); 
        this.animatorDead = new SpriteAnimator (sprites.laser, 50, 50, 50, 2, 200);

        this.isLoopingSound = false;
        this.wasFiringLastTick = false;
    }

    update(deltaTime) {
        super.update(deltaTime);
        if (!this.isDead) {
            this.animatorLive.update(deltaTime);
        }
        
        if (this.health <= 0 && !this.isDead) {
            this.isDead = true;
        }
            
    }
    
    attack(enemies, bullets) {
        if (this.isDead) return;

        const target = enemies.find(enemy =>
            Math.abs(enemy.y - this.y) < 10 &&
            Math.abs(enemy.x - this.x) < this.range
        );

        if (target && !this.wasFiringLastTick) {
            soundManager.playLoop('laser');
            this.isLoopingSound = true;
            this.animatorLive.reset();
        } else if (!target && this.wasFiringLastTick) {
            soundManager.stopLoop('laser');
            this.isLoopingSound = false;
            this.animatorLive.reset();
        }

        if (target) {
            const bullet = new LaserBullet(this.x + 16, this.y - 1, target.x, target.y, this);
            bullet.bulletDamage = this.damage;
            bullets.push(bullet);
        }

        this.wasFiringLastTick = !!target;
    }

    upgrade() {
        const UPGRADE_COSTS = [150, 300, 500, 750, 1000];
        if (this.upgrades >= 5 || money < UPGRADE_COSTS[this.upgrades]) return;
        updateMoney('decrease', UPGRADE_COSTS[this.upgrades]);
        
        this.baseHealth += 20;  
        this.maxHealth += 20;
        this.health += 20;
        this.baseDamage += 0.2; 
        this.damage += 0.2;
        this.baseRange += 100;  
        this.range += 100;
        this.baseFireRate = Math.max(3, this.baseFireRate - 0.5); 
        this.fireRate = this.baseFireRate;
        
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
            health: oldStats.health + 20,
            range: oldStats.range + 100,
            fireRate: Math.max(3, oldStats.fireRate - 0.5),
            damage: +(oldStats.damage + 0.2).toFixed(1), 
            upgradeCost: this.upgrades < 5 ? UPGRADE_COSTS[this.upgrades] : -1
        };

        return { oldStats, newStats };
    }
}
