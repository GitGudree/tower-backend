import { Mine } from "./towers/Mine.js";
import { SlowTrap } from "./towers/SlowTrap.js";

/**
 * Items module implementing game item functionality.
 * 
 * @module items
 * @author Randomfevva
 **/

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
}

/**
 * Mine item class for explosive traps.
 * @extends Item
 */
class MineInfo extends Item {
    constructor() {
        super("Mine", 180, "Explodes when enemies step on it, dealing high damage.", "/sprites/landmine.png");
    }
}

/**
 * SlowTrap item class for slowing enemies.
 * @extends Item
 */
class SlowTrapInfo extends Item {
    constructor() {
        super("Slow Trap", 160, "Slows down enemies that step on it for a short duration.", "/sprites/slowtrap.png");
    }
}

/**
 * Barricade item class for blocking enemies.
 * @extends Item
 */
class BarricadeInfo extends Item {
    constructor() {
        super("Barricade", 150, "Blocks enemy movement but does no damage.", "/sprites/barricade.png");
    }
}

/**
 * Key item class for unlocking special content.
 * @extends Item
 */
class KeyInfo extends Item {
    constructor() {
        super("Key", 1000, "A mysterious key for upcoming purposes.", "/sprites/emptyicon.png");
        this.resourceCost = 2500; // Additional resource cost
    }
}

const items = {
    barricade: new BarricadeInfo(),
    mine: new MineInfo(),
    slowTrap: new SlowTrapInfo(),
    key: new KeyInfo()
};

export { items };
