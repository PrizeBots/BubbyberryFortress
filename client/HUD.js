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
        this.events.on('updateCoins', this.updateCoins, this);
        this.events.on('updateFPS', this.updateFPS, this);
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
    updateFPS() {
        const fps = Math.round(this.game.loop.actualFps);
        this.FPSText.setText('FPS: ' + fps);
    }
}

export default HUD;
