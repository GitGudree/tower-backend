import { toastSuccess, toastError, toastWarning, TOAST_MESSAGES } from "./toast-message.js";
import { resources, updateResources } from "./game.js";

/**
 * Tower Unlock System module implementing tower progression functionality.
 * 
 * @module towerUnlockSystem
 * @author Randomfevva
 **/

export const TOWER_DATA = {
    basic: {
        price: 70,
        unlocked: true,
        unlockPrice: 0
    },
    sniper: {
        price: 230,
        unlocked: false,
        unlockPrice: 350
    },
    gatling: {
        price: 100,
        unlocked: false,
        unlockPrice: 100
    },
    rocket: {
        price: 200,
        unlocked: false,
        unlockPrice: 250
    },
    laser: {
        price: 300,
        unlocked: false,
        unlockPrice: 400
    },
    artillery: {
        price: 250,
        unlocked: false,
        unlockPrice: 500
    }
};

export function isTowerUnlocked(towerType) {
    return TOWER_DATA[towerType]?.unlocked ?? false;
}

export function getTowerPrice(towerType) {
    return TOWER_DATA[towerType]?.price ?? 50;
}

export function getUnlockPrice(towerType) {
    switch(towerType) {
        case 'basic':
            return 0;
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
            return 999999;
    }
}

export function unlockTower(towerType) {
    const tower = TOWER_DATA[towerType];
    if (!tower) return false;
    
    if (tower.unlocked) {
        toastWarning("This tower is already unlocked!");
        return false;
    }

    if (resources >= tower.unlockPrice + 1) {
        updateResources("decrease", tower.unlockPrice);
        tower.unlocked = true;
        toastSuccess(TOAST_MESSAGES.TOWER.UNLOCK_SUCCESS);
        updateTowerCardStates();
        return true;
    } else {
        toastError(TOAST_MESSAGES.TOWER.UNLOCK_ERROR);
        return false;
    }
}

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
            card.querySelector('.tower-unlock-price-title').innerHTML = `<span class="tower-unlock-price">Unlock: ${tower.unlockPrice} ⚒️</span>`;
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    updateTowerCardStates();
}); 