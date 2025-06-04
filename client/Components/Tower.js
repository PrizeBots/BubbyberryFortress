//Tower.js
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
        this.ammo = 0;
        this.target = null;
        this.targetLine = new Phaser.GameObjects.Graphics(this.scene); // Graphics object for drawing the line
        this.scene.add.existing(this.targetLine);
    }

    create() {
        //See which kind of tower we are creating
        if (this.phase === 'arrow') {
            this.sprite = this.scene.add.sprite(0, 0, 'tower');
        } else if (this.phase === 'bombTower') {
            if (this.team === 'blue') {
                // this.sprite = this.scene.add.sprite(0, 0, 'bomb');
            }
        }
        this.add(this.sprite);
        this.healthBar = new HealthBar(this.scene, this.sprite.height / 2 + 20, this.maxHealth);
        this.add(this.healthBar);
        this.scene.towers.push(this);
    }

    changePhase(newPhase) {
        this.sprite.destroy();
        // this.healthBar.destroy();
        this.create();
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

            //draw line from this.x and y to target.x and y
        }
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

    updateHealth(health) {
        this.healthBar.setHealth(health);
    }
}
