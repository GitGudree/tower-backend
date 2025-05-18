import { sprites } from "../spriteLoader.js";
import { SpriteAnimator } from "../spriteAnimator.js";
import { Bullet } from "../projectiles/Bullet.js";
import { collision } from "../../game/hitreg.js";
import { updateResources } from "../../game/game.js";
import { money, updateMoney } from "../../game/game.js";
import { Tower} from "./tower.js";
import { soundManager } from "../../game/soundManager.js";


/**
 * Gatling tower class
 *
 * @constructor (x, y, row)
 * Author:    Anarox, Quetzalcoatl
 * Created:   27.03.2025
 **/
export class GatlingTower extends Tower {
    constructor(x, y, type, laneIndex) {
        super(x, y, type, laneIndex);
        this.name = "Gatling";
        this.description = "A rapid-fire tower that excels at sustained damage.";
        this.baseHealth = 80;
        this.baseRange = 400;
        this.baseDamage = 3;
        this.baseFireRate = 10;
        this.maxHealth = this.baseHealth;
        this.health = this.maxHealth;
        this.range = this.baseRange;
        this.damage = this.baseDamage;
        this.fireRate = this.baseFireRate;
        this.projectiles = [];
        this.bulletType = type;
        this.laneIndex = laneIndex;
        this.background = "green";

        this.isFiring = false;
        this.deathDuration = 50;
        this.deathTimer = this.deathDuration;
        this.isDead;
        
        this.isLoopingSound = false;
        this.wasFiringLastTick = false;
        
        this.animatorLive = new SpriteAnimator (sprites.gatling, 0, 50, 50, 3); // image, startY, width, height, amount of frames, frame interval
        this.animatorDead = new SpriteAnimator (sprites.gatling, 50, 50, 50, 2, 200);
    }
    

    upgrade() {
        const UPGRADE_COSTS = [150, 300, 500, 750, 1000];
        if (this.upgrades >= 5 || money < UPGRADE_COSTS[this.upgrades]) return;
        updateMoney('decrease', UPGRADE_COSTS[this.upgrades]);
        
        // Gatling-specific upgrades
        this.baseHealth += 30;  // Update base health
        this.maxHealth += 30;
        this.health += 30;
        this.baseDamage += 2;   // Update base damage
        this.damage += 2;
        this.baseRange += 20;   // Update base range
        this.range += 20;
        this.baseFireRate = Math.max(5, this.baseFireRate - 2); // Update base fire rate
        this.fireRate = this.baseFireRate;
        
        this.upgrades++;
    }
    
    /**
     * getUpgradeStats
     *

    * @description Two objects, { old ... new } The new object is an instance of the old one, and are further tweaked to use newer upgrade stats,
    * serves as a temporarily data-placeholder for adding additional objects before project structure will be rewritten.
    * Author:    Anarox
    * Editor:    Quetzalcoatl
    * Created:   09.03.2025
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
        const newStats = {
            health: oldStats.health + 30,
            range: oldStats.range + 20,
            fireRate: Math.max(5, oldStats.fireRate - 2),
            damage: oldStats.damage + 2,
            upgradeCost: this.upgrades < 5 ? UPGRADE_COSTS[this.upgrades] : -1
        };

        return { oldStats, newStats };
    }

    attack(enemies, bullets) {
        if (this.timer <= 0 && !this.isDead) {
            let foundTarget = false;
            
            enemies.forEach(enemy => {
                if (Math.abs(enemy.y - this.y) < 10 && Math.abs(enemy.x - this.x) < this.range) {
                    this.animationExtend = this.animationExtend;
                    const bullet = new Bullet(this.x + 18, this.y - 4, this.bulletType, this.laneIndex);
                    bullet.bulletDamage = this.damage;
                    bullets.push(bullet);
                    foundTarget = true;
                }           
            });

            // Only start/stop the loop if the firing state changed
            if (foundTarget && !this.wasFiringLastTick) {
                soundManager.playLoop('gatling_fire');
                this.fireAnimation = this.fireAnimationTime;
                this.isLoopingSound = true;
            } else if (!foundTarget && this.wasFiringLastTick) {
                soundManager.stopLoop('gatling_fire');
                this.isLoopingSound = false;
                this.animatorLive.reset();
            }

            this.isFiring = foundTarget;
            this.wasFiringLastTick = foundTarget;
            this.timer = this.fireRate;
        } else {
            this.timer--;
            // If not firing, ensure the loop is stopped
            if (this.timer <= 0 && this.isLoopingSound) {
                soundManager.stopLoop('gatling_fire');
                this.isLoopingSound = false;
                this.wasFiringLastTick = false;
            }
        }
    }

    update(deltaTime) {
        if (this.isDead) {
            this.animatorDead.update(deltaTime);
            if (this.deathTimer >= 0) {
                this.deathDuration -= deltaTime;
            }
        } else {
            if (this.isFiring) {
                this.animatorLive.update(deltaTime);
            } else if (!this.isFiring && this.animatorLive.currentFrame !== 0) {
                this.animatorLive.reset();
            }
        }
    }
}

