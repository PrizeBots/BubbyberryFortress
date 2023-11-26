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

        this.events.on('updateCoins', this.updateCoins, this);

        const seedButton = this.add.image(this.game.config.width - 300, 30, 'seedButton');
        seedButton.setInteractive();
        seedButton.on('pointerdown', () => {
            this.game.events.emit('seedButtonDown');
        });
        seedButton.setScale(2)
        const eggButton = this.add.image(this.game.config.width - 200, 30, 'eggButton');
        eggButton.setInteractive();
        eggButton.on('pointerdown', () => {
            this.game.events.emit('eggButtonDown');
        });
        eggButton.setScale(2)
        const buildButton = this.add.image(this.game.config.width - 100, 30, 'buildButton');
        buildButton.setInteractive();
        buildButton.on('pointerdown', () => {
            // Handle the 'Build' button click
        });
        buildButton.setScale(2)
    }

    updateCoins(coins) {
        this.playerCoinsText.setText('Coins: ' + coins.toString());
    }
}

export default HUD;
