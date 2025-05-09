import { Tower } from "./tower.js";
import { money, updateMoney } from "../../game/game.js";
/**
 * Error tower class used only if the towerFactory gets an incorrect input and thus uses the default
 *
 * @constructor (x, y, row)
 * Author:    Anarox, Quetzalcoatl
 * Created:   27.03.2025
 **/
export class ErrorTower extends Tower {
    constructor(x, y, type, laneIndex) {
        super(x, y, type, laneIndex);
        this.name = "error";
        this.baseHealth = 60;
        this.baseRange = 300;
        this.baseDamage = 1;
        this.baseFireRate = 10;
        this.health = this.baseHealth;
        this.range = this.baseRange;
        this.damage = this.baseDamage;
        this.fireRate = this.baseFireRate;
        this.projectiles = [];
        this.bulletType = type;
        this.background = "black";
        this.laneIndex = laneIndex;

        this.deathDuration = 0;
        this.deathTimer = this.deathDuration;
        this.isDead;
    }

    update (deltaTime) {}

    upgrade() {
        const UPGRADE_COSTS = [150, 300, 500, 750, 1000];
        if (this.upgrades >= 5 || money < UPGRADE_COSTS[this.upgrades]) return;
        updateMoney('decrease', UPGRADE_COSTS[this.upgrades]);
        this.maxHealth += 50;
        this.health += 50;
        this.upgrades++;
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
