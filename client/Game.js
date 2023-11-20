import Phaser from 'phaser';
import io from 'socket.io-client';
import { setUpArena } from './Components/Arena';
import Player from './Components/Player';
import Seed from './Components/Seed';
//import Egg from './Components/Egg';
class Game extends Phaser.Scene {
    constructor() {
        super({ key: 'Game' });

        this.playerManager = new Player(this);
        this.screenWidth = 1031;
        this.screenHeight = 580;
        this.arenaWidth = 3093;
        this.socket = null;
        this.players = {};
        this.cursors = null;
        this.keysWASD = null;
        this.player = {};
        this.arena = null;
        this.playerCoins = 1000;
    }

    preload() {
        // Preload assets
    }

    create() {
        this.scene.launch('HUD');
        this.time.delayedCall(0, () => {
            this.scene.get('HUD').events.emit('updateCoins', this.playerCoins);
        });

        this.arena = setUpArena(this, this.arenaWidth, this.screenWidth, this.screenHeight);
        this.socket = io('http://localhost:3000');

        this.cursors = this.input.keyboard.createCursorKeys();
        this.keysWASD = this.input.keyboard.addKeys('W,A,S,D');

        document.addEventListener('click', () => {
            if (this.sound && this.sound.context && this.sound.context.state === 'suspended') {
                this.sound.context.resume();
            }
        });


        this.events.on('seedButtonDown', () => {
            console.log('seedButtonDown.');
            const seed = new Seed(this, 50, 50); 
    

            seed.setInteractive();
            seed.input.setDraggable(true);

            seed.on('pointerdown', () => {
                seed.setTint(0xff0000); 
            });
    
            seed.on('pointerup', () => {
                seed.clearTint(); 
                if (isWithinValidDropZone(seed.x, seed.y)) {
 
                    console.log('Seed dropped into the game.');
                }
            });
    
            this.add.existing(seed);
        });
        this.socket.on('connect', () => {
            this.socket.emit('getPlayersList', { x: this.player.x, y: this.player.y });
            this.events.emit('updateCoins', this.playerCoins);
        });

        this.socket.on('assignTeam', (team) => {
            const circleColor = team === 'blue' ? 0x0000ff : 0xff0000;
            this.player = this.add.circle(400, 300, 10, circleColor);
            this.player.playerId = this.socket.id;
            this.player.team = team;
            this.players[this.socket.id] = this.player;
        });

        this.input.on('pointermove', (pointer) => {
            this.player.x = pointer.worldX;
            this.player.y = pointer.worldY;
            this.socket.emit('mousemove', { x: this.player.x, y: this.player.y });
        });

        this.input.on('pointerdown', (pointer) => {
            if (this.sound.context.state === 'suspended') {
                this.sound.context.resume();
            }
            this.socket.emit('click', { x: pointer.x, y: pointer.y });
        });

        this.socket.on('updatePlayersList', (playerList) => {
            for (const playerId in playerList) {
                if (!this.players[playerId]) {
                    const { x, y, team } = playerList[playerId];
                    const circleColor = team === 'blue' ? 0x0000ff : 0xff0000;
                    const otherPlayer = this.add.circle(x, y, 10, circleColor);
                    otherPlayer.playerId = playerId;
                    otherPlayer.team = team;
                    this.players[playerId] = otherPlayer;
                }
            }
        });

        this.socket.on('playerMove', ({ id, x, y }) => {
            if (this.players[id]) {
                this.players[id].x = x;
                this.players[id].y = y;
            }
        });

        this.socket.on('playerDisconnected', (playerId) => {
            if (this.players[playerId]) {
                this.players[playerId].destroy();
                delete this.players[playerId];
            }
        });
    }

    update() {
        if (this.cursors.left.isDown || this.keysWASD.A.isDown) {
            if (this.cameras.main.scrollX > 0) {
                this.cameras.main.scrollX -= 4;
            }
        } else if (this.cursors.right.isDown || this.keysWASD.D.isDown) {
            if (this.cameras.main.scrollX < this.arenaWidth - this.screenWidth) {
                this.cameras.main.scrollX += 4;
            }
        }

        const pointer = this.input.activePointer;
        if (this.player && pointer) {
            this.player.x = pointer.worldX;
            this.player.y = pointer.worldY;
            this.socket.emit('mousemove', { x: this.player.x, y: this.player.y });
        }
    }
}

export default Game;
