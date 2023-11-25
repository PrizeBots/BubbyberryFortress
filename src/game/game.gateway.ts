// src/game/game.gateway.ts
import { WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Player } from './Player';
import { Bubby } from './Bubby';
import { Plant } from './Plant';
import { Game } from './Game';

@WebSocketGateway()
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;
    private players: Record<string, Player> = {}; // Track players by their socket ID
    private bubbies: Record<string, Bubby> = {}; // Track bubbies by their UID
    private plants: Record<string, Plant> = {};
    private teamCounts: Record<'blue' | 'red', number> = { blue: 0, red: 0 }; // Track team counts
    private eggPrice: number = 10;
    private eggsSpawned: number = 0;
    private seedPrice: number = 2;
    private seedsSpawned: number = 0;
    public objects: (Bubby | Plant)[] = []; // Specify the type explicitly
    constructor() {
        this.objects = [];
        setInterval(() => {
            //update bubbies
            for (const bubbyId in this.bubbies) {
                if (this.bubbies.hasOwnProperty(bubbyId)) {
                    const bubby = this.bubbies[bubbyId];
                    bubby.update();
                    // Check for collisions with other objects (e.g., other bubbies or plants)
                    for (const objectId in this.objects) {
                        if (this.objects.hasOwnProperty(objectId)) {
                            const object = this.objects[objectId];
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
            //update plants
            for (const plantID in this.plants) {
                if (this.plants.hasOwnProperty(plantID)) {
                    const plant = this.plants[plantID];
                    plant.update();
                }
            }
            this.server.emit('updateBubbiesList', this.bubbies);
            this.server.emit('updatePlants', this.plants);
        }, 30); //interval
    }
    //welcome new player!
    handleConnection(client: Socket) {
        const blueTeamCount = Object.values(this.players).filter((player) => player.team === 'blue').length;
        const redTeamCount = Object.values(this.players).filter((player) => player.team === 'red').length;
        const team = blueTeamCount <= redTeamCount ? 'blue' : 'red';
        let coins = 1000;
        // Add the new player to the list with the determined team
        this.players[client.id] = { x: 0, y: 0, team, coins }; // Initialize with default position and team
        if (team === 'blue') {
            this.teamCounts.blue++;
        } else {
            this.teamCounts.red++;
        }
        //set up newly connected player
        this.server.to(client.id).emit('initialize', { team, coins }); // Send team assignment and coins to the new client
        this.server.emit('updatePlayersList', this.players); // Send the updated player list to all clients
        this.server.emit('updateBubbiesList', this.bubbies);
        //a player wants to move something, lets see if they are owner and if we can let them
        client.on('moveObject', (data: { objID: string; x: number; y: number }) => {
            const obj = this.objects.find((obj) => obj.id === data.objID);
            if (obj) {
                // Check the type of the object (buddy or plant) and handle accordingly
                if (obj instanceof Bubby) {
                    // Handle moving a Bubby
                    obj.x = data.x;
                    obj.y = data.y;
                    this.server.emit('updateBubbiesList', this.bubbies);
                } else if (obj instanceof Plant) {
                    // Handle moving a Plant
                    obj.x = data.x;
                    obj.y = data.y;
                    this.server.emit('updatePlants', this.plants);
                }
            } else {
                // Object not found, log the issue for debugging
                console.log('Object not found for objID:', data.objID);
            }
        });
        //move player hands
        client.on('mousemove', (data: { x: number; y: number }) => {
            // Update the player's position
            this.players[client.id] = { ...this.players[client.id], x: data.x, y: data.y };
            // Broadcast the player's movement
            client.broadcast.emit('playerMove', { id: client.id, x: data.x, y: data.y });
        });
        //player clicked
        client.on('click', (data: { x: number; y: number }) => {
        });
        //Shopping
        client.on('buyEgg', (data: { x: number; y: number }) => {
            let coins = this.players[client.id].coins;
            if (coins >= this.eggPrice) {
                //stamp n spawn an egg
                const eggId = `egg_${client.id}_${this.eggsSpawned}`;
                this.eggsSpawned++;
                this.bubbies[eggId] = new Bubby(
                    'bubby',
                    data.x,
                    data.y,
                    this.players[client.id].team,
                    eggId,
                    'egg',
                    10,
                    10,
                    2,
                    '',
                    null,
                    10,
                    1,
                    this.plants,
                );
                this.objects.push(this.bubbies[eggId]);
                //trade with player
                this.players[client.id].coins -= this.eggPrice;
                this.server.to(client.id).emit('updateCoins', this.players[client.id].coins);
                this.server.emit('spawnEgg', this.bubbies[eggId]);
            } else {
                console.log("no coin!")
            }
        });
        client.on('buySeed', (data: { x: number; y: number }) => {
            let coins = this.players[client.id].coins;
            if (coins >= this.seedPrice) {
                //stamp n spawn a seed
                const seedID = `seed_${client.id}_${this.seedsSpawned}`;
                this.seedsSpawned++;
                this.plants[seedID] = new Plant(
                    'plant',
                    data.x,
                    data.y,
                    this.players[client.id].team,
                    seedID,
                    'seed',
                    5,
                    5,
                    '',
                    16,
                );
                this.objects.push(this.plants[seedID]);
                //trade with player
                this.players[client.id].coins -= this.seedPrice;
                this.server.to(client.id).emit('updateCoins', this.players[client.id].coins);
                this.server.emit('spawnSeed', this.plants[seedID]);
            } else {
                console.log("no coin!")
            }
        });
    }
    handleDisconnect(client: Socket) {
        // Release control of the bubby if the disconnecting player was controlling one
        for (const bubbyId in this.bubbies) {
            const bubby = this.bubbies[bubbyId];
            if (bubby.isUsedBy === client.id) {
                bubby.isUsedBy = "";
                this.server.emit('bubbyControlReleased', { bubbyId });
            }
        }
        // Get the team of the disconnecting player
        const team = this.players[client.id].team;
        // Decrement the team count for the disconnecting player's team
        this.teamCounts[team]--;
        // Broadcast the updated team counts to all clients
        this.server.emit('updateTeamCounts', this.teamCounts);
        // Broadcast the player disconnection to all clients
        this.server.emit('playerDisconnected', client.id);
        // Remove the player from the list
        delete this.players[client.id];
    }
}
