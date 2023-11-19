//Arena.js
import Phaser from 'phaser';

export function setUpArena(scene, arenaWidth, screenWidth, screenHeight) {
    console.log(arenaWidth, screenWidth, screenHeight)

    let arena = scene.add.container();
    const sky = scene.add.rectangle(0, 0, arenaWidth + screenWidth, screenHeight, 0x87CEEB); // Use a sky blue color
    sky.setOrigin(0, 0);
    arena.add(sky);

    const grass = scene.add.rectangle(0, screenHeight - 400, arenaWidth + screenWidth, 400, 0x228B22); // Use a green color
    grass.setOrigin(0, 0);
    arena.add(grass);

    const blueFort = scene.add.rectangle(50, 250, 200, 200, 0x0000ff); // Blue color
    blueFort.setOrigin(0, 0);
    const redFort = scene.add.rectangle(arenaWidth - 250, 250, 200, 200, 0xff0000); // Red color
    redFort.setOrigin(0, 0);
    
    return arena;
}
