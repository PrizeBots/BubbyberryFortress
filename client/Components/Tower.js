import Phaser from 'phaser';
import HealthBar from './HealthBar';

export default class Tower extends Phaser.GameObjects.Container {
    constructor(scene, team, id, x, y, phase, maxHealth) {
        super(scene, x, y);
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.prevX = x; // Store the previous X position
        this.prevY = y; // Store the previous Y position
        this.phase = phase;
        this.maxHealth = maxHealth;
        this.health = maxHealth;
        this.team = team;
        this.id = id;
        this.isUsedBy = "";
        this.tower = null; // Placeholder for the seed sprite
        this.bombTower = null; // Placeholder for the babyBubby sprite
        this.timer = null; // Timer for the egg
        this.healthBarContainer = null; // Container for the health bar
        this.create();
        this.scene.add.existing(this);
    }

    create() {
        console.log(this.phase)
        //See which kind of bubby we are creating
        if (this.phase === 'tower') {
            this.sprite = this.scene.add.sprite(0, 0, 'tower');
           // this.sprite = this.scene.add.sprite(0, 0, 'tower');
        } else if (this.phase === 'bombTower') {
            if (this.team === 'blue') {
                // this.sprite = this.scene.add.sprite(0, 0, 'bomb');

            }
        }
        //give it health bar
        this.healthBar = new HealthBar(this.scene, this.sprite.height/2+20, this.maxHealth);
        this.add(this.healthBar);
        //set up bubby and interactions
        this.add(this.sprite);
        this.scene.bubbies.push(this);
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
            const deltaX = this.x - this.prevX;
            const deltaY = this.y - this.prevY;
            this.prevX = this.x;
            this.prevY = this.y;
            if (deltaX > 0) {
                this.sprite.setFlipX(false);
            }
            else if (deltaX < 0) {
                this.sprite.setFlipX(true);
            }
        }
    }

    updateHealth(health) {
        this.healthBar.setHealth(health);
    }
}
