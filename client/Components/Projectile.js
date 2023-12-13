//projectile.js
import Phaser from 'phaser';
export default class Projectile extends Phaser.GameObjects.Container {
    constructor(scene, x, y, phase, team, id) {
        super(scene, x, y);
        this.team = team;
        this.scene = scene;
        this.id = id;
        this.x = x;
        this.y = y;
        this.phase = phase;
        this.ball = null; // Placeholder for the seed sprite
        this.create();
        this.scene.add.existing(this);
        this.direction = { x: 0, y: 0 };
        this.speed = 0;

       // console.log('team1 ', team)

   
        this.testerz = team;

    }
    create() {
        //console.log('phase? ' , this.phase)

        this.createSprites();

    }
    createSprites() {
    //    console.log('phase ', this.phase)
        //See which kind of bubby we are creating
      
            if (this.team === 'red') {
                this.sprite = this.scene.add.sprite(0, 0, 'ballRed');
            } else if (this.team === 'blue') {
                this.sprite = this.scene.add.sprite(0, 0, 'ballBlue');
            }
            // this.sprite.setDepth(1);

            this.add(this.sprite);
            this.scene.projectiles.push(this);
   
    }
    update(time, delta) {
        super.update(time, delta);
        // Update the projectile's position based on direction and speed
        this.x += this.direction.x * this.speed * (delta / 1000); // Convert delta to seconds
        this.y += this.direction.y * this.speed * (delta / 1000);

        // Check if the projectile should be removed (e.g., out of bounds or expired)
        if (this.isOutOfBounds()) {
            //  this.destroy(); // Remove the projectile from the scene
        }
    }
    // Add methods to check if the projectile is out of bounds or expired
    isOutOfBounds() {
        // Check if the projectile is out of the game bounds
        return (
            this.x < 0 || this.x > this.scene.game.config.width || this.y < 0 || this.y > this.scene.game.config.height
        );
    }


}

