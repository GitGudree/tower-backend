import { Bullet } from "./projectiles/Bullet.js";
import { collision } from "../game/hitreg.js";
import { updateResources, towerDamageElement, towerUpgradePriceElement } from "../game/game.js";
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
        this.textColor = 'gold'
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
        if (this.selected) {
            ctx.fillStyle = "lightblue";
        } else {
            ctx.fillStyle = this.background;
        }
        ctx.fillRect(this.x + 2, this.y + 2, 50 - 4, 50 - 4);
        if (this.selected) {
            ctx.fillStyle = 'black'
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
                this.background = "yellow";
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
}

export const towers = [];
