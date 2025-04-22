import { Tower } from "./tower.js";
/**
 * Error tower class used only if the towerFactory gets an incorrect input and thus uses the default
 *
 * @constructor (x, y, row)
 * Author:    Randomfevva
 * Created:   15.04.2025
 **/
export class Barricade extends Tower {
    constructor(x, y, type) {
        super(x, y, type);
        this.name = "barricade";
        this.x = x;
        this.y = y;
        this.health = 500; // Mye helse for å blokkere fiender
        this.background = 'darkgray';
        this.textColor = 'white';
        this.selected = false;
    }
    destroy() {
        console.log("Barricade destroyed!");
        // Fjern barricaden fra spillbrettet
        Barricade.splice(Barricade.indexOf(this), 1);
    }

    attack(){};
    upgrade() {}
    getUpgradeStats() {}
}