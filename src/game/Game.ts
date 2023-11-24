// Game.ts


export interface Game {
    eggPrice: number;
    seedPrice: number;
    towerPrice: number;
    bluePower: number;
    redPower: number;
    blueFort: { x: number; y: number }; // Add blueFort and redFort properties
    redFort: { x: number; y: number };
}

export class Game implements Game {
    constructor(
        public eggPrice: number,
        public seedPrice: number,
        public towerPrice: number,
        public bluePower: number,
        public redPower: number,
        public blueFort: { x: number; y: number }, // Initialize blueFort and redFort
        public redFort: { x: number; y: number }
    ) {
        console.log("CREATE A GAME");
    }
}
