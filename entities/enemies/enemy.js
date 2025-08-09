import { canvas} from "../../game/game.js";
import { cellSize } from "../../game/grid.js";
import { sprites } from "../spriteLoader.js";
import { SpriteAnimator } from "../spriteAnimator.js";
import { soundManager } from "../../game/soundManager.js";

/**
 * Base Enemy class implementing core enemy functionality.
 * 
 * @class Enemy
 * @param {number} row - Row position
 * @param {number} wave - Current wave number
 * @author Anarox
 * @contributor Randomfevva
 * @date 2025-01-25
 **/
export class Enemy {
    constructor(row, wave) {
        this.x = canvas.width;
        this.y = row * cellSize;
        this.type = "normal";
        this.health = 120 + (wave - 1) * 20;
        this.speed = 0.9;
        this.width = cellSize;
        this.height = cellSize;
        this.isStopped = false;
        this.isSlowed = false;
        this.laneIndex = row;
        
        this.damage = 2 + Math.floor(wave / 5);
        this.attackspeed = Math.max(8, 15 - Math.floor(wave / 8));
        this.lastHitSoundTime = 0;
        this.isAttacking = false;
        this.deathAnimationPlayed = false;

        this.setAnimations();
    }

    setAnimations(){
        this.animatorMove = new SpriteAnimator(sprites.enemy, 0, 50, 50, 4); 
        this.animatorShoot = new SpriteAnimator(sprites.enemy, 50, 50, 50, 2);
        this.animatorDead = new SpriteAnimator(sprites.enemy, 100, 50, 50, 1, 300);
    }

    move(deltaTime) {
        if (this.health <= 0) {
            // Handle death animation
            if (!this.deathAnimationPlayed) {
                this.animatorDead.update(deltaTime);
                if (this.animatorDead.currentFrame === this.animatorDead.totFrames - 1) {
                    this.deathAnimationPlayed = true;
                }
            }
            return;
        }

        if (!this.isStopped) {
            // Moving
            this.x -= this.speed;
            this.animatorMove.update(deltaTime);
        } else {
            // Stopped - handle attacking or slowed animations
            if (this.isAttacking) {
                this.animatorShoot.update(deltaTime);
            }
            // Note: animatorSlow was commented out, so removed this condition
        }
    }

    stopMove() {
        this.isStopped = true;
        this.x = cellSize * Math.ceil(this.x / cellSize);
    }

    resumeMove() {
        this.isStopped = false;
    }

    draw(ctx) {
        this.drawSprite(ctx);
    }

    drawSprite(ctx){
        if (this.health <= 0) {
            this.animatorDead.draw(ctx, this.x, this.y);
        } else if (this.isStopped && this.isAttacking) {
            this.animatorShoot.draw(ctx, this.x, this.y);
        } else {
            this.animatorMove.draw(ctx, this.x, this.y);
        }
    }
    
    attack(tower) {
        this.isAttacking = true;
        tower.health -= this.damage;
        setTimeout(() => {
            this.isAttacking = false;
        }, 100);
    }

    takeDamage(amount) {
        this.health -= amount;
        const now = Date.now();
        if (!this.lastHitSoundTime || now - this.lastHitSoundTime > 1000) {
            soundManager.play('enemy_hit');
            this.lastHitSoundTime = now;
        }
    }
}

export let enemies = [];

export function setEnemies(enemiesArray) {
    enemies = enemiesArray;
}

const enemyTypes = [
    { type: "fast", weight: 0.35, minWave: 3 },
    { type: "tank", weight: 0.35, minWave: 5 },
    { type: "normal", weight: 0.3, minWave: 1 }
];

export function getRandomEnemyType(wave) {
    if (wave % 10 === 0) {  
        return "boss";
    }
    
    const availableTypes = enemyTypes.filter(enemy => wave >= enemy.minWave);
    
    const totalWeight = availableTypes.reduce((sum, enemy) => sum + enemy.weight, 0);
    
    let rand = Math.random() * totalWeight;
    let sum = 0;
    for (let enemy of availableTypes) {
        sum += enemy.weight;
        if (rand < sum) return enemy.type;
    }
    
    return "normal"; 
}
