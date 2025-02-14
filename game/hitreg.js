export function collision(enemy, bullet) {
    if (bullet.x >= enemy.x && bullet.x <= enemy.x + 50) {
        return true
    }
}