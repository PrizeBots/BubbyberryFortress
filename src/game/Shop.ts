//Shop.ts
import { Player } from './Player';
import { Bubby } from './Bubby';
import { Plant } from './Plant';
import { Tower } from './Tower';

export class Shop {
    // Prices for items
    private eggPrice: number = 10;
    private seedPrice: number = 2;
    private towerPrice: number = 100;
    // Counter for spawned items
    private eggsSpawned: number = 0;
    private seedsSpawned: number = 0;
    private towersSpawned: number = 0;
    constructor(
        private players: Record<string, Player>,
        private bubbies: Record<string, Bubby>,
        private plants: Record<string, Plant>,
        private towers: Record<string, Tower>
    ) {
    }

    buyEgg(playerId: string, x: number, y: number): Bubby | null {
        const player = this.players[playerId];
        if (player && player.coins >= this.eggPrice) {
            player.coins -= this.eggPrice;
            const eggId = `egg_${playerId}_${this.eggsSpawned++}`;
            const newEgg = new Bubby(
                'bubby',
                x,
                y,

                player.team,  // Use the player's team
                eggId,
                'egg',

                10, //max hp
                10,//hp
                2, //speed

                '', //used by
                null, //target
                32,//collison radius

                1,//attack 
                0,
                1000,

                false,
                true,//isMovable

                this.plants,
             //   this.bubbies,

            );
            this.bubbies[eggId] = newEgg;
            return newEgg;
        }
        return null;
    }
    buySeed(playerId: string, x: number, y: number): Plant | null {
        const player = this.players[playerId];
        if (player && player.coins >= this.seedPrice) {
            player.coins -= this.seedPrice;
            const seedId = `plant_${playerId}_${this.seedsSpawned++}`;
            const newSeed = new Plant(
                'plant',
                x,
                y,
                player.team,  // Use the player's team
                seedId,
                'seed',
                20,
                false,//hp

            );
            // console.log(seedId)
            this.plants[seedId] = newSeed;
            return newSeed;
        }
        return null;
    }
    buyTower(playerId: string): boolean {
        const player = this.players[playerId];
        if (player && player.coins >= this.towerPrice) {
            player.coins -= this.towerPrice;
            return true;
        }
        return false;
    }
    placeTower(playerId: string, x: number, y: number): Tower | null {
        const player = this.players[playerId];
        const towerId = `tower_${playerId}_${this.towersSpawned++}`;
        const newTower = Tower.createTower(
            x,
            y,
            this.players[playerId].team,
            towerId,
            'arrow',
            50,//health
            this.bubbies
        );
        this.towers[towerId] = newTower;
        return newTower;
    }
    // getTower(towerId: string): Tower | null {
    //     return this.towers[towerId] || null;
    // }
}