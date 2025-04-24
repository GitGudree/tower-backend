/**
 * Defines collision, generic variable name as it will handle all collision types, uses bounding box hit detection and a simpler method for tower-enemy collision
 *               

 * @param: party 1, party 2            for example: bullet, enemy
 * @author:    Quetzalcoatl
 * Created:   15.02.2025
 **/
export function collision(value1, value2, type) {
    switch (type) {
        case "boundingBox":
            return (
                value1.x < value2.x + value2.width &&
                value1.x + value1.width > value2.x &&
                value1.y < value2.y + value2.height &&
                value1.y + value1.height > value2.y
            );
        default:
            return ( value2.x >= value1.x && value2.x <= value1.x + 50 && value1.y === value2.y) // bounding box causes issues in tower-enemy collision so this is used instead
    }
}