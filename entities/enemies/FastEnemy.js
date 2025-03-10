import { Enemy } from "./enemy.js";

/**
 * Fast Enemy class
 *
 * @author:    Anarox
 * Created:   25.01.2025
 **/
export class FastEnemy extends Enemy {
    constructor(row, wave) {
        super(row, wave);
        this.type = "fast";
        this.health = 50 + (wave - 1) * 10;
        this.speed = 1.2;
        this.background = "orange";
    }
}
