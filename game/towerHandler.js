import { toastSuccess, toastError, toastWarning, toastInfo, TOAST_MESSAGES } from "./toast-message.js";
import { money, updateMoney } from "./game.js";
import { isTowerUnlocked, unlockTower, TOWER_DATA } from "./towerUnlockSystem.js";
import { setChosenTower } from "../entities/towers/towerState.js";
import { towers } from "../entities/towers/tower.js";

/**
 * Tower Handler module implementing tower management functionality.
 * 
 * @module towerHandler
 * @author Randomfevva
 **/

const TOWER_NAMES = {
    'basic': 'Normal Tower',
    'sniper': 'Sniper Tower',
    'gatling': 'Gatling Tower',
    'laser': 'Laser Tower',
    'rocket': 'Rocket Tower',
    'artillery': 'Artillery Tower',
    'barricade': 'Barricade',
    'mine': 'Mine',
    'slowtrap': 'Slow Trap'
};

document.addEventListener('DOMContentLoaded', () => {
    const towerCards = document.querySelectorAll('.card[tower-type]');
    towerCards.forEach(card => {
        card.addEventListener('click', () => {
            const towerType = card.getAttribute('tower-type');
            if (!towerType) return;

            if (!isTowerUnlocked(towerType)) {
                unlockTower(towerType);
                return;
            }

            document.querySelectorAll('.card').forEach(c => {
                c.classList.remove('select');
                setChosenTower(null);
            });

            card.classList.add('select');
            setChosenTower(towerType);
            
            updateTowerInfo(towerType);
            const towerName = TOWER_NAMES[towerType] || 'Unknown tower';
            toastInfo(`${towerName} selected`);
        });

        const towerType = card.getAttribute('tower-type');
        if (towerType && !isTowerUnlocked(towerType)) {
            card.classList.add('locked');
        }
    });

    document.addEventListener('towerUnlocked', (event) => {
        const towerType = event.detail?.towerType;
        if (towerType) {
            const card = document.querySelector(`.card[tower-type="${towerType}"]`);
            if (card) {
                card.classList.remove('locked');
            }
        }
    });

    const upgradeButton = document.querySelector('.tower-upgrade-btn');
    if (upgradeButton) {
        upgradeButton.addEventListener('click', () => {
            const selectedTower = towers.find(tower => tower.selected);
            if (!selectedTower) {
                toastWarning("Please select a tower first");
                return;
            }

            if (selectedTower.upgrades >= 5) {
                toastWarning("Tower is already at maximum level");
                return;
            }

            const upgradeCost = selectedTower.upgradeCost;
            if (money < upgradeCost) {
                toastError(TOAST_MESSAGES.TOWER.UPGRADE_ERROR);
                return;
            }

            const success = selectedTower.upgrade();
            if (success) {
                toastSuccess(TOAST_MESSAGES.TOWER.UPGRADE_SUCCESS);
                updateTowerStats(selectedTower);
            }
        });
    }

    document.addEventListener('towerPlaced', (event) => {
        const towerType = event.detail?.towerType;
        if (towerType) {
            const towerName = TOWER_NAMES[towerType.toLowerCase()] || 'Unknown tower';
            toastSuccess(`${towerName} placed`);
        }
    });
});

function updateTowerInfo(towerType) {
    const towerImage = document.getElementById('tower-image');
    const towerTitle = document.getElementById('tower-title');
    const towerDescription = document.getElementById('tower-description');
    const towerStats = document.getElementById('tower-stats');

    switch(towerType) {
        case 'basic':
            towerTitle.textContent = TOWER_NAMES.basic;
            towerDescription.textContent = 'A reliable tower with balanced stats.';
            break;
        case 'sniper':
            towerTitle.textContent = TOWER_NAMES.sniper;
            towerDescription.textContent = 'Long range tower with high single-target damage.';
            break;
        case 'gatling':
            towerTitle.textContent = TOWER_NAMES.gatling;
            towerDescription.textContent = 'Rapid-fire tower with high attack speed.';
            break;
        case 'laser':
            towerTitle.textContent = TOWER_NAMES.laser;
            towerDescription.textContent = 'Energy-based tower that pierces through enemies.';
            break;
        case 'rocket':
            towerTitle.textContent = TOWER_NAMES.rocket;
            towerDescription.textContent = 'Explosive tower with area damage.';
            break;
    }

    if (towerStats) {
        towerStats.classList.remove('hidden');
    }
}


function upgradeTower(tower) {
    tower.upgrade();
}

export { updateTowerInfo, upgradeTower }; 