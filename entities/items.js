

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

// Barricade - Blokkerer fiender, men gjør ingen skade
class BarricadeInfo extends Item {
    constructor(x, y) {
        super("Barricade", 100, "Blocks enemy movement but does no damage.", "images/barricade.png"); // 
        /*
        this.x = x;
        this.y = y;
        this.health = 500; // Mye helse for å blokkere fiender
        this.background = 'darkgray';
        this.textColor = 'white';
        this.selected = false;
        */
    }
    /*
    // Overstyrer attack-metoden til å gjøre ingenting
    attack() {};
        // Barricaden angriper ikke, men blokkerer fiender
    
    
    takeDamage(amount) {
        this.health -= amount;
        console.log(`Barricade took ${amount} damage. Remaining health: ${this.health}`);

        // Hvis barricaden ødelegges, fjernes den
        if (this.health <= 0) {
            this.destroy();
        }
    }

    destroy() {
        console.log("Barricade destroyed!");
        // Fjern barricaden fra spillbrettet
        Barricade.splice(Barricade.indexOf(this), 1);
    }
    
    draw(ctx) {
        ctx.fillStyle = this.background;
        ctx.fillRect(this.x + 2, this.y + 2, 50 - 4, 50 - 4);

        if (this.selected) {
            ctx.strokeStyle = 'black';
            ctx.lineWidth = 3;
            ctx.strokeRect(this.x + 2, this.y + 2, 50 - 4, 50 - 4);
        } else {
            ctx.fillStyle = this.textColor;
        }
        ctx.font = '20px Impact';
        ctx.textAlign = 'center';
        ctx.fillText(Math.floor(this.health), this.x + 25, this.y + 25);
    }
        
        */
        
}
    

// Oppretter items ved å bruke de riktige klassene
const items = {
    barricade: new BarricadeInfo(), // Standard posisjon, men må settes dynamisk
    mine: new Item("Mine", 150, "Explodes when enemies step on it.", "images/mine.png"),
    slowTrap: new Item("Slow Trap", 120, "Slows down enemies for a duration.", "images/slowtrap.png")
};

// Eksporter items slik at det kan brukes i shop.js
export { items };
