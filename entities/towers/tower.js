import { sprites } from "../spriteLoader.js";
import { SpriteAnimator } from "../spriteAnimator.js";
import { Bullet } from "../projectiles/Bullet.js";
import { collision } from "../../game/hitreg.js";
import { updateResources, towerDamageElement, towerUpgradePriceElement } from "../../game/game.js";
import { cellSize, rows } from "../../game/grid.js";
import { money, updateMoney } from "../../game/game.js";

/**
 * Tower Class
 *

 * @constructor (x, y, row)
 * Author:    Anarox, Quetzalcoatl
 * Created:   25.01.2025
 **/
export class Tower {
    constructor(x, y, type, row) {
        this.x = x;
        this.y = y;
        this.name = "Shooter";
        this.health = 80;
        this.range = 500;
        this.damage = 5;
        this.width = cellSize;
        this.height = cellSize;
        this.projectiles = [];
        this.fireRate = 40;
        this.timer = 0;
        //this.isFiring = false;
        this.iFrames = 0;
        this.stopEnemy = 100; // can cause rubberbanding if value exceeds 100
        this.upgradeCost = 150;
        this.upgrades = 0;
        this.selected = false;
        this.bulletType = type;
        this.isColliding = false;
        this.laneIndex = row;

        // Tower style
        this.background = 'blue';
        this.textColor = 'lightgray';

        this.isFiring = false;
        this.deathDuration = 50;
        this.deathTimer = this.deathDuration;
        this.isDead;
        this.animationExtend = 3;
        this.fireAnimation = 0;
        this.frameInterval = 100;
        

        this.animatorLive = new SpriteAnimator (sprites.default, 0, 50, 50, 3); // image, startY, width, height, amount of frames, frame interval
        this.animatorDead = new SpriteAnimator (sprites.default, 50, 50, 50, 2, 200);
    }
    
    stopEnemyMovement(enemies) { // used to prevent rubberbanding
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
                        this.animationExtend = this.animationExtend;
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

    upgrade() {
        if (money < this.upgradeCost || this.upgradeCost === -1) return;

        // DO NOT REMOVE THIS CODE!!!
        // const towerUpgrades = towerTypes['Shooter'].upgradePath;

        // for (let upgradeKey in towerUpgrades[this.upgrades]) {
        //     const upgrade = towerUpgrades[upgradeKey];
        //     this[upgradeKey] = upgrade[upgradeKey];
        // }

        const cost = this.upgradeCost;
        switch (this.upgrades) {
            case 0:
                this.range += 50;
                this.fireRate = 25;
                this.damage = 2;

                // Next upgrade cost
                this.upgradeCost = 300;
                break;
            case 1:
                this.range += 100;
                this.fireRate = 20;
                this.damage = 3;

                // Next upgrade cost
                this.upgradeCost = 1_000;
                break;
            case 2:
                this.range += 150;
                this.fireRate = 15;
                this.damage = 5;

                // Next upgrade cost
                this.upgradeCost = 5_000;
                break;
            case 3:
                this.range += 200;
                this.fireRate = 20;
                this.damage = 20;

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
    
    /**
     * getUpgradeStats
     *

    * @description Two objects, { old ... new } The new object is an instance of the old one, and are further tweaked to use newer upgrade stats,
    * serves as a temporarily data-placeholder for adding additional objects before project structure will be rewritten.
    * Author:    Anarox
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

        let newRange = this.range;
        let newFireRate = this.fireRate;
        let newDamage = this.damage;
        let newUpgradeCost = this.upgradeCost;

        switch (this.upgrades) {
            case 0:
                newRange += 50;
                newFireRate = 25; // lower = better
                newDamage = 3;

                newUpgradeCost = 300;
                break;
            case 1:
                newRange += 100;
                newFireRate = 20; // lower = better
                newDamage = 3;

                newUpgradeCost = 1_000;
                break;
            case 2:
                newRange += 150;
                newFireRate = 15; // lower = better
                newDamage = 5;

                newUpgradeCost = 5_000;
                break;
            case 3:
                newRange += 150;
                newFireRate = 20; // lower = better
                newDamage = 20;

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
            // background: 'green',
            upgradeCost: 1_000,
        }, {
            damage: 30,
            fireRate: 60,
            // background: 'green',
            upgradeCost: 5_000,
        }, {
            damage: 50,
            fireRate: 50,
            // background: 'green',
            upgradeCost: 20_000,
        }, {
            damage: 100,
            fireRate: 50,
            // background: 'green',
            upgradeCost: 100_000,
        }]
    }
        
}
    
