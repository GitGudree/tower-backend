import { auth } from '../auth/firebase-config.js';
import { updateUserStats } from '../auth/auth-service.js';
import { updateStatsDisplay } from './statsDisplay.js';

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
    updateGameStats();
}

export function recordResourcesGathered(amount) {
    gameStats.totalResourcesGathered += amount;
    updateGameStats();
}

export function recordEnemyKilled() {
    gameStats.totalEnemiesKilled += 1;
    updateGameStats();
}

export function recordMoneySpent(amount) {
    gameStats.totalMoneySpent += amount;
    updateGameStats();
}

export function recordWaveReached(wave) {
    if (wave > gameStats.highestWaveReached) {
        gameStats.highestWaveReached = wave;
        updateGameStats();
    }
}

export function recordBossStage() {
    gameStats.totalBossStagesReached += 1;
    updateGameStats();
}

async function updateGameStats() {
    // Update the display
    updateStatsDisplay();
    
    // Update the database
    if (auth.currentUser) {
        const result = await updateUserStats(auth.currentUser.uid, gameStats);
 
        if (!result.success) {
            console.error("Failed to update stats:", result.error);
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


export { gameStats }; 