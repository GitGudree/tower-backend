import { sprites } from "../spriteLoader.js";
import { SpriteAnimator } from "../spriteAnimator.js";
import { Bullet } from "../projectiles/Bullet.js";
import { collision } from "../../game/hitreg.js";
import { updateResources } from "../../game/game.js";
import { money, updateMoney } from "../../game/game.js";
import { Tower} from "./tower.js";
import { soundManager } from "../../game/soundManager.js";

/**
 * Sniper tower class
 *
 * @constructor (x, y, row)
 * Author:    Anarox, Quetzalcoatl
 * Created:   27.03.2025
 **/
export class SniperTower extends Tower {
    constructor(x, y, type, laneIndex) {
        super(x, y, type, laneIndex);
        this.name = "Sniper";
        this.description = "A powerful sniper tower with high damage and range.";
        this.baseHealth = 80;
        this.baseRange = 700;
        this.baseDamage = 20;
        this.baseFireRate = 120;
        this.maxHealth = this.baseHealth;
        this.health = this.maxHealth;
        this.range = this.baseRange;
        this.damage = this.baseDamage;
        this.fireRate = this.baseFireRate;
        this.projectiles = [];
        this.bulletType = type;
        this.background = "yellow";  
        this.laneIndex = laneIndex;

        // animation stuff
        this.isFiring = false;
        this.deathDuration = 50;
        this.deathTimer = this.deathDuration;
        this.isDead;
        this.animationExtend = 5;
        this.fireAnimation = 0;
        this.frameInterval = 100;
        
        this.animatorLive = new SpriteAnimator (sprites.sniper, 0, 50, 50, 5); // image, startY, width, height, amount of frames, frame interval
        this.animatorDead = new SpriteAnimator (sprites.sniper, 50, 50, 50, 2, 200);
    }
 
    upgrade() {
        const UPGRADE_COSTS = [150, 300, 500, 750, 1000];
        if (this.upgrades >= 5 || money < UPGRADE_COSTS[this.upgrades]) return;
        updateMoney('decrease', UPGRADE_COSTS[this.upgrades]);
        
        // Sniper-specific upgrades
        this.baseHealth += 30;  // Update base health
        this.maxHealth += 30;
        this.health += 30;
        this.baseDamage += 15;  // Update base damage
        this.damage += 15;
        this.baseRange += 50;   // Update base range
        this.range += 50;
        this.baseFireRate = Math.max(80, this.baseFireRate - 10); // Update base fire rate
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
            health: oldStats.health + 30,
            range: oldStats.range + 50,
            fireRate: Math.max(80, oldStats.fireRate - 10),
            damage: oldStats.damage + 15,
            upgradeCost: this.upgrades < 5 ? UPGRADE_COSTS[this.upgrades] : -1
        };

        return { oldStats, newStats };
    }
    
    attack(enemies, bullets) {
        if (this.timer <= 0 && !this.isDead) {
            this.isFiring = false;
            let foundTarget = false;
            
            enemies.forEach(enemy => {
                if (Math.abs(enemy.y - this.y) < 10 && Math.abs(enemy.x - this.x) < this.range) {
                    this.animationExtend = 5;
                    const bullet = new Bullet(this.x + 18, this.y - 4, this.bulletType, this.laneIndex);
                    bullet.bulletDamage = this.damage;
                    bullets.push(bullet);
                    this.isFiring = true;
                    foundTarget = true;
                }           
            });

            if (this.isFiring) {
                this.fireAnimation = 500;
                this.animatorLive.reset();
                soundManager.play('sniper_fire');
            } else if (!foundTarget) {
                // Reset animation when no target is found
                this.animatorLive.reset();
                this.fireAnimation = 0;
            }
            
            this.timer = this.fireRate;
        } else {
            this.timer--;
        }
    }
}
