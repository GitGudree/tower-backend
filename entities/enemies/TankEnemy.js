import { Enemy } from "./enemy.js";
import { sprites } from "../spriteLoader.js";
import { SpriteAnimator } from "../spriteAnimator.js";

/**
 * Tank Enemy class
 *
 * @author:    Randomfevva
 * Created:   07.03.2025
 **/
export class TankEnemy extends Enemy {
    constructor(row, wave) {
        super(row, wave);
        this.type = "tank";
        this.health = 200 + (wave - 1) * 20;
        this.speed = 0.5;
        this.background = "darkgreen";
        this.laneIndex = row; 

        this.setAnimations();
    }
    setAnimations(){
        this.animatorMove = new SpriteAnimator (sprites.tankEnemy, 0, 50, 50, 4); // image, startY, width, height, amount of frames, frame interval
        this.animatorShoot = new SpriteAnimator (sprites.tankEnemy, 50, 50, 50, 2);
        this.animatorDead = new SpriteAnimator (sprites.tankEnemy, 100, 50, 50, 1, 300);
    }
}
