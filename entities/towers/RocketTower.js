import { Tower } from "./tower.js";
import { RocketBullet } from "../projectiles/RocketBullet.js";
import { money, updateMoney } from "../../game/game.js";
import { sprites } from "../spriteLoader.js";
import { SpriteAnimator } from "../spriteAnimator.js";
import { soundManager } from "../../game/soundManager.js";
/**
 * Rocket tower class
 *
 * @constructor (x, y, row)
 * Author:    Anarox, Randomfevva, Quetzalcoatl
 * Created:   27.03.2025
 **/
export class RocketTower extends Tower {
    constructor(x, y, type, laneIndex) {
        super(x, y, type, laneIndex);
        this.name = "Rocket";
        this.description = "A powerful rocket launcher with splash damage.";
        this.baseHealth = 70;
        this.baseRange = 600;
        this.baseDamage = 10;
        this.baseFireRate = 150;
        this.maxHealth = this.baseHealth;
        this.health = this.maxHealth;
        this.range = this.baseRange;
        this.damage = this.baseDamage;
        this.fireRate = this.baseFireRate;
        this.projectiles = [];
        this.bulletType = type;
        this.background = "grey"; 
        this.laneIndex = laneIndex;

        this.isFiring = false;
        this.deathDuration = 50;
        this.deathTimer = this.deathDuration;
        this.isDead;
        this.animationExtend = 3;
        this.fireAnimation = 0;
        

        this.animatorLive = new SpriteAnimator (sprites.rocket, 0, 50, 50, 3, 500); // image, startY, width, height, amount of frames, frame interval
        this.animatorDead = new SpriteAnimator (sprites.rocket, 50, 50, 50, 2, 200);
    }
    
    attack(enemies, bullets) {
        if (this.timer <= 0) {
            let fired = false;
            for (let enemy of enemies) {
                if (Math.abs(enemy.y - this.y) < 10 && Math.abs(enemy.x - this.x) < this.range) {
                    this.animationExtend = 5;
                    const bullet = new RocketBullet(this.x, this.y, enemy, this.laneIndex);
                    bullet.bulletDamage = this.damage;
                    bullets.push(bullet);
                    fired = true;
                    break;
                }            
            };
            if (fired){
                this.fireAnimation = 500
                this.animatorLive.reset();
                soundManager.play('rocket');
            }
            
            this.timer = this.fireRate;
        } else {
            this.timer--;
        }
    }

    upgrade() {
        const UPGRADE_COSTS = [150, 300, 500, 750, 1000];
        if (this.upgrades >= 5 || money < UPGRADE_COSTS[this.upgrades]) return;
        updateMoney('decrease', UPGRADE_COSTS[this.upgrades]);
        
        // Rocket-specific upgrades
        this.baseHealth += 25;  // Update base health
        this.maxHealth += 25;
        this.health += 25;
        this.baseDamage += 8;   // Update base damage
        this.damage += 8;
        this.baseRange += 40;   // Update base range
        this.range += 40;
        this.baseFireRate = Math.max(100, this.baseFireRate - 15); // Update base fire rate
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
            health: oldStats.health + 25,
            range: oldStats.range + 40,
            fireRate: Math.max(100, oldStats.fireRate - 15),
            damage: oldStats.damage + 8,
            upgradeCost: this.upgrades < 5 ? UPGRADE_COSTS[this.upgrades] : -1
        };

        return { oldStats, newStats };
    }

}

