import Phaser from 'phaser';
import io from 'socket.io-client';
import { setUpArena } from './Components/Arena';
import Player from './Components/Player';
import Plant from './Components/Plant';
import Bubby from './Components/Bubby';

class Game extends Phaser.Scene {
    constructor() {
        super({ key: 'Game' });
        this.playerManager = new Player(this);
        this.screenWidth = 1031;
        this.screenHeight = 580;
        this.arenaWidth = 3093;
        //network
        this.socket = null;
        //components
        this.players = {};
        this.player = {};
        this.bubbies = [];
        this.plants = [];
        this.berryBushes = [];
        this.arena = null;
        //controls
        this.cursors = null;
        this.keysWASD = null;
    }

    preload() {
        this.load.image('seed', './Assets/seed.png');
        this.load.image('seed', './Assets/sprout.png');
        this.load.image('egg', './Assets/egg.png');
        this.load.image('babyBubby', './Assets/babyBubby.png');
        this.load.image('fortress', './Assets/fortress.png');
 
    }
    //request to buy an egg
    handleEggButton() {
        const cameraView = this.cameras.main.worldView;
        const worldX = cameraView.x + this.player.x;
        const worldY = cameraView.y + this.player.y;
        this.socket.emit('buyEgg', { x: worldX, y: worldY });
    }

    handleSeedButton(x, y) {
        const cameraView = this.cameras.main.worldView;
        const worldX = cameraView.x + this.player.x;
        const worldY = cameraView.y + this.player.y;
        this.socket.emit('buySeed', { x: worldX, y: worldY });
    };

