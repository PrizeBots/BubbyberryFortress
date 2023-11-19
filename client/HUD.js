const screenWidth = 1031;
const screenHeight = 580;

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

        const button1 = this.add.text(screenWidth - 300, 10, 'Seed', buttonStyle);
        button1.setInteractive();
        button1.on('pointerdown', () => {
            console.log('Button 1 clicked');
        });

        const button2 = this.add.text(screenWidth - 200, 10, 'Egg', buttonStyle);
        button2.setInteractive();
        button2.on('pointerdown', () => {
            console.log('Button 2 clicked');
        });

        const button3 = this.add.text(screenWidth - 100, 10, 'Build', buttonStyle);
        button3.setInteractive();
        button3.on('pointerdown', () => {
            console.log('Button 3 clicked');
        });
    }

    updateCoins(coins) {
        console.log(coins)
        this.playerCoinsText.setText('Coins: ' + coins.toString());
    }
}

export default HUD;