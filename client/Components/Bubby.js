import Phaser from 'phaser';
import HealthBar from './HealthBar';

export default class Bubby extends Phaser.GameObjects.Container {
    constructor(scene, name, team, id, x, y, phase, maxHealth) {
        super(scene, x, y);
        this.ownerName = name;
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
        this.egg = null; // Placeholder for the seed sprite
        this.babyBubby = null; // Placeholder for the babyBubby sprite
        this.timer = null; // Timer for the egg
        this.healthBarContainer = null; // Container for the health bar
        this.create();
        this.scene.add.existing(this);
        this.target = null;
        this.targetLine = new Phaser.GameObjects.Graphics(this.scene); // Graphics object for drawing the line

    }

    create() {
        // console.log("Bubby is owned by, ", this.ownerName);
        this.createSprites();
        this.scene.bubbies.push(this);
    }
    createSprites() {
        //See which kind of bubby we are creating
        if (this.phase === 'egg') {
            this.sprite = this.scene.add.sprite(0, 0, 'egg');
        } else if (this.phase === 'babyBubby') {
            if (this.team === 'blue') {
                this.sprite = this.scene.add.sprite(0, 0, 'babyBubbyBlue');
            } else {
                this.sprite = this.scene.add.sprite(0, 0, 'babyBubbyRed');

            }
            this.sprite.setScale(2);
        } else if (this.phase === 'bubby') {
            if (this.team === 'blue') {
                this.sprite = this.scene.add.sprite(0, 0, 'bubbyBlue');
            } else {
                this.sprite = this.scene.add.sprite(0, 0, 'bubbyRed');

            }
            this.sprite.setScale(2);
        }

        //give it health bar
        this.healthBar = new HealthBar(this.scene, this.sprite.height * 1.8, this.maxHealth);
        this.add(this.healthBar);
        // Set up name tag
        this.nameTag = this.scene.add.text(0, this.sprite.height / 2 + 16, this.ownerName, {
            fontSize: '16px',
            color: '#ffffff',
            align: 'center'
        }).setOrigin(0.5, 0);
        this.add(this.nameTag);
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
        this.nameTag.destroy();
        this.phase = newPhase;
        this.createSprites();
    }
    update() {
        if (this.sprite) {
            this.drawTargetLine();

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


    drawTargetLine() {
        this.targetLine.clear(); // Clear previous line
        if (this.target) {
            // Define colors for each team
            const teamColors = {
                blue: 0x0000ff, // Blue color for the blue team
                red: 0xff0000  // Red color for the red team
            };

            // Choose color based on the tower's team
            const lineColor = teamColors[this.team];

            this.targetLine.lineStyle(2, lineColor, 1.0); // Set line style with team color
            this.targetLine.beginPath();
            this.targetLine.moveTo(this.x, this.y); // Start at tower's position
            this.targetLine.lineTo(this.target.x, this.target.y); // Draw to target's position
            this.targetLine.closePath();
            this.targetLine.strokePath();
        }
        else {
            // console.log('no target');
        }
    }

}
