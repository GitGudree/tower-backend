/**
 * Creates and shows a toast message
 * @param {string} message - The message to display
 * @param {number} duration - Duration in seconds
 * @param {string} type - Type of message ('success', 'error', 'info', 'warning')
 */
export function showToast(message, duration = 2, type = 'info') {
    // Remove any existing toast
    const existingToast = document.getElementById('toast-container');
    if (existingToast) {
        existingToast.remove();
    }

    // Create toast container if it doesn't exist
    const toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container';
    toastContainer.className = `toast-container ${type}`;

    // Create toast message element
    const toastMessage = document.createElement('div');
    toastMessage.className = 'toast-message';
    toastMessage.textContent = message;

    // Add progress bar
    const progressBar = document.createElement('div');
    progressBar.className = 'toast-progress';

    // Append elements
    toastContainer.appendChild(toastMessage);
    toastContainer.appendChild(progressBar);
    document.body.appendChild(toastContainer);

    // Animation
    requestAnimationFrame(() => {
        toastContainer.style.transform = 'translateY(0)';
        progressBar.style.width = '0';
    });

    // Remove toast after duration
    setTimeout(() => {
        toastContainer.style.transform = 'translateY(-100%)';
        setTimeout(() => toastContainer.remove(), 300);
    }, duration * 1000);
}

// Predefined message functions
export const toastSuccess = (message, duration) => showToast(message, duration, 'success');
export const toastError = (message, duration) => showToast(message, duration, 'error');
export const toastInfo = (message, duration) => showToast(message, duration, 'info');
export const toastWarning = (message, duration) => showToast(message, duration, 'warning');

// Message templates for different actions
export const TOAST_MESSAGES = {
    TOWER: {
        UPGRADE_SUCCESS: 'Tower successfully upgraded!',
        UPGRADE_ERROR: 'Not enough money for upgrade',
        UNLOCK_SUCCESS: 'Tower unlocked! You can now build this tower type.',
        UNLOCK_ERROR: 'Not enough money to unlock tower',
        LOCKED: 'This tower is locked. Click unlock to purchase access.',
        PLACED: 'Tower placed successfully',
        SOLD: 'Tower sold'
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