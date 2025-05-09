import { toastSuccess, toastError, toastWarning, toastInfo, TOAST_MESSAGES } from "./toast-message.js";
import { money, updateMoney } from "./game.js";
import { isTowerUnlocked, unlockTower, TOWER_DATA } from "./towerUnlockSystem.js";
import { setChosenTower } from "../entities/towers/towerState.js";

// Tower type display names
const TOWER_NAMES = {
    'basic': 'Normal Tower',
    'sniper': 'Sniper Tower',
    'gatling': 'Gatling Tower',
    'laser': 'Laser Tower',
    'rocket': 'Rocket Tower',
    'artillery': 'Artillery Tower',
    // Add inventory items
    'barricade': 'Barricade',
    'mine': 'Mine',
    'slowtrap': 'Slow Trap'
};

document.addEventListener('DOMContentLoaded', () => {
    // Handle tower selection
    const towerCards = document.querySelectorAll('.card[tower-type]');
    towerCards.forEach(card => {
        card.addEventListener('click', () => {
            const towerType = card.getAttribute('tower-type');
            if (!towerType) return;

            // Check if tower is locked
            if (!isTowerUnlocked(towerType)) {
                unlockTower(towerType);
                return;
            }

            // If tower is unlocked, handle selection
            document.querySelectorAll('.card').forEach(c => {
                c.classList.remove('select');
                // Remove any previous selection styling
                setChosenTower(null);
            });

            // Add selection styling and set as chosen tower
            card.classList.add('select');
            setChosenTower(towerType);
            
            updateTowerInfo(towerType);
            const towerName = TOWER_NAMES[towerType] || 'Unknown tower';
            toastInfo(`${towerName} selected`);
        });

        // Add initial locked state check
        const towerType = card.getAttribute('tower-type');
        if (towerType && !isTowerUnlocked(towerType)) {
            card.classList.add('locked');
        }
    });

    // Listen for tower unlock events to update UI
    document.addEventListener('towerUnlocked', (event) => {
        const towerType = event.detail?.towerType;
        if (towerType) {
            const card = document.querySelector(`.card[tower-type="${towerType}"]`);
            if (card) {
                card.classList.remove('locked');
            }
        }
    });

    // Handle tower upgrade
    const upgradeButton = document.querySelector('.tower-upgrade-btn');
    if (upgradeButton) {
        upgradeButton.addEventListener('click', () => {
            const selectedTower = document.querySelector('.card.select');
            if (!selectedTower) {
                toastWarning("Please select a tower first");
                return;
            }

            const upgradeCost = calculateUpgradeCost(selectedTower);
            if (money >= upgradeCost) {
                updateMoney("decrease", upgradeCost);
                upgradeTower(selectedTower);
                toastSuccess(TOAST_MESSAGES.TOWER.UPGRADE_SUCCESS);
            } else {
                toastError(TOAST_MESSAGES.TOWER.UPGRADE_ERROR);
            }
        });
    }

    // Listen for tower placement events
    document.addEventListener('towerPlaced', (event) => {
        const towerType = event.detail?.towerType;
        if (towerType) {
            const towerName = TOWER_NAMES[towerType.toLowerCase()] || 'Unknown tower';
            toastSuccess(`${towerName} placed`);
        }
    });
});

function updateTowerInfo(towerType) {
    // Update tower info display based on tower type
    const towerImage = document.getElementById('tower-image');
    const towerTitle = document.getElementById('tower-title');
    const towerDescription = document.getElementById('tower-description');
    const towerStats = document.getElementById('tower-stats');

    // Set tower info based on type
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

    // Show tower stats
    if (towerStats) {
        towerStats.classList.remove('hidden');
    }
}

function calculateUpgradeCost(tower) {
    // Add your upgrade cost calculation logic here
    return 100; // Example cost
}

function upgradeTower(tower) {
    // Add your tower upgrade logic here
    // This should update the tower's stats and visual appearance
}

// Export functions that might be needed elsewhere
export { updateTowerInfo, upgradeTower }; 