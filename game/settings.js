/**
 * Settings module implementing game configuration functionality.
 * 
 * @module settings
 * @author Randomfevva
 * @contributor Anarox
 * @description Handles game settings and their persistence
 */

import { soundManager } from './soundManager.js';
import { openTab } from './eventhandler.js';

const Settings = {
    speedMultiplier: 1,
    volume: 1,
    
    // Default keybindings
    keybindings: {
        startWave: 'S',
        autoWave: 'A',
        gameTab: 'Q',
        towerTab: 'W',
        inventoryTab: 'E',
        shopTab: 'R'
    },

    /**
     * Initializes settings module.
     * 
     * @method init
     */
    init() {
        this.loadSettings();
        this.setupUI();
        this.setupPopupControls();
        this.setupKeybindings();
    },

    /**
     * Loads settings from local storage.
     * 
     * @method loadSettings
     * @private
     */
    loadSettings() {
        const savedSpeed = localStorage.getItem('gameSpeed');
        const savedVolume = localStorage.getItem('gameVolume');
        const savedKeybindings = localStorage.getItem('gameKeybindings');
        
        if (savedSpeed) this.speedMultiplier = parseFloat(savedSpeed);
        if (savedVolume) this.volume = parseFloat(savedVolume);
        if (savedKeybindings) {
            this.keybindings = { ...this.keybindings, ...JSON.parse(savedKeybindings) };
        }
    },

    /**
     * Saves settings to local storage.
     * 
     * @method saveSettings
     * @private
     */
    saveSettings() {
        localStorage.setItem('gameSpeed', this.speedMultiplier);
        localStorage.setItem('gameVolume', this.volume);
        localStorage.setItem('gameKeybindings', JSON.stringify(this.keybindings));
    },

    /**
     * Sets up UI controls for settings.
     * 
     * @method setupUI
     * @private
     */
    setupUI() {
        const speedSlider = document.getElementById('speedSlider');
        const volumeSlider = document.getElementById('volumeSlider');
        
        if (speedSlider) {
            speedSlider.value = this.speedMultiplier;
            speedSlider.addEventListener('input', (e) => {
                this.speedMultiplier = parseFloat(e.target.value);
                this.saveSettings();
            });
        }

        if (volumeSlider) {
            volumeSlider.value = this.volume;
            soundManager.setVolume(this.volume);
            volumeSlider.addEventListener('input', (e) => {
                this.volume = parseFloat(e.target.value);
                soundManager.setVolume(this.volume);
                this.saveSettings();
            });
        }

        // Setup keybinding inputs
        this.setupKeybindingInputs();
    },

    /**
     * Sets up keybinding input fields in settings.
     * 
     * @method setupKeybindingInputs
     * @private
     */
    setupKeybindingInputs() {
        const keybindingInputs = {
            'startWave': 'startWaveKey',
            'autoWave': 'autoWaveKey', 
            'gameTab': 'gameTabKey',
            'towerTab': 'towerTabKey',
            'inventoryTab': 'inventoryTabKey',
            'shopTab': 'shopTabKey'
        };

        for (const [key, inputId] of Object.entries(keybindingInputs)) {
            const input = document.getElementById(inputId);
            if (input) {
                input.value = this.keybindings[key];
                input.addEventListener('input', (e) => {
                    const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
                    if (value.length > 0) {
                        this.keybindings[key] = value;
                        this.saveSettings();
                        e.target.value = value;
                    }
                });
            }
        }
    },

    /**
     * Sets up popup menu functionality.
     * 
     * @method setupPopupControls
     * @private
     */
    setupPopupControls() {
        const settingsPopup = document.getElementById("settingsPopup");
        const settingsButton = document.querySelector(".settings-btn");
        const closeButton = document.querySelector("#settingsPopup button");

        if (settingsButton && settingsPopup) {
            settingsButton.addEventListener("click", () => {
                settingsPopup.classList.remove('hidden');
            });
        }

        if (closeButton) {
            closeButton.addEventListener("click", () => {
                settingsPopup.classList.add('hidden');
            });
        }

        if (settingsPopup) {
            settingsPopup.addEventListener("click", (e) => {
                if (e.target === settingsPopup) {
                    settingsPopup.classList.add('hidden');
                }
            });
        }
    },

    /**
     * Sets up global keybindings.
     * 
     * @method setupKeybindings
     * @private
     */
    setupKeybindings() {
        document.addEventListener('keydown', (e) => {
            const key = e.key.toUpperCase();
            
            // Ignore if user is typing in an input field
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                return;
            }

            switch (key) {
                case this.keybindings.startWave:
                    e.preventDefault();
                    this.triggerStartWave();
                    break;
                case this.keybindings.autoWave:
                    e.preventDefault();
                    this.triggerAutoWave();
                    break;
                case this.keybindings.gameTab:
                    e.preventDefault();
                    this.switchToTab('game-tab');
                    break;
                case this.keybindings.towerTab:
                    e.preventDefault();
                    this.switchToTab('tower-tab');
                    break;
                case this.keybindings.inventoryTab:
                    e.preventDefault();
                    this.switchToTab('inventory-tab');
                    break;
                case this.keybindings.shopTab:
                    e.preventDefault();
                    this.switchToTab('shop-tab');
                    break;
            }
        });
    },

    /**
     * Triggers start wave action.
     * 
     * @method triggerStartWave
     * @private
     */
    triggerStartWave() {
        const startWaveBtn = document.querySelector('.start-wave-btn');
        if (startWaveBtn && !startWaveBtn.disabled) {
            startWaveBtn.click();
        }
    },

    /**
     * Triggers auto wave toggle.
     * 
     * @method triggerAutoWave
     * @private
     */
    triggerAutoWave() {
        const autoWaveCheckbox = document.getElementById('autoWaveCheckbox');
        if (autoWaveCheckbox) {
            autoWaveCheckbox.checked = !autoWaveCheckbox.checked;
            autoWaveCheckbox.dispatchEvent(new Event('change'));
        }
    },

    /**
     * Switches to a specific tab.
     * 
     * @method switchToTab
     * @param {string} tabName - The tab to switch to
     * @private
     */
    switchToTab(tabName) {
        const tabButton = document.querySelector(`[data-tab="${tabName}"]`);
        if (tabButton) {
            openTab(tabButton);
        }
    },

    /**
     * Gets the current keybindings.
     * 
     * @method getKeybindings
     * @returns {Object} Current keybindings
     */
    getKeybindings() {
        return { ...this.keybindings };
    }
};

Settings.init();

export default Settings;
