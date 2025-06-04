import Phaser from 'phaser';
import io from 'socket.io-client';
import Player from './Components/Player';
import Bubby from './Components/Bubby';
import Plant from './Components/Plant';
import Tower from './Components/Tower';
import Arena from './Components/Arena';
import HUD from './HUD';

class Game extends Phaser.Scene {
    constructor() {
        super({ key: 'Game' });
        this.playerManager = new Player(this);
        this.screenWidth = 1031;
        this.screenHeight = 580;
        this.arena = null;
        this.arenaWidth = 2600;
        //network
        this.socket = null;
        //players
        this.players = {};
        this.player = {};
        this.placementSprite = null;
        this.pendingBuilding = null;
        this.isBuilding = false;
        //objects
        this.bubbies = [];
        this.plants = [];
        this.towers = [];
        this.projectiles = [];
        //controls
        this.cursors = null;
        this.keysWASD = null;
        //loop
        this.lastUpdateTime = 0;
        this.updateInterval = 30;
    }

    preload() {
        console.log("preload Game.js assets")
        this.load.image('buildButton', './Assets/UI/button_build.png');
        this.load.image('seedButton', './Assets/UI/button_seed.png');
        this.load.image('eggButton', './Assets/UI/button_egg.png');
        //Plants
        this.load.image('seed', './Assets/seed.png');
        this.load.image('germinating', './Assets/germinating.png');
        this.load.image('sprout', './Assets/sprout.png');
        this.load.image('babyBush', './Assets/babyBush.png');
        this.load.image('bush', './Assets/bush.png');
        //Towers
        this.load.image('tower', './Assets/tower.png');
        this.load.image('towerFoundation', './Assets/towerFoundation.png');
        this.load.image('ballRed', './Assets/ballRed.png');
        this.load.image('ballBlue', './Assets/ballBlue.png');
        //
        this.load.image('egg', './Assets/egg.png');
        this.load.image('babyBubbyRed', './Assets/babyBubbyRed.png');
        this.load.image('bubbyRed', './Assets/bubbyRed.png');
        //  this.load.image('bigBubbyRed', './Assets/babyBubbyRed.png');
        this.load.image('babyBubbyBlue', './Assets/babyBubbyBlue.png');
        this.load.image('bubbyBlue', './Assets/bubbyBlue.png');
        //  this.load.image('babyBubbyBlue', './Assets/babyBubbyBlue.png');
        //
        this.load.image('fortress', './Assets/fortress.png');
    }
    //request to buy an egg
    handleEggButton() {
        const cameraView = this.cameras.main.worldView;
        const worldX = cameraView.x + this.player.x;
        const worldY = cameraView.y + this.player.y;
        this.socket.emit('buyEgg', { x: worldX, y: worldY });
    }

    handleSeedButton() {
        const cameraView = this.cameras.main.worldView;
        const worldX = cameraView.x + this.player.x;
        const worldY = cameraView.y + this.player.y;
        this.socket.emit('buySeed', { x: worldX, y: worldY });
    };

    handleBuildButton() {
        const cameraView = this.cameras.main.worldView;
        const worldX = cameraView.x + this.player.x;
        const worldY = cameraView.y + this.player.y;
        this.socket.emit('buyTower', { x: worldX, y: worldY });
    };


    calculateFPS() {
        const currentTime = performance.now();
        const deltaTime = currentTime - this.lastUpdateTime;
        const fps = 1000 / deltaTime; // Calculate FPS based on deltaTime

        console.log("FPS: ", fps); // Log FPS to the console

        this.lastUpdateTime = currentTime;
    }

