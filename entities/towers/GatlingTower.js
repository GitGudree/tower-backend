import { Tower } from "./tower.js";
import { money, updateMoney } from "../../game/game.js";

/**
 * Gatling tower class
 *
 * @constructor (x, y, row)
 * Author:    Anarox
 * Editor:    Quetzalcoatl
 * Created:   27.03.2025
 **/
export class GatlingTower extends Tower {
    constructor(x, y, type) {
        super(x, y, type);
        this.name = "Gatling";
        this.health = 60;
        this.range = 300;
        this.damage = 1;
        this.projectiles = [];
        this.fireRate = 10;
        this.bulletType = type;
        this.background = "green";
    }
    attack(){}

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
                this.range += 20;
                this.fireRate = 9;

                // Next upgrade cost
                this.upgradeCost = 300;
                break;
            case 1:
                this.range += 40;
                this.fireRate = 8;
                this.damage = 2;

                // Next upgrade cost
                this.upgradeCost = 1_000;
                break;
            case 2:
                this.range += 60;
                this.fireRate = 7;


                // Next upgrade cost
                this.upgradeCost = 5_000;
                break;
            case 3:
                this.range += 100;
                this.fireRate = 6;
                this.damage = 3;

                // Next upgrade cost - 1e3=1.000, 1e6=1.000.000
                this.upgradeCost = 1e9;
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
                newRange += 20;
                newFireRate = 9;

                newUpgradeCost = 300;
                break;
            case 1:
                newRange += 40;
                newFireRate = 8;
                newDamage = 2;

                newUpgradeCost = 1_000;
                break;
            case 2:
                newRange += 60;
                newFireRate = 7;

                newUpgradeCost = 5_000;
                break;
            case 3:
                newRange += 100;
                newFireRate = 6; // lower = better
                newDamage = 3;

                newUpgradeCost = 1e9;
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

