// Player.ts
export interface Player {
    x: number;
    y: number;
    team: 'blue' | 'red';
    coins: number;
}

export class Player implements Player {
    constructor(
        public x: number,
        public y: number,
        public team: 'blue' | 'red',
        public coins: number
    ) {
        console.log("CREATE A PLAYER");
    }
}