    create() {
        this.scene.launch('HUD');
        this.time.delayedCall(0, () => {
            this.scene.get('HUD').events.emit('updateCoins', 0);
            this.game.events.on('seedButtonDown', this.handleSeedButton, this);
            this.game.events.on('eggButtonDown', this.handleEggButton, this);
        });

        this.arena = setUpArena(this, this.arenaWidth, this.screenWidth, this.screenHeight);
        //this.socket = io('http://localhost:3000');
        this.socket = io('https://bbf-kn8o.onrender.com');
        this.cursors = this.input.keyboard.createCursorKeys();
        this.keysWASD = this.input.keyboard.addKeys('W,A,S,D');

        document.addEventListener('click', () => {
            if (this.sound && this.sound.context && this.sound.context.state === 'suspended') {
                this.sound.context.resume();
            }
        });

        this.socket.on('bubbyControlGranted', ({ bubbyId, clientId }) => {
            // Check if the granted control is for a bubby controlled by this client
            const bubby = this.bubbies.find((b) => b.id === bubbyId);
        });

        this.socket.on('controlRequestRejected', (bubbyId) => {
            console.log("YOU CANT TOUCH THIS RIGHT NOW!")
        });

        this.socket.on('updateCoins', (coins) => {
            this.scene.get('HUD').events.emit('updateCoins', coins);
        });

        this.socket.on('connect', () => {
            this.socket.emit('getPlayersList', { x: this.player.x, y: this.player.y });
        });

        this.socket.on('initialize', (data) => {
            const team = data.team;
            let coins = data.coins;
            const circleColor = team === 'blue' ? 0x0000ff : 0xff0000;
            this.player = this.add.circle(400, 300, 10, circleColor);
            this.player.playerId = this.socket.id;
            this.player.team = team;
            this.player.coins = coins;
            this.players[this.socket.id] = this.player;
            this.scene.get('HUD').events.emit('updateCoins', coins);
        });

        this.input.on('pointermove', (pointer) => {
            this.player.x = pointer.worldX;
            this.player.y = pointer.worldY;
        });

        this.input.on('pointerdown', (pointer) => {
            console.log('Click x: ', pointer.worldX, 'y: ', pointer.worldY);
            if (this.sound.context.state === 'suspended') {
                this.sound.context.resume();
            }
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

        this.socket.on('spawnEgg', (newEgg) => {
            const newBubby = new Bubby(this, newEgg.team, newEgg.id, newEgg.x, newEgg.y, 'egg', newEgg.maxHealth);
        });

        this.socket.on('spawnSeed', (newSeed) => {
            const newPlant = new Plant(this, newSeed.team, newSeed.id, newSeed.x, newSeed.y, 'seed', newSeed.maxHealth);
        });
        this.socket.on('updateBubbiesList', (bubbiesList) => {
            for (const bubbyID in bubbiesList) {
                if (bubbiesList.hasOwnProperty(bubbyID)) {
                    const updatedBubby = bubbiesList[bubbyID];
                    const bubby = this.bubbies.find((b) => b.id === bubbyID);
                    if (bubby) {
                        bubby.x = updatedBubby.x;
                        bubby.y = updatedBubby.y;
                        //catch a phase change
                        if (bubby.phase !== updatedBubby.phase) {
                            bubby.phase = updatedBubby.phase;
                            bubby.maxHealth = updatedBubby.maxHealth;
                            if (bubby.phase === 'egg') {
                                bubby.changePhase('egg');
                            } else if (bubby.phase === 'babyBubby') {
                                bubby.changePhase('babyBubby');
                            }
                        }
                        // console.log(bubby.health, ' , ', updatedBubby.health)
                        // console.log(bubby.maxHealth, ' , ', updatedBubby.maxHealth)
                        ///   console.log(`Updated bubby ${bubbyID}: x=${bubby.x}, y=${bubby.y}, phase=${bubby.phase}`);
                    } else {
                        console.log("i didnt have this bub, making it now")
                        const newBubby = new Bubby(this, updatedBubby.team, bubbyID, updatedBubby.x, updatedBubby.y, updatedBubby.phase, updatedBubby.maxHealth);
                    }

                }
            }
        });

        this.socket.on('updatePlants', (plants) => {
            for (const plantID in plants) {
                if (plants.hasOwnProperty(plantID)) {
                    const updatedPlant = plants[plantID];
                    const plant = this.plants.find((p) => p.id === plantID);
                    if (plant) {
                        plant.x = updatedPlant.x;
                        plant.y = updatedPlant.y;
                        plant.updateHealth(updatedPlant.health);
                        //catch a phase change
                        if (plant.phase !== updatedPlant.phase) {
                            plant.phase = updatedPlant.phase;
                           
                            if (plant.phase === 'egg') {
                                plant.changePhase('egg');
                            } else if (plant.phase === 'babyBubby') {
                                plant.changePhase('babyBubby');
                            }
                        }
                        if(plant.health<=0) {
                            console.log('kill plant');
                            plant.destroy();
                        }
                        // console.log(bubby.health, ' , ', updatedBubby.health)
                        // console.log(bubby.maxHealth, ' , ', updatedBubby.maxHealth)
                        ///   console.log(`Updated bubby ${bubbyID}: x=${bubby.x}, y=${bubby.y}, phase=${bubby.phase}`);
                    } else {
                        console.log("i didnt have this plant, making it now")
                        const newPlant = new Plant(this, updatedPlant.team, plantID, updatedPlant.x, updatedPlant.y, updatedPlant.phase, updatedPlant.maxHealth);
                    }

                }
            }
        });

        this.socket.on('bubbyControlReleased', ({ bubbyId }) => {
            // Check if the released control is for a bubby controlled by this client
            const bubby = this.bubbies.find((b) => b.id === bubbyId);
            if (bubby) {
                // Set isUsedBy to an empty string for the bubby
                bubby.isUsedBy = "";
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
        for (const bubby of this.bubbies) {
            bubby.update();
        }

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
            //  console.log('UPDATE x: ', pointer.worldX, 'y: ', pointer.worldY);
            this.socket.emit('mousemove', { x: this.player.x, y: this.player.y });
        }
    }
}

export default Game;
