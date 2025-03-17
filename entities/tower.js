import { Bullet } from "./projectiles/Bullet.js";
import { collision } from "../game/hitreg.js";
import { updateResources, towerDamageElement, towerUpgradePriceElement, updateTowerInfo, upgradeTowerStats } from "../game/game.js";
import { cellSize } from "../game/grid.js";
import { money, updateMoney } from "../game/game.js";

/**
 * Tower Class
 *

 * @constructor (x, y, row)
 * Author:    Anarox
 * Created:   25.01.2025
 **/
export class Tower {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.name = "Shooter";
        this.health = 100;
        this.range = 500;
        this.damage = 2;
        this.projectiles = [];
        this.fireRate = 30;
        this.timer = 0;
        this.upgradeCost = 150;
        this.upgrades = 0;
        this.selected = false;

        // Tower Destruction
        this.deathMessage = null;
        this.deathMessageTimer = 0;

        // Tower style
        this.background = 'blue';
        this.textColor = 'lightgray';
    }

    attack(enemies, bullets, towerIndex) {
        if (this.timer <= 0) {
            enemies.forEach(enemy => {
                if (Math.abs(enemy.y - this.y) < 10 && Math.abs(enemy.x - this.x) < this.range) {
                    const bullet = new Bullet(this.x, this.y, this.y);
                    bullet.bulletDamage = this.damage;
                    bullets.push(bullet);
                }
            });

            for (let enemy of enemies) {
                if (collision(this, enemy)) {
                    enemy.stopMove();
                    enemy.attack(this);
                }
            }

            if (this.health <= 0) {
                towers.splice(towerIndex, 1);
                this.deathMessage = "-5 Resources";
                this.deathMessageTimer = 60;

                updateResources("decrease", 5);


                for (let enemy of enemies) {
                    enemy.resumeMove();
                }
            }
            this.timer = this.fireRate;
        } else {
            this.timer--;
        }
    }

    draw(ctx) {
        ctx.fillStyle = this.background;
        ctx.fillRect(this.x + 2, this.y + 2, 50 - 4, 50 - 4);

        if (this.selected) {
            ctx.fillStyle = 'white';
            ctx.strokeStyle = 'green';
            ctx.lineWidth = 2;
            ctx.strokeRect(this.x + 2, this.y + 2, 50 - 4, 50 - 4)
        } else {
            ctx.fillStyle = this.textColor;
        }
        ctx.font = '20px Impact';
        ctx.textAlign = 'center';
        ctx.fillText(Math.floor(this.health), this.x + cellSize / 2, this.y + cellSize / 2);
        
    }

    upgrade() {
        if (money < this.upgradeCost || this.upgradeCost === -1) return;

        const cost = this.upgradeCost;
        switch (this.upgrades) {
            case 0:
                this.range += 50;
                this.fireRate = 25; // lower = better
                this.background = "green";

                this.upgradeCost = 300;
                break;
            case 1:
                this.range += 100;
                this.fireRate = 20; // lower = better
                this.background = "orange";
                this.damage = 3;

                this.upgradeCost = 1000;
                break;
            case 2:
                this.range += 150;
                this.fireRate = 10; // lower = better
                this.background = "purple";
                this.damage = 10;

                this.upgradeCost = -1;
                break;
            default:
                return;
        }
        updateMoney('decrease', cost);

        this.health += 50;
        this.upgrades++;
        
        
        towerDamageElement.textContent = this.damage;
        towerUpgradePriceElement.textContent = this.upgradeCost;

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
        if (this.upgrades >= 3) return;

        const oldStats = {
            health: this.health,
            range: this.range,
            fireRate: this.fireRate,
            damage: this.damage,
            background: this.background,
            upgradeCost: this.upgradeCost
        };

        let newRange = this.range;
        let newFireRate = this.fireRate;
        let newBackground = this.background;
        let newDamage = this.damage;
        let newUpgradeCost = this.upgradeCost;

        switch (this.upgrades) {
            case 0:
                newRange += 50;
                newFireRate = 25; // lower = better
                newBackground = "red";

                newUpgradeCost = 300;
                break;
            case 1:
                newRange += 100;
                newFireRate = 20; // lower = better
                newBackground = "yellow";
                newDamage = 3;

                newUpgradeCost = 1000;
                break;
            case 2:
                newRange += 150;
                newFireRate = 10; // lower = better
                newBackground = "purple";
                newDamage = 10;

                newUpgradeCost = -1;
                break;
            default:
                return;
        }

        const newStats = {
            health: oldStats.health + 50,
            range: newRange,
            fireRate: newFireRate,
            damage: newDamage,
            background: newBackground,
            upgradeCost: newUpgradeCost
        };

        return { oldStats, newStats };
    }
}

export const towers = [];