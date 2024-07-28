// Player.ts
export interface Player {
    name: string;
    x: number;
    y: number;
    team: 'blue' | 'red';
    coins: number;
    isBuilding: boolean;
    isInGame: boolean;
}

export class Player implements Player {
    constructor(
        public name: string,
        public x: number,
        public y: number,
        public team: 'blue' | 'red',
        public coins: number,
        public isBuilding: boolean = false,
        public isInGame: boolean = false,
    ) {
        console.log("CREATE A PLAYER");
       // isBuilding = false;
    }
}
