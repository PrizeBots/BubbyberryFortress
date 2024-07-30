import Phaser from 'phaser';
import Game from './Game';
import HUD from './HUD';
function isMobileOrTablet() {

    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    const isMobile = /android|ipad|iphone|ipod|blackberry|iemobile|opera mini|mobile|tablet/i.test(userAgent) ||
        (window.innerWidth <= 1024 && window.innerHeight <= 1366);
    console.log('User Agent:', userAgent);
    console.log('Window Dimensions:', window.innerWidth, window.innerHeight);
    console.log('Is Mobile or Tablet:', isMobile);
    return isMobile;

}

const isMobile = isMobileOrTablet();
var config = {
    type: Phaser.AUTO,
    parent: 'gameContainer', // Ensure the game is rendered in the correct container
    backgroundColor: 0x333333,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 1031, // Default width
        height: 580, // Default height
        // min: {
        //     width: 640,
        //     height: 360
        // },
        // max: {
        //     width: 1031,
        //     height: 580
        // }
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false,
        },
    },
    pixelArt: true,
    scene: [Game, HUD], // Array of scene classes
    callbacks: {
        postBoot: function (game) {
            game.isMobile = isMobile;
        }
    }

};
console.log('Is Mobile:', isMobile);
var game = new Phaser.Game(config);

// window.addEventListener('resize', () => {
//     game.scale.resize(window.innerWidth, window.innerHeight);
// });
