import { Tower, towers } from "./tower.js";
import { cellSize} from "../../game/grid.js";
import { money, updateMoney } from "../../game/game.js";
import { sprites } from "../spriteLoader.js";
import { SpriteAnimator } from "../spriteAnimator.js";
import { getTowerPrice } from "../../game/towerUnlockSystem.js";
import { toastSuccess } from "../../game/toast-message.js";

/**
 * Barricade tower class implementing defensive blocking functionality.
 * 
 * @class Barricade
 * @extends Tower
 * @param {number} x - X coordinate
 * @param {number} y - Y coordinate
 * @param {string} type - Tower type
 * @param {number} laneIndex - Lane position
 * @author Randomfevva
 * @contributor Quetzalcoatl
 * @date 2025-04-15
 **/
export class Barricade extends Tower {
    constructor(x, y, type, laneIndex) {
        super(x, y, type, laneIndex);
        this.name = "Barricade";
        this.x = x;
        this.y = y;
        this.baseHealth = 500;
        this.baseRange = 0;
        this.baseDamage = 0;
        this.baseFireRate = 0;
        this.maxHealth = this.baseHealth;
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

        this.animatorLive = new SpriteAnimator (sprites.barricade, 0, 50, 50, 1); 
        this.animatorDead = new SpriteAnimator (sprites.barricade, 50, 50, 50, 1);
    }

    update (deltaTime) {}
    
    destroy() {
        console.log("Barricade destroyed!");
        Barricade.splice(Barricade.indexOf(this), 1);
    }

    attack() {};

    draw(ctx) {
        this.drawSprite(ctx);
        this.drawSynergyEffects(ctx);
    }
    
    drawSprite(ctx) {
        if(this.health <= 0){
            this.animatorDead.draw(ctx, this.x, this.y);
        } else{
            this.animatorLive.draw(ctx, this.x, this.y);
        }
    }

    upgrade() {
        const UPGRADE_COSTS = [150, 300, 500, 750, 1000]; 
        if (this.upgrades >= 5 || money < UPGRADE_COSTS[this.upgrades]) return;
        updateMoney('decrease', UPGRADE_COSTS[this.upgrades]);
        this.maxHealth += 50;
        this.health += 50;
        this.upgrades++;
    }

    /**
     * Override the scrap method to implement barricade-specific sell logic
     * @returns {boolean} Whether the scrap was successful
     */
    scrap() {
        const basePrice = getTowerPrice(this.bulletType);
        const healthPercentage = this.health / this.maxHealth;
        
        let refundAmount;
        
        if (healthPercentage >= 0.7) {
            // 70% money back if health is 70% or higher
            refundAmount = Math.ceil(basePrice * 0.7);
        } else {
            // Less money back if health is below 70%
            refundAmount = Math.ceil(basePrice * 0.7 * healthPercentage);
        }
        
        // Add 20% bonus for each upgrade level
        const upgradeBonus = this.upgrades * 0.2;
        refundAmount = Math.ceil(refundAmount * (1 + upgradeBonus));
        
        updateMoney("increase", refundAmount);
        
        const towerIndex = towers.findIndex(t => t === this);
        if (towerIndex !== -1) {
            towers.splice(towerIndex, 1);
        }

        toastSuccess(`Barricade scrapped for ${refundAmount}💶`);
        return true;
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

        const UPGRADE_COSTS = [150, 300, 500, 750, 1000]; 
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