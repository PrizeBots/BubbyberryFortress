// src/game/game.gateway.ts
import { WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { eventBus } from '../components/EventBus'; // Correct the case here
import { CollisionHandler } from '../components/CollisionHandler'; // Import the event bus
import { Player } from './Player';
import { Bubby } from './Bubby';
import { Plant } from './Plant';
import { Tower } from './Tower';
import { Bullet } from './Bullet';
import { Game } from './Game';
import { Shop } from './Shop';
@WebSocketGateway()
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;
    private shop: Shop;
    private players: Record<string, Player> = {}; // Track players by their socket ID
    private bubbies: Record<string, Bubby> = {}; // Track bubbies by their UID
    //private redBubbies: Record<string, Bubby> = {}; // Track bubbies by their UID
    //private blueBubbies: Record<string, Bubby> = {}; // Track bubbies by their UID
    private plants: Record<string, Plant> = {};
    private towers: Record<string, Tower> = {};
    private bullets: Record<string, Bullet> = {};
    private bulletsSpawned: number = 0;
    private teamCounts: Record<'blue' | 'red', number> = { blue: 0, red: 0 }; // Track team counts
    public objects: (Bubby | Plant | Tower | Bullet)[] = [];
    constructor() {
        console.log("GAME SERVER CONSTRUCTOR!!")
        eventBus.on('towerShot', (data: any) => {
            const projectileID = `projectile_${data.id}_${this.bulletsSpawned++}`;
            // console.log(data.team)
            const newProjectile = new Bullet(
                'bullet',
                data.x,
                data.y,
                data.team,  // Use the player's team
                projectileID,
                'ball',
                data.speed, //speed
                null, //target
                data.attack, //attk
                data.shotDirection,
                16, //collision radius
                false,//remove
            );
            this.bullets[projectileID] = newProjectile;
            const bulletKeys = Object.keys(this.bullets);
            const bulletsLength = bulletKeys.length;
            // console.log(`Number of bullets: ${bulletsLength}`);
            this.objects.push(newProjectile);
            this.server.emit('towerShot', newProjectile);
        });
        this.shop = new Shop(this.players, this.bubbies, this.plants, this.towers);
        this.objects = [];
        setInterval(() => {
            //update bubbies
            //    const updatedBubbies: Record<string, Bubby> = {};

            for (const bubbyId in this.bubbies) {
                if (this.bubbies.hasOwnProperty(bubbyId)) {
                    const bubby = this.bubbies[bubbyId];
                    if (bubby && bubby.shouldRemove) {
                        delete this.bubbies[bubbyId];
                    } else {
                        bubby.testupdate(this.bubbies);
                        bubby.update();
                    }
                }
            }
            //update plants
            for (const plantID in this.plants) {
                if (this.plants.hasOwnProperty(plantID)) {
                    const plant = this.plants[plantID];
                    if (plant && plant.shouldRemove) {
                        delete this.plants[plantID];
                    }
                    if (plant) plant.update();
                }
            }
            //update towers
            for (const towerID in this.towers) {
                if (this.towers.hasOwnProperty(towerID)) {
                    const tower = this.towers[towerID];
                    tower.update();
                    //console.log(tower.target)
                }
            }
            for (const bulletID in this.bullets) {
                if (this.bullets.hasOwnProperty(bulletID)) {
                    const bullet = this.bullets[bulletID];
                    bullet.update();
                    if (bullet.shouldRemove) {
                        //  console.log('remove bullet')
                        // Flag or remove the expired bullet from the array or the game
                        delete this.bullets[bulletID];
                    }
                }
            }
            CollisionHandler.handleCollisions(this.objects);
            this.server.emit('updateBubbies', this.bubbies);
            this.server.emit('updatePlants', this.plants);
            this.server.emit('updateTowers', this.towers);
            this.server.emit('updateProjectiles', this.bullets);
            //emit player updates - current when mouse moves
        }, 40); //interval
    }

    //welcome new player!
    handleConnection(client: Socket) {
        console.log('Client connected:', client.id);
        console.log('Sending existing player and bubbies lists');
        this.server.emit('updatePlayersList', this.players); // Send the updated player list to all clients
        this.server.emit('updateBubbiesList', this.bubbies);
        //a player wants to move something, lets see if they are owner and if we can let them

        //Register new player once they send their name
        client.on('newName', (data: { name: string }) => {
            console.log('Received newName from', client.id, 'name:', data.name);
            // Update the player's name
          //  this.players[client.id].name = data.name;
         
            // Broadcast the player's name
            const blueTeamCount = Object.values(this.players).filter((player) => player.team === 'blue').length;
            const redTeamCount = Object.values(this.players).filter((player) => player.team === 'red').length;
            const team = blueTeamCount <= redTeamCount ? 'blue' : 'red';
            let coins = 1000;
            // Add the new player to the list with the determined team
            this.players[client.id] = { name: data.name, x: 0, y: 0, team, coins, isBuilding: false, isInGame: true }; // Initialize with default position and team
            console.log(this.players[client.id].name, "has joined the game on team", team);
            console.log('Current players:', this.players);
            if (team === 'blue') {
                this.teamCounts.blue++;
            } else {
                this.teamCounts.red++;
            }
            //set up newly connected player
            this.server.to(client.id).emit('initialize', { team, coins }); // Send team assignment and coins to the new client
            console.log('Initialization data sent to', client.id);
        });
        //Only let connected clients that are in the game play
        // if (this.players[client.id].isInGame) {

        //make sure its either their object or their teams object
            client.on('moveObject', (data: { objID: string; x: number; y: number }) => {
                const obj = this.objects.find((obj) => obj.id === data.objID);
                if (obj && obj.isMovable) {
                    //console.log(obj.type)
                    // Check the type of the object (buddy or plant) and handle accordingly
                    if (obj instanceof Bubby) {
                        // Handle moving a Bubby
                        obj.x = data.x;
                        obj.y = data.y;
                        this.server.emit('updateBubbiesList', this.bubbies);
                    } else if (obj instanceof Plant) {
                        //   console.log('got a plant here')
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
                //console.log('total objects on server: ', this.objects.length)
            });

            //Shopping
            client.on('buyEgg', (data: { x: number; y: number }) => {
                const newEgg = this.shop.buyEgg(client.id, data.x, data.y);
                if (newEgg) {
                    this.objects.push(this.bubbies[newEgg.id]);
                    this.server.emit('spawnEgg', newEgg);
                    this.server.to(client.id).emit('updateCoins', this.players[client.id].coins);
                } else {
                    //  console.log("Insufficient coins for egg purchase");
                }
            });
            client.on('buySeed', (data: { x: number; y: number }) => {
                const newSeed = this.shop.buySeed(client.id, data.x, data.y);
                if (newSeed) {
                    this.objects.push(this.plants[newSeed.id]);
                    this.server.emit('spawnSeed', newSeed);
                    this.server.to(client.id).emit('updateCoins', this.players[client.id].coins);
                } else {
                    // console.log("Insufficient coins for seed purchase");
                }
            });
            client.on('buyTower', (data: { x: number; y: number }) => {
                const buyTower = this.shop.buyTower(client.id);
                // console.log('buy tower0 ', buyTower)
                if (buyTower) {
                    // console.log('this.players[client.id].isBuilding')
                    this.players[client.id].isBuilding = true;
                    //this.objects.push(this.plants[newTower.id]);
                    this.server.emit('placeBuilding');
                    this.server.to(client.id).emit('updateCoins', this.players[client.id].coins);
                } else {
                    console.log("Insufficient coins for tower purchase");
                }
            });
            client.on('placeTower', (data: { x: number; y: number }) => {
                if (this.players[client.id].isBuilding) {
                    const newTower = this.shop.placeTower(client.id, data.x, data.y);
                    this.objects.push(this.towers[newTower.id]);
                }
                else {
                    console.log("hacker!");
                }
            });
      //  }

    }

    handleDisconnect(client: Socket) {
        console.log('Client disconnected:', client.id);
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

        console.log(this.players[client.id].name, " has left the game");

        // Broadcast the player disconnection to all clients
        this.server.emit('playerDisconnected', client.id);

        // Remove the player from the list
        delete this.players[client.id];
    }
}
