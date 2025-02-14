// generic names as it  will be reused with tower and enemy collisison
export function collision(value1, value2) {
    if ( value2.x >= value1.x && value2.x <= value1.x + 50 && value1.laneIndex === value2.laneIndex) {
        return true
    }
}