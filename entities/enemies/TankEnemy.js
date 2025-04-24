import { Enemy } from "./enemy.js";

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
    }
}
