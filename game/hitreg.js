/**
 * Defines collision, generic name as it will handle all collision types
 *               

 * @param: party 1, party 2            for example: bullet, enemy
 * @author:    Quetzalcoatl
 * Created:   15.02.2025
 **/
export function collision(value1, value2) {
    if ( value2.x >= value1.x && value2.x <= value1.x + 50 && value1.y === value2.y) {
        return true
    }
}