import { gameStats } from './statistics.js';

/**
 * Updates the stats display in the game UI
 */
function updateStatsDisplay() {
    document.getElementById('totalDamageValue').textContent = gameStats.totalTowerDamage.toLocaleString();
    document.getElementById('enemiesKilledValue').textContent = gameStats.totalEnemiesKilled.toLocaleString();
    document.getElementById('moneySpentValue').textContent = gameStats.totalMoneySpent.toLocaleString();
    document.getElementById('waveReachedValue').textContent = gameStats.highestWaveReached.toLocaleString();
    document.getElementById('bossesReachedValue').textContent = gameStats.totalBossStagesReached.toLocaleString();
}

export { updateStatsDisplay };

setInterval(updateStatsDisplay, 1000); 