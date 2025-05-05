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
        this.name = "barricade";
        this.x = x;
        this.y = y;
        this.health = 500; // High health for blocking enemies
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
                if (money < this.upgradeCost || this.upgradeCost === -1) return;
        
                // DO NOT REMOVE THIS CODE!!!
                // const towerUpgrades = towerTypes['Shooter'].upgradePath;
        
                // for (let upgradeKey in towerUpgrades[this.upgrades]) {
                //     const upgrade = towerUpgrades[upgradeKey];
                //     this[upgradeKey] = upgrade[upgradeKey];
                // }
        
                const cost = this.upgradeCost;
                switch (this.upgrades) {
                    case 0:
                        break;
                    case 1:
                        break;
                    case 2:
                        break;
                    case 3:
                        break;
                    default:
                        return;
                }
        
                updateMoney('decrease', cost);
        
                this.health += 50;
                this.upgrades++;
                
                
                //towerDamageElement.textContent = this.damage;
                //towerUpgradePriceElement.textContent = this.upgradeCost;
        
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
        
                let newRange = this.range;
                let newFireRate = this.fireRate;
                let newDamage = this.damage;
                let newUpgradeCost = this.upgradeCost;
        
                switch (this.upgrades) {
                    case 0:
                        break;
                    case 1:
                        break;
                    case 2:
                        break;
                    case 3:
                        break;
                    default:
                        return {
                            oldStats,
                            newStats: oldStats
                        };
                }
        
                const newStats = {
                    health: oldStats.health + 50,
                    range: newRange,
                    fireRate: newFireRate,
                    damage: newDamage,
                    upgradeCost: newUpgradeCost
                };
        
                return { oldStats, newStats };
            }
}