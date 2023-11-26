// PlayerUpdater.ts
import { Server } from 'socket.io';
import { Bubby } from './Bubby';
import { Plant } from './Plant';
import { Player } from './Player';

export class PlayerUpdater {
    private server: Server;
    private players: Record<string, Player>;
    private bubbies: Record<string, Bubby>;
    private plants: Record<string, Plant>;
    private objects: (Bubby | Plant)[]; // Add objects property

    constructor(server: Server, players: Record<string, Player>, bubbies: Record<string, Bubby>, plants: Record<string, Plant>) {
        this.server = server;
        this.players = players;
        this.bubbies = bubbies;
        this.plants = plants;
    }
    // Batch update function
    public updateGame() {
        // Update bubbies
        for (const bubbyId in this.bubbies) {
            if (this.bubbies.hasOwnProperty(bubbyId)) {
                const bubby = this.bubbies[bubbyId];
                bubby.update();
                // Check for collisions with other objects (e.g., other bubbies or plants)
                for (const objectId in this.plants) {
                    if (this.plants.hasOwnProperty(objectId)) {
                        const object = this.plants[objectId];
                        if (object !== bubby) {
                            // Avoid self-collision
                            bubby.handleCollision(object);
                        }
                    }
                }
                // Set the target plant for the bubby
                bubby.setTargetPlant(this.plants);
            }
        }

        // Update plants
        for (const plantID in this.plants) {
            if (this.plants.hasOwnProperty(plantID)) {
                const plant = this.plants[plantID];
                plant.update();
            }
        }

        // Prepare a batch update message
        const updateMessage = {
            bubbies: this.bubbies,
            plants: this.plants,
            players: this.players,
        };

    
    }
}