    create() {

        this.scene.launch('HUD');
        this.fpsText = this.add.text(10, 10, 'FPS: ', { font: '16px Arial', fill: '#ffffff' });

        // establish socket connection
        this.socket = io();
        console.log('Requesting player name');
        this.showNameModal();
        this.socket.on('connect', () => {
            console.log('Socket connected:', this.socket.id);
            console.log('Requesting player list from server');
            this.socket.emit('getPlayersList', { x: 0, y: 0 });
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
        this.socket.on('initialize', (data) => {
            console.log('Received initialization data:', data);
            const team = data.team;
            const coins = data.coins;
            const circleColor = team === 'blue' ? 0x0000ff : 0xff0000;
            this.player = this.add.circle(400, 300, 10, circleColor);
            this.player.playerId = this.socket.id;
            this.player.team = team;
            this.player.coins = coins;
            this.players[this.socket.id] = this.player;
            this.scene.get('HUD').events.emit('updateCoins', coins);
        });
        this.time.delayedCall(0, () => {
            this.scene.get('HUD').events.emit('updateCoins', 0);
            this.game.events.on('seedButtonDown', this.handleSeedButton, this);
            this.game.events.on('eggButtonDown', this.handleEggButton, this);
            this.game.events.on('buildButtonDown', this.handleBuildButton, this);
            this.game.events.on('leftButtonDown', this.handleLeftButtonDown, this);
            this.game.events.on('leftButtonUp', this.handleLeftButtonUp, this);
            this.game.events.on('rightButtonDown', this.handleRightButtonDown, this);
            this.game.events.on('rightButtonUp', this.handleRightButtonUp, this);
        });

        this.arena = new Arena(this, this.arenaWidth, this.screenWidth, this.screenHeight);
        this.placementSprite = this.add.sprite(500, 500, 'towerFoundation');
        this.placementSprite.visible = false;
        this.cursors = this.input.keyboard.createCursorKeys();
        this.keysWASD = this.input.keyboard.addKeys('W,A,S,D');

        document.addEventListener('click', () => {
            if (this.sound && this.sound.context && this.sound.context.state === 'suspended') {
                this.sound.context.resume();
            }
        });

        this.input.on('pointermove', (pointer) => {
            this.player.x = pointer.worldX;
            this.player.y = pointer.worldY;
            if (this.isBuilding) {
                console.log(this.isBuilding)
                this.placementSprite.x = this.player.x;
                this.placementSprite.y = this.player.y;
            }
        });

        this.input.on('pointerdown', (pointer) => {
            if (this.isBuilding) {
                this.isBuilding = false;
                this.placementSprite.visible = false;
                this.socket.emit('placeTower', { x: this.player.x, y: this.player.y });

            }
            console.log('Click x: ', pointer.worldX, 'y: ', pointer.worldY);
            if (this.sound.context.state === 'suspended') {
                this.sound.context.resume();
            }
        });
        //player is ready to build
        this.socket.on('placeBuilding', () => {
            console.log('placeBuilding')

            this.isBuilding = true;
            this.placementSprite.visible = true;
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
            if (this.players[id] && this.players[id] != this.player) {
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

    showNameModal() {
        const modal = document.getElementById('nameModal');
        const input = document.getElementById('playerNameInput');
        const button = document.getElementById('submitNameButton');

        console.log('Displaying name modal');
        modal.style.display = 'flex'; // Ensure the modal is displayed

        button.addEventListener('click', () => {
            console.log('Connect button clicked');
            const playerName = input.value.trim();
            console.log('Entered player name:', playerName);
            if (playerName) {
                console.log('Sending newName to server');
                // Send the player name to the server
                this.socket.emit('newName', { name: playerName });
                modal.style.display = 'none'; // Hide the modal after submission
                console.log('Name modal hidden after submission');
            } else {
                console.log('No name entered; modal remains visible');
            }
        });
    }

    sortAllObjectsByDepth() {
        // Create an array of all objects that need sorting
        const allObjects = [...this.bubbies, ...this.towers, ...this.plants]; // Add other arrays as needed

        // Sort the array based on the y-coordinate of the objects
        allObjects.sort((a, b) => a.y - b.y);

        // Set the depth based on the sorting order
        allObjects.forEach((object, index) => {
            object.setDepth(index);
        });
    }

    update() {
        this.scene.get('HUD').events.emit('updateFPS');

        const pointer = this.input.activePointer;
        if (this.player && pointer) {
            this.player.x = pointer.worldX;
            this.player.y = pointer.worldY;
        }

        if (this.cursors.left.isDown || this.keysWASD.A.isDown) {
            if (this.cameras.main.scrollX > 0) {
                this.cameras.main.scrollX -= 10;
            }
        } else if (this.cursors.right.isDown || this.keysWASD.D.isDown) {
            if (this.cameras.main.scrollX < this.arenaWidth - this.screenWidth) {
                this.cameras.main.scrollX += 10;
            }
        }
        if (this.isBuilding) {
            //build sprite follows mouse for placement instructions
        }
        //console.log(this.arena.clouds);
        for (const bubby of this.bubbies) {
            bubby.update();
        }

        //const pointer = this.input.activePointer;
        if (this.player && pointer) {
            this.socket.emit('mousemove', { x: this.player.x, y: this.player.y });
        }
    }
}
export default Game;
