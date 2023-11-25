import Phaser from 'phaser';

export default class HealthBar extends Phaser.GameObjects.Container {
    constructor(scene, objHeight, maxHealth) {
        super(scene);
        this.scene = scene;
        this.width = maxHealth;
        this.height = 6;
        this.borderThickness = 2; // Adjust the border thickness as needed
        this.objHeight = objHeight;
        this.maxHP = maxHealth; // Maximum health points (you can adjust this)
        this.currentHP =  this.maxHP ; // Initial health points (you can adjust this)
        // Create the background and foreground graphics for the health bar
        this.background = this.scene.add.graphics();
        this.foreground = this.scene.add.graphics();
        this.border = this.scene.add.graphics(); // Create a graphics object for the border
        // Set the fill color for the health bar
        this.foreground.fillStyle(0x00ff00); // Green color
        // Add the background, foreground, and border to the container
        this.add([this.background, this.foreground, this.border]);
        // Update the health bar initially
        this.updateBar();
        // Add the health bar to the scene
        this.scene.add.existing(this);
    }

    updateBar() {
        const percentage = this.currentHP / this.maxHP;
        const barX = - this.maxHP/2;
        const barY = -this.objHeight;
        // Clear the graphics
        this.foreground.clear();
        this.border.clear(); // Clear the border graphics
        // Draw the border first
        this.border.lineStyle(this.borderThickness, 0x000000); // White color for the border
        this.border.strokeRect(barX, barY, this.maxHP, this.height);
        // Draw the foreground (health) bar
        if (percentage > 0) {
            this.foreground.fillStyle(0x00ff00); // Green color
            this.foreground.fillRect(barX, barY, this.maxHP * percentage, this.height);
        }
        // Draw the background
        this.background.fillStyle(0x000000, 0.5); // Black color with 50% opacity
        this.background.fillRect(barX, barY, this.maxHP, this.height);
    }

    setHealth(health) {
        if (health > this.maxHP) this.maxHP = health;
        this.currentHP = health;
        this.updateBar();
    }
}
