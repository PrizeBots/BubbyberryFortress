//plants.ts

export class Plant implements Plant {
    constructor(
        public type: string,
        public x: number,
        public y: number,
        public team: 'blue' | 'red',
        public id: string,
        public phase: string,
        public maxHealth: number = 5,
        public health: number = maxHealth,
        public isUsedBy: string,
        public collisionRadius: number,
    ) {
        //egg hatch timer
        setTimeout(() => {
            // if (this && this.phase === 'seed') {
            //     this.phase = 'sprout';
            //     this.health = 25;
            //     this.maxHealth = 25;
            // }
        }, 4000)


        //death timer
        setTimeout(() => {
            //delete this.bubbies[this.id];
        }, 14000)
    }

    public update() {
        //plant life
        if (this.y <= 200) {
            this.y += 5;
        } else if (this.y >= 580) {
            this.y -= 5;
        }
        if (this.x <= 0) {
            this.x += 5;
        } else if (this.x >= 3093) {
            this.x -= 5;
        }
    }
}
