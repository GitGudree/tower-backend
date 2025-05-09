import { Tower } from "./tower.js";
import { cellSize} from "../../game/grid.js";
import { money, updateMoney } from "../../game/game.js";
/**
 * Barricade tower class implementing defensive blocking functionality.
 * 
 * @class Barricade
 * @extends Tower
 * @param {number} x - X coordinate
 * @param {number} y - Y coordinate
 * @param {string} type - Tower type
 * @param {number} laneIndex - Lane position
 * @author Randomfevva, Quetzalcoatl
 * @date 2025-04-15
 **/
export class Barricade extends Tower {
    constructor(x, y, type, laneIndex) {
        super(x, y, type, laneIndex);
        this.name = "Barricade";
        this.x = x;
        this.y = y;
        this.baseHealth = 100;
        this.baseRange = 0;
        this.baseDamage = 0;
        this.baseFireRate = 0;
        this.health = this.baseHealth;
        this.range = this.baseRange;
        this.damage = this.baseDamage;
        this.fireRate = this.baseFireRate;
        this.background = 'darkgray';
        this.textColor = 'white';
        this.selected = false;
        this.laneIndex = laneIndex;

        this.deathDuration = 0;
        this.deathTimer = this.deathDuration;
        this.isDead;
    }

    update (deltaTime) {}
    
    destroy() {
        console.log("Barricade destroyed!");
        // Remove barricade from the game board
        Barricade.splice(Barricade.indexOf(this), 1);
    }

    attack() {};

    draw(ctx) {
        // Draw barricade base
        ctx.fillStyle = this.background;
        ctx.fillRect(this.x + 2, this.y + 2, 50 - 4, 50 - 4);

        if (this.selected) {
            ctx.fillStyle = 'white';
            ctx.strokeStyle = 'black';
            ctx.lineWidth = 3;
            ctx.strokeRect(this.x + 2, this.y + 2, 50 - 4, 50 - 4)
        } else {
            ctx.fillStyle = this.textColor;
        }
        ctx.font = '20px Impact';
        ctx.textAlign = 'center';
        ctx.fillText(Math.floor(this.health), this.x + cellSize / 2, this.y + cellSize / 2);

        // Draw synergy effects
        this.drawSynergyEffects(ctx);
    }
    upgrade() {
        const UPGRADE_COSTS = [150, 300, 500, 750, 1000]; // Costs for levels 2-6
        if (this.upgrades >= 5 || money < UPGRADE_COSTS[this.upgrades]) return;
        updateMoney('decrease', UPGRADE_COSTS[this.upgrades]);
        this.maxHealth += 50;
        this.health += 50;
        this.upgrades++;
    }
            
    /**
     * Retrieves current and next upgrade statistics for the barricade.
     * 
     * @method getUpgradeStats
     * @returns {Object} Contains current and projected upgrade statistics
     * @description Provides two objects containing current and projected stats after upgrade
     * @author Anarox
     * @contributor Quetzalcoatl
     * @date 2025-03-09
     **/
    getUpgradeStats() {
        const oldStats = {
            health: this.health,
            range: this.range,
            fireRate: this.fireRate,
            damage: this.damage,
            upgradeCost: this.upgradeCost
        };

        const UPGRADE_COSTS = [150, 300, 500, 750, 1000]; // Costs for levels 2-6
        const newStats = {
            health: oldStats.health + 50,
            range: oldStats.range,
            fireRate: oldStats.fireRate,
            damage: oldStats.damage,
            upgradeCost: this.upgrades < 5 ? UPGRADE_COSTS[this.upgrades] : -1
        };

        return { oldStats, newStats };
    }
}