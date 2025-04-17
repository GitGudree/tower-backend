import { Tower } from "./tower.js";

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

    attack(){};
}