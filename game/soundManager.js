/**
 * Sound Manager module implementing audio system functionality.
 * 
 * @module soundManager
 * @author Randomfevva
 * @date 2025-01-25
 **/

export class SoundManager {
    constructor() {
        this.sounds = new Map();
        this.soundVolumes = new Map();
        this.muted = false;
        this.volume = 1.0;
        this.loops = new Map();
        this.loopStopTimeouts = new Map();
        this.music = {
            current: null,
            tracks: {},
            volume: 1.0,
            pendingPlay: null
        };
        this.hasUserInteracted = false;
        console.log("SoundManager initialized");

        document.addEventListener('click', () => {
            if (!this.hasUserInteracted) {
                this.hasUserInteracted = true;
                if (this.music.pendingPlay) {
                    this.playMusic(this.music.pendingPlay);
                    this.music.pendingPlay = null;
                }
            }
        }, { once: true });
    }

    loadSound(name, path) {
        console.log(`Loading sound: ${name} from ${path}`);
        return new Promise((resolve, reject) => {
            const audio = new Audio(path);
            audio.volume = this.volume;
            if (name === 'rocket' || name === 'artillery_fire') {
                this.soundVolumes.set(name, 0.12);
            } else if (name === 'background_music' || name === 'gameplay_music') {
                audio.loop = true;
                audio.volume = this.music.volume;
                this.music.tracks[name] = audio;
            } else {
                this.soundVolumes.set(name, this.volume);
            }
            this.sounds.set(name, audio);
            
            audio.addEventListener('canplaythrough', () => {
                console.log(`Sound ${name} loaded successfully`);
                resolve();
            }, { once: true });
            
            audio.addEventListener('error', (error) => {
                console.error(`Error loading sound ${name}:`, error);
                reject(error);
            }, { once: true });
        });
    }

    playMusic(type) {
        let trackName = null;
        if (type === 'background') trackName = 'background_music';
        if (type === 'gameplay') trackName = 'gameplay_music';
        if (!trackName) return;

        if (!this.hasUserInteracted) {
            this.music.pendingPlay = type;
            console.log('Music will start after user interaction');
            return;
        }
        
        if (this.music.current && this.music.current !== this.music.tracks[trackName]) {
            this.music.current.pause();
            this.music.current.currentTime = 0;
        }
        
        const track = this.music.tracks[trackName];
        if (track && this.music.current !== track) {
            track.currentTime = 0;
            track.volume = this.music.volume;
            track.play().catch(error => {
                console.error(`Error playing music ${trackName}:`, error);
                setTimeout(() => {
                    track.play().catch(err => console.error(`Failed to play music ${trackName} after retry:`, err));
                }, 1000);
            });
            this.music.current = track;
            console.log(`Started playing ${trackName}`);
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
            
            const baseVolume = name === 'rocket' || name === 'artillery_fire' ? 0.12 : 1.0;
            soundClone.volume = baseVolume * this.volume;
            
            soundClone.play().catch(error => {
                console.error(`Error playing sound ${name}:`, error);
            });
        } else {
            console.warn(`Sound ${name} not found in sound manager`);
        }
    }

    playLoop(name) {
        if (this.muted) return;
        if (this.loops.has(name)) return;
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
        
        this.sounds.forEach(sound => {
            if (sound !== this.music.tracks['background_music'] && 
                sound !== this.music.tracks['gameplay_music']) {
                sound.volume = this.volume;
            }
        });
        
        this.loops.forEach(loopAudio => {
            loopAudio.volume = this.volume;
        });
        
        this.music.volume = this.volume;
        if (this.music.current) {
            this.music.current.volume = this.volume;
        }
        
        
        this.soundVolumes.forEach((customVolume, name) => {
            if (name !== 'background_music' && name !== 'gameplay_music') {
                const baseVolume = name === 'rocket' || name === 'artillery_fire' ? 0.12 : 1.0;
                this.soundVolumes.set(name, baseVolume * this.volume);
            }
        });
        
        console.log(`Master volume set to: ${this.volume}`);
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

export const soundManager = new SoundManager(); 