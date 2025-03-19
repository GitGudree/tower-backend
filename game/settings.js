// settings.js - Håndtering av spillinnstillinger

const Settings = {
    speedMultiplier: 1, // Juster spillhastighet (1 = normal)
    volume: 1, // Lydvolum (0 = mute, 1 = maks)

    init() {
        this.loadSettings();
        this.setupUI();
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
    }
};

// Initialiser innstillinger ved oppstart
Settings.init();

// Eksport for bruk i andre moduler
export default Settings;
