import { auth } from '../auth/firebase-config.js';
import { updateUserStats } from '../auth/auth-service.js';
import { updateStatsDisplay } from './statsDisplay.js';
import { toastInfo } from './toast-message.js';

let gameStats = {
    totalTowerDamage: 0,
    totalResourcesGathered: 0,
    totalEnemiesKilled: 0,
    totalMoneySpent: 0,
    highestWaveReached: 0,
    totalBossStagesReached: 0
};

export function recordTowerDamage(damage) {
    gameStats.totalTowerDamage += damage;
    updateStatsDisplay();
}

export function recordResourcesGathered(amount) {
    gameStats.totalResourcesGathered += amount;
    updateStatsDisplay();
}

export function recordEnemyKilled() {
    gameStats.totalEnemiesKilled += 1;
    updateStatsDisplay();
}

export function recordMoneySpent(amount) {
    gameStats.totalMoneySpent += amount;
    updateStatsDisplay();
}

export function recordWaveReached(wave) {
    if (wave > gameStats.highestWaveReached) {
        gameStats.highestWaveReached = wave;
        updateStatsDisplay();
    }
}

export function recordBossStage() {
    gameStats.totalBossStagesReached += 1;
    toastInfo("Saving stats to leaderboard");
    updateGameStats();
}

async function updateGameStats() {
    // Update the display
    updateStatsDisplay();
    // Save to localStorage for cross-page persistence
    localStorage.setItem('latestGameStats', JSON.stringify(gameStats));
    // Update the database
    if (auth.currentUser) {
        const result = await updateUserStats(auth.currentUser.uid, gameStats);
        console.log("Stats updated " + result);
 
        if (!result.success) {
            console.error("Failed to update stats:", result.error);
        }
    }
}

export function loadGameStatsFromStorage() {
    const saved = localStorage.getItem('latestGameStats');
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            Object.assign(gameStats, parsed);
        } catch (e) {
            console.error('Failed to parse saved game stats:', e);
        }
    }
}

export function resetGameStats() {
    gameStats = {
        totalTowerDamage: 0,
        totalResourcesGathered: 0,
        totalEnemiesKilled: 0,
        totalMoneySpent: 0,
        highestWaveReached: 0,
        totalBossStagesReached: 0
    };
    updateStatsDisplay();
}

export { gameStats, updateGameStats }; 