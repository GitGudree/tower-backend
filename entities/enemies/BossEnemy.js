import { Enemy } from "./enemy.js";
import { sprites } from "../spriteLoader.js";
import { SpriteAnimator } from "../spriteAnimator.js";

/**
 * Boss Enemy class
 *
 * @author:    Randomfevva
 * Created:   07.03.2025
 **/
export class BossEnemy extends Enemy {
    constructor(row, wave) {
        super(row, wave);
        this.type = "boss";
        this.health = 500 + (wave - 1) * 50;
        this.speed = 0.8;
        this.background = "purple";
        this.laneIndex = row;

        this.setAnimations();
    }

    setAnimations(){
        this.animatorMove = new SpriteAnimator (sprites.bossEnemy, 0, 50, 50, 3); // image, startY, width, height, amount of frames, frame interval
        this.animatorShoot = new SpriteAnimator (sprites.bossEnemy, 50, 50, 50, 2);
        this.animatorDead = new SpriteAnimator (sprites.bossEnemy, 100, 50, 50, 2, 300);
    }
}
