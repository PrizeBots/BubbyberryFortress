import Phaser from 'phaser';
import HealthBar from './HealthBar';

export default class Seed extends Phaser.GameObjects.Container {
    constructor(scene, team, id, x, y, phase, maxHealth) {
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
        this.timer = null; // Timer for the egg
        this.healthBarContainer = null; // Container for the health bar
        this.create();
        this.scene.add.existing(this);
    }
    create() {
        this.createSprites();
        this.scene.plants.push(this);
    }
    createSprites() {
        //See which kind of bubby we are creating
        if (this.phase === 'seed') {
            this.sprite = this.scene.add.sprite(0, 0, 'seed');
        } else if (this.phase === 'germinating') {
            this.sprite = this.scene.add.sprite(0, 0, 'germinating');
        } else if (this.phase === 'sprout') {
            this.sprite = this.scene.add.sprite(0, 0, 'sprout');
        } else if (this.phase === 'babyBush') {
            this.sprite = this.scene.add.sprite(0, 0, 'babyBush');
        } else if (this.phase === 'bush') {
            this.sprite = this.scene.add.sprite(0, 0, 'bush');
        }
        //give it health bar
        this.healthBar = new HealthBar(this.scene, this.sprite.height+10, this.maxHealth);
        this.add(this.healthBar);
        //set up bubby and interactions
        this.add(this.sprite);
        this.sprite.setInteractive();
        this.scene.input.setDraggable(this.sprite);
        this.sprite.on('drag', (pointer, dragX, dragY) => {
            this.scene.socket.emit('moveObject', { objID: this.id, x: pointer.worldX, y: pointer.worldY });
        });
    }

    changePhase(newPhase) {
        this.sprite.destroy();
        this.healthBar.destroy();
        this.createSprites();
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
        if (health <= 0) this.destroy();
    }
}

