export class Seed {
    constructor(scene, x, y) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.sprite = null; // Placeholder for the seed sprite
    }

    create() {
        // Logic to create a seed sprite or object
        this.sprite = this.scene.add.sprite(this.x, this.y, 'seedImage');
    }

    update() {
        // Update logic for the seed, if needed
    }

    // Additional methods specific to the Seed
}
export default Seed;