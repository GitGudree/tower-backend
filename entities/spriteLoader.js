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
  gatling: "/gatling-0001-Sheet.png",
  sniper: "/railgun-0002-Sheet.png",
  default: "/default-0002-Sheet.png",
  rocket: "/mortard-0002-Sheet.png",
};

for (const [key, src] of Object.entries(imagePaths)) { // should load images before they are used
  const img = new Image();
  img.src = src;
  sprites[key] = img;
}
