import Phaser from 'phaser';

class HUD extends Phaser.Scene {
    constructor() {
        super({ key: 'HUD' });
    }

    create() {
        this.playerCoinsText = this.add.text(10, 10, '', {
            font: '16px Arial',
            fill: '#000000',
        });
        this.FPSText = this.add.text(950, 10, '', {
            font: '16px Arial',
            fill: '#000000',
        });
        this.bText = this.add.text(650, 5, '', {
            font: '10px Arial',
            fill: '#000000',
        });
        this.pText = this.add.text(650, 15, '', {
            font: '10px Arial',
            fill: '#000000',
        });
        this.tText = this.add.text(650, 25, '', {
            font: '10px Arial',
            fill: '#000000',
        });

        this.events.on('updateCoins', this.updateCoins, this);
        this.events.on('updateHUD', this.updateHUD, this);
        const seedButton = this.add.image(this.game.config.width/2, 30, 'seedButton');
        seedButton.setInteractive();
        seedButton.on('pointerdown', () => {
            this.game.events.emit('seedButtonDown');
        });
        seedButton.setScale(2)
        const eggButton = this.add.image(seedButton.x - 75, 30, 'eggButton');
        eggButton.setInteractive();
        eggButton.on('pointerdown', () => {
            this.game.events.emit('eggButtonDown');
        });
        eggButton.setScale(2)
        const buildButton = this.add.image(seedButton.x+75, 30, 'buildButton');
        buildButton.setInteractive();
        buildButton.on('pointerdown', () => {
            this.game.events.emit('buildButtonDown');
        });
        buildButton.setScale(2)
    }

    updateCoins(coins) {
        this.playerCoinsText.setText('Coins: ' + coins.toString());
    }

    updateHUD() {
        const fps = Math.round(this.game.loop.actualFps);
        const b =    this.scene.get('Game').bubbies.length;
        const p = this.scene.get('Game').plants.length;
        const t = this.scene.get('Game').towers.length;
        this.FPSText.setText('FPS: ' + fps);
        this.bText.setText('b: ' + b);
        this.pText.setText('p: ' + p);
        this.tText.setText('t: ' + t);
    }
}

export default HUD;
