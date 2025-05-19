import { soundManager } from './soundManager.js';

/**
 * Toast Message module implementing notification system functionality.
 * 
 * @module toast-message
 * @author Randomfevva
 **/

/**
 * Creates and shows a toast message
 * @param {string} message - The message to display
 * @param {number} duration - Duration in seconds
 * @param {string} type - Type of message ('success', 'error', 'info', 'warning')
 */
export function showToast(message, duration = 2, type = 'info') {
    const existingToast = document.getElementById('toast-container');
    if (existingToast) {
        existingToast.remove();
    }

    const toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container';
    toastContainer.className = `toast-container ${type}`;

    const toastMessage = document.createElement('div');
    toastMessage.className = 'toast-message';
    toastMessage.textContent = message;

    const progressBar = document.createElement('div');
    progressBar.className = 'toast-progress';

    toastContainer.appendChild(toastMessage);
    toastContainer.appendChild(progressBar);
    document.body.appendChild(toastContainer);

    requestAnimationFrame(() => {
        toastContainer.style.transform = 'translateY(0)';
        progressBar.style.width = '0';
    });

    setTimeout(() => {
        toastContainer.style.transform = 'translateY(-100%)';
        setTimeout(() => toastContainer.remove(), 300);
    }, duration * 1000);
}

export const toastSuccess = (message, duration) => showToast(message, duration, 'success');
export const toastError = (message, duration) => showToast(message, duration, 'error');
export const toastInfo = (message, duration) => showToast(message, duration, 'info');
export const toastWarning = (message, duration) => showToast(message, duration, 'warning');

export const TOAST_MESSAGES = {
    TOWER: {
        UPGRADE_SUCCESS: 'Tower successfully upgraded!',
        UPGRADE_ERROR: 'Not enough resources for upgrade',
        UNLOCK_SUCCESS: 'Tower unlocked! You can now build this tower type.',
        UNLOCK_ERROR: 'Not enough money to unlock tower',
        LOCKED: 'This tower is locked. Click unlock to purchase access.',
        PLACED: 'Tower placed successfully',
        SOLD: 'Tower scrapped successfully',
        REPAIR_SUCCESS: 'Tower repaired successfully!',
        REPAIR_ERROR: 'Not enough resources to repair tower',
        REPAIR_NOT_NEEDED: 'Tower is already at full health'
    },
    SHOP: {
        PURCHASE_SUCCESS: 'Item purchased successfully!',
        PURCHASE_ERROR: 'Not enough money to buy item',
        INVENTORY_FULL: 'Inventory is full!'
    },
    INVENTORY: {
        ITEM_USED: 'Item used successfully',
        ITEM_DELETED: 'Item deleted',
        ITEM_ERROR: 'Cannot use item right now'
    },
    WAVE: {
        START: 'Wave started!',
        COMPLETE: 'Wave completed!',
        AUTO_ENABLED: 'Auto wave enabled',
        AUTO_DISABLED: 'Auto wave disabled'
    }
}; 