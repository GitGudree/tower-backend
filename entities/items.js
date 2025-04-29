import { Mine } from "./towers/Mine.js";
import { SlowTrap } from "./towers/SlowTrap.js";

class Item {
    constructor(name, price, description, image) {
        this.name = name;
        this.price = price;
        this.description = description;
        this.image = image;
    }

    // Standard attack-metode (kan overstyres av subklasser)
    attack(target) {
        console.log(`${this.name} attacks ${target}!`);
    }
}

// Mine - Explodes and deals damage to enemies that step on it
class MineInfo extends Item {
    constructor() {
        super("Mine", 150, "Explodes when enemies step on it, dealing high damage.", "public/sprites/landmineicon.png");
    }
}

// SlowTrap - Slows down enemies that step on it
class SlowTrapInfo extends Item {
    constructor() {
        super("Slow Trap", 120, "Slows down enemies that step on it for a short duration.", "public/sprites/beartrapiconmidl.png");
    }
}

// Barricade - Blokkerer fiender, men gjør ingen skade
class BarricadeInfo extends Item {
    constructor() {
        super("Barricade", 100, "Blocks enemy movement but does no damage.", "public/sprites/barricadeicon.png");
    }
}

// Oppretter items ved å bruke de riktige klassene
const items = {
    barricade: new BarricadeInfo(),
    mine: new MineInfo(),
    slowTrap: new SlowTrapInfo()
};

// Eksporter items slik at det kan brukes i shop.js
export { items };
