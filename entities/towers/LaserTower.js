import { Tower } from "./tower.js";
import { LaserBullet } from "../projectiles/laserBullet.js";
import { collision } from "../../game/hitreg.js";
import { updateResources} from "../../game/game.js";
import { money, updateMoney } from "../../game/game.js";

/**
 * Laser tower class
 *
 * @constructor (x, y, row)
 * Author:    Quetzalcoatl
 * Created:   27.03.2025
 **/
export class LaserTower extends Tower {
    constructor(x, y, type, laneIndex) {
        super(x, y, type, laneIndex);
        this.name = "laser";
        this.width = 5;
        this.height = 5;
        this.health = 30;
        this.range = 1000;
        this.damage = 4;
        this.fireRate = 5;
        this.projectiles = [];
        this.fireRate = 50;
        this.bulletType = type;
        this.background = "purple";
        this.laneIndex = laneIndex;

        this.deathDuration = 0;
        this.deathTimer = this.deathDuration;
        this.isDead;
    }

    update (deltaTime) {}
    
    attack(enemies, bullets) {
        if (this.timer <= 0) {
            const target = enemies.find(enemy =>
                Math.abs(enemy.y - this.y) < 10 &&
                Math.abs(enemy.x - this.x) < this.range
            );
    
            if (target) {
                const bullet = new LaserBullet(this.x, this.y, target.x, target.y, this);
                bullet.bulletDamage = this.damage;
                bullets.push(bullet);
            }
    
            this.timer = this.fireRate;
        } else {
            this.timer--;
        }
    }
    /*
      attack(enemies, bullets) {
             if (this.timer <= 0) {
                 enemies.forEach(enemy => {
                     if (Math.abs(enemy.y - this.y) < 10 && Math.abs(enemy.x - this.x) < this.range) {
                         const bullet = new LaserBullet(this.x, this.y, enemy.x, enemy.y);
                         bullet.bulletDamage = this.damage;
                         bullets.push(bullet);
                     }            
                 });
     
     
                 this.timer = this.fireRate;
             } else {
                 this.timer--;
             }
         }
             */
}
