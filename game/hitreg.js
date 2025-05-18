/**
 *  Defines collision, generic variable names as it will handle all collision types, uses centre point hit detection and a simpler method for tower-enemy collision
 * 
 * @module hitreg
 * @param: value 1, value 2            for example: bullet, enemy
 * @author Anarox, Quetzalcoatl
 * @contributor Quetzalcoatl
 * @date 2025-01-25
 **/
export function collision(value1, value2, type) {
    switch (type) {
    case "boundingBox":
        if (value1.laneIndex === value2.laneIndex){
        return (
                value1.x < value2.x + value2.width &&
                value1.x + value1.width > value2.x &&
                value1.y < value2.y + value2.height &&
                value1.y + value1.height > value2.y
                );
            }
    default:
        return ( value2.x >= value1.x && value2.x <= value1.x + 50 && value1.y === value2.y) // bounding box causes issues in tower-enemy collision so this is used instead
               
           
    }
}