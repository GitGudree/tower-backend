export class SoundManager {
    constructor() {
        this.sounds = new Map();
        this.soundVolumes = new Map(); // Store custom volumes
        this.muted = false;
        this.volume = 1.0; // Default to max volume
        this.loops = new Map(); // Track looping sounds
        this.loopStopTimeouts = new Map(); // Track debounce timeouts
        this.music = {
            current: null,
            tracks: {},
            volume: 1.0 // Default music volume is also max
        };
        console.log("SoundManager initialized");
    }

    loadSound(name, path) {
        console.log(`Loading sound: ${name} from ${path}`);
        const audio = new Audio(path);
        audio.volume = this.volume;
        // Set custom volume for specific sounds
        if (name === 'rocket' || name === 'artillery_fire') {
            this.soundVolumes.set(name, 0.12); // Lower volume for rocket and artillery sounds
        } else if (name === 'background_music' || name === 'gameplay_music') {
            audio.loop = true;
            audio.volume = this.music.volume;
            this.music.tracks[name] = audio;
        } else {
            this.soundVolumes.set(name, this.volume);
        }
        this.sounds.set(name, audio);
        console.log(`Sound ${name} loaded successfully`);
    }

    playMusic(type) {
        let trackName = null;
        if (type === 'background') trackName = 'background_music';
        if (type === 'gameplay') trackName = 'gameplay_music';
        if (!trackName) return;
        // Stop current music if playing
        if (this.music.current && this.music.current !== this.music.tracks[trackName]) {
            this.music.current.pause();
            this.music.current.currentTime = 0;
        }
        // Play new music if not already playing
        const track = this.music.tracks[trackName];
        if (track && this.music.current !== track) {
            track.currentTime = 0;
            track.volume = this.music.volume;
            track.play();
            this.music.current = track;
        }
    }

    stopMusic() {
        if (this.music.current) {
            this.music.current.pause();
            this.music.current.currentTime = 0;
            this.music.current = null;
        }
    }

    play(name) {
        if (this.muted) {
            console.log(`Sound ${name} not played - sound is muted`);
            return;
        }
        
        const sound = this.sounds.get(name);
        if (sound) {
            console.log(`Playing sound: ${name}`);
            const soundClone = sound.cloneNode();
            const customVolume = this.soundVolumes.get(name) ?? this.volume;
            soundClone.volume = customVolume;
            soundClone.play().catch(error => {
                console.error(`Error playing sound ${name}:`, error);
            });
        } else {
            console.warn(`Sound ${name} not found in sound manager`);
        }
    }

    playLoop(name) {
        if (this.muted) return;
        if (this.loops.has(name)) return; // Already playing
        // Cancel any pending stop for this sound
        if (this.loopStopTimeouts.has(name)) {
            clearTimeout(this.loopStopTimeouts.get(name));
            this.loopStopTimeouts.delete(name);
        }
        const sound = this.sounds.get(name);
        if (sound) {
            const loopAudio = sound.cloneNode();
            loopAudio.loop = true;
            const customVolume = this.soundVolumes.get(name) ?? this.volume;
            loopAudio.volume = customVolume;
            loopAudio.play().catch(error => {
                console.error(`Error playing looped sound ${name}:`, error);
            });
            this.loops.set(name, loopAudio);
        }
    }

    stopLoop(name) {
        // Debounce: wait 100ms before actually stopping
        if (this.loopStopTimeouts.has(name)) {
            clearTimeout(this.loopStopTimeouts.get(name));
        }
        const timeout = setTimeout(() => {
            const loopAudio = this.loops.get(name);
            if (loopAudio) {
                loopAudio.pause();
                loopAudio.currentTime = 0;
                this.loops.delete(name);
            }
            this.loopStopTimeouts.delete(name);
        }, 100);
        this.loopStopTimeouts.set(name, timeout);
    }

    setVolume(volume) {
        this.volume = Math.max(0, Math.min(1, volume));
        this.sounds.forEach(sound => sound.volume = this.volume);
        this.loops.forEach(loopAudio => loopAudio.volume = this.volume);
        // Update music volume live
        this.music.volume = this.volume;
        if (this.music.current) {
            this.music.current.volume = this.volume;
        }
        console.log(`Volume set to: ${this.volume}`);
    }

    toggleMute() {
        this.muted = !this.muted;
        this.loops.forEach(loopAudio => {
            loopAudio.muted = this.muted;
        });
        console.log(`Sound ${this.muted ? 'muted' : 'unmuted'}`);
    }

    fadeOutMusic(trackName, duration = 800, callback) {
        const track = this.music.tracks[trackName];
        if (!track) {
            if (callback) callback();
            return;
        }
        const startVolume = track.volume;
        const steps = 30;
        let currentStep = 0;
        const stepTime = duration / steps;
        const fade = () => {
            currentStep++;
            track.volume = startVolume * (1 - currentStep / steps);
            if (currentStep < steps) {
                setTimeout(fade, stepTime);
            } else {
                track.pause();
                track.currentTime = 0;
                track.volume = this.music.volume;
                if (callback) callback();
            }
        };
        fade();
    }
}

// Create and export a singleton instance
export const soundManager = new SoundManager(); 