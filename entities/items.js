import { Mine } from "./towers/Mine.js";
import { SlowTrap } from "./towers/SlowTrap.js";

/**
 * Base Item class for all game items.
 * 
 * @class Item
 * @param {string} name - Item name
 * @param {number} price - Item price
 * @param {string} description - Item description
 * @param {string} image - Path to item image
 */
class Item {
    constructor(name, price, description, image) {
        this.name = name;
        this.price = price;
        this.description = description;
        this.image = image;
    }

    // Standard attack method (can be overridden by subclasses)
    attack(target) {
        console.log(`${this.name} attacks ${target}!`);
    }
}

/**
 * Mine item class for explosive traps.
 * @extends Item
 */
class MineInfo extends Item {
    constructor() {
        super("Mine", 150, "Explodes when enemies step on it, dealing high damage.", "public/sprites/landmine.png");
    }
}

/**
 * SlowTrap item class for slowing enemies.
 * @extends Item
 */
class SlowTrapInfo extends Item {
    constructor() {
        super("Slow Trap", 120, "Slows down enemies that step on it for a short duration.", "public/sprites/slowtrap.png");
    }
}

/**
 * Barricade item class for blocking enemies.
 * @extends Item
 */
class BarricadeInfo extends Item {
    constructor() {
        super("Barricade", 100, "Blocks enemy movement but does no damage.", "public/sprites/barricade.png");
    }
}

// Create items using the appropriate classes
const items = {
    barricade: new BarricadeInfo(),
    mine: new MineInfo(),
    slowTrap: new SlowTrapInfo()
};

// Export items for use in shop.js
export { items };
