class Item {
    constructor(name, cost, description, image) {
        this.name = name;
        this.cost = cost;
        this.description = description;
        this.image = image;
    }
}

// Eksempel på items
const items = {
    barricade: new Item("Barricade", 100, "Place a barricade on a grid slot to slow down enemies.", "images/barricade.png"),
    mine: new Item("Mine", 150, "Explodes when enemies step on it.", "images/mine.png"),
    slowTrap: new Item("Slow Trap", 120, "Slows down enemies for a duration.", "images/slowtrap.png")
};

// Eksporter items
export { items };
