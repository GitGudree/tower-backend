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
        this.health = 100 + (wave - 1) * 15;
        this.speed = 0.8;
        this.background = "red";
        this.laneIndex = row;
        this.width = cellSize;
        this.height = cellSize;
        this.isStopped = false;
        this.laneIndex = row;
        
        this.damage = 2;
        this.attackspeed  = 15;
        this.lastHitSoundTime = 0;

        this.setAnimations();
    }

    setAnimations(){
        this.animatorMove = new SpriteAnimator (sprites.enemy, 0, 50, 50, 4); // image, startY, width, height, amount of frames, frame interval
        this.animatorShoot = new SpriteAnimator (sprites.enemy, 50, 50, 50, 2);
        this.animatorDead = new SpriteAnimator (sprites.enemy, 100, 50, 50, 1, 300);
    }

    move(deltaTime) {
        if (!this.isStopped) {
            this.x -= this.speed;
            this.animatorMove.update(deltaTime);
        } else if (this.isStopped) {
            this.animatorShoot.update(deltaTime);
        } else if (this.health <= 0) {
            this.animatorDead.update(deltaTime);
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
        /*
        ctx.fillStyle = this.background;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.fillStyle = "black";
        ctx.font = '20px Impact';
        ctx.textAlign = 'center';
        ctx.fillText(Math.floor(this.health), this.x + cellSize / 2, this.y + cellSize / 2);
        */
       this.drawSprite(ctx);
    }

    drawSprite(ctx){
        if (!this.health <= 0 && !this.isStopped){
            this.animatorMove.draw(ctx, this.x, this.y);
        } else if (!this.health <= 0 && this.isStopped){
            this.animatorShoot.draw(ctx, this.x, this.y);
        }else {
            this.animatorDead.draw(ctx, this.x, this.y);
        }

    }
    
    attack(tower) {
        tower.health -= this.damage;
    }

    takeDamage(amount) {
        this.health -= amount;
        const now = Date.now();
        if (!this.lastHitSoundTime || now - this.lastHitSoundTime > 1000) { // 1000ms = 1 second
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
    { type: "fast", weight: 0.3 },
    { type: "tank", weight: 0.3 },
    { type: "normal", weight: 0.4 }
];

export function getRandomEnemyType(wave) {
    if (wave % 5 === 0) {
        return "boss";
    }
    
    let rand = Math.random();
    let sum = 0;
    for (let enemy of enemyTypes) {
        sum += enemy.weight;
        if (rand < sum) return enemy.type;
    }
}
