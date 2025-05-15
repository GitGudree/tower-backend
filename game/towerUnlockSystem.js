import { toastSuccess, toastError, toastWarning, TOAST_MESSAGES } from "./toast-message.js";
import { money, updateMoney } from "./game.js";

// Tower unlock prices and initial states
export const TOWER_DATA = {
    basic: {
        price: 100,
        unlocked: true,  // Basic tower starts unlocked
        unlockPrice: 0   // No unlock price for basic tower
    },
    sniper: {
        price: 70,
        unlocked: false,
        unlockPrice: 150
    },
    gatling: {
        price: 80,
        unlocked: false,
        unlockPrice: 200
    },
    rocket: {
        price: 100,
        unlocked: false,
        unlockPrice: 250
    },
    laser: {
        price: 200,
        unlocked: false,
        unlockPrice: 400
    },
    artillery: {
        price: 800,
        unlocked: false,
        unlockPrice: 500
    }
};

// Function to check if a tower is unlocked
export function isTowerUnlocked(towerType) {
    return TOWER_DATA[towerType]?.unlocked ?? false;
}

// Function to get tower price
export function getTowerPrice(towerType) {
    return TOWER_DATA[towerType]?.price ?? 50; // Default to 50 if not found
}

// Function to get tower unlock price
export function getUnlockPrice(towerType) {
    switch(towerType) {
        case 'basic':
            return 0; // Already unlocked
        case 'sniper':
            return 50;
        case 'gatling':
            return 50;
        case 'laser':
            return 50;
        case 'rocket':
            return 50;
        case 'artillery':
            return 500;
        default:
            return 999999; // High price for unknown towers
    }
}

// Function to unlock a tower
export function unlockTower(towerType) {
    const tower = TOWER_DATA[towerType];
    if (!tower) return false;
    
    if (tower.unlocked) {
        toastWarning("This tower is already unlocked!");
        return false;
    }

    if (money >= tower.unlockPrice) {
        updateMoney("decrease", tower.unlockPrice);
        tower.unlocked = true;
        toastSuccess(TOAST_MESSAGES.TOWER.UNLOCK_SUCCESS);
        updateTowerCardStates(); // Update visual states of tower cards
        return true;
    } else {
        toastError(TOAST_MESSAGES.TOWER.UNLOCK_ERROR);
        return false;
    }
}

// Function to update visual states of tower cards
function updateTowerCardStates() {
    const towerCards = document.querySelectorAll('.card[tower-type]');
    towerCards.forEach(card => {
        const towerType = card.getAttribute('tower-type');
        if (!towerType) return;

        const tower = TOWER_DATA[towerType];
        if (!tower) return;

        if (tower.unlocked) {
            card.classList.remove('locked');
            card.querySelector('.tower-unlock-price-title').innerHTML = `<span class="tower-unlock-price">${tower.price} 💶</span>`;
        } else {
            card.classList.add('locked');
            card.querySelector('.tower-unlock-price-title').innerHTML = `<span class="tower-unlock-price">Unlock: ${tower.unlockPrice} 💶</span>`;
        }
    });
}

// Initialize tower states when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    updateTowerCardStates();
}); 