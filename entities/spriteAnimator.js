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
    }

    update (deltaTime) {
        this.frameTimer += deltaTime;
        if (this.frameTimer >= this.frameInterval){
            this.currentFrame = (this.currentFrame + 1) % this.totFrames
            this.frameTimer = 0;
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
    }

}