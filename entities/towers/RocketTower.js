import { Tower } from "./tower.js";
import { RocketBullet } from "../projectiles/RocketBullet.js";
/**
 * Rocket tower class
 *
 * @constructor (x, y, row)
 * Author:    Anarox
 * Editor:    Quetzalcoatl
 * Created:   27.03.2025
 **/
export class RocketTower extends Tower {
    constructor(x, y, type) {
        super(x, y, type);
        this.name = "Rocket";
        this.health = 30;
        this.range = 700;
        this.damage = 15;
        this.projectiles = [];
        this.fireRate = 160;
        this.bulletType = type;
        this.background = "grey"; 
    }
    
    attack(enemies, bullets) {
        if (this.timer <= 0) {
            enemies.forEach(enemy => {
                if (Math.abs(enemy.y - this.y) < 10 && Math.abs(enemy.x - this.x) < this.range) {
                    const bullet = new RocketBullet(this.x, this.y, enemy);
                    bullet.bulletDamage = this.damage;
                    bullets.push(bullet);
                }            
            });
            
            this.timer = this.fireRate;
        } else {
            this.timer--;
        }
    }
}
