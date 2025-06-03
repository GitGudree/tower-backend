/**
 * Sprite Animator module implementing sprite animation functionality.
 * 
 * @module spriteAnimator
 * @author Quetzalcoatl
 * @contributor Randomfevva
 * @date 2025-01-25
 **/

export class SpriteAnimator {
    constructor (image, startY, frameWidth, frameHeight, totFrames, frameInterval = 100){
        this.image = image;
        this.frameWidth = frameWidth;
        this.frameHeight = frameHeight;
        this.totFrames = totFrames;
        this.frameInterval = frameInterval;
        this.startY = startY;

        this.currentFrame = 0;
        this.frameTimer = 0;
        this.lastUpdate = performance.now();
        this.isAnimating = false;
        
        this.frameCache = new Map(); 
        this.lastDrawnFrame = -1;
        this.updateThreshold = 32; 
        this.shouldUpdate = true;
    }

    update(deltaTime) {
        const now = performance.now();
        
        if (now - this.lastUpdate < 33) {
            return;
        }

        this.frameTimer += deltaTime;
        if (this.frameTimer >= this.frameInterval) {
            const framesToAdvance = Math.min(
                Math.floor(this.frameTimer / this.frameInterval),
                2 
            );
            this.currentFrame = (this.currentFrame + framesToAdvance) % this.totFrames;
            this.frameTimer = this.frameTimer % this.frameInterval;
            this.isAnimating = true;
            this.lastUpdate = now;
        }
    }

    draw(ctx, x, y, width = this.frameWidth, height = this.frameHeight) {
        if (!this.image || !this.image.complete) { return; }

        ctx.drawImage(
            this.image,
            this.currentFrame * this.frameWidth, this.startY,
            this.frameWidth, this.frameHeight,
            x, y,
            width, height
        );
    }

    reset() {
        this.currentFrame = 0;
        this.frameTimer = 0;
        this.isAnimating = false;
        this.lastUpdate = performance.now();
    }

    setUpdateFrequency(enabled, threshold = 32) {
        this.shouldUpdate = enabled;
        this.updateThreshold = threshold;
    }
}