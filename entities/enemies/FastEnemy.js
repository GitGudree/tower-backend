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
        this.health = 70 + (wave - 1) * 12;
        this.speed = 1.4;
        this.background = "orange";
        this.laneIndex = row;

        this.setAnimations();
    }

    setAnimations(){
        this.animatorMove = new SpriteAnimator (sprites.fastEnemy, 0, 50, 50, 6); 
        this.animatorShoot = new SpriteAnimator (sprites.fastEnemy, 50, 50, 50, 2);
        this.animatorDead = new SpriteAnimator (sprites.fastEnemy, 100, 50, 50, 1, 300);
    }
}
