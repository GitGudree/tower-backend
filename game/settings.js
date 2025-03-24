// settings.js - Håndtering av spillinnstillinger

const Settings = {
    speedMultiplier: 1, // Juster spillhastighet (1 = normal)
    volume: 1, // Lydvolum (0 = mute, 1 = maks)

    init() {
        this.loadSettings();
        this.setupUI();
        this.setupPopupControls(); // Legger til popup-funksjonalitet
    },

    loadSettings() {
        const savedSpeed = localStorage.getItem('gameSpeed');
        const savedVolume = localStorage.getItem('gameVolume');
        
        if (savedSpeed) this.speedMultiplier = parseFloat(savedSpeed);
        if (savedVolume) this.volume = parseFloat(savedVolume);
    },

    saveSettings() {
        localStorage.setItem('gameSpeed', this.speedMultiplier);
        localStorage.setItem('gameVolume', this.volume);
    },

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
            volumeSlider.addEventListener('input', (e) => {
                this.volume = parseFloat(e.target.value);
                this.saveSettings();
            });
        }
    },

    // Funksjonalitet for pop-up menyen
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
                settingsPopup.style.display = "flex";
            });
        }

        if (closeButton) {
            closeButton.addEventListener("click", () => {
                console.log("Close button clicked!");
                settingsPopup.style.display = "none";
            });
        }
    }
};

// Initialiser innstillinger ved oppstart
Settings.init();

// Eksport for bruk i andre moduler
export default Settings;
