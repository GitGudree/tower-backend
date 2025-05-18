import { Tower } from "./tower.js";
import { cellSize } from "../../game/grid.js";
import { collision } from "../../game/hitreg.js";
import { soundManager } from "../../game/soundManager.js";
import { sprites } from "../spriteLoader.js";
import { SpriteAnimator } from "../spriteAnimator.js";

/**
 * Mine tower class implementing explosive trap functionality.
 * 
 * @class Mine
 * @extends Tower
 * @param {number} x - X coordinate
 * @param {number} y - Y coordinate
 * @param {string} type - Tower type
 * @param {number} laneIndex - Lane position
 * @author Randomfevva
 **/

export class Mine extends Tower {
    constructor(x, y, type, laneIndex) {
        super(x, y, type, laneIndex);
        this.name = "mine";
        this.x = x;
        this.y = y;
        this.damage = 150;
        this.laneIndex = laneIndex;
        this.exploded = false;
        this.aoe = 80;
        this.explosionTimer = 0;
        this.explosionLifetime = 15;
        this.isActive = true;
        this.hitEnemies = new Set();
        
        // Completely disable tower behaviors
        this.range = 0;
        this.fireRate = 0;
        this.stopEnemy = 0;
        this.isColliding = false;
        
        // Set death-related properties
        this.deathTimer = 0;
        this.deathDuration = 0;
        this.isDead = false;

        this.animatorLive = new SpriteAnimator (sprites.mineTower, 0, 50, 50, 1); // image, startY, width, height, amount of frames, frame interval
        this.animatorDead = new SpriteAnimator (sprites.mineTower, 50, 50, 50, 1, 500);
    }

    update(deltaTime) {
        if (this.exploded) {
            this.explosionTimer += deltaTime;
            if (this.explosionTimer >= this.explosionLifetime) {
                // Remove all references to hit enemies before destroying
                this.hitEnemies.clear();
                this.isDead = true;
                return true; // Remove the mine
            }
        }
        return false;
    }

    // Override the attack method to handle explosion instead of shooting
    attack(enemies) {
        if (this.isActive && !this.exploded) {
            for (let enemy of enemies) {
                // Check if enemy is in the same lane and colliding
                if (enemy.laneIndex === this.laneIndex && collision(this, enemy)) {
                    console.log("Mine triggered!");
                    soundManager.play('mine_trigger');
                    
                    // Deal damage to triggering enemy
                    enemy.health -= this.damage;
                    this.hitEnemies.add(enemy);

                    // Deal AOE damage to nearby enemies in the same lane
                    enemies.forEach(nearbyEnemy => {
                        if (!this.hitEnemies.has(nearbyEnemy) && 
                            nearbyEnemy.laneIndex === this.laneIndex) {
                            const dx = nearbyEnemy.x - this.x;
                            const dy = nearbyEnemy.y - this.y;
                            const distance = Math.sqrt(dx * dx + dy * dy);
                            
                            if (distance <= this.aoe) {
                                nearbyEnemy.health -= this.damage;
                                this.hitEnemies.add(nearbyEnemy);
                            }
                        }
                    });

                    this.exploded = true;
                    this.isActive = false;
                    break;
                }
            }
        }
    }

    draw(ctx) {
        if (!this.exploded) {
            /*
            // Draw mine
            ctx.fillStyle = '#8B0000';
            ctx.beginPath();
            ctx.arc(this.x + cellSize/2, this.y + cellSize/2, cellSize/3, 0, Math.PI * 2);
            ctx.fill();

            if (this.selected) {
                ctx.strokeStyle = 'white';
                ctx.lineWidth = 2;
                ctx.stroke();
            }
                */
            
            /*
            // Draw crossed lines
            ctx.strokeStyle = 'white';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(this.x + cellSize/4, this.y + cellSize/4);
            ctx.lineTo(this.x + cellSize*3/4, this.y + cellSize*3/4);
            ctx.moveTo(this.x + cellSize*3/4, this.y + cellSize/4);
            ctx.lineTo(this.x + cellSize/4, this.y + cellSize*3/4);
            ctx.stroke();
            */

            // Draw synergy effects without the sprite
            this.drawSynergyEffects(ctx);
            this.drawSprite(ctx);
        } else if (this.explosionTimer < this.explosionLifetime) {
            // Draw explosion effect
            const alpha = 1 - (this.explosionTimer / this.explosionLifetime);
            ctx.fillStyle = `rgba(255, 165, 0, ${alpha})`;
            ctx.beginPath();
            ctx.arc(this.x + cellSize/2, this.y + cellSize/2, this.aoe, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    drawSprite(ctx) {
        // Draw the tower sprite
        if(!this.exploded){
            this.animatorLive.draw(ctx, this.x, this.y);
        } else{
            this.animatorDead.draw(ctx, this.x, this.y);
        }
        

        // Draw selection outline if selected
        if (this.selected) {
            ctx.save();
            ctx.strokeStyle = 'yellow';
            ctx.lineWidth = 2;
            ctx.strokeRect(this.x, this.y, cellSize, cellSize);
            ctx.restore();
        }
    }

    // Override all collision-related methods to do nothing
    stopEnemyMovement() {
        return;
    }

    updateTowerCollision() {
        return;
    }

    upgrade() {
        return;
    }
} 