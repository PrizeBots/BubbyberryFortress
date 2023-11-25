//main.js
import Phaser from 'phaser';
import Game from './Game';
import HUD from './HUD';

var config = {
    type: Phaser.AUTO,
    width: 1031,
    height: 580,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false,
        },
    },
    pixelArt: true,
    scene: [Game, HUD] // Array of scene classes

};
var game = new Phaser.Game(config);
