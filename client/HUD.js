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

        const buttonStyle = {
            fontSize: '20px',
            fill: '#ffffff',
            backgroundColor: '#000000',
            padding: { x: 10, y: 5 },
        };

        const button1 = this.add.text(this.game.config.width - 300, 10, 'Seed', buttonStyle);
        button1.setInteractive();
        button1.on('pointerdown', () => {
            this.game.events.emit('seedButtonDown');
        });

        const button2 = this.add.text(
            this.game.config.width - 200,
            10,
            'Egg',
            buttonStyle
        );
        button2.setInteractive();
        button2.on('pointerdown', () => {
            this.game.events.emit('eggButtonDown'); // Emitting event on the global event emitter

        });

        const button3 = this.add.text(this.game.config.width - 100, 10, 'Build', buttonStyle);
        button3.setInteractive();
        button3.on('pointerdown', () => {
          
        });
    }

    updateCoins(coins) {
        this.playerCoinsText.setText('Coins: ' + coins.toString());
    }
}

export default HUD;
