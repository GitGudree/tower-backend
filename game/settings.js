/**
 * Settings module implementing game configuration functionality.
 * 
 * @module settings
 * @author Randomfevva
 * @contributor Anarox
 * @description Handles game settings and their persistence
 */

import { soundManager } from './soundManager.js';

const Settings = {
    speedMultiplier: 1,
    volume: 1,

    /**
     * Initializes settings module.
     * 
     * @method init
     */
    init() {
        this.loadSettings();
        this.setupUI();
        this.setupPopupControls();
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
        
        if (savedSpeed) this.speedMultiplier = parseFloat(savedSpeed);
        if (savedVolume) this.volume = parseFloat(savedVolume);
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
            this.volume = 1.0;
            volumeSlider.value = this.volume;
            soundManager.setVolume(this.volume);
            volumeSlider.addEventListener('input', (e) => {
                this.volume = parseFloat(e.target.value);
                soundManager.setVolume(this.volume);
                this.saveSettings();
            });
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

        console.log("settingsPopup:", settingsPopup);
        console.log("settingsButton:", settingsButton);
        console.log("closeButton:", closeButton);

        if (settingsButton && settingsPopup) {
            settingsButton.addEventListener("click", () => {
                console.log("Settings button clicked!");
                settingsPopup.classList.remove('hidden');
            });
        }

        if (closeButton) {
            closeButton.addEventListener("click", () => {
                console.log("Close button clicked!");
                settingsPopup.classList.add('hidden');
            });
        }

        settingsPopup.addEventListener("click", (e) => {
            if (e.target === settingsPopup) {
                settingsPopup.classList.add('hidden');
            }
        });
    }
};

Settings.init();

export default Settings;
