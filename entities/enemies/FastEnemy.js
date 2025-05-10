import { Enemy } from "./enemy.js";
import { sprites } from "../spriteLoader.js";
import { SpriteAnimator } from "../spriteAnimator.js";

/**
 * Fast Enemy class
 *
 * @author:    Randomfevva
 * Created:   07.03.2025
 **/
export class FastEnemy extends Enemy {
    constructor(row, wave) {
        super(row, wave);
        this.type = "fast";
        this.health = 50 + (wave - 1) * 10;
        this.speed = 1.2;
        this.background = "orange";
        this.laneIndex = row;

        this.setAnimations();
    }

    setAnimations(){
        this.animatorMove = new SpriteAnimator (sprites.enemy, 0, 50, 50, 4); // image, startY, width, height, amount of frames, frame interval
        this.animatorShoot = new SpriteAnimator (sprites.enemy, 50, 50, 50, 2);
        this.animatorDead = new SpriteAnimator (sprites.enemy, 100, 50, 50, 1, 300);
    }
}
