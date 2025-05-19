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
  gatling: "./public/sprites/gatling-0001-Sheet.png",
  sniper: "./public/sprites/railgun-0002-Sheet.png",
  default: "./public/sprites/default-0002-Sheet.png",
  rocket: "./public/sprites/mortard-0002-Sheet.png",
  laser: "./public/sprites/lazoar-0001-Sheet.png",
  artillery: "./public/sprites/artyTower-0001-Sheet.png",
  barricade:  "./public/sprites/barricade-0001-Sheet.png",
  slowTower: "./public/sprites/slow-0001.png",
  mineTower:  "./public/sprites/mine-0001-Sheet.png",
  enemy: "./public/sprites/normEnemy-0001-Sheet.png",
  tankEnemy: "./public/sprites/btrEnemy-0001-Sheet.png",
  bossEnemy: "./public/sprites/mechEnemy-0001-Sheet.png",
  fastEnemy: "./public/sprites/fastEnemy-0001-Sheet.png"
  
};

for (const [key, src] of Object.entries(imagePaths)) { 
  const img = new Image();
  img.src = src;
  sprites[key] = img;
}
