import { Tower } from "./tower.js";
import { RocketBullet } from "../projectiles/RocketBullet.js";
import { money, updateMoney } from "../../game/game.js";
import { sprites } from "../spriteLoader.js";
import { SpriteAnimator } from "../spriteAnimator.js";
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
        this.health = 30;
        this.range = 700;
        this.damage = 10;
        this.projectiles = [];
        this.fireRate = 160;
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
            }
            
            this.timer = this.fireRate;
        } else {
            this.timer--;
        }
    }

    upgrade() {
        if (money < this.upgradeCost || this.upgradeCost === -1) return;

        const cost = this.upgradeCost;
        switch (this.upgrades) {
            case 0:
                this.range += 50;
                this.damage = 14;

                // Next upgrade cost
                this.upgradeCost = 300;
                break;
            case 1:
                this.range += 100;
                this.fireRate = 150;
                this.damage = 18;

                // Next upgrade cost
                this.upgradeCost = 1_000;
                break;
            case 2:
                this.range += 150;
                this.fireRate = 140;
                this.damage = 22;

                // Next upgrade cost
                this.upgradeCost = 5_000;
                break;
            case 3:
                this.range += 200;
                this.fireRate = 120;
                this.damage = 28;

                // Next upgrade cost - 1e3=1.000, 1e6=1.000.000
                this.upgradeCost = 1e9;
                break;
            default:
                return;
        }

        updateMoney('decrease', cost);

        this.health += 50;
        this.upgrades++;
        
        
        //towerDamageElement.textContent = this.damage;
        //towerUpgradePriceElement.textContent = this.upgradeCost;

    }
    getUpgradeStats() {

        const oldStats = {
            health: this.health,
            range: this.range,
            fireRate: this.fireRate,
            damage: this.damage,
            upgradeCost: this.upgradeCost
        };

        let newRange = this.range;
        let newFireRate = this.fireRate;
        let newDamage = this.damage;
        let newUpgradeCost = this.upgradeCost;

        switch (this.upgrades) {
            case 0:
                newRange += 50;
                newDamage = 20;

                newUpgradeCost = 300;
                break;
            case 1:
                newRange += 100;
                newDamage = 25;

                newUpgradeCost = 1_000;
                break;
            case 2:
                newRange += 150;
                newDamage = 30;

                newUpgradeCost = 5_000;
                break;
            case 3:
                newRange += 150;
                newFireRate = 100; // lower = better
                newDamage = 35;

                newUpgradeCost = 1e9;
                break;
            default:
                return {
                    oldStats,
                    newStats: oldStats
                };
        }

        const newStats = {
            health: oldStats.health + 50,
            range: newRange,
            fireRate: newFireRate,
            damage: newDamage,
            upgradeCost: newUpgradeCost
        };

        return { oldStats, newStats };
    }

}

