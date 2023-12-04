//Arena.js
import Phaser from 'phaser';
import HealthBar from './HealthBar';

export default class Arena extends Phaser.GameObjects.Container {
    constructor(scene, arenaWidth, screenWidth, screenHeight) {
        super(scene);
        this.scene = scene;
        this.arenaWidth = arenaWidth;
        this.screenWidth = screenWidth;
        this.screenHeight = screenHeight;
        this.clouds = null;
        this.create();
    }
    createCloud() {
        const cloudColor = 0xFFFFFF; // Sky blue color
        const cloudX = Phaser.Math.Between(0, this.arenaWidth);
        const cloudY = Phaser.Math.Between(0, 200);
        const cloudContainer = this.scene.add.container(cloudX, cloudY);
        const minCircles = 6;
        const maxCircles = 12;
        const numberOfCircles = Phaser.Math.Between(minCircles, maxCircles);
        const circleSize = Phaser.Math.Between(15, 50);
        for (let j = 0; j < numberOfCircles; j++) {
            // Randomly position the circle within the cloud container
            const circleX = Phaser.Math.Between(0, 150);
            const circleY = Phaser.Math.Between(0, 60);
            // Create a circle and add it to the cloud container
            const circle = this.scene.add.circle(circleX, circleY, circleSize, cloudColor);
            cloudContainer.add(circle);
            this.clouds.add(cloudContainer); // Push the cloud container into the clouds array
        }
    }
    create() {
        //console.log(arenaWidth, screenWidth, screenHeight)
        let arena = this.scene.add.container();
        const sky = this.scene.add.rectangle(0, 0, this.arenaWidth + this.screenWidth, this.screenHeight, 0x87CEEB); // Use a sky blue color
        sky.setOrigin(0, 0);
        arena.add(sky);

        this.clouds = this.scene.add.container();// Define the clouds array here
        arena.add(this.clouds);

        //create initial clouds
        for (let i = 0; i < 12; i++) {
            this.createCloud();
        }
        const grass = this.scene.add.rectangle(0, this.screenHeight - 400, this.arenaWidth + this.screenWidth, 400, 0x228B22); // Use a green color
        grass.setOrigin(0, 0);
        arena.add(grass);
        // const blueFort = scene.add.rectangle(50, 250, 200, 200, 0x0000ff); // Blue color
        // blueFort.setOrigin(0, 0);
        const blueFort = this.scene.add.sprite(0, 100, 'fortress');
        blueFort.setOrigin(0, 0);
        blueFort.setScale(.25)
        const healthBar = new HealthBar(this.scene, -50, 200);
        //blueFort.add(healthBar);
        //this.add(healthBar);
        // healthBar.setHealth(100);//arena.add(this.healthBar);
        healthBar.x = blueFort.x + 150;
        //healthBar.y = 50;
        // const redFort = scene.add.rectangle(arenaWidth - 250, 250, 200, 200, 0xff0000); // Red color
        // redFort.setOrigin(0, 0);
        const redFort = this.scene.add.sprite(this.arenaWidth - 400, 100, 'fortress');
        redFort.setOrigin(0, 0);
        redFort.setScale(.25)
    }

    update() {
        const cloudContainers = this.clouds.getAll(); // Get an array of all objects in the container
        for (const cloudContainer of cloudContainers) {
            cloudContainer.x -= .1;
            if (cloudContainer.x  < -300) {
                cloudContainer.destroy();
                this.createCloud();
            }
        }
    }
}






