import { Tower } from "./tower.js";
/**
 * Error tower class used only if the towerFactory gets an incorrect input and thus uses the default
 *
 * @constructor (x, y, row)
 * Author:    Randomfevva, Quetzalcoatl
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

    update (deltaTime) {}
    
    destroy() {
        console.log("Barricade destroyed!");
        // Fjern barricaden fra spillbrettet
        Barricade.splice(Barricade.indexOf(this), 1);
    }

    attack() {};
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
             * getUpgradeStats
             *
        
            * @description Two objects, { old ... new } The new object is an instance of the old one, and are further tweaked to use newer upgrade stats,
            * serves as a temporarily data-placeholder for adding additional objects before project structure will be rewritten.
            * Author:    Anarox
            * Editor:    Quetzalcoatl
            * Created:   09.03.2025
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