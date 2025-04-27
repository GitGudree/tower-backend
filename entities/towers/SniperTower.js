import { sprites } from "../spriteLoader.js";
import { SpriteAnimator } from "../spriteAnimator.js";
import { Bullet } from "../projectiles/Bullet.js";
import { collision } from "../../game/hitreg.js";
import { updateResources } from "../../game/game.js";
import { money, updateMoney } from "../../game/game.js";
import { Tower} from "./tower.js";

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
        this.health = 30;
        this.range = 700;
        this.damage = 15;
        this.projectiles = [];
        this.fireRate = 120;
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
    /*
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
    
        draw (ctx) {
            if (!this.isDead){
                this.animatorLive.draw(ctx, this.x, this.y);
            } else {
                this.animatorDead.draw(ctx, this.x, this.y);
            }
        }
    
        attack(enemies, bullets) {
            if (this.timer <= 0 && !this.isDead) {
                let fired = false;
                enemies.forEach(enemy => {
                    if (Math.abs(enemy.y - this.y) < 10 && Math.abs(enemy.x - this.x) < this.range) {
                        this.animationExtend = 5;
                        const bullet = new Bullet(this.x + 18, this.y - 4, this.bulletType, this.laneIndex);
                        bullet.bulletDamage = this.damage;
                        bullets.push(bullet);
                        fired = true;
                    }           
                });

                if (fired){
                    this.fireAnimation = 500
                    this.animatorLive.reset();
                }
    
                this.isFiring = fired;
                this.timer = this.fireRate;
            } else {
                this.timer--;
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
                            this.deathMessage = "-5 Resources";
                            this.deathMessageTimer = 60;
                
                            updateResources("decrease", 5);
                
                
                            for (let enemy of enemies) {
                                enemy.resumeMove();
                            }
                        }
                    }
                    this.iFrames += enemy.attackspeed;
                }
                   
            } else{
                this.iFrames--;
            }
        
        }
            */
    upgrade() {
            if (money < this.upgradeCost || this.upgradeCost === -1) return;
    
            const cost = this.upgradeCost;
            switch (this.upgrades) {
                case 0:
                    this.range += 50;
                    this.damage = 20;
    
                    // Next upgrade cost
                    this.upgradeCost = 300;
                    break;
                case 1:
                    this.range += 100;
                    this.damage = 25;
    
                    // Next upgrade cost
                    this.upgradeCost = 1_000;
                    break;
                case 2:
                    this.range += 150;
                    this.damage = 30;
    
                    // Next upgrade cost
                    this.upgradeCost = 5_000;
                    break;
                case 3:
                    this.range += 200;
                    this.fireRate = 100;
                    this.damage = 35;
    
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
