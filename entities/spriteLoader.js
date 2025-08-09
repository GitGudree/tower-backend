/**
 * sprite loader class
 * contains sprites and loads them before use
 *
 * @constructor (x, y, row)
 * Author:    Quetzalcoatl
 * Created:   27.04.2025
 **/
export const sprites = {};

const imagePaths = {
      gatling: "/sprites/gatling-0001-Sheet.png",
    sniper: "/sprites/railgun-0002-Sheet.png",
    default: "/sprites/default-0002-Sheet.png",
    rocket: "/sprites/mortard-0002-Sheet.png",
    laser: "/sprites/lazoar-0001-Sheet.png",
    artillery: "/sprites/artyTower-0001-Sheet.png",
    barricade:  "/sprites/barricade-0001-Sheet.png",
    slowTower: "/sprites/slow-0001.png",
    mineTower:  "/sprites/mine-0001-Sheet.png",
    enemy: "/sprites/normEnemy-0001-Sheet.png",
    tankEnemy: "/sprites/btrEnemy-0001-Sheet.png",
    bossEnemy: "/sprites/mechEnemy-0001-Sheet.png",
    fastEnemy: "/sprites/fastEnemy-0001-Sheet.png"
  
};

for (const [key, src] of Object.entries(imagePaths)) { 
  const img = new Image();
  img.src = src;
  sprites[key] = img;
}
