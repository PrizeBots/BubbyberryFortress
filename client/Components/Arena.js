//Arena.js
import Phaser from 'phaser';
import HealthBar from './HealthBar';
export function setUpArena(scene, arenaWidth, screenWidth, screenHeight) {
    console.log(arenaWidth, screenWidth, screenHeight)

    let arena = scene.add.container();
    const sky = scene.add.rectangle(0, 0, arenaWidth + screenWidth, screenHeight, 0x87CEEB); // Use a sky blue color
    sky.setOrigin(0, 0);
    arena.add(sky);

    const cloudColor = 0x228B22; // Sky blue color
    const minClouds = 1;
    const maxClouds = 5;

    // Randomly determine the number of clouds to create
    const numberOfClouds = Phaser.Math.Between(minClouds, maxClouds);

    for (let i = 0; i < numberOfClouds; i++) {
        // Randomly position the cloud on the X-axis
        const cloudX = Phaser.Math.Between(0, arenaWidth);

        // Randomly position the cloud above the grass area
        const cloudY = Phaser.Math.Between(screenHeight - 400, screenHeight - 200);

        // Create a cloud container to hold the circles
        const cloudContainer = scene.add.container(cloudX, cloudY);
        arena.add(cloudContainer);

        // Randomly determine the number of circles in the cloud
        const minCircles = 3;
        const maxCircles = 10;
        const numberOfCircles = Phaser.Math.Between(minCircles, maxCircles);

        for (let j = 0; j < numberOfCircles; j++) {
            // Randomly position the circle within the cloud container
            const circleX = Phaser.Math.Between(0, 150);
            const circleY = Phaser.Math.Between(0, 60);

            // Create a circle and add it to the cloud container
            const circle = scene.add.circle(circleX, circleY, 15, cloudColor);
            cloudContainer.add(circle);
        }
    }

    const grass = scene.add.rectangle(0, screenHeight - 400, arenaWidth + screenWidth, 400, 0x228B22); // Use a green color
    grass.setOrigin(0, 0);
    arena.add(grass);

    // const blueFort = scene.add.rectangle(50, 250, 200, 200, 0x0000ff); // Blue color
    // blueFort.setOrigin(0, 0);
    const blueFort = scene.add.sprite(0, 100, 'fortress');
    blueFort.setOrigin(0, 0);
    blueFort.setScale(.25)

    const healthBar = new HealthBar(scene, blueFort.x+blueFort.width/16, blueFort.y-20, 140, 16);
    healthBar.setHealth(100);//arena.add(this.healthBar);

    // const redFort = scene.add.rectangle(arenaWidth - 250, 250, 200, 200, 0xff0000); // Red color
    // redFort.setOrigin(0, 0);

    const redFort = scene.add.sprite(arenaWidth-400, 100, 'fortress');
    redFort.setOrigin(0, 0);
    redFort.setScale(.25)

    return arena;
}



