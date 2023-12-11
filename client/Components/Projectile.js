//projectile.js
import Phaser from 'phaser';
export default class Projectile extends Phaser.GameObjects.Container {
    constructor(scene, x, y, phase) {
        super(scene, x, y);
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.phase = phase;
        this.ball = null; // Placeholder for the seed sprite
        this.create();
        this.scene.add.existing(this);
    }
    create() {
        this.createSprites();
        this.scene.projectiles.push(this);
    }
    createSprites() {
        //See which kind of bubby we are creating
        if (this.phase === 'ball') {
            this.sprite = this.scene.add.sprite(0, 0, 'ball');
            this.sprite.setDepth(1);
            console.log('cool made a ball')
        } else if (this.phase === 'bullet') {
            //this.sprite = this.scene.add.sprite(0, 0, 'sprout');
        }
        this.add(this.sprite);
    }
    update() {
        if (this.sprite) {
            // Calculate the new position based on direction and speed
            // const deltaX = Math.cos(this.direction) * this.speed;
            // const deltaY = Math.sin(this.direction) * this.speed;
    
            // // Update the projectile's position
            // this.x += deltaX;
            // this.y += deltaY;

            // if (this.team == "blue") {
            //     this.sprite.setFlipX(false);
            // } else {
            //     this.sprite.setFlipX(true);
            // }
        }
    }
}

