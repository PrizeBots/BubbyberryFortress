import Phaser from 'phaser';
import HealthBar from './HealthBar';

export default class Seed extends Phaser.GameObjects.Container {
    constructor(scene, team, id, x, y, phase,maxHealth) {
        super(scene, x, y);
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.phase = phase;
        this.maxHealth = maxHealth;
        this.health = maxHealth;
        this.team = team;
        this.id = id;
        this.isUsedBy = "";
        this.seed = null; // Placeholder for the seed sprite
     
        this.timer = null; // Timer for the egg
        this.healthBarContainer = null; // Container for the health bar
        this.create();
        this.scene.add.existing(this);
    }

    create() {
<<<<<<< Updated upstream
=======
        this.createSprites();
        this.scene.plants.push(this);

        console.log('plant phase? ' , this.phase)
    }
    createSprites() {
>>>>>>> Stashed changes
        //See which kind of bubby we are creating
        if (this.phase === 'seed') {
            this.sprite = this.scene.add.sprite(0, 0, 'seed');
        } else if (this.phase === 'sprout') {
            this.sprite = this.scene.add.sprite(0, 0, 'sprout');
        }
        //give it health bar
        this.healthBar = new HealthBar(this.scene, this.sprite.height, this.maxHealth);
        this.add(this.healthBar);
        //set up bubby and interactions
        this.add(this.sprite);
        this.scene.plants.push(this);
        this.sprite.setInteractive();
        this.scene.input.setDraggable(this.sprite);
        this.sprite.on('drag', (pointer, dragX, dragY) => {
            this.scene.socket.emit('moveObject', { objID: this.id, x: pointer.worldX, y: pointer.worldY });
        });
    }

    changePhase(newPhase) {
        this.sprite.destroy();
        this.healthBar.destroy();
        this.create();
    }

    update() {
        if (this.sprite) {
            if (this.team == "blue") {
                this.sprite.setFlipX(false);
            } else {
                this.sprite.setFlipX(true);
            }
        }
    }

    updateHealth(health) {
        this.healthBar.setHealth(health);
        if(health<=0) this.destroy();
    }
}

